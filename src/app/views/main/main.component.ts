import { Component, OnInit } from '@angular/core';

import { CandidatesService } from '../../services/candidates//candidates.service';
import { Candidate } from '../../classes/candidate';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public candidates: Candidate[];

  constructor(private candidatesService: CandidatesService) { }

  ngOnInit() {
  	  this.candidatesService.getCandidates().subscribe(
  		candidates => this.candidates = candidates
      )

  }

}
