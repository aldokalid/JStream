import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPopupComponent } from './session-popup.component';

describe('SessionPopupComponent', () => {
  let component: SessionPopupComponent;
  let fixture: ComponentFixture<SessionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
