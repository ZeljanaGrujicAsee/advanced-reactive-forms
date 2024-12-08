import { createAction, props } from '@ngrx/store';
import { Task } from '../services/task.service';

// Load tasks
export const loadTasks = createAction(
    '[Task] Load Tasks',
    props<{ page: number; pageSize: number }>() // Add props to accept page and pageSize
);

export const loadTasksSuccess = createAction(
    '[Task] Load Tasks Success',
    props<{ tasks: Task[]; totalCount: number }>() // Include totalCount
);

export const loadTasksFailure = createAction(
    '[Task] Load Tasks Failure',
    props<{ error: string }>()
);

// Add a new task
export const addTask = createAction(
    '[Task] Add Task',
    props<{ task: Task }>()
);

export const addTaskSuccess = createAction(
    '[Task] Add Task Success',
    props<{ task: Task }>()
);

export const addTaskFailure = createAction(
    '[Task] Add Task Failure',
    props<{ error: any }>()
);

// Update an existing task
export const updateTask = createAction(
    '[Task] Update Task',
    props<{ task: Task }>()
);

// Delete a task
export const deleteTask = createAction(
    '[Task] Delete Task',
    props<{ taskId: number }>()
);

export const deleteTaskSuccess = createAction(
    '[Task] Delete Task Success',
    props<{ taskId: number }>() // Pass the ID of the deleted task
);

export const deleteTaskFailure = createAction(
    '[Task] Delete Task Failure',
    props<{ error: string }>() // Pass the error message
);


// filter
export const setFilter = createAction(
    '[Task] Set Filter',
    props<{ filter: string }>() // Add a filter action
);


export const toggleTaskStatus = createAction(
    '[Task] Toggle Task Status',
    props<{ taskId: number; updatedStatus: string }>() // Only taskId and status
);

export const toggleTaskStatusSuccess = createAction(
    '[Task] Toggle Task Status Success',
    props<{ taskId: number; updatedStatus: string }>() // Reflect updated status
);

export const toggleTaskStatusFailure = createAction(
    '[Task] Toggle Task Status Failure',
    props<{ error: string }>() // Handle errors
);

export const setLoading = createAction(
    '[Task] Set Loading',
    (isLoading: boolean) => ({ isLoading })
);