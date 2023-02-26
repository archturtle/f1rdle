import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, forkJoin, Observable, of, ReplaySubject, zip } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators'
import { Circuit, CircuitResult } from '../interfaces/circuit';

@Injectable({
  providedIn: 'root'
})
export class CircuitsService {
  private _circuits: BehaviorSubject<Circuit[]> = new BehaviorSubject<Circuit[]>([]);
  public readonly circuits$: Observable<Circuit[]> = this._circuits.asObservable();

  private _selectedCircuit: ReplaySubject<Circuit> = new ReplaySubject<Circuit>(1);
  public readonly selectedCircuit$: Observable<Circuit> = this._selectedCircuit.asObservable();


  constructor(private httpClient: HttpClient) { }

  getSeasons$(): Observable<number[]> {
    return this.httpClient.get('http://ergast.com/api/f1/seasons.json?limit=1000')
      .pipe(
        map((result: any) => result["MRData"]["SeasonTable"]["Seasons"]),
        map((result: any) => result.map((item: any) => parseInt(item["season"], 10)))
      );
  }

  getCircuits$(season: number): Observable<Circuit[]> {
    // http://ergast.com/api/f1/2001/circuits.json
    return this.httpClient.get(`http://ergast.com/api/f1/${season}/circuits.json?limit=1000`)
      .pipe(
        map((result: any): Circuit[] => result["MRData"]["CircuitTable"]["Circuits"]),
        map((result: any): Circuit[] => {
          return result.map((r: any) => {
            return {
              circuitId: r["circuitId"],
              circuitName: r["circuitName"],
              season: season,
              result: [],
              location: {
                lat: r["Location"]["lat"],
                long: r["Location"]["long"],
                locality: r["Location"]["locality"],
                country: r["Location"]["country"],
              }
            }
          })
        }),
        tap(console.log),
        tap({
          next: (value: Circuit[]) => {
            this._circuits.next(value);
          }
        }),
      );
  }

  chooseRandomCircuit$(): Observable<void> {
    let idx = Math.floor(Math.random() * this._circuits.value.length);
    let circuit = this._circuits.value[idx];
    let url = `http://ergast.com/api/f1/${circuit.season}/circuits/${circuit.circuitId}/results.json`;

    return this.httpClient.get(url)
      .pipe(
        map((result: any): any[] => result["MRData"]["RaceTable"]["Races"]),
        map((result: any[]) => {
          let race = Math.floor(Math.random() * result.length);
          let res = result[race]["Results"];
          circuit.results = res.map((r: any) => {
            return {
              number: r["number"],
              position: r["position"],
              positionText: r["positionText"],
              driver: {
                driverId: r["Driver"]["driverId"],
                code: r["Driver"]["code"],
                givenName: r["Driver"]["givenName"],
                familyName: r["Driver"]["familyName"],
                dateOfBirth: r["Driver"]["dateOfBirth"],
                nationality: r["Driver"]["nationality"]
              },
              constructor: {
                constructorId: r["Constructor"]["constructorId"],
                name: r["Constructor"]["name"],
                nationality: r["Constructor"]["nationality"]
              }
            }
          })

          let val = this._circuits.value;
          val[idx] = circuit;

          this._circuits.next(val);
          this._selectedCircuit.next(circuit);
        }),
      )
  }
}
