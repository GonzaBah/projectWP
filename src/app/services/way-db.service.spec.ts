import { TestBed } from '@angular/core/testing';

import { WayDBService } from './way-db.service';

describe('WayDBService', () => {
  let service: WayDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WayDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
