import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from '@angular/material/table'

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { GuessComponent } from './components/guess/guess.component';
import { GuessesComponent } from './components/guesses/guesses.component';
import { AppRoutingModule } from './app-routing.module';
import { EasyPageComponent } from './components/easy-page/easy-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MediumPageComponent } from './components/medium-page/medium-page.component';
import { HardPageComponent } from './components/hard-page/hard-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from "@angular/material/input";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    StatisticsComponent,
    GuessComponent,
    GuessesComponent,
    EasyPageComponent,
    MediumPageComponent,
    HardPageComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatTableModule
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
