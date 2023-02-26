import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { GuessResult } from "../interfaces/guess";

@Injectable({
  providedIn: 'root'
})
export class GuessesService {
  private _guesses: BehaviorSubject<GuessResult[]> = new BehaviorSubject<GuessResult[]>([]);
  public readonly guesses$: Observable<GuessResult[]> = this._guesses.asObservable();

  constructor() { }

  addGuesses(guess: GuessResult): boolean {
    if (this._guesses.value.filter(value => {
      return value.name == guess.name
    }).length != 0) return false;

    this._guesses.next([...this._guesses.value, guess]);
    return true;
  }

  hasCircuit(name: string): boolean {
    return this._guesses.value.filter(item => item.name == name).length != 0;
  }
}
