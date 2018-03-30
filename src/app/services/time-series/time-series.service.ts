import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TimeSerie } from '../../classes/time-serie';
import { VizCategory } from '../../classes/viz-category';
import { Candidate } from '../../classes/candidate';
import { Mode } from '../../classes/mode';

@Injectable()
export class TimeSeriesService {

  constructor(
    private http: HttpClient,
  ) { }

  getData ():Observable<any>{
  	return this.http.get("assets/data/time-series.json")
  }

  getSeries(data:any, mode:Mode, candidates:Candidate[],  themes:VizCategory[]){
    if(data == undefined || mode == undefined || candidates == undefined || themes == undefined)
      return []
    if(mode.showMode == 'candidate')
      return themes.map((theme)=>this.getSingleSerie(data, theme, candidates[0], mode.showMode) )
    if(mode.showMode == 'theme')
      return candidates.map((candidate)=>this.getSingleSerie(data, themes[0], candidate, mode.showMode) )
  }

  private getSingleSerie(data:any, theme:VizCategory, candidate:Candidate, showBy:string):TimeSerie{
    let dates = data[theme.id][candidate.id].dates;
  	let values = data[theme.id][candidate.id].values;
  	let key = showBy == 'theme'?candidate.name:theme.name
    let timeserie =  {'values': dates.map((date,index)=> ({'x': new Date(date),'y': +values[index] })),
  			              'key': key}  
    if(showBy == 'theme')
      timeserie['color'] = candidate.color
    return timeserie
  }
  
} 


