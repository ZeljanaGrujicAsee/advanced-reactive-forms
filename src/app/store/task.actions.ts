import { createAction, props } from "@ngrx/store";
import { Task } from "../services/task.service";

export const loadTasks = createAction(
    '[Task] Load Tasks',
    props<{ page: number; pageSize: number }>()
);

export const loadTasksSuccess = createAction(
    '[Task] Load Tasks Success',
    props<{ tasks: Task[]; totalCount: number }>()
);

export const loadTasksFailure = createAction(
    '[Task] Load Tasks Failure',
    props<{ error: string }>()
);

export const setFilter = createAction(
    '[Task] Set Filter',
    props<{ filter: string }>()
);