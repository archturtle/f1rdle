import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from '@angular/material/table'
import { MatInputModule } from "@angular/material/input";

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

import { CircuitsService } from 'src/app/services/circuits.service';
import { firstValueFrom } from 'rxjs';

import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";

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
    FormsModule,
    AppRoutingModule,
    BrowserModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ReactiveFormsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: async (circuitsService: CircuitsService) => {
        let seasonList = await firstValueFrom(circuitsService.getSeasons$());
        let season = seasonList[Math.floor(Math.random() * seasonList.length)];

        await firstValueFrom(circuitsService.getCircuitCodes$())
        await firstValueFrom(circuitsService.getCircuitsPerSeason$(season));
        await firstValueFrom(circuitsService.chooseRandomCircuit$())
      },
      deps: [CircuitsService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
