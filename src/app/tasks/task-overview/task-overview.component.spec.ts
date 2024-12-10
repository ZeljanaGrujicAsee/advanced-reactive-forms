import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskOverviewComponent } from './task-overview.component';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { TaskService } from '../../services/task.service';

describe('TaskOverviewComponent', () => {
  let component: TaskOverviewComponent;
  let fixture: ComponentFixture<TaskOverviewComponent>;
  let mockStore: any;
  let mockRouter: any;
  let mockRoute: any;
  let mockMetaService: any;
  let mockTitleService: any;
  let mockTaskService: any;

  beforeEach(async () => {
    mockStore = {
      select: jasmine.createSpy().and.returnValue(
        of({
          id: 1,
          title: 'Test Task',
          description: 'Task Description',
          status: 'In Progress',
          subtasks: []
        })
      )
    };

    mockRouter = { navigate: jasmine.createSpy() };
    mockRoute = { paramMap: of(new Map([['id', '1']])) };
    mockTitleService = { setTitle: jasmine.createSpy() };
    mockMetaService = { updateTag: jasmine.createSpy() };
    mockTaskService = {
      getTaskById: jasmine.createSpy().and.returnValue(
        of({
          id: 1,
          title: 'Test Task',
          description: 'Task Description',
          status: 'In Progress',
          subtasks: []
        })
      )
    };

    await TestBed.configureTestingModule({
      imports: [TaskOverviewComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Title, useValue: mockTitleService },
        { provide: Meta, useValue: mockMetaService },
        { provide: TaskService, useValue: mockTaskService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shoudl fetch task details on initialization', () => {
    expect(mockStore.select).toHaveBeenCalled();
  });

  it('should render task details when task is found', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Test Task');
    expect(compiled.querySelector('p').textContent).toContain('Task Description');
  });

  it('should navigate to /tasks on goBack call', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks'])
  });

  it('should update title and meta tags when task is found', () => {
    expect(mockTitleService.setTitle).toHaveBeenCalledWith('Task Overview: Test Task');
    expect(mockMetaService.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Viewing details for task: Test Task.' })
  });
});
