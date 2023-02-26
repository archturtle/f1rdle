import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Circuit} from './interfaces/circuit';
import {CircuitsService} from './services/circuits.service';

/**
 * The main component for the website.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}
