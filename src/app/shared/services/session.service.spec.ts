import { TestBed } from '@angular/core/testing';

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login as "aldokalid" and logout successfully', () => {
    spyOn(service, 'logout').and.callThrough();

    // Login.
    const session = "aldokalid";

    service.login(session);

    expect(service.getSession()).toBe(session);

    // Logout.
    service.logout();

    expect(service.logout).toHaveBeenCalled();
  })
});
