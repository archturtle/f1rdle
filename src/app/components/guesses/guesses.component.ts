import {Component, OnInit} from '@angular/core';
import {GuessesService} from "../../services/guesses.service";
import {GuessResult} from "../../interfaces/guess";

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-guesses',
  styleUrls: ['guesses.component.css'],
  templateUrl: 'guesses.component.html',
})
export class GuessesComponent implements OnInit {

  guesses!: GuessResult[];
  displayedColumns: string[] = ['circuit', 'year', 'driver', 'wordCount', 'finishingCars'];

  constructor(private guessService: GuessesService) { }

  ngOnInit() {
    this.guessService.guesses$
      .subscribe(e => this.guesses = e)
  }
}
