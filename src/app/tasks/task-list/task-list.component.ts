import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Task, TaskService } from '../../services/task.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  tasks: Task[] = [];

  constructor(
    private router: Router,
    private taskService: TaskService,
    private logger: LoggerService
  ) { }

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
    this.logger.log('TaskListComponent initialized.');
  }

  navigateToEditTask(taskId: number) {
    this.logger.log(`Navigating to edit task with ID: ${taskId}`);
    this.router.navigate(['/tasks/edit', taskId]);
  }

  navigateToCreateTask() {
    this.logger.log('Navigating to create a new task.');
    this.router.navigate(['/tasks/create']);
  }

  deleteTask(taskId: number, event: Event): void {
    // Stop the click event from propagating to the <li> element
    event.stopPropagation();

    // Show confirmation dialog before deleting the task
    if (window.confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId);
      this.tasks = this.taskService.getTasks();
      this.logger.log(`Task with ID: ${taskId} has been deleted.`);
    }
  }
}
