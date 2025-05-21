import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPopupComponent } from './login-popup.component';
import { By } from '@angular/platform-browser';

describe('LoginPopupComponent', () => {
  let component: LoginPopupComponent;
  let fixture: ComponentFixture<LoginPopupComponent>;
  let resolveComplete = false;

  beforeEach(async () => {
    TestBed.overrideComponent(LoginPopupComponent, {
      set: { inputs: ['onAction', 'onDispose', 'onReject', 'onResolve'] }
    })

    await TestBed.configureTestingModule({
      imports: [LoginPopupComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginPopupComponent);
    component = fixture.componentInstance;

    resolveComplete = false;
    component.onAction = () => { }
    component.onDispose = () => { }
    component.onReject = () => { }
    component.onResolve = () => { resolveComplete = true }

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect close button click event', () => {
    spyOn(component, 'onCloseBtnClick').and.callThrough();

    (fixture.debugElement.query(By.css('#popup-close-btn')).nativeNode as HTMLButtonElement).click();

    expect(component.onCloseBtnClick).toHaveBeenCalled();
  });

  it('should detect changes on username input', () => {
    spyOn(component, 'onInputChange').and.callThrough();

    const auxInput = (fixture.debugElement.query(By.css('#popup-username-input')))
      .nativeElement as HTMLInputElement;

    auxInput.value = 'testusername';
    auxInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.onInputChange).toHaveBeenCalled();
  });

  it('should detect changes on password input', () => {
    spyOn(component, 'onInputChange').and.callThrough();

    const auxInput = (fixture.debugElement.query(By.css('#popup-password-input')))
      .nativeElement as HTMLInputElement;

    auxInput.value = 'testpassword';
    auxInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.onInputChange).toHaveBeenCalled();
  });

  it('should login successfully', () => {
    jasmine.clock().install();

    const auxInputUsr = (fixture.debugElement.query(By.css('#popup-username-input')))
      .nativeElement as HTMLInputElement;

    auxInputUsr.value = 'testusername';
    auxInputUsr.dispatchEvent(new Event('input'));

    const auxInputPsw = (fixture.debugElement.query(By.css('#popup-password-input')))
      .nativeElement as HTMLInputElement;

    auxInputPsw.value = 'testpassword';
    auxInputPsw.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    (fixture.debugElement.query(By.css('#popup-login-btn')).nativeElement as HTMLButtonElement)
      .click();

    jasmine.clock().tick(3100);
    jasmine.clock().uninstall();

    expect(resolveComplete).toBeTruthy();
  });

  it('should refuse to login', () => {
    jasmine.clock().install();

    component.onLoginBtnClick();


    jasmine.clock().tick(3100);
    jasmine.clock().uninstall();

    expect(resolveComplete).toBeFalsy();
  })
});
