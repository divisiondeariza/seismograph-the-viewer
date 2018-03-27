import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { MainComponent } from './views/main/main.component';
import { CandidatesService } from './services/candidates/candidates.service';
import { VizCategoriesService } from './services/viz-categories/viz-categories.service';
import { ModesService } from './services/modes/modes.service';
import { GraphComponent } from './elements/graph/graph.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgSelectModule
  ],
  providers: [CandidatesService,
              VizCategoriesService,
              ModesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
