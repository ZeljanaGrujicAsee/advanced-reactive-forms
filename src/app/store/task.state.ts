import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Task } from '../services/task.service';

// Define the shape of the TaskState
// Extends EntityState to manage a collection of tasks efficiently.
// Adds custom properties like isLoading and error for UI state management.
export interface TaskState extends EntityState<Task> {
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    currentPage: number; // Add current page to the state
    pageSize: number; 
    filter: string;   // Add page size to the state
}

// Create an Entity Adapter for Task
// Simplifies CRUD operations (e.g., adding, updating, deleting tasks).
// Provides utility methods for managing collections.
export const taskAdapter = createEntityAdapter<Task>();

// Define the initial state using the adapter
export const initialTaskState: TaskState = taskAdapter.getInitialState({
    isLoading: false,
    error: null,
    totalCount: 0,
    currentPage: 1, // Default page
    pageSize: 5,
    filter: ''
});
