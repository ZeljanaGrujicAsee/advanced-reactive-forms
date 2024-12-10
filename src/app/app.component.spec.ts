import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { LoadingService } from './services/loading.service';
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let mockLoadingService: any;

  beforeEach(async () => {
    mockLoadingService = {
      loading$: of(false)
    };

    const mockActivatedRoute = {
      snapshot: {
        param: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'advanced-reactive-forms' title`, () => {
    expect(component.title).toEqual('advanced-reactive-forms');
  });

  it('should subscribe to the loading service on initiazliation', () => {
    spyOn(mockLoadingService.loading$, 'subscribe');
    component.ngOnInit();
    expect(mockLoadingService.loading$.subscribe).toHaveBeenCalled();
  })
});
