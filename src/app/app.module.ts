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
import { GameComponent } from './components/game/game.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CircuitsService } from 'src/app/services/circuits.service';
import { firstValueFrom } from 'rxjs';

import { ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AboutComponent } from 'src/app/components/about/about.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    DashboardComponent,
    StatisticsComponent,
    GuessComponent,
    GuessesComponent,
    GameComponent,
    AboutComponent
  ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSnackBarModule,
        MatTableModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatAutocompleteModule
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
export class AppModule {
}
