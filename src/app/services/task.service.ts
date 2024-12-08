import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, shareReplay, tap, throwError } from 'rxjs';

export interface Task {
    id: number;
    title: string;
    description: string;
    startDate: string;
    dueDate: string;
    status: string;
    subtasks?: Subtask[];
    teamAssignment?: TeamAssignment;
}

export interface Subtask {
    title: string;
}

export interface TeamAssignment {
    teamMemberName: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = 'http://localhost:5095';

    constructor(private http: HttpClient) { }

    // Fetch paginated tasks
    getTasks(page: number = 1, pageSize: number = 10): Observable<{ tasks: Task[], totalCount: number }> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<{ tasks: Task[], totalCount: number }>(`${this.apiUrl}/tasks`, { params }).pipe(
            retry(3), // Retry the request up to 3 times in case of an error
            catchError((error) => {
                console.error('Error fetching tasks:', error);
                return throwError(() => new Error('Failed to load tasks. Please try again later.'));
            })
        );
    }

    // Add a new task
    addTask(task: Omit<Task, 'id'>): Observable<Task> {
        return this.http.post<Task>(`${this.apiUrl}/tasks`, task);
    }

    // Fetch a single task by ID
    getTaskById(id: number): Observable<Task> {
        return this.http.get<Task>(`${this.apiUrl}/tasks/${id}`).pipe(
            catchError((error) => {
                console.error('Error fetching task by ID:', error);
                return throwError(() => new Error('Failed to load the task. Please try again later.'));
            })
        );
    }

    // Update a task
    updateTask(id: number, updatedTask: Task): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, updatedTask);
    }

    // Delete a task
    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`);
    }

    // Fetch user assignments
    getUserAssignments(): Observable<{ taskId: number; teamAssignment: TeamAssignment }[]> {
        return this.http.get<{ taskId: number; teamAssignment: TeamAssignment }[]>(
            `${this.apiUrl}/user-assignments`
        );
    }

    // Update a task's status
    updateTaskStatus(id: number, status: string): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/tasks/${id}/status`, { status }).pipe(
            catchError((error) => {
                console.error('Error updating task status:', error);
                return throwError(() => new Error(`Failed to update task status: ${error.message}`));
            })
        );
    }
}