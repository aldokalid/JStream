import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { By } from '@angular/platform-browser';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invoke click handler before clicking Go To Home button', () => {
    spyOn(component, 'onGoToHomeBtnClick').and.callThrough();

    const btnDebugElement = fixture.debugElement.query(By.css('#go-home-btn'));
    const btn = (btnDebugElement.nativeElement as Element).querySelector('button');

    btn?.click();

    expect(component.onGoToHomeBtnClick).toHaveBeenCalled();
  });
});
