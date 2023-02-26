import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TWILIO_URL, TWILIO_FROM_NUMBER, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from 'src/app/twilio-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {
  constructor(private httpClient: HttpClient) { }

  sendMessage$(to: string, value: string): Observable<void> {
    const body: HttpParams = new HttpParams()
      .set('From', TWILIO_FROM_NUMBER)
      .set('To', to)
      .set('Body', value);

    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
    return this.httpClient.post(TWILIO_URL, body.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Basic ${auth}`)
    }).pipe(
      map((all: any) => {})
    )
  }
}
