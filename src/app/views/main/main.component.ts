import { Component, OnInit } from '@angular/core';

import { CandidatesService } from '../../services/candidates//candidates.service';
import { VizCategoriesService } from '../../services/viz-categories/viz-categories.service';
import { ModesService } from '../../services/modes/modes.service';
import { Candidate } from '../../classes/candidate';
import { VizCategory } from '../../classes/viz-category';
import { Mode } from '../../classes/mode';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public candidates: Candidate[];
  public vizCategories: VizCategory[];
  public modes: Mode[];
  public selectedCandidates: Candidate[];
  public selectedThemesIds: VizCategory[];
  public selectedMode: Mode;


  constructor(     ) { }

  ngOnInit() {

  }

  changeMode($event){
    this.selectedMode = $event;
  }

  changeCandidates($event){
    this.selectedCandidates = $event;
  }

  changeThemes($event){
    this.selectedThemesIds = $event;
  }

}
