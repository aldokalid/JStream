import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPopupComponent } from './login-popup.component';
import { By } from '@angular/platform-browser';
import { AuthService } from '@core/services/auth.service';
import { setupHttpClientTestBed } from 'src/test-setup';

describe('LoginPopupComponent', () => {
  let component: LoginPopupComponent;
  let fixture: ComponentFixture<LoginPopupComponent>;

  beforeEach(async () => {
    setupHttpClientTestBed();

    TestBed.overrideComponent(LoginPopupComponent, {
      set: { inputs: ['onAction', 'onDispose', 'onReject', 'onResolve'] }
    })

    // mockAuthService = jasmine.createSpyObj(AuthService, ['signIn'])

    await TestBed.configureTestingModule({
      imports: [LoginPopupComponent],
      providers: [AuthService]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPopupComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect close button click event', () => {
    spyOn(component, 'onCloseBtnClick').and.callThrough();

    // Esto obtiene solo el div que contiene el botón real (<app-button />).
    const btnDebugElement = fixture.debugElement.query(By.css('#popup-close-btn'));
    // Este sí obtiene el botón.
    const btn = (btnDebugElement.nativeElement as Element).querySelector('button');

    btn?.click();

    expect(component.onCloseBtnClick).toHaveBeenCalled();
  });

  it('should detect changes on username input', () => {
    spyOn(component, 'onUsernameInputbarChange').and.callThrough();

    component.onUsernameInputbarChange('testusername');

    expect(component.onUsernameInputbarChange).toHaveBeenCalled();
  });

  it('should detect changes on password input', () => {
    spyOn(component, 'onPasswordInputbarChange').and.callThrough();

    component.onPasswordInputbarChange('testpassword');

    expect(component.onPasswordInputbarChange).toHaveBeenCalled();
  });

  it('should login successfully', () => {
    spyOn(component, "resolveLogIn").and.callThrough();

    // Ingresa los datos del usuario.
    component.onUsernameInputbarChange("testusername");
    component.onPasswordInputbarChange("testpassword");

    // Esto obtiene solo el div que contiene el botón real (<app-button />).
    const btnDebugElement = fixture.debugElement.query(By.css('#popup-login-btn'));
    // Este sí obtiene el botón.
    const btn = (btnDebugElement.nativeElement as Element).querySelector('button');

    btn?.click();

    expect(component.resolveLogIn).toHaveBeenCalled();
  });
});
