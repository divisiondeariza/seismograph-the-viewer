import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule }    from '@angular/common/http';
import { NvD3Module } from 'ng2-nvd3';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainComponent } from './views/main/main.component';
import { CandidatesService } from './services/candidates/candidates.service';
import { VizCategoriesService } from './services/viz-categories/viz-categories.service';
import { ModesService } from './services/modes/modes.service';
import { TimeSeriesService } from './services/time-series/time-series.service';
import { GraphOptionsService } from './services/graph-options/graph-options.service';


import { GraphComponent } from './elements/graph/graph.component';

import 'd3';
import 'nvd3';
import 'moment';
import { CreditsComponent } from './elements/credits/credits.component';
import { SelectPanelComponent } from './elements/select-panel/select-panel.component'


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    GraphComponent,
    CreditsComponent,
    SelectPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgSelectModule,
    NvD3Module,
    FormsModule
  ],
  providers: [CandidatesService,
              VizCategoriesService,
              ModesService,
              TimeSeriesService,
              GraphOptionsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
