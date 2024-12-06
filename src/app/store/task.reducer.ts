import { createReducer, on } from "@ngrx/store";
import { initialTaskState, taskAdapter } from "./task.state";
import { loadTasks, loadTasksFailure, loadTasksSuccess, setFilter } from "./task.actions";

export const taskReducer = createReducer(
    initialTaskState,

    on(loadTasks, (state, { page, pageSize }) => ({
        ...state,
        currentPage: page,
        pageSize: pageSize,
        isLoading: true
    })),
    on(setFilter, (state, { filter }) => ({
        ...state,
        filter
    })),
    on(loadTasksSuccess, (state, { tasks, totalCount }) =>
        taskAdapter.setAll(tasks, { ...state, isLoading: false, totalCount })),
    on(loadTasksFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    }))
)