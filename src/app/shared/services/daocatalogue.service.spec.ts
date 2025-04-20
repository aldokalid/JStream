import { TestBed } from '@angular/core/testing';

import { DAOCatalogueService } from './daocatalogue.service';

describe('DAOCatalogueService', () => {
  let service: DAOCatalogueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DAOCatalogueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
