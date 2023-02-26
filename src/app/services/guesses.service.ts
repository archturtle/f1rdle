import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Circuit} from "../interfaces/circuit";
import { GuessResult} from "../interfaces/guess";

@Injectable({
  providedIn: 'root'
})
export class GuessesService {
  private _guesses: BehaviorSubject<GuessResult[]> = new BehaviorSubject<GuessResult[]>([
    {
      name: 'Monza',
      year: {
        result: "2043",
        status: "HIGHER"
      },
      driver: {
        result: "Alex Albon",
        status: "EQUAL"
      },
      wordCount: {
        result: "3",
        status: "LOWER"
      },
      finishingCars: {
        result: "4",
        status: "HIGHER"
      }
    }
  ]);
  public readonly guesses$: Observable<GuessResult[]> = this._guesses.asObservable();

  constructor() { }

  addGuesses(guess: GuessResult): boolean {
    if (this._guesses.value.filter(value => {
      return value.name == guess.name &&
        value.year.result == guess.year.result &&
        value.driver.result == guess.driver.result &&
        value.wordCount.result == guess.wordCount.result &&
        value.finishingCars.result == guess.finishingCars.result;
    }).length != 0) return false;

    this._guesses.next([...this._guesses.value, guess]);
    return true;
  }


}
