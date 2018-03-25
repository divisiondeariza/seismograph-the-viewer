import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { VizCategoriesService } from './viz-categories.service';
import { VizCategory } from '../../classes/viz-category';


describe('VizCategoriesService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VizCategoriesService],
      imports: [
        HttpClientTestingModule
        ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should return expected Viz categories (http called once)', inject([VizCategoriesService], 
  	(service: VizCategoriesService)  =>{
	  const expectedVizCategories: VizCategory[] =
	    [{ id: 'one', name: 'VizCategory One', children: [] }, { id: 'two', name: 'VizCategory Two', children: []}];
	  service.getVizCategories()
	  		.subscribe(candidates => expect(candidates).toEqual(expectedVizCategories))

	  const req = httpTestingController.expectOne("assets/data/viz-categories.json");
	  expect(req.request.method).toEqual('GET');

	  req.flush(expectedVizCategories)


  }));
});
