import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    TestBed.overrideComponent(NavbarComponent, {
      set: { inputs: ['onUserImgClick'] }
    })
    await TestBed.configureTestingModule({
      imports: [NavbarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    component.onUserImgClick = () => { };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect logo click', () => {
    spyOn(component, 'onLogoClick').and.callThrough();

    (fixture.debugElement.query(By.css('#logo')).nativeElement as HTMLElement).click();

    expect(component.onLogoClick).toHaveBeenCalled();
  });

  it('should detect categories click', () => {
    spyOn(component, 'onCategoriesOptionClick').and.callThrough();

    (fixture.debugElement.query(By.css('#categories-option')).nativeElement as HTMLElement).click();

    expect(component.onCategoriesOptionClick).toHaveBeenCalled();
  });

  it('should detect search button click', () => {
    spyOn(component, 'onSearchBtnClick').and.callThrough();

    // Esto obtiene solo el div que contiene el botón real (<app-button />).
    const btnDebugElement = fixture.debugElement.query(By.css('#navbar-search-btn-click'));
    // Este sí obtiene el botón.
    const btn = (btnDebugElement.nativeElement as Element).querySelector('button');

    btn?.click();

    expect(component.onSearchBtnClick).toHaveBeenCalled();
  });

  it('should detect user img click', () => {
    spyOn(component, 'onUserPictureClick').and.callThrough();

    (fixture.debugElement.query(By.css('.user-img-container')).nativeElement as HTMLElement).click();

    expect(component.onUserPictureClick).toHaveBeenCalled();
  })
});
