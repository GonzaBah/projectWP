import { TestBed } from '@angular/core/testing';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

import { wayDBService } from './way-db.service';

describe('WayDBService', () => {
  let service: wayDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[SQLite],
    });
    service = TestBed.inject(wayDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
