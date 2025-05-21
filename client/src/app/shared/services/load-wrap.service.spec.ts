import { TestBed } from '@angular/core/testing';

import { LoadWrapService } from './load-wrap.service';

describe('LoadWrapService', () => {
  let service: LoadWrapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadWrapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
