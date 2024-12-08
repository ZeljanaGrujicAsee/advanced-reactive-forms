import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, TaskService } from '../../services/task.service';
import { LoggerService } from '../../services/logger.service';
import { BehaviorSubject, forkJoin, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HighlightOverdueDirective } from '../../directives/highlight-overdue.directive';
import { TaskStatusPipe } from '../../pipes/task-status.pipe';
import { DaysUntilDuePipe } from '../../pipes/days-until-due.pipe';
import { ActionsDebugService } from '../../store/actions-debug.service';
import { Store } from '@ngrx/store';
import { selectAllTasks, selectIsLoading, selectPaginatedTasks, selectTotalCount } from '../../store/task.selectors';
import { deleteTask, loadTasks, setFilter, toggleTaskStatus } from '../../store/task.actions';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    HighlightOverdueDirective,
    TaskStatusPipe,
    DaysUntilDuePipe
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit, OnDestroy {
  // tasks$!: Observable<Task[]>; // Observable for tasks list to bind using async pipe
  private readonly store = inject(Store);
  tasks$!: Observable<Task[]>;
  totalTasks$!: Observable<number>;
  isLoading$!: Observable<boolean>;
  // tasks$: Observable<Task[]> = this.store.select(selectPaginatedTasks);
  // totalTasks$: Observable<number> = this.store.select(selectTotalCount);
  // isLoading$: Observable<boolean> = this.store.select(selectIsLoading);
  // isError$: Observable<string | null> = this.store.select(selectError);
  // private filterSubject = new BehaviorSubject<string>(''); // Subject to manage the filter keyword

  pageSize = 5;
  currentPage = 1;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    // private taskService: TaskService,
    private logger: LoggerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.tasks$ = this.store.select(selectPaginatedTasks);
    this.totalTasks$ = this.store.select(selectTotalCount);
    this.isLoading$ = this.store.select(selectIsLoading);
    this.loadTasks();
    this.watchQueryParams();
    // this.isError$.subscribe((error) => {
    //   if (error) {
    //     alert(`Error: ${error}`); // Replace with snackbar or toast
    //   }
    // });
    // this.setupFilteredTasks();
    // this.watchQueryParams();
  }

  loadTasks(): void {
    this.store.dispatch(
      loadTasks({
        page: this.currentPage,
        pageSize: this.pageSize,
      })
    );
  }

  // Update filter value to trigger the Observable pipeline
  filterTasks(keyword: string): void {
    this.store.dispatch(
      setFilter({ filter: keyword }) // Dispatch filter update
    );
    this.loadTasks(); // Reload tasks to ensure pagination and filtering work together
  }

  // Step 1: Set up the Observable for Tasks with Filtering
  // private setupFilteredTasks(): void {
  //   this.tasks$ = this.filterSubject.pipe(
  //     switchMap((keyword) =>
  //       forkJoin({
  //         tasksResponse: this.taskService.getTasks(this.currentPage, this.pageSize),
  //         assignments: this.taskService.getUserAssignments(),
  //       }).pipe(
  //         map(({ tasksResponse, assignments }) => {
  //           let tasks = tasksResponse.tasks.map((task) => {
  //             const assignment = assignments.find((a) => a.taskId === task.id);
  //             task.teamAssignment = assignment?.teamAssignment;
  //             return task;
  //           });

  //           // Apply filter if keyword is provided
  //           if (keyword) {
  //             tasks = tasks.filter((task) =>
  //               task.title.toLowerCase().includes(keyword.toLowerCase())
  //             );
  //             this.logger.log(`Tasks filtered with keyword: ${keyword}`);
  //           }

  //           this.totalTasks = tasksResponse.totalCount;
  //           return tasks;
  //         })
  //       )
  //     )
  //   );
  // }

  // Step 2: Set Up Query Parameter Watch for Filtering
  private watchQueryParams(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const keyword = params['keyword'] || '';
      this.filterTasks(keyword);
    });
  }

  // onPageChange(event: PageEvent | number): void {
  //   if (typeof event === 'number') {
  //     this.currentPage = event;
  //   } else {
  //     this.currentPage = event.pageIndex + 1;
  //     this.pageSize = event.pageSize;
  //   }

  //   this.filterTasks(this.filterSubject.getValue()); // Reload tasks with the current keyword and new pagination
  // }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    // Dispatch loadTasks with updated values
    this.store.dispatch(
      loadTasks({
        page: this.currentPage,
        pageSize: this.pageSize,
      })
    );
  }

  navigateToTaskOverview(taskId: number): void {
    this.router.navigate(['/tasks/overview', taskId]);
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
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(deleteTask({ taskId })); // Dispatch the delete action
    }
  }

  toggleTaskStatus(task: Task): void {
    const updatedStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    this.store.dispatch(
      toggleTaskStatus({ taskId: task.id!, updatedStatus })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
