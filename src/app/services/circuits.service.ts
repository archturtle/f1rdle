import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators'
import { Circuit } from '../interfaces/circuit';

@Injectable({
  providedIn: 'root'
})
export class CircuitsService {
  private _circuits: BehaviorSubject<Circuit[]> = new BehaviorSubject<Circuit[]>([]);
  public readonly circuits$: Observable<Circuit[]> = this._circuits.asObservable();

  constructor(private httpClient: HttpClient) { }

  getCircuits$(): Observable<Circuit[]> {
    return this.httpClient.get('http://ergast.com/api/f1/circuits.json?limit=1000')
      .pipe(
        map((result: any): Circuit[] => result["MRData"]["CircuitTable"]["Circuits"]),
        tap({
          next: (value: Circuit[]) => this._circuits.next(value)
        }),
      );
  }

  getCircuitResults$(circuit: Circuit): Observable<Circuit> {
    let url = `http://ergast.com/api/f1/circuits/${circuit.circuitId}/results.json`;

    return this.httpClient.get(url)
      .pipe(
        map((result: any) => result["MRData"]["RaceTable"]["Races"]),
        map((result: any[]): Circuit => {
          let idx = Math.floor(Math.random() * result.length);
          let res = result[idx];

          return {
            circuitId: circuit.circuitId,
            circuitName: circuit.circuitName,
            season: res["season"],
            location: circuit.location,
            results: res["Results"]
          };
        }),
      )
  }
}
