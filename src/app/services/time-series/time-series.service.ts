import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TimeSerie } from '../../classes/time-serie';

@Injectable()
export class TimeSeriesService {

  constructor(
    private http: HttpClient,
  ) { }

  getData ():Observable<any>{
  	return this.http.get("assets/data/time-series.json")
  }

  getSeriesByCandidate(data:any, candidate:string, metric:string, themes:string[]):TimeSerie[]{
  	return themes.map((theme)=>this.getSingleSerie(data, theme, candidate, 'theme') )
  }

  getSeriesByTheme(data:any, theme:string, metric:string, candidates:string[]):TimeSerie[]{
  	return candidates.map((candidate)=>this.getSingleSerie(data, theme, candidate, 'candidate') )
  }

  private getSingleSerie(data:any, theme:string, candidate:string, keyname:string):TimeSerie{
	let dates = data[theme][candidate].dates;
	let values = data[theme][candidate].values;
	let key = keyname == 'candidate'?candidate:theme
	return {'values': dates.map((date,index)=> ({'y': new Date(date),'x': +values[index] })),
			'key': key}  }
  

}


