import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TaskActions from './task.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { TaskService } from '../services/task.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Injectable()
export class TaskEffects {
    private actions$ = inject(Actions);
    private store = inject(Store);
    constructor(private taskService: TaskService, private router: Router) { }

    loadTasks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TaskActions.loadTasks),
            mergeMap(() =>
                this.taskService.getTasks().pipe(
                    map((response) =>
                        TaskActions.loadTasksSuccess({ tasks: response.tasks, totalCount: response.totalCount }) // Pass totalCount
                    ),
                    catchError((error) =>
                        of(TaskActions.loadTasksFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    addTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TaskActions.addTask),
            switchMap(({ task }) =>
                this.taskService.addTask(task).pipe(
                    map((savedTask) => TaskActions.addTaskSuccess({ task: savedTask })),
                    catchError((error) => of(TaskActions.addTaskFailure({ error })))
                )
            )
        )
    );

    navigateAfterAddTaskSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(TaskActions.addTaskSuccess), // Listen for the success action
                tap(() => {
                    this.router.navigate(['/tasks']); // Navigate to the task list
                })
            ),
        { dispatch: false } // This effect does not dispatch another action
    );

    deleteTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TaskActions.deleteTask),
            mergeMap(({ taskId }) =>
                this.taskService.deleteTask(taskId).pipe(
                    map(() => TaskActions.deleteTaskSuccess({ taskId })), // Dispatch success action
                    catchError((error) =>
                        of(TaskActions.deleteTaskFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    toggleTaskStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TaskActions.toggleTaskStatus),
            mergeMap(({ taskId, updatedStatus }) =>
                this.taskService.updateTaskStatus(taskId, updatedStatus).pipe(
                    map(() =>
                        TaskActions.toggleTaskStatusSuccess({ taskId, updatedStatus })
                    ),
                    catchError((error) =>
                        of(TaskActions.toggleTaskStatusFailure({ error: error.message }))
                    )
                )
            )
        )
    );
}