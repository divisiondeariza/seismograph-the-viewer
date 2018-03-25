import { Component, OnInit } from '@angular/core';

import { CandidatesService } from '../../services/candidates//candidates.service';
import { VizCategoriesService } from '../../services/viz-categories/viz-categories.service';
import { Candidate } from '../../classes/candidate';
import { VizCategory } from '../../classes/viz-category';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public candidates: Candidate[];
  public vizCategories: VizCategory[];

  constructor(private candidatesService: CandidatesService,
  			  private vizCategoriesServices: VizCategoriesService) { }

  ngOnInit() {
  	  this.candidatesService.getCandidates().subscribe(
  		candidates => this.candidates = candidates
      )
  	  
  	  this.vizCategoriesServices.getVizCategories().subscribe(
  		candidates => this.vizCategories = candidates
      )

  }

}
