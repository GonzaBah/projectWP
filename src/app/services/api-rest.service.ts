import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from
'@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiRestService {

  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' :'*'
    })
    }   

    apiURL = 'https://my-json-server.typicode.com/victorrosendo/repoUsuariosRamos';
    apiURL2 ="https://my-json-server.typicode.com/victorrosendo/repoListadoAutos";
    apiURL3 = "https://reqres.in/api/users?page=2";

  constructor(private http: HttpClient) { }

  getUser(id):Observable<any>{
    return this.http.get(this.apiURL+'/repoUsuariosRamos/users/'+id,this.httpOptions).pipe(
    retry(3)
    );
  }

  getUsers():Observable<any>{
    return this.http.get(this.apiURL+'/users/',this.httpOptions).pipe(
    retry(3)
    );
  }

  getAuto(id):Observable<any>{
    return this.http.get(this.apiURL+'/repoListadoAutos/autos/'+id,this.httpOptions).pipe(
    retry(3)
    );
  }

  getAutos():Observable<any>{
    return this.http.get(this.apiURL2+'/autos/',this.httpOptions).pipe(
    retry(3)
    );
  }

  createAuto(auto):Observable<any>{
    return this.http.post(this.apiURL+'/autos/',auto,this.httpOptions)
    .pipe(
    retry(3)
    );
  }

  deleteAuto(id):Observable<any>{
    return this.http.delete(this.apiURL+'/autos/'+id,this.httpOptions);
    }
}
