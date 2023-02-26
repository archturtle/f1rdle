import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { GuessResult } from "../../interfaces/guess";
import { CircuitsService } from "../../services/circuits.service";
import { Circuit, CircuitResult } from "../../interfaces/circuit";
import { GuessesService } from "../../services/guesses.service";
import { lastValueFrom, Observable, startWith } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';

/**
 * The component to handle all input from the user when they are guessing.
 */
@Component({
  selector: 'app-guess',
  templateUrl: './guess.component.html',
  styleUrls: ['./guess.component.css']
})
export class GuessComponent implements OnInit {
  /**
   * The map of circuit codes.
   */
  circuits = this.circuitService.circuitCodes;

  /**
   * Filtered autocompletion options
   */
  filteredOptions$!: Observable<string[]>;

  /**
   * The answer to the game in circuit form.
   */
  answer!: Circuit;

  /**
   * The control which links to the input.
   */
  circuitControl = new FormControl<string>('');

  /**
   * Injects the services CircuitsService, GuessesService and FormBuilder.
   *
   * @param formBuilder: The form builder, which binds the form in the template to the code.
   * @param circuitService: The circuit service.
   * @param guessService: The guess service.
   * @param snackBar: The snack bar service.
   */
  constructor(private formBuilder: FormBuilder,
              private circuitService: CircuitsService,
              private guessService: GuessesService,
              private snackBar: MatSnackBar) {
  }

  /**
   * When the component is initialized, it will subscribe to the circuit service and set the answer of the
   * game to answer.
   */
  ngOnInit(): void {
    // Selected Circuit
    this.circuitService.selectedCircuit$
      .subscribe(e => this.answer = e);

    // Filtered Options
    this.filteredOptions$ = this.circuitControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => {
          if (value == null || value.length < 1) return [];
          return this.filter(value);
        })
      );
  }

  /**
   * Computes the number of racers that completed the race.
   *
   * @param results: The number of racers that completed the race.
   */
  computeNumberWon(results: CircuitResult[]): number {
    return results.filter(item => item.position == item.positionText).length;
  }

  /**
   * Filters the circuit keys to find ones that are close to val
   *
   * @param val The closest match string.
   */
  filter(val: string): string[] {
    return [...this.circuits.keys()].filter(name => {
      return name.includes(val);
    })
  }

  /**
   * Validates the user's input when the user input's a guess.
   * If the guess is valid, then it will be added to the guess list and compute how close the guess was.
   * Otherwise, the guess will be skipped over and the user will have to re-input.
   */
  onSubmit = async (): Promise<void> => {
    let guess = this.circuitControl.value
    if (guess == null || guess.length < 1) return;
    this.circuitControl.reset();

    // checks that the guess is in the list of possible circuits
    let check = false;
    for (let nameOfCircuit of this.circuits.keys()) {
      if (nameOfCircuit == guess) {
        check = true;
      }
    }

    if (!check) {
      this.snackBar.open("Circuit Does not Exist!", "OK", {
        duration: 2000
      });
      return;
    }

    if (this.guessService.hasCircuit(guess)) {
      this.snackBar.open("You have already guess this!", "OK", {
        duration: 2000
      });
      return;
    }

    // Ensures that the season is correct based on what is inputted
    // Miami needs to be hardcoded because there is only one year that it has been used.
    let season = this.answer.season;
    let val: Circuit | null = await lastValueFrom(
      this.circuitService.getCircuitByCode$(
        this.circuits.get(guess)!,
        (guess == "Miami International Autodrome".toLowerCase()) ? 2022 : season
      )
    );

    // Gets the Circuit of the name inputted for the guess, if the circuit does not exist for the
    // year that the answer exists, then it will choose a random year that it did exist.
    while (val == null) {
      val = await lastValueFrom(
        this.circuitService.getCircuitByCode$(
          this.circuits.get(guess)!,
          1950 + Math.floor(Math.random() * 72)
        )
      )
    }

    // Sets up & processes the guess and circuit data
    let yearDiff: string;
    let yearDiffS: string;
    let wordCountG: string;
    let wordCountGS: string;
    let finishCarDiff: string;
    let finishCarDiffS: string;

    if ((this.answer.season - val.season) > 0) {
      yearDiff = val.season + " ↑";
      yearDiffS = "HIGHER"
    } else if (this.answer.season == val.season) {
      yearDiff = val.season + "";
      yearDiffS = "EQUAL"
    } else {
      yearDiff = val.season + " ↓";
      yearDiffS = "HIGHER"
    }


    if ((this.answer.circuitName.split(' ').length - val.circuitName.split(' ').length) > 0) {
      wordCountG = val.circuitName.split(' ').length.toString() + " ↑";
      wordCountGS = "HIGHER";
    } else if (this.answer.circuitName.split(' ').length == val.circuitName.split(' ').length) {
      wordCountG = val.circuitName.split(' ').length.toString();
      wordCountGS = "EQUAL";
    } else {
      wordCountG = val.circuitName.split(' ').length.toString() + " ↓";
      wordCountGS = "LOWER";
    }

    if ((this.computeNumberWon(this.answer.results) - this.computeNumberWon(val.results)) > 0) {
      finishCarDiff = this.computeNumberWon(val.results).toString() + " ↑";
      finishCarDiffS = "HIGHER";
    } else if (this.computeNumberWon(this.answer.results) == this.computeNumberWon(val.results)) {
      finishCarDiff = this.computeNumberWon(val.results).toString();
      finishCarDiffS = "EQUAL";
    } else {
      finishCarDiff = this.computeNumberWon(val.results).toString() + " ↓";
      finishCarDiffS = "LOWER";
    }

    let driverStatus = "";
    if(this.answer.circuitName == val.circuitName){
      yearDiffS = "WIN";
      driverStatus = "WIN";
      wordCountGS = "WIN";
      finishCarDiffS = "WIN";

      this.circuitControl.disable();
      this.snackBar.open("You Win!", "Yay", {
        duration: 5000
      });
    }

    // Creates the GuessResult and adds it to the guesses list
    let guessCircuit: GuessResult = {
      name: val.circuitName,
      year: {result: yearDiff, status: yearDiffS},
      driver: {result: val.results[0].driver.givenName + " " + val.results[0].driver.familyName, status: driverStatus},
      wordCount: {result: wordCountG, status: wordCountGS},
      finishingCars: {result: finishCarDiff, status: finishCarDiffS},
    };

    this.guessService.addGuesses(guessCircuit);
  }
}
