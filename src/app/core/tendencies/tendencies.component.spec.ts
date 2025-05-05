import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TendenciesComponent } from './tendencies.component';

describe('TendenciesComponent', () => {
  let component: TendenciesComponent;
  let fixture: ComponentFixture<TendenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TendenciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TendenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click over a tendency and call onTendenciesClick', () => {
    spyOn(component, 'onTendenciesClick').and.callThrough();

    // Click over a tendency.
    (component.tendenciesHolder.nativeElement.firstChild as HTMLElement).click();

    expect(component.onTendenciesClick).toHaveBeenCalled();
  });
});
