import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Circuit } from './interfaces/circuit';
import { CircuitsService } from './services/circuits.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  circuits$: Observable<Circuit[]> = this.circuitService.circuits$;
  
  title = "f1rdle";

  constructor(private circuitService: CircuitsService) { }

  ngOnInit(): void {
    this.circuitService.getCircuits$()
      .subscribe();
  }
}
