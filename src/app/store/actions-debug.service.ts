import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable({
  providedIn: 'root',
})
export class ActionsDebugService {
  constructor(private actions$: Actions) {
    console.log('ActionsDebugService initialized:', actions$);
  }
}
