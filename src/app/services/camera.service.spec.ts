import { TestBed } from '@angular/core/testing';

import { CameraService } from './camera.service';
import { Storage } from '@ionic/storage-angular';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
describe('CameraService', () => {
  let service: CameraService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Storage, Camera, SQLite]
    });
    service = TestBed.inject(CameraService);
    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


});
