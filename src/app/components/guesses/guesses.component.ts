import {Component, OnInit} from '@angular/core';
import {GuessesService} from "../../services/guesses.service";
import {GuessResult} from "../../interfaces/guess";

/**
 * Handles the Guess table and its items.
 */
@Component({
  selector: 'app-guesses',
  styleUrls: ['guesses.component.css'],
  templateUrl: 'guesses.component.html',
})
export class GuessesComponent implements OnInit {

  /**
   * The list of guesses.
   */
  guesses!: GuessResult[];
  displayedColumns: string[] = ['circuit', 'year', 'driver', 'wordCount', 'finishingCars'];

  /**
   * Injects the service GuessesService.
   * @param guessService: the guesses service.
   */
  constructor(private guessService: GuessesService) {
  }

  /**
   * When the component is initialized, it will subscribe to the guess service and set the list of the circuits
   * that have been guessed to guesses.
   */
  ngOnInit() {
    this.guessService.guesses$
      .subscribe(e => this.guesses = e)
  }
}
