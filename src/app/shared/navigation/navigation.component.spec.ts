import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { Subject } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let mockRouter: any;
  let mockAuthService: any;
  let mockActivatedRoute: any;
  const routerEvents$ = new Subject<any>();

  beforeEach(async () => {
    mockRouter = {
      events: routerEvents$.asObservable(),
      navigate: jasmine.createSpy('navigate'),
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}),
      serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue('mockUrl'),
      url: '/tasks'
    }

    mockAuthService = {
      isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true),
      logout: jasmine.createSpy('logout')
    };

    mockActivatedRoute = {
      snapshot: {
        params: {}
      }
    }

    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shoould hide search filter when navigating to non-task routes', () => {
    mockRouter.url = '/home';

    routerEvents$.next(new NavigationEnd(1, '/home', '/home'));

    fixture.detectChanges();

    expect(component.searchVisible).toBeFalse();

    const searchBar = fixture.nativeElement.querySelector('.navbar-search');
    expect(searchBar).toBeNull;
  })
});
