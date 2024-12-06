import { inject, Injectable } from "@angular/core";
import { TaskService } from "../services/task.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadTasks, loadTasksFailure, loadTasksSuccess } from "./task.actions";
import { catchError, map, mergeMap, of } from "rxjs";

@Injectable()
export class TaskEffects {
    private actions$ = inject(Actions);
    constructor(private taskService: TaskService) { }

    loadTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadTasks),
            mergeMap(() =>
                this.taskService.getTasks().pipe(
                    map((response) =>
                        loadTasksSuccess({ tasks: response.tasks, totalCount: response.totalCount })
                    ),
                    catchError((error) =>
                        of(loadTasksFailure({ error: error.message }))
                    )
                )
            )
        )
    );
}