import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Mode } from '../../classes/mode';


@Injectable()
export class ModesService {

  constructor(private http: HttpClient) { }

  getModes():Observable<Mode[]>{
  	return this.http.get<Mode[]>("assets/data/modes.json")  	

  }

}
