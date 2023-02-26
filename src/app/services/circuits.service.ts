import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatestWith, Observable, of, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Circuit } from '../interfaces/circuit';
import { TwilioService } from 'src/app/services/twilio.service';
import { environment } from 'src/environments/environment';
import { TWILIO_TO_NUMBER } from 'src/app/twilio-config';

@Injectable({
  providedIn: 'root'
})
export class CircuitsService {
  // The circuits
  private _circuits: BehaviorSubject<Circuit[]> = new BehaviorSubject<Circuit[]>([]);
  public readonly circuits$: Observable<Circuit[]> = this._circuits.asObservable();

  // The selected circuit
  private _selectedCircuit: ReplaySubject<Circuit> = new ReplaySubject<Circuit>(1);
  public readonly selectedCircuit$: Observable<Circuit> = this._selectedCircuit.asObservable();

  // Circuit names
  private _circuitCodes: Map<string, string> = new Map<string, string>();
  public readonly circuitCodes = this._circuitCodes;

  constructor(private httpClient: HttpClient, private twilioService: TwilioService) { }

  getSeasons$(): Observable<number[]> {
    return this.httpClient.get('http://ergast.com/api/f1/seasons.json?limit=1000')
      .pipe(
        map((result: any) => result["MRData"]["SeasonTable"]["Seasons"]),
        map((result: any) => result.map((item: any) => parseInt(item["season"], 10)))
      );
  }

  getCircuitCodes$(): Observable<void> {
    return this.httpClient.get('http://ergast.com/api/f1/circuits.json?limit=1000')
      .pipe(
        map((result: any): any[] => result["MRData"]["CircuitTable"]["Circuits"]),
        map((result: any) => result.map((r: any) => {
          this._circuitCodes.set(r["circuitName"], r["circuitId"]);
        })),
      )
  }

  getCircuitByCode$(code: string, season: number): Observable<Circuit | null> {
    let response: Observable<Circuit> = this.httpClient.get(`http://ergast.com/api/f1/${season}/circuits/${code}.json`)
      .pipe(
        map((result: any) => {
          let arr = result["MRData"]["CircuitTable"]["Circuits"];
          return arr[0];
        }),
      );

    return this.httpClient.get(`http://ergast.com/api/f1/${season}/circuits/${code}/results.json`)
      .pipe(
        map((result: any) => {
          let res = result["MRData"]["RaceTable"]["Races"]
          if (res.length == 0) throw "error to exit pipe"

          return res[0]["Results"].map((r: any) => {
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
        }),
        combineLatestWith(response),
        map(([e1, e2]) => {
          e2.results = e1;
          e2.season = season;
          return e2;
        }),
        catchError(() => of(null))
      );
  }

  getCircuitsPerSeason$(season: number): Observable<Circuit[]> {
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

          // Message it
          if (environment.production) {
            this.twilioService.sendMessage$(TWILIO_TO_NUMBER, circuit.circuitName)
              .subscribe();
          }

          this._circuits.next(val);
          this._selectedCircuit.next(circuit);
        }),
      )
  }
}
