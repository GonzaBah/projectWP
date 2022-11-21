import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AjustesVehPage } from './ajustes-veh.page';

describe('AjustesVehPage', () => {
  let component: AjustesVehPage;
  let fixture: ComponentFixture<AjustesVehPage>;
  let servicios: AjustesVehPage;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AjustesVehPage ],
      imports: [IonicModule.forRoot()],
      providers: [Storage, SQLite],
    }).compileComponents();

    fixture = TestBed.createComponent(AjustesVehPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });




});
