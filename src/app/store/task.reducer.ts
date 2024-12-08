import { createReducer, on } from '@ngrx/store';
import { initialTaskState, taskAdapter } from './task.state';
import * as TaskActions from './task.actions';

// Define the reducer function
export const taskReducer = createReducer(
    initialTaskState,

    // Handle loading tasks
    on(TaskActions.loadTasks, (state, { page, pageSize }) => ({
        ...state,
        currentPage: page, // Update current page
        pageSize: pageSize, // Update page size
        isLoading: true,
    })),
    on(TaskActions.setFilter, (state, { filter }) => ({
        ...state,
        filter, // Update the filter in the state
    })),
    on(TaskActions.loadTasksSuccess, (state, { tasks, totalCount }) =>
        taskAdapter.setAll(tasks, { ...state, isLoading: false, totalCount })
    ),
    on(TaskActions.loadTasksFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
    })),
    on(TaskActions.addTaskSuccess, (state, { task }) => {
        const totalPages = Math.ceil((state.totalCount + 1) / state.pageSize);
        const currentPage = Math.min(state.currentPage, totalPages);
        return taskAdapter.addOne(task, {
            ...state,
            totalCount: state.totalCount + 1,
            currentPage,
        });
    }),
    on(TaskActions.addTaskFailure, (state, { error }) => ({
        ...state,
        error,
    })),
    // // Handle adding a task
    // on(TaskActions.addTask, (state, { task }) =>
    //     taskAdapter.addOne(task, state)
    // ),

    // // Handle updating a task
    // on(TaskActions.updateTask, (state, { task }) =>
    //     taskAdapter.updateOne(
    //         { id: task.id, changes: task },
    //         state
    //     )
    // ),

    // Handle deleting a task
    on(TaskActions.deleteTask, (state, { taskId }) =>
        taskAdapter.removeOne(taskId, state)
    ),

    // update status
    on(TaskActions.toggleTaskStatusSuccess, (state, { taskId, updatedStatus }) =>
        taskAdapter.updateOne(
            { id: taskId, changes: { status: updatedStatus } }, // Only update the status
            state
        )
    ),
);
