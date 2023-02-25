import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { GuessComponent } from './components/guess/guess.component';
import { GuessesComponent } from './components/guesses/guesses.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    StatisticsComponent,
    GuessComponent,
    GuessesComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
