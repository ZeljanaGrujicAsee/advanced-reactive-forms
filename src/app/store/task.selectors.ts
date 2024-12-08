// Selectors allow components to query specific slices of the state efficiently.
// This step involves creating a task.selectors.ts file 
// where we define functions to access tasks, loading state,
// and error messages from the store.

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState, taskAdapter } from './task.state';
import { Task } from '../services/task.service';

// Feature selector for the 'tasks' state
// Access the tasks feature in the root state.
export const selectTaskState = createFeatureSelector<TaskState>('tasks');

// Destructure entity adapter selectors for convenience
const { selectAll, selectEntities } = taskAdapter.getSelectors();

// Select all tasks
// selectAll: Returns the list of all tasks.
// selectEntities: Returns tasks as a key-value map.
export const selectAllTasks = createSelector(selectTaskState, selectAll);

// Select task entities (key-value pairs)
export const selectTaskEntities = createSelector(selectTaskState, selectEntities);

// Select loading state
// selectIsLoading: Returns the current loading state.
// selectError: Returns the error message, if any.
// selectFilteredTasks: Dynamically filters tasks based on a provided condition (e.g., filter by title or status).
export const selectIsLoading = createSelector(
    selectTaskState,
    (state) => state.isLoading
);

// Select error state
// export const selectError = createSelector(
//     selectTaskState,
//     (state) => state.error
// );

// Selector for totalCount
export const selectTotalCount = createSelector(
    selectTaskState,
    (state) => state.totalCount
);

// Example: Select tasks filtered by a specific condition
// export const selectFilteredTasks = (filterFn: (task: Task) => boolean) =>
//     createSelector(selectAllTasks, (tasks) => tasks.filter(filterFn));

export const selectFilter = createSelector(
    selectTaskState,
    (state) => state.filter // Selector for the current filter
);

export const selectFilteredTasks = createSelector(
    selectAllTasks,
    selectFilter,
    (tasks, filter) => {
        if (!filter) return tasks; // No filter applied
        return tasks.filter((task) =>
            task.title.toLowerCase().includes(filter.toLowerCase()) // Apply filter
        );
    }
);

export const selectCurrentPage = createSelector(
    selectTaskState,
    (state) => state.currentPage // Default to page 1 if undefined
);

export const selectPageSize = createSelector(
    selectTaskState,
    (state) => state.pageSize// Default to 5 if undefined
);

export const selectPaginatedTasks = createSelector(
    selectFilteredTasks, // Apply filtering first
    selectCurrentPage,
    selectPageSize,
    (tasks, currentPage, pageSize) => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return tasks.slice(startIndex, endIndex); // Apply pagination
    }
);

export const selectTaskById = (id: number) =>
    createSelector(selectTaskEntities, (entities) => entities[id]);