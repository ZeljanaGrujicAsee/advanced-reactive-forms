import { createFeatureSelector, createSelector } from "@ngrx/store";
import { taskAdapter, TaskState } from "./task.state";

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

const { selectAll, selectEntities } = taskAdapter.getSelectors();

export const selectAllTasks = createSelector(selectTaskState, selectAll);

export const selectFilter = createSelector(
    selectTaskState,
    (state) => state.filter
);

export const selectFilteredTasks = createSelector(
    selectAllTasks,
    selectFilter,
    (tasks, filter) => {
        if (!filter) return tasks;
        return tasks.filter((task) =>
            task.title.toLowerCase().includes(filter.toLocaleLowerCase())
        );
    }
);

export const selectTotalCount = createSelector(
    selectTaskState,
    (state) => state.totalCount
);

export const selectCurrentPage = createSelector(
    selectTaskState,
    (state) => state.currentPage || 1
);

export const selectPageSize = createSelector(
    selectTaskState,
    (state) => state.pageSize || 5
);

export const selectPaginatedTasks = createSelector(
    selectFilteredTasks,
    selectCurrentPage,
    selectPageSize,
    (tasks, currentPage, pageSize) => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return tasks.slice(startIndex, endIndex);
    }
)
