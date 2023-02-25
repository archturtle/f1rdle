import { Driver } from 'src/app/interfaces/driver';
import { Constructor } from 'src/app/interfaces/constructor';

export interface Circuit {
  circuitId: string;
  circuitName: string;
  season?: string;
  location: Location;
  results?: CircuitResult[];
}

export interface Location {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

export interface CircuitResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  driver: Driver;
  constructor: Constructor;
}