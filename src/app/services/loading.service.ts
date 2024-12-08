import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { selectIsLoading } from '../store/task.selectors';
import { setLoading } from '../store/task.actions';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private localLoadingSubject = new BehaviorSubject<boolean>(false);

    constructor(private store: Store) {
        // Sync the loading state from the store to the local BehaviorSubject
        this.store.select(selectIsLoading).subscribe((isLoading) => {
            this.localLoadingSubject.next(isLoading);
        });
    }

    // Observable for loading status
    get loading$(): Observable<boolean> {
        return this.localLoadingSubject.asObservable();
    }

    // Show the spinner and update the store
    show(): void {
        this.store.dispatch(setLoading(true)); // Dispatch the action to update the store
    }

    // Hide the spinner and update the store
    hide(): void {
        this.store.dispatch(setLoading(false)); // Dispatch the action to update the store
    }
}