import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { VizCategory } from '../../classes/viz-category';


@Injectable()
export class VizCategoriesService {

  constructor(private http: HttpClient) { }

  getVizCategories():Observable<VizCategory[]>{
  	return this.http.get<VizCategory[]>("assets/data/viz-categories.json")
  }
}
