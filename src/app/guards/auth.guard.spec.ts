import { Router } from "@angular/router";
import { AuthGuard } from "./auth.guard"
import { TestBed } from "@angular/core/testing";

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let router: Router;
    let navigateSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthGuard,
                {
                    provide: Router,
                    useValue: {
                        navigate: jasmine.createSpy('navigate')
                    }
                }
            ]
        })
        guard = TestBed.inject(AuthGuard);
        router = TestBed.inject(Router);
        navigateSpy = router.navigate as jasmine.Spy;
    });

    it('should allow navigation when user is authenticated', () => {
        spyOn(localStorage, 'getItem').and.returnValue('fateAuthToken');

        const result = guard.canActivate();

        expect(result).toBeTrue();
        expect(navigateSpy).not.toHaveBeenCalled();
    })

    it('should redirect to login when user is no authenticated', () => {
        spyOn(localStorage, 'getItem').and.returnValue(null);

        const result = guard.canActivate();

        expect(result).toBeFalse();
        expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    })
})