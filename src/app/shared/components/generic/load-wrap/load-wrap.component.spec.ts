import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadWrapComponent } from './load-wrap.component';

describe('LoadWrapComponent', () => {
  let component: LoadWrapComponent;
  let fixture: ComponentFixture<LoadWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadWrapComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoadWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
