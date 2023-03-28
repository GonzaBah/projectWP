import { TestBed } from '@angular/core/testing';

import { ApiRestService } from './api-rest.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('ApiRestService', () => {
  let service: ApiRestService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule]
    });
    service = TestBed.inject(ApiRestService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it("Llamada de usuarios", (done)=>{
  //   service.getUsers().subscribe(res=>{
  //     expect(res).toHaveSize(3);
  //     done();
  //     })
  //   });

  it('Llamada de usuarios',(done)=>{
    service.getUsers().subscribe(res=>{
      expect(res).toHaveSize(3);
      done();
    })
  });

  it('Llamada de un usuario',(done)=>{
    service.getUser(1).subscribe(res=>{
      expect(res.id).toEqual(1);
      done();
    })
  });

  it('Llamada de autos',(done)=>{
    service.getAutos().subscribe(res=>{
      expect(res).toHaveSize(2);
      done();
    })
  });

  it('Llamada de un auto',(done)=>{

    service.getAuto('FF-HH-22').subscribe(res=>{
      expect(res).toHaveSize(1);
      done();
      console.log(res)
    })
  });


});
