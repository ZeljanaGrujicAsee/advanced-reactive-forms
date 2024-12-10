import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NavigationComponent } from "./navigation.component"
import { AuthService } from "../../services/auth.service";
import { provideRouter, Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { routes } from "../../app.routes";
import { Location } from "@angular/common";

describe('NavigationComponent Integration Tests', () => {
    let component: NavigationComponent;
    let fixture: ComponentFixture<NavigationComponent>;
    let authService: AuthService;
    let router: Router;
    let location: Location;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NavigationComponent,
                ReactiveFormsModule
            ],
            providers: [
                provideRouter(routes),
                { provide: AuthService, useValue: { isLoggedIn: () => true, logout: jasmine.createSpy('logout') } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NavigationComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService);
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        fixture.detectChanges();
    })

    it('should hide serach bar when navigating to /home', async () => {
        await router.navigate(['/']);
        fixture.detectChanges();

        expect(component.searchVisible).toBeFalse();
        const searchBar = fixture.nativeElement.querySelector('.navbar-search');
        expect(searchBar).toBeNull;
    })
})