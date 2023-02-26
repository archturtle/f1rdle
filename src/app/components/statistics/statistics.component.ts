import { Component, OnInit } from '@angular/core';
import { Circuit, CircuitResult } from 'src/app/interfaces/circuit';
import { CircuitsService } from 'src/app/services/circuits.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  /**
   * The answer for the game.
   */
  selectedCircuit!: Circuit;

  /**
   * Injects the circuit service.
   * @param circuitService: the circuit service.
   */
  constructor(private circuitService: CircuitsService) {
  }

  /**
   * When the component is initialized, it will subscribe to the circuit service and set the answer of the
   * game to selectedCircuit.
   */
  ngOnInit(): void {
    this.circuitService.selectedCircuit$
      .subscribe(res => this.selectedCircuit = res);
  }

  /**
   * Computes the number of racers that completed the race.
   *
   * @param results: The number of racers that completed the race.
   */
  computeNumberWon(results: CircuitResult[]): number {
    return results.filter(item => item.position == item.positionText).length;
  }
}
