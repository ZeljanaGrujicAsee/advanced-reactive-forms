import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, TaskService } from '../../services/task.service';
import { LoggerService } from '../../services/logger.service';
import { GlobalSpinnerComponent } from '../../shared/global-spinner/global-spinner.component';
import { forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  totalTasks = 0;
  pageSize = 5;
  currentPage = 1;
  totalPages = 0;
  
  private taskUpdateSubject = new Subject<Task>();
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private taskService: TaskService,
    private logger: LoggerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.updateSingleTask();
    this.watchQueryParams();
  }

  loadTasks(page: number = this.currentPage, pageSize: number = this.pageSize): void {
    forkJoin({
      tasksResponse: this.taskService.getTasks(page, pageSize), // Now returning a response with tasks and totalCount
      assignments: this.taskService.getUserAssignments()
    })
      .pipe(takeUntil(this.destroy$)) // Ensures cleanup on component destruction
      .subscribe({
        next: ({ tasksResponse, assignments }) => {
          // Extract tasks and total count from the response
          const { tasks, totalCount } = tasksResponse;

          // Enrich tasks with user assignments for display purposes only
          this.tasks = tasks.map(task => {
            const assignment = assignments.find(a => a.taskId === task.id);
            task.teamAssignment = assignment?.teamAssignment; // Set the teamAssignment directly if it exists
            return task;
          });

          // Update total tasks to reflect the entire task count in the backend
          this.totalTasks = totalCount;
          this.totalPages = Math.ceil(this.totalTasks / this.pageSize);
          this.logger.log('Tasks and assignments loaded successfully.');
        },
        error: (err) => {
          this.logger.log(`Error loading tasks and assignments: ${err.message}`);
        }
      });
  }

  updateSingleTask(): void {
    this.taskUpdateSubject.pipe(
      switchMap((updatedTask) => {
        return this.taskService.updateTask(updatedTask.id, updatedTask);
      })
    ).subscribe({
      next: (updatedTask) => {
        if (updatedTask) {
          const index = this.tasks.findIndex(task => task.id === updatedTask.id);
          if (index !== -1) {
            this.tasks[index] = updatedTask; // Update the local task list
          }
          this.logger.log('Task updated successfully.');
        }
      },
      error: (err) => {
        this.logger.log(`Error updating task: ${err.message}`);
      }
    });
  }

  watchQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      const keyword = params['keyword'] ? params['keyword'].toLowerCase() : '';
      this.filterTasks(keyword);
    });
  }

  filterTasks(keyword: string): void {
    if (keyword) {
      this.tasks = this.tasks.filter(task => task.title.toLowerCase().includes(keyword));
      this.logger.log(`Tasks filtered with keyword: ${keyword}`);
    } else {
      // If no keyword, reload the original list of tasks
      this.loadTasks();
    }
  }

  navigateToEditTask(taskId: number): void {
    this.logger.log(`Navigating to edit task with ID: ${taskId}`);
    this.router.navigate(['/tasks/edit', taskId]);
  }

  navigateToCreateTask(): void {
    this.logger.log('Navigating to create a new task.');
    this.router.navigate(['/tasks/create']);
  }

  deleteTask(taskId: number, event: Event): void {
    // Stop the click event from propagating to the <li> element
    event.stopPropagation();

    // Show confirmation dialog before deleting the task
    if (window.confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          // Refresh the tasks list after deletion
          this.loadTasks();
        },
        error: (err) => {
          this.logger.log(`Error deleting task: ${err.message}`);
        },
      });
    }
  }

  toggleTaskStatus(task: Task): void {
    const updatedTask = { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' };
    this.taskUpdateSubject.next(updatedTask);
    this.logger.log(`Toggling status for task with ID: ${task.id}`);
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emit a value to signal that it's time to complete
    this.destroy$.complete(); // Complete the Subject to release resources
  }

  onPageChange(event: PageEvent | number): void {
    if (typeof event === 'number') {
      this.currentPage = event;
    } else {
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;
    }

    // Ensure currentPage stays within valid bounds
    if (this.currentPage < 1) {
      this.currentPage = 1;
    } else if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.loadTasks(this.currentPage, this.pageSize);
  }
}
