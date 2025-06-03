import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionPopupComponent } from './session-popup.component';
import { By } from '@angular/platform-browser';
import { BrowserService } from '../../services/browser.service';
import { setupHttpClientTestBed } from 'src/test-setup';

describe('SessionPopupComponent', () => {
  let component: SessionPopupComponent;
  let fixture: ComponentFixture<SessionPopupComponent>;
  let componentDisposed = false;
  let auxHomeComponent = document.createElement('div');
  auxHomeComponent.className = 'home';

  beforeEach(async () => {
    setupHttpClientTestBed();

    // Crea un objeto espía, que reemplaza a la función BrowserService.reload para evitar
    // que la página sea recargada y no interrumpa la prueba.
    const browserSpyObj = jasmine.createSpyObj('BrowserService', ['reload']);

    await TestBed.configureTestingModule({
      imports: [SessionPopupComponent],
      providers: [{ provide: BrowserService, useValue: browserSpyObj }]
    }).compileComponents();

    fixture = TestBed.createComponent(SessionPopupComponent);
    component = fixture.componentInstance;
    component.onDispose = () => componentDisposed = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect logout btn click', () => {
    spyOn(component, 'onLogoutBtnClick').and.callThrough();

    (fixture.debugElement.query(By.css('button')).nativeElement as HTMLElement).click();

    expect(component.onLogoutBtnClick).toHaveBeenCalled();
  });

  it('should assign a session', () => {
    component.session = 'a_session';
    component.ngOnInit();
    expect(component.getCurrSession()).toBe('a_session');
  });

  it('should uptade status class to empty (rendered) when animationend triggers', () => {
    component.sessionPopup.nativeElement.dispatchEvent(new Event('animationend'));

    expect(component.getStatusClass()).toBe('');
  });

  it('should dispose component when animationend triggers', () => {
    // Lanza el evento para terminar de renderizar el componente.
    component.sessionPopup.nativeElement.dispatchEvent(new Event('animationend'));
    // Asigna un evento al componente home de prueba.
    auxHomeComponent.addEventListener('click', component.onHomeComponentClick);
    // Hace click sobre el componente.
    auxHomeComponent.click();

    expect(component.getStatusClass()).toBe(' hide'); // Componente oculto.

    // Ejecutando manualmente el evento animationend.
    component.sessionPopup.nativeElement.dispatchEvent(new Event('animationend'));
    expect(componentDisposed).toBeTruthy(); // El componente se ha cerrado.
  });
});
