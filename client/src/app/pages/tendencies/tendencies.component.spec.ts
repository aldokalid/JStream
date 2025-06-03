import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TendenciesComponent } from './tendencies.component';
import { getTestMedia, setupHttpClientTestBed } from 'src/test-setup';
import { Router } from '@angular/router';
import { APIService } from '@core/services/api.service';


describe('TendenciesComponent', () => {
  let component: TendenciesComponent;
  let fixture: ComponentFixture<TendenciesComponent>;

  beforeEach(async () => {
    setupHttpClientTestBed();

    // Mock de API Service.
    let mockAPIService = jasmine.createSpyObj('APIService', ['getMedias$'])

    await TestBed.configureTestingModule({
      imports: [TendenciesComponent],
      providers: [
        Router,
        { provide: APIService, useValue: mockAPIService }]
    }).compileComponents();

    mockAPIService.getMedias$.and.returnValue(getTestMedia());

    fixture = TestBed.createComponent(TendenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click over a tendency and call onTendenciesClick', () => {
    spyOn(component, 'onTendenciesClick').and.callThrough();

    // // Click over a tendency.
    // console.log('**********************');
    // console.log('**********************');
    // console.log(component.tendenciesHolder);
    // console.log('**********************');
    // console.log('**********************');

    (component.tendenciesHolder.nativeElement.firstChild as HTMLElement).click();

    expect(component.onTendenciesClick).toHaveBeenCalled();
  });
});
