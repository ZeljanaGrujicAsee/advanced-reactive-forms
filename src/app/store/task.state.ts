import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Task } from "../services/task.service";

export interface TaskState extends EntityState<Task>{
    isLoading: boolean;
    filter: string;
    totalCount: number;
    currentPage: number;
    pageSize: number;
    error: string | null;
}

export const taskAdapter = createEntityAdapter<Task>();

export const initialTaskState: TaskState = taskAdapter.getInitialState({
    isLoading: false,
    filter: '',
    totalCount: 0,
    currentPage: 1,
    pageSize: 5,
    error: null
});