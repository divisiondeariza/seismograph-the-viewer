import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Input, Output, EventEmitter, DebugElement, Component } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { By } from '@angular/platform-browser';


import { MainComponent } from './main.component';
import { CreditsComponent } from '../../elements/credits/credits.component'
import { CandidatesService } from '../../services/candidates/candidates.service';
import { Candidate } from '../../classes/candidate';
import { ModesService } from '../../services/modes/modes.service';
import { Mode } from '../../classes/mode';
import { VizCategoriesService } from '../../services/viz-categories/viz-categories.service';
import { VizCategory } from '../../classes/viz-category';

@Component({selector: 'app-select-panel', template: ''})
class SelectPanelStubComponent {
  @Output() candidatesChange = new EventEmitter<Candidate[]>();
  @Output() themesChange = new EventEmitter<VizCategory[]>();
  @Output() modeChange = new EventEmitter<Mode>();
}

@Component({selector: 'app-graph', template: ''})
class GraphComponent {
  @Input() candidates: Candidate[];
  @Input() themes: VizCategory[];
  @Input() mode: Mode;

}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainComponent,
                      SelectPanelStubComponent,
                      GraphComponent,
                      CreditsComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  describe('setting graph component', ()=>{
    let selectPanelEl: DebugElement;
    let graphEl: DebugElement;

    beforeEach(() =>{
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
  })

});