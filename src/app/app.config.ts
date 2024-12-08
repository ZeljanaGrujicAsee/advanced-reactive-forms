import { ApplicationConfig, inject, Injectable, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { LoggerService } from './services/logger.service';
import { ConsoleLoggerService } from './services/console-logger.service';
import { FileLoggerService } from './services/file-logger.service';
import { LOGGER_SERVICES } from './services/logger.tokens';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LoadingInterceptor } from './services/loading.interceptor';
import { ErrorInterceptor } from './services/error.interceptor';

import { provideStore } from '@ngrx/store';
import { Actions, createEffect, ofType, provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { taskReducer } from './store/task.reducer';
import { TaskEffects } from './store/task.effects';
import { ActionsDebugService } from './store/actions-debug.service';
import { map } from 'rxjs';

// @Injectable()
// export class TestEffect {
//   private actions$ = inject(Actions); // Use `inject` to get the Actions stream

//   constructor() {
//     console.log('TestEffect initialized with inject:', this.actions$); // Debug log
//   }

//   testEffect$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType('TEST_ACTION'),
//       map(() => ({ type: 'TEST_ACTION_SUCCESS' }))
//     )
//   );
// }
export function loggerFactory(): LoggerService {
  const isDev = true; // Determine this dynamically based on environment
  return isDev ? new ConsoleLoggerService() : new FileLoggerService();
}

// Placeholder reducer and effects (to be added later)
// const rootReducers: Record<string, any> = {};  // Add reducers as we create them
const rootReducers = {
  tasks: taskReducer, // Register the task reducer under the 'tasks' feature key
};
// const rootEffects: any[] = [];  // Add effects as we create them
const rootEffects = [TaskEffects];

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(rootReducers),
    provideEffects(rootEffects),
    ActionsDebugService,
    provideStoreDevtools({ maxAge: 25 }), // Enables time-travel debugging
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        LoadingInterceptor,
        ErrorInterceptor
      ])
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: LOGGER_SERVICES,
      useClass: ConsoleLoggerService,
      multi: true
    },
    {
      provide: LOGGER_SERVICES,
      useClass: FileLoggerService,
      multi: true
    },
    {
      provide: LoggerService,
      useFactory: loggerFactory
    }
  ]
};