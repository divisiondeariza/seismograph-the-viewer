import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Input, Output, EventEmitter, DebugElement, Component } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { By } from '@angular/platform-browser';


import { MainComponent } from './main.component';
import { CandidatesService } from '../../services/candidates/candidates.service';
import { Candidate } from '../../classes/candidate';
import { ModesService } from '../../services/modes/modes.service';
import { Mode } from '../../classes/mode';
import { VizCategoriesService } from '../../services/viz-categories/viz-categories.service';
import { VizCategory } from '../../classes/viz-category';

@Component({selector: 'ng-select', template: ''})
class NgSelectStubComponent {
  @Input() items: any;
  @Input() multiple: boolean
  @Input() maxSelectedItems: boolean
  @Output() change = new EventEmitter()

}

@Component({selector: 'app-graph', template: ''})
class GraphComponent {
  @Input() showBy: string;
  @Input() metric: string;
  @Input() candidates: string[];
  @Input() themes: string[];

}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let candidates: Candidate[];
  let getCandidatesSpy: jasmine.Spy;
  let vizCategories:VizCategory[];
  let getVizCategoriesSpy: jasmine.Spy;
  let modes:Mode[];
  let getModeSpy: jasmine.Spy;

  beforeEach(async(() => {
    candidates = [{ id: 'one', name: 'Candidate One', color:"#fff" }, { id: 'two', name: 'Candidate Two', color:"#888" }];
    const candidatesService = jasmine.createSpyObj('CandidatesService', ['getCandidates']);
    getCandidatesSpy = candidatesService.getCandidates.and.returnValue(of(candidates));

    vizCategories = [{ id: 'one', name: 'VizCategory One', children: [
                    { id: 'one-a', name: 'VizCategory One a', children: []},
                    { id: 'one-b', name: 'VizCategory One b', children: []},
                    ] }]
    const vizCategoriesService = jasmine.createSpyObj('VizCategoriesService', ['getVizCategories'])
    getVizCategoriesSpy = vizCategoriesService.getVizCategories.and.returnValue(of(vizCategories));                    

    modes =  [
                {   id: 'candidate-metric',
                    showMode:"Candidate",
                    showModeName:"candidate",
                    metric:"metric",
                    metricName:"Metric"  },         
                {   id: 'theme-metric',
                    showMode:"Theme",
                    showModeName:"theme",
                    metric:"metric",
                    metricName:"Metric"  }, 
                  ];
    const modesService = jasmine.createSpyObj('VizModes', ['getModes'])
    getVizCategoriesSpy = modesService.getModes.and.returnValue(of(modes));                    


    TestBed.configureTestingModule({
      declarations: [ MainComponent,
                      NgSelectStubComponent,
                      GraphComponent],
      providers: [
        { provide:  VizCategoriesService, useValue: vizCategoriesService },
        { provide:  CandidatesService, useValue: candidatesService },
        { provide:  ModesService, useValue: modesService }
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
      expect(candidatesEl.componentInstance.maxSelectedItems).toEqual(4);

    });

    it("should set isMultiple true only when showBy != 'candidate' ", ()=>{
      component.showBy = 'candidate';
      fixture.detectChanges();
      expect(candidatesEl.componentInstance.multiple).toEqual(false);
      component.showBy = 'theme';
      fixture.detectChanges();
      expect(candidatesEl.componentInstance.multiple).toEqual(true);

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
      expect(vizCategoriesEl.componentInstance.maxSelectedItems).toEqual(4);

    })

    it("should set isMultiple true only when showBy != 'theme' ", ()=>{
      component.showBy = 'candidate';
      fixture.detectChanges();
      expect(vizCategoriesEl.componentInstance.multiple).toEqual(true);
      component.showBy = 'theme';
      fixture.detectChanges();
      expect(vizCategoriesEl.componentInstance.multiple).toEqual(false);

    })
  });

  describe('setting mode select', ()=>{
    let modesEl: DebugElement;


    beforeEach(() =>{
      modesEl = fixture.debugElement.query(By.css('#modes-select'));
    });
    it('Should set modes correctly', ()=>{
      expect(modesEl.componentInstance.items).toEqual(modes);
    });

    it('should configure correctly the ng-selec attributes', ()=>{
      expect(modesEl.attributes.bindLabel).toEqual("metricName");
      expect(modesEl.attributes.bindValue).toEqual("id");
      expect(modesEl.attributes.groupBy).toEqual("showModeName");

    });

    it('should set showBy correctly when change isn emmited', ()=>{
      modesEl.componentInstance.change.emit( {  id: 'candidate-metric',
                                                showMode:"candidate",
                                                showModeName:"Candidate",
                                                metric:"metric",
                                                metricName:"Metric"  } );
      expect(component.showBy).toEqual('candidate');
    })

  });

  describe('setting graph component', ()=>{
    let modesEl: DebugElement;
    let vizCategoriesEl: DebugElement;
    let candidatesEl: DebugElement;
    let graphEl: DebugElement;

    beforeEach(() =>{
      vizCategoriesEl = fixture.debugElement.query(By.css('#viz-categories-select'));
      candidatesEl = fixture.debugElement.query(By.css('#candidates-select'));
      modesEl = fixture.debugElement.query(By.css('#modes-select'));
      graphEl = fixture.debugElement.query(By.css('app-graph'));
    });    

    it('should connect graphEl with data from selectors - show by candidate case', ()=>{
      modesEl.componentInstance.change.emit( {  id: 'candidate-metric',
                                                showMode:"candidate",
                                                showModeName:"Candidate",
                                                metric:"metric2",
                                                metricName:"Metric"  } );
      candidatesEl.componentInstance.change.emit({ id: 'two', name: 'Candidate Two', color:"#888" })
      vizCategoriesEl.componentInstance.change.emit([{ id: 'one-a', name: 'VizCategory One a', children: []}]);
      fixture.detectChanges();
      expect(graphEl.componentInstance.showBy).toEqual('candidate');
      expect(graphEl.componentInstance.metric).toEqual('metric2');
      expect(graphEl.componentInstance.candidates).toEqual([ 'two' ]);
      expect(graphEl.componentInstance.themes).toEqual(['one-a']);

    });

    it('should connect graphEl with data from selectors - show by theme case', ()=>{
      modesEl.componentInstance.change.emit( {  id: 'theme-metric',
                                                showMode:"theme",
                                                showModeName:"Theme",
                                                metric:"metric2",
                                                metricName:"Metric"  } );
      candidatesEl.componentInstance.change.emit([{ id: 'two', name: 'Candidate Two', color:"#888" }])
      vizCategoriesEl.componentInstance.change.emit({ id: 'one-a', name: 'VizCategory One a', children: []});
      fixture.detectChanges();
      expect(graphEl.componentInstance.showBy).toEqual('theme');
      expect(graphEl.componentInstance.metric).toEqual('metric2');
      expect(graphEl.componentInstance.candidates).toEqual([ 'two' ]);
      expect(graphEl.componentInstance.themes).toEqual(['one-a']);

    })
  })

});
