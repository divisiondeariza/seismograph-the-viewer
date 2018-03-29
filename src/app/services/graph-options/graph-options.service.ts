import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GraphOptionsService {

  constructor(
    private http: HttpClient,
  ) { }

  getOptions():Observable<any>{
  	return this.http.get<any>("assets/data/graph-options.json")
  }

}
