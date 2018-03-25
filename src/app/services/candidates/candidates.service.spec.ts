import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CandidatesService } from './candidates.service';
import { Candidate } from '../../classes/candidate';

describe('CandidatesService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CandidatesService],
      imports: [
        HttpClientTestingModule
        ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

  });

  it('should return expected candidates (http called once)', inject([CandidatesService], 
  	(service: CandidatesService)  =>{
	  const expectedCandidates: Candidate[] =
	    [{ id: 'one', name: 'Candidate One', color:"#fff"}, { id: 'two', name: 'Candidate Two', color:"#888" }];
	  service.getCandidates()
	  		.subscribe(candidates => expect(candidates).toEqual(expectedCandidates))

	  const req = httpTestingController.expectOne("assets/data/candidates.json");
	  expect(req.request.method).toEqual('GET');

	  req.flush(expectedCandidates)
  }))

});


