import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Input, Output, EventEmitter, DebugElement, Component } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { By } from '@angular/platform-browser';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AngularFontAwesomeModule } from 'angular-font-awesome';


import { SelectPanelComponent } from './select-panel.component';
import { CandidatesService } from '../../services/candidates/candidates.service';
import { Candidate } from '../../classes/candidate';
import { ModesService } from '../../services/modes/modes.service';
import { Mode } from '../../classes/mode';
import { VizCategoriesService } from '../../services/viz-categories/viz-categories.service';
import { VizCategory } from '../../classes/viz-category';


@Component({selector: 'ng-select', template: ''})
class NgSelectStubComponent {
  @Input() items: any;
  @Input() multiple: boolean;
  @Input() maxSelectedItems: number;
  @Input() hidden: boolean;
  @Output() change = new EventEmitter();
  @Input() placeholder;

  @Input() ngModel: any;

}

describe('SelectPanelComponent', () => {
  let component: SelectPanelComponent;
  let fixture: ComponentFixture<SelectPanelComponent>;
  let candidates: Candidate[];
  let getCandidatesSpy: jasmine.Spy;
  let vizCategories:VizCategory[];
  let getVizCategoriesSpy: jasmine.Spy;
  let modes:Mode[];
  let getModeSpy: jasmine.Spy;


  beforeEach(async(() => {

    candidates = [{ id: 'one', name: 'Candidate One', color:"#fff" }, 
                  { id: 'two', name: 'Candidate Two', color:"#888" },
                  { id: 'two', name: 'Candidate Two', color:"#444" },
                  { id: 'two', name: 'Candidate Two', color:"#222" },
                  { id: 'two', name: 'Candidate Two', color:"#111" },];
    const candidatesService = jasmine.createSpyObj('CandidatesService', ['getCandidates']);
    getCandidatesSpy = candidatesService.getCandidates.and.returnValue(of(candidates));

    vizCategories = [
                    { id: 't-one', name: 'VizCategory One', children: []},
                    { id: 't-two', name: 'VizCategory Two', children: []},
                    { id: 't-three', name: 'VizCategory Three', children: []},
                     ]
    const vizCategoriesService = jasmine.createSpyObj('VizCategoriesService', ['getVizCategories'])
    getVizCategoriesSpy = vizCategoriesService.getVizCategories.and.returnValue(of(vizCategories));                    

    modes = [{"showMode":"candidate","showModeName":"Por Candidato","metric":"topicratio","name":"", "info": "info"  },
             {"showMode":"candidate","showModeName":"Por Candidato","metric":"topiceffectivity","name":"", "info": "info"},
             {"showMode":"candidate","showModeName":"Por Candidato","metric":"topicsentiment","name":"", "info": "info"},
             {"showMode":"theme","showModeName":"Por Tema","metric":"topicratio","name":"", "info": "info"},
             {"showMode":"theme","showModeName":"Por Tema","metric":"topiceffectivity","name":"", "info": "info"},
             {"showMode":"theme","showModeName":"Por Tema","metric":"topicsentiment","name":"", "info": "info"}]

    const modesService = jasmine.createSpyObj('VizModes', ['getModes'])
    getVizCategoriesSpy = modesService.getModes.and.returnValue(of(modes));     

    TestBed.configureTestingModule({
      declarations: [ SelectPanelComponent, NgSelectStubComponent ],
      providers: [
        { provide:  VizCategoriesService, useValue: vizCategoriesService },
        { provide:  CandidatesService, useValue: candidatesService },
        { provide:  ModesService, useValue: modesService }
      ],
      imports: [ PopoverModule.forRoot(), AngularFontAwesomeModule ]
    })
    .compileComponents();
  }));
 
  beforeEach(() => {

    fixture = TestBed.createComponent(SelectPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    describe('Setting defaults', ()=>{
      let modesEl: DebugElement;
      let vizCategoriesEl: DebugElement;
      let candidatesEl: DebugElement;

      it('should not have default values selected without defaultTheme', () =>{
        modesEl = fixture.debugElement.query(By.css('#modes-select'));
        vizCategoriesEl = fixture.debugElement.query(By.css('#viz-categories-select'));
        candidatesEl = fixture.debugElement.query(By.css('#candidates-select'));
        expect(modesEl.componentInstance.ngModel).toBeNull();
/*        expect(vizCategoriesEl.componentInstance.ngModel).toEqual({ id: 'two', name: 'VizCategory Two', children: []})
        expect(candidatesEl.componentInstance.ngModel.length).toEqual(4);   */
      })


      // For good sake refactor this
      it('should set correct theme if  defaultTheme given', ()=>{
        // Re-generate component with defaultTheme
        fixture = TestBed.createComponent(SelectPanelComponent);
        component = fixture.componentInstance;
        component.defaultThemeId = 't-two';
        spyOn(component.candidatesChange, 'emit');
        spyOn(component.themesChange, 'emit');
        fixture.detectChanges();      

        modesEl = fixture.debugElement.query(By.css('#modes-select'));
        vizCategoriesEl = fixture.debugElement.query(By.css('#viz-categories-select'));
        candidatesEl = fixture.debugElement.query(By.css('#candidates-select'));



        expect(modesEl.componentInstance.ngModel)
              .toEqual({"showMode":"theme","showModeName":"Por Tema","metric":"topicratio","name":"", "info": "info"})
        expect(vizCategoriesEl.componentInstance.ngModel).toEqual({ id: 't-two', name: 'VizCategory Two', children: []})
        expect(candidatesEl.componentInstance.ngModel.length).toEqual(4);      
        expect(candidates).toEqual(jasmine.arrayContaining(candidatesEl.componentInstance.ngModel));  
        expect(candidatesEl.componentInstance.hidden).toBeFalsy();    
        expect(vizCategoriesEl.componentInstance.hidden).toBeFalsy();


        fixture.detectChanges();     
        expect(component.candidatesChange.emit).toHaveBeenCalledWith(jasmine.arrayContaining(candidatesEl.componentInstance.ngModel));
        expect(component.themesChange.emit).toHaveBeenCalledWith([{ id: 't-two', name: 'VizCategory Two', children: []}]);

      })
    })





  describe('Setting placeholders', ()=>{
    let modesEl: DebugElement;
    let vizCategoriesEl: DebugElement;
    let candidatesEl: DebugElement;


    beforeEach(() =>{
      modesEl = fixture.debugElement.query(By.css('#modes-select'));
      vizCategoriesEl = fixture.debugElement.query(By.css('#viz-categories-select'));
      candidatesEl = fixture.debugElement.query(By.css('#candidates-select'));
    });    

    it('should set placeholder for modes', ()=>{
      expect(modesEl.componentInstance.placeholder).toEqual("Seleccione una pregunta")
    });

    it('should set placeholder for candidates when showBy==candidate', ()=>{
      modesEl.componentInstance.change.emit( {  id: 'candidate-metric',
                                                showMode:"candidate",
                                                showModeName:"Candidate",
                                                metric:"metric",
                                                name:"Metric"  } );
      fixture.detectChanges();
      expect(candidatesEl.componentInstance.placeholder).toEqual("Seleccione un candidato");
    });

    it('should set placeholder for candidates when showBy!=candidate', ()=>{
      modesEl.componentInstance.change.emit( {  id: 'candidate-metric',
                                                showMode:"theme",
                                                showModeName:"Candidate",
                                                metric:"metric",
                                                name:"Metric"  } );
      fixture.detectChanges();
      expect(candidatesEl.componentInstance.placeholder).toEqual("Seleccione uno o más candidatos");
    });

    it('should set placeholder for themes when showBy==theme', ()=>{
      modesEl.componentInstance.change.emit( {  id: 'candidate-metric',
                                                showMode:"theme",
                                                showModeName:"Candidate",
                                                metric:"metric",
                                                name:"Metric"  } );
      fixture.detectChanges();
      expect(vizCategoriesEl.componentInstance.placeholder).toEqual("Seleccione un tema");
    });

    it('should set placeholder for candidates when showBy!=theme', ()=>{
      modesEl.componentInstance.change.emit( {  id: 'candidate-metric',
                                                showMode:"candidate",
                                                showModeName:"Candidate",
                                                metric:"metric",
                                                name:"Metric"  } );
      fixture.detectChanges();
      expect(vizCategoriesEl.componentInstance.placeholder).toEqual("Seleccione uno o más temas");
    });

  });

  describe('setting candidates select', ()=>{
    let candidatesEl: DebugElement;

    beforeEach(() =>{
      candidatesEl = fixture.debugElement.query(By.css('#candidates-select'));
    });

    it("should not be visible if no mode selected", ()=>{
      component.showBy = undefined;
      fixture.detectChanges();
      expect(candidatesEl.componentInstance.hidden).toBeTruthy();
      component.showBy = "showMode";
      fixture.detectChanges();
      expect(candidatesEl.componentInstance.hidden).toBeFalsy();
    });

    it('Should set candidates correctly', ()=>{
      expect(candidatesEl.componentInstance.items).toEqual(candidates);
    });

    it('should configure correctly the ng-selec attributes', ()=>{
      expect(candidatesEl.attributes.bindLabel).toEqual("name");
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

    it('should emit when selector emits', ()=>{
      spyOn(component.candidatesChange, 'emit');
      candidatesEl.componentInstance.change.emit([{ id: 'one-a', name: 'VizCategory One a', children: []}]);
      fixture.detectChanges();     
      expect(component.candidatesChange.emit).toHaveBeenCalled();
    });

    it("should emit an array of themes when selector emits an array", ()=>{
      component.candidatesChange.subscribe((value)=> expect(value).toEqual([{ id: 'one', name: 'Candidate One', color:"#fff" }]))
      candidatesEl.componentInstance.change.emit([{ id: 'one', name: 'Candidate One', color:"#fff" }]);
      fixture.detectChanges();
    });

    it("should emit an array of themes when selector emits a single value", ()=>{
      component.candidatesChange.subscribe((value)=> expect(value).toEqual([{ id: 'one', name: 'Candidate One', color:"#fff" }]))
      candidatesEl.componentInstance.change.emit({ id: 'one', name: 'Candidate One', color:"#fff" });
      fixture.detectChanges();
    });

    it("should not emit when selector emits undefined", ()=>{
      component.candidatesChange.subscribe((value)=> fail("Should not emit"))
      candidatesEl.componentInstance.change.emit(undefined);
      fixture.detectChanges();
    });
  });


  describe('setting vizCategories select', ()=>{
    let vizCategoriesEl: DebugElement;

    beforeEach(() =>{
      vizCategoriesEl = fixture.debugElement.query(By.css('#viz-categories-select'));
    });
    it('Should set vizCategories correctly', ()=>{
      expect(vizCategoriesEl.componentInstance.items).toEqual(vizCategories);
    });

    it("should not be visible if no mode selected", ()=>{
      component.showBy = undefined;
      fixture.detectChanges();
      expect(vizCategoriesEl.componentInstance.hidden).toBeTruthy();
      component.showBy = "showMode";
      fixture.detectChanges();
      expect(vizCategoriesEl.componentInstance.hidden).toBeFalsy();
    });

    it('should configure correctly the ng-selec attributes', ()=>{
      expect(vizCategoriesEl.attributes.bindLabel).toEqual("name");
      expect(vizCategoriesEl.componentInstance.maxSelectedItems).toEqual(4);

    })

    it("should set multiple true only when showBy == 'candidate' ", ()=>{
      component.showBy = 'candidate';
      fixture.detectChanges();
      expect(vizCategoriesEl.componentInstance.multiple).toEqual(true);
      component.showBy = 'theme';
      fixture.detectChanges();
      expect(vizCategoriesEl.componentInstance.multiple).toEqual(false);
      component.showBy = undefined;
      fixture.detectChanges();
      expect(vizCategoriesEl.componentInstance.multiple).toEqual(false);

    });

    it('should emit when selector emits', ()=>{
      spyOn(component.themesChange, 'emit');
      vizCategoriesEl.componentInstance.change.emit([{ id: 'one-a', name: 'VizCategory One a', children: []}]);
      fixture.detectChanges();     
      expect(component.themesChange.emit).toHaveBeenCalled();
    });

    it("should emit an array of themes when selector emits an array", ()=>{
      component.themesChange.subscribe((value)=> expect(value).toEqual([{ id: 'one-a', name: 'VizCategory One a', children: []}]))
      vizCategoriesEl.componentInstance.change.emit([{ id: 'one-a', name: 'VizCategory One a', children: []}]);
      fixture.detectChanges();
    });

    it("should emit an array of themes when selector emits a single value", ()=>{
      component.themesChange.subscribe((value)=> expect(value).toEqual([{ id: 'one-a', name: 'VizCategory One a', children: []}]))
      vizCategoriesEl.componentInstance.change.emit({ id: 'one-a', name: 'VizCategory One a', children: []});
      fixture.detectChanges();
    });

    it("should not emit when selector emits undefined", ()=>{
      component.themesChange.subscribe((value)=> fail("Should not emit"))
      vizCategoriesEl.componentInstance.change.emit(undefined);
      fixture.detectChanges();
    });

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
      expect(modesEl.attributes.bindLabel).toEqual("name");

    });
    
    it('should emit when selector emits', ()=>{
      spyOn(component.modeChange, 'emit');
      modesEl.componentInstance.change.emit([{ id: 'one-a', name: 'VizCategory One a', children: []}]);
      fixture.detectChanges();     
      expect(component.modeChange.emit).toHaveBeenCalled();
    });

    it('should set showBy correctly and emit showByChange and metricChange when change is emmited', ()=>{
      component.modeChange.subscribe((value) => expect(value).toEqual({ showMode:"candidate",
                                                                        showModeName:"Candidate",
                                                                        metric:"metric",
                                                                        name:"Metric",
                                                                        info: "Info"  }))
      modesEl.componentInstance.change.emit( {  showMode:"candidate",
                                                showModeName:"Candidate",
                                                metric:"metric",
                                                name:"Metric",
                                                info: "Info"  } );
      expect(component.showBy).toEqual('candidate');
      fixture.detectChanges();

    });
    it('should set info button only when there is a mode selected', ()=>{
      const btnInfoEl = fixture.debugElement.query(By.css('#btn-info'));
      expect(btnInfoEl == null).toBeTruthy();
    });

    it('should set popover in info button correctly', ()=>{
      modesEl.componentInstance.change.emit( {  showMode:"candidate",
                                                showModeName:"Candidate",
                                                metric:"metric",
                                                name:"Metric",
                                                info: "Info"  } );
      fixture.detectChanges();
      const btnInfoEl = fixture.debugElement.query(By.css('#btn-info'));
      expect(btnInfoEl.attributes["ng-reflect-popover"]).toEqual("Info");

    });



  });

})
