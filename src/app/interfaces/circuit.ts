import {Driver} from 'src/app/interfaces/driver';
import {Constructor} from 'src/app/interfaces/constructor';

/**
 * The interface for a circuit.
 */
export interface Circuit {
  circuitId: string;
  circuitName: string;
  season: number;
  location: Location;
  results: CircuitResult[];
}

/**
 * The interface for the Location.
 */
export interface Location {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

export interface Time {
  millis: string;
  time: string;
}

/**
 * The interface for the circuit result.
 */
export interface CircuitResult {
  number: string;
  position: string;
  positionText: string;
  driver: Driver;
  constructor: Constructor;
}
