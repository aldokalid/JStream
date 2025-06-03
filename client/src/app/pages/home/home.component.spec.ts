import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { AuthService } from '@core/services/auth.service';
import { setupHttpClientTestBed } from 'src/test-setup';
import { LoadWrapService } from 'src/app/shared/services/load-wrap.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    setupHttpClientTestBed();

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        AuthService,
        LoadWrapService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
