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
  @Input() showBy: string;
  @Input() metric: string;
  @Input() candidates: string[];
  @Input() themes: string[];

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

    // xit('should set default values as the first value of each selection array', ()=>{
    //   expect(modesEl.componentInstance.ngModel).toEqual({   id: 'candidate-metric',
    //                                                         showMode:"Candidate",
    //                                                         showModeName:"candidate",
    //                                                         metric:"metric",
    //                                                         metricName:"Metric"  }   )
    // });

    it('should update graphEl when a mode is emited from selectPanel', ()=>{
      selectPanelEl.componentInstance.modeChange.emit( {  id: 'candidate-metric',
                                                          showMode:"candidate",
                                                          showModeName:"Candidate",
                                                          metric:"metric2",
                                                          metricName:"Metric"  } );
      fixture.detectChanges();
      expect(graphEl.componentInstance.showBy).toEqual('candidate');
      expect(graphEl.componentInstance.metric).toEqual('metric2');

    });

    it('should update graphEl when a candidates are emited from selectPanel', ()=>{

      selectPanelEl.componentInstance.candidatesChange.emit([{ id: 'two', name: 'Candidate Two', color:"#888" }])
      // selectPanelEl.componentInstance.change.emit([{ id: 'one-a', name: 'VizCategory One a', children: []}]);
      fixture.detectChanges();
      expect(graphEl.componentInstance.candidates).toEqual([ { id: 'two', name: 'Candidate Two', color:"#888" } ]);
      // expect(graphEl.componentInstance.themes).toEqual([{ id: 'one-a', name: 'VizCategory One a', children: []}]);

    });


    it('should update graphEl when themes are emited from selectPanel', ()=>{

      selectPanelEl.componentInstance.themesChange.emit([{ id: 'one-a', name: 'VizCategory One a', children: []}]);
      fixture.detectChanges();
      expect(graphEl.componentInstance.themes).toEqual([{ id: 'one-a', name: 'VizCategory One a', children: []}]);

    });
  })

});
