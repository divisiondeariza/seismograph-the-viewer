import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { CandidatesService } from '../../services/candidates//candidates.service';
import { VizCategoriesService } from '../../services/viz-categories/viz-categories.service';
import { ModesService } from '../../services/modes/modes.service';
import { Candidate } from '../../classes/candidate';
import { VizCategory } from '../../classes/viz-category';
import { Mode } from '../../classes/mode';

@Component({
  selector: 'app-select-panel',
  templateUrl: './select-panel.component.html',
  styleUrls: ['./select-panel.component.css']
})
export class SelectPanelComponent implements OnInit {

  @Output() showByChange = new EventEmitter<string>();
  @Output() metricChange =  new EventEmitter<string>();
  @Output() modeChange = new EventEmitter<Mode>()
  @Output() candidatesChange = new EventEmitter<Candidate[]>();
  @Output() themesChange = new EventEmitter<VizCategory[]>();

  public showBy: string;
  public allCandidates: Candidate[];
  public allVizCategories: VizCategory[];
  public modes: Mode[];

  public mode: Mode;
  public candidates: any;

  public candidatesPlaceholder: string;
  public themesPlaceholder: string;



  constructor(private candidatesService: CandidatesService,
              private vizCategoriesServices: VizCategoriesService,
  			  private modesServices: ModesService,
              ) { }

  ngOnInit() {
  	  this.candidatesService.getCandidates().subscribe(
  		  candidates => {
          this.allCandidates = candidates
        }
      )
      
      this.vizCategoriesServices.getVizCategories().subscribe(
        vizCategories => this.allVizCategories = vizCategories
      )      
      this.modesServices.getModes().subscribe(
        modes => {
          this.modes = modes;
          // this.mode = this.modes[0];
        }

      )



  }

  changeMode($event){
  	this.showBy = $event.showMode; 
  	this.modeChange.emit($event);
    this.candidatesPlaceholder = this.showBy=='candidate'?'Seleccione un candidato':'Seleccione uno o más candidatos';
    this.themesPlaceholder = this.showBy=='theme'?'Seleccione un tema':'Seleccione uno o más temas';
  }
  

  changeCandidates($event){
    this.candidatesChange.emit(this.arrayfy($event));
  }

  changeThemes($event){
  	this.themesChange.emit(this.arrayfy($event));
  }

  private arrayfy(element){
  	return (element instanceof Array)?element:[ element ]
  }


}
