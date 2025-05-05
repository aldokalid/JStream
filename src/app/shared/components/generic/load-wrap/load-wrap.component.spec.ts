import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadWrapComponent } from './load-wrap.component';
import { LoadWrapService } from 'src/app/shared/services/load-wrap.service';

describe('LoadWrapComponent', () => {
  let component: LoadWrapComponent;
  let fixture: ComponentFixture<LoadWrapComponent>;
  let loadWrapService = new LoadWrapService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadWrapComponent],
      providers: [{ provide: LoadWrapService, useValue: loadWrapService }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadWrapComponent);
    component = fixture.componentInstance;
    component.onDispose = () => { };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger animationend and pass through its states (show, native and hide)', () => {
    spyOn(component, 'onComponentAnimationEnd').and.callThrough();
    spyOn(loadWrapService, 'setLoadWrapOnHide').and.callThrough();
    spyOn(loadWrapService, 'loadWrapOnHideExecute').and.callThrough();
    spyOn(component, 'onDispose').and.callThrough();

    // Estado inicial (show).
    expect(component.getStatusClass()).toBe(' show');

    component.loadingWrapper.nativeElement.dispatchEvent(new Event('animationend'));
    expect(component.onComponentAnimationEnd).toHaveBeenCalled();
    expect(component.getStatusClass()).toBe(''); // Estado nativo.
    
    // Estado de ocultar.
    loadWrapService.loadWrapOnHideExecute();
    expect(component.getStatusClass()).toBe(' hide');
    expect(loadWrapService.loadWrapOnHideExecute).toHaveBeenCalled();
    component.loadingWrapper.nativeElement.dispatchEvent(new Event('animationend'));
    expect(component.onDispose).toHaveBeenCalled();
  });
});
