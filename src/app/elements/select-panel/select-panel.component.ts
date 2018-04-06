import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

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

  @Input() defaultThemeId: string;
  @Output() modeChange = new EventEmitter<Mode>()
  @Output() candidatesChange = new EventEmitter<Candidate[]>();
  @Output() themesChange = new EventEmitter<VizCategory[]>();

  public showBy: string;
  public info: string;
  public allCandidates: Candidate[];
  public allVizCategories: VizCategory[];
  public modes: Mode[];

  public candidatesPlaceholder: string;
  public themesPlaceholder: string;

  public defaultCandidates:Candidate[];
  public defaultTheme: VizCategory;
  public defaultMode: Mode;


  constructor(private candidatesService: CandidatesService,
              private vizCategoriesServices: VizCategoriesService,
  			      private modesServices: ModesService,
              ) { }

  ngOnInit() {
  	  this.candidatesService.getCandidates().subscribe(
  		  candidates => {
          this.allCandidates = candidates
          this.defaultCandidates = candidates.slice(0,4); 
          this.changeCandidates(this.defaultCandidates);
        }
      )
      
      this.vizCategoriesServices.getVizCategories().subscribe(
        vizCategories => {
          this.allVizCategories = vizCategories;
          let themeFound = this.allVizCategories.filter(theme => theme.id == this.defaultThemeId);
          if(themeFound.length > 0)
            this.defaultTheme = themeFound[0]
          this.changeThemes(this.defaultTheme);
        }
      )      
      this.modesServices.getModes().subscribe(
        modes => {
          this.modes = modes;
          this.defaultMode = this.defaultThemeId?modes[3]:null;
          if(this.defaultMode)
            this.changeMode(this.defaultMode);
        }
      )
  }

  changeMode($event){
  	this.showBy = $event.showMode; 
  	this.modeChange.emit($event);
    this.info = $event.info;
    this.candidatesPlaceholder = this.showBy=='candidate'?'Seleccione un candidato':'Seleccione uno o más candidatos';
    this.themesPlaceholder = this.showBy=='theme'?'Seleccione un tema':'Seleccione uno o más temas';
  }
  

  changeCandidates($event){
    if($event)
      this.candidatesChange.emit(this.arrayfy($event));
  }

  changeThemes($event){
    if($event)
    	this.themesChange.emit(this.arrayfy($event));
  }

  private arrayfy(element){
  	return (element instanceof Array)?element:[ element ]
  }


}
