import { TestBed } from '@angular/core/testing';

import { BrowserService } from './browser.service';

describe('BrowserService', () => {
  let service: BrowserService;
  let windowMock: jasmine.SpyObj<Window>;

  beforeEach(() => {
    // Reemplaza TestBed con un mock para simular la recarga de página.
    windowMock = jasmine.createSpyObj('Window', ['location']);
    windowMock.location = jasmine.createSpyObj('Location', ['reload']);
    service = new BrowserService(windowMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should reload the page', () => {
    service.reloadPage();
    expect(windowMock.location.reload).toHaveBeenCalled();
  });
});
