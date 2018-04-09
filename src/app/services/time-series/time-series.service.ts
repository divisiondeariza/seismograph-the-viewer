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

  getData (source):Observable<any>{
  	return this.http.get(`https://storage.googleapis.com/sismoee/static/${source}.json`)
    // return this.http.get(`http://52.14.188.152:5000/get_sismografo?doc_id=5ac40596a9474d5a14119fa0`)
  }

  getSeries(data:any, mode:Mode, candidates:Candidate[],  themes:VizCategory[]){
    if(data == undefined || mode == undefined || candidates == undefined || themes == undefined)
      return []
    if(mode.showMode == 'candidate')
      return themes.map((theme)=>this.getSingleSerie(data, mode,theme, candidates[0], mode.showMode) )
    if(mode.showMode == 'theme')
      return candidates.map((candidate)=>this.getSingleSerie(data, mode, themes[0], candidate, mode.showMode) )
  }

  private getSingleSerie(data:any, mode:Mode, theme:VizCategory, candidate:Candidate, showBy:string):TimeSerie{
    let dates = data[mode.metric][theme.id][candidate.id].dates;
  	let values = data[mode.metric][theme.id][candidate.id].values;
  	let key = showBy == 'theme'?candidate.name:theme.name
    let timeserie =  {'values': dates.map((date,index)=> ({'x': new Date(date),'y': +values[index] })),
  			              'key': key}  
    if(showBy == 'theme')
      timeserie['color'] = candidate.color
    return timeserie
  }
  
}