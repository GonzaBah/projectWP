import { TestBed } from '@angular/core/testing';

import { wayDBService } from './way-db.service';

describe('WayDBService', () => {
  let service: wayDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(wayDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
