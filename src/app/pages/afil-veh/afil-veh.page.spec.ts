import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AfilVehPage } from './afil-veh.page';

describe('AfilVehPage', () => {
  let component: AfilVehPage;
  let fixture: ComponentFixture<AfilVehPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AfilVehPage ],
      imports: [IonicModule.forRoot()],
      providers:[Storage, SQLite],
    }).compileComponents();

    fixture = TestBed.createComponent(AfilVehPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
