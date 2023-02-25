import {Component} from '@angular/core';

export interface CircuitGuesses {
  position: number;
  circuit: string;
  year: string;
  driver: string;
  wordCount: string;
  dnfs: string;
}

const GUESSES_DATA: CircuitGuesses[] = [
  {position: 1, circuit: 'Monaco', year: '2022', driver: 'PER', wordCount: '3', dnfs: '3'},
];

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-guesses',
  styleUrls: ['guesses.component.css'],
  templateUrl: 'guesses.component.html',
})
export class GuessesComponent {
  displayedColumns: string[] = ['position', 'circuit', 'year', 'driver', 'wordCount', 'dnfs'];
  dataSource = GUESSES_DATA;
}
