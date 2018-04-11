import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Input, Output, EventEmitter, DebugElement, Component } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { By } from '@angular/platform-browser';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ActivatedRoute, convertToParamMap, ParamMap, Params } from '@angular/router';
import { MainComponent } from './main.component';
import { CreditsComponent } from '../../elements/credits/credits.component'
import { CandidatesService } from '../../services/candidates/candidates.service';
import { Candidate } from '../../classes/candidate';
import { ModesService } from '../../services/modes/modes.service';
import { Mode } from '../../classes/mode';
import { VizCategoriesService } from '../../services/viz-categories/viz-categories.service';
import { VizCategory } from '../../classes/viz-category';

import * as moment from 'moment-timezone';

class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subjectParam = new ReplaySubject<ParamMap>();
  private subjectQuery = new ReplaySubject<any>();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  /** The mock paramMap observable */
  readonly paramMap = this.subjectParam.asObservable();

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this.subjectParam.next(convertToParamMap(params));
  };

  /** The mock queryParams observable */
  readonly queryParams = this.subjectQuery.asObservable();

  /** Set the queryParams observables's next value */
  setQueryParams(queryParams?: any) {
    this.subjectQuery.next(queryParams);
  };

}


@Component({selector: 'app-select-panel', template: ''})
class SelectPanelStubComponent {
  @Output() candidatesChange = new EventEmitter<Candidate[]>();
  @Output() themesChange = new EventEmitter<VizCategory[]>();
  @Output() modeChange = new EventEmitter<Mode>();
  @Input() defaultThemeId: string;
}

@Component({selector: 'app-graph', template: ''})
class GraphComponent {
  @Input() candidates: Candidate[];
  @Input() themes: VizCategory[];
  @Input() mode: Mode;
  @Input() source: string;

}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let activatedRoute: ActivatedRouteStub;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      declarations: [ MainComponent,
                      SelectPanelStubComponent,
                      GraphComponent,
                      CreditsComponent],      
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
      imports:[ ButtonsModule.forRoot(), FormsModule]
    })
    .compileComponents();
  }));

  describe("Set source", ()=>{
    let sourceEl:any[];
    let graphEl: DebugElement;    
    
    beforeEach(()=>{
      fixture = TestBed.createComponent(MainComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      sourceEl = fixture.nativeElement.querySelectorAll('.btn');
      graphEl = fixture.debugElement.query(By.css('app-graph'));
    });

    it("Should set source in graph as facebook by default", ()=>{
        expect(graphEl.componentInstance.source).toEqual('facebook');
    })

    it("Should set source in graph when clicked one of the source buttons", ()=>{
      for(let labelEl of sourceEl){
        labelEl.click();
        fixture.detectChanges();
        expect(graphEl.componentInstance.source).toEqual(labelEl.attributes.btnradio.nodeValue)
      }
    })

  });

 
  describe('default theme', ()=>{
    let selectPanelEl: DebugElement;

    beforeEach(() =>{
      fixture = TestBed.createComponent(MainComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      selectPanelEl = fixture.debugElement.query(By.css('app-select-panel'));
    });        

    it('should set default theme when themeId given', ()=>{
      activatedRoute.setQueryParams({ 'themeId': "some-theme" })
      fixture.detectChanges();
      expect(selectPanelEl.componentInstance.defaultThemeId).toEqual('some-theme')

    })
  })



  describe('setting graph component', ()=>{
    let selectPanelEl: DebugElement;
    let graphEl: DebugElement;

    beforeEach(() =>{
      fixture = TestBed.createComponent(MainComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      selectPanelEl = fixture.debugElement.query(By.css('app-select-panel'));
      graphEl = fixture.debugElement.query(By.css('app-graph'));
    });    

    it('should update graphEl when a mode is emited from selectPanel', ()=>{
      selectPanelEl.componentInstance.modeChange.emit( {  id: 'candidate-metric',
                                                          showMode:"candidate",
                                                          showModeName:"Candidate",
                                                          metric:"metric2",
                                                          metricName:"Metric"  } );
      fixture.detectChanges();
      expect(graphEl.componentInstance.mode).toEqual({  id: 'candidate-metric',
                                                          showMode:"candidate",
                                                          showModeName:"Candidate",
                                                          metric:"metric2",
                                                          metricName:"Metric"  } );

    });

    it('should update graphEl when a candidates are emited from selectPanel', ()=>{
      selectPanelEl.componentInstance.candidatesChange.emit([{ id: 'two', name: 'Candidate Two', color:"#888" }])
      fixture.detectChanges();
      expect(graphEl.componentInstance.candidates).toEqual([ { id: 'two', name: 'Candidate Two', color:"#888" } ]);
    });


    it('should update graphEl when themes are emited from selectPanel', ()=>{
      selectPanelEl.componentInstance.themesChange.emit([{ id: 'one-a', name: 'VizCategory One a', children: []}]);
      fixture.detectChanges();
      expect(graphEl.componentInstance.themes).toEqual([{ id: 'one-a', name: 'VizCategory One a', children: []}]);

    });
  });

  describe('setting last update element', ()=>{
    let lastUpdatedElement: DebugElement;
    beforeEach(() =>{
      fixture = TestBed.createComponent(MainComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      lastUpdatedElement = fixture.debugElement.query(By.css('.last-updated'));
    });    

    it('Should set date correcly', ()=>{
      expect(lastUpdatedElement.nativeElement.innerHTML).toContain(moment().format("DD/MM/YYYY"))
    })

  })

});
