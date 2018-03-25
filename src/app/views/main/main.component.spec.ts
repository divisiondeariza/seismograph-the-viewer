import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Input, Output, EventEmitter, DebugElement, Component } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { By } from '@angular/platform-browser';


import { MainComponent } from './main.component';
import { CandidatesService } from '../../services/candidates/candidates.service';
import { Candidate } from '../../classes/candidate';
import { VizCategoriesService } from '../../services/viz-categories/viz-categories.service';
import { VizCategory } from '../../classes/viz-category';

@Component({selector: 'ng-select', template: ''})
class NgSelectStubComponent {
  @Input() items: any;
  @Input() multiple: boolean
  @Input() maxSelectedItems: boolean
  // @Input() limit: Number;
  // @Input() isPrincipal: Boolean;
  // @Output() selectedChange = new EventEmitter<String[]>();
}


describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let candidates: Candidate[];
  let getCandidatesSpy: jasmine.Spy;
  let vizCategories:VizCategory[];
  let getVizCategoriesSpy: jasmine.Spy;

  beforeEach(async(() => {
    candidates = [{ id: 'one', name: 'Candidate One', color:"#fff" }, { id: 'two', name: 'Candidate Two', color:"#888" }];
    const candidatesService = jasmine.createSpyObj('SvCandidatesService', ['getCandidates']);
    getCandidatesSpy = candidatesService.getCandidates.and.returnValue(of(candidates));

    vizCategories = [{ id: 'one', name: 'VizCategory One', children: [
                    { id: 'one-a', name: 'VizCategory One a', children: []},
                    { id: 'one-b', name: 'VizCategory One b', children: []},
                    ] }]
    const vizCategoriesService = jasmine.createSpyObj('SvVizCategoriesService', ['getVizCategories'])
    getVizCategoriesSpy = vizCategoriesService.getVizCategories.and.returnValue(of(vizCategories));                    



    TestBed.configureTestingModule({
      declarations: [ MainComponent,
                      NgSelectStubComponent ],
      providers: [
        { provide:  VizCategoriesService, useValue: vizCategoriesService },
        { provide:  CandidatesService, useValue: candidatesService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setting candidates select', ()=>{
    let candidatesEl: DebugElement;

    beforeEach(() =>{
      candidatesEl = fixture.debugElement.query(By.css('#candidates-select'));
    });
    it('Should set candidates correctly', ()=>{
      expect(candidatesEl.componentInstance.items).toEqual(candidates);
    });

    it('should configure correctly the ng-selec attributes', ()=>{
      expect(candidatesEl.attributes.bindLabel).toEqual("name");
      expect(candidatesEl.attributes.bindValue).toEqual("id");
      expect(candidatesEl.componentInstance.multiple).toEqual(true);
      expect(candidatesEl.componentInstance.maxSelectedItems).toEqual(4);

    })
  });


  describe('setting vizCategories select', ()=>{
    let vizCategoriesEl: DebugElement;

    beforeEach(() =>{
      vizCategoriesEl = fixture.debugElement.query(By.css('#viz-categories-select'));
    });
    it('Should set vizCategories correctly', ()=>{
      expect(vizCategoriesEl.componentInstance.items).toEqual(vizCategories);
    });

    it('should configure correctly the ng-selec attributes', ()=>{
      expect(vizCategoriesEl.attributes.bindLabel).toEqual("name");
      expect(vizCategoriesEl.attributes.bindValue).toEqual("id");
      expect(vizCategoriesEl.componentInstance.multiple).toEqual(true);
      expect(vizCategoriesEl.componentInstance.maxSelectedItems).toEqual(4);

    })
  });

});
