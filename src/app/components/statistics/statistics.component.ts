import { Component, Input, OnInit } from '@angular/core';
import { Circuit, CircuitResult } from 'src/app/interfaces/circuit';
import { CircuitsService } from 'src/app/services/circuits.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit{

  /**
   * The answer for the game.
   */
  selectedCircuit!: Circuit;

  /**
   * Injects the circuit service.
   * @param circuitService: the circuit service.
   */
  constructor(private circuitService: CircuitsService) {}

  ngOnInit(): void {
    this.circuitService.selectedCircuit$
      .subscribe(res => this.selectedCircuit = res);
  }

  computeNumberWon(results: CircuitResult[]): number {
    return results.filter(item => item.position == item.positionText).length;
  }
}
