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

  getSeries(data:any, metric:string, candidates:string[],  themes:string[], showBy:string){
    if(showBy == 'candidate')
      return themes.map((theme)=>this.getSingleSerie(data, theme, candidates[0], showBy) )
    if(showBy == 'theme')
      return candidates.map((candidate)=>this.getSingleSerie(data, themes[0], candidate, showBy) )
  }
  getSeriesByCandidate(data:any, metric:string, candidates:string[],  themes:string[]):TimeSerie[]{
  	return themes.map((theme)=>this.getSingleSerie(data, theme, candidates[0], 'theme') )
  }

  getSeriesByTheme(data:any, metric:string, candidates:string[],  themes:string[]):TimeSerie[]{
  	return candidates.map( candidate =>this.getSingleSerie(data, themes[0], candidate, 'candidate') )
  }

  private getSingleSerie(data:any, theme:string, candidate:string, showBy:string):TimeSerie{
	let dates = data[theme][candidate].dates;
	let values = data[theme][candidate].values;
	let key = showBy == 'theme'?candidate:theme
	return {'values': dates.map((date,index)=> ({'x': new Date(date),'y': +values[index] })),
			'key': key}  }
  
}


