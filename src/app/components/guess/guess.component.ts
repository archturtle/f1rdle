import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {GuessResult} from "../../interfaces/guess";
import {CircuitsService} from "../../services/circuits.service";
import {Circuit, CircuitResult} from "../../interfaces/circuit";
import * as latinize from "latinize";
import {GuessesService} from "../../services/guesses.service";
import {lastValueFrom} from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-guess',
  templateUrl: './guess.component.html',
  styleUrls: ['./guess.component.css']
})
export class GuessComponent implements OnInit {
    circuits = this.circuitService.circuitCodes;

    answer!: Circuit;
    guessForm: FormGroup = this.formBuilder.group({ input: '' })

    constructor(private formBuilder: FormBuilder,
                private circuitService: CircuitsService,
                private guessService: GuessesService,
                private snackBar: MatSnackBar) { }

    ngOnInit(): void {
      this.circuitService.selectedCircuit$
        .subscribe(e => this.answer = e);
    }

    computeNumberWon(results: CircuitResult[]): number {
      return results.filter(item => item.position == item.positionText).length;
    }

    onSubmit = async (): Promise<void> => {
      let guess = this.guessForm.value['input']
      guess = latinize(guess).toLowerCase();
      // this.guessForm.reset();

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

      let season = this.answer.season;
      let val: Circuit | null = await lastValueFrom(
        this.circuitService.getCircuitByCode$(
          this.circuits.get(guess)!,
          (guess == "Miami International Autodrome".toLowerCase()) ? 2022 : season
        )
      );
      while (val == null) {
        val = await lastValueFrom(
          this.circuitService.getCircuitByCode$(
            this.circuits.get(guess)!,
            1950 + Math.floor(Math.random() * 72)
          )
        )
      }

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


      let guessCircuit: GuessResult = {
        name: val.circuitName,
        year: {result: yearDiff, status: yearDiffS},
        driver: {result: val.results[0].driver.givenName + " " + val.results[0].driver.familyName, status: ""},
        wordCount: {result: wordCountG, status: wordCountGS},
        finishingCars: {result: finishCarDiff, status: finishCarDiffS}
      };

      this.guessService.addGuesses(guessCircuit);
    }


}
