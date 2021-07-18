import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private _http: HttpClient
  ) { }

  ping(from: string) {
    const eventSource = new EventSource('/gateway/ping');

    eventSource.onmessage = ({ data }) => {
      console.log(JSON.parse(data));

      const body = new FormData()
      body.append('from', from)

      fetch('/gateway/pong', { method: 'POST', body })
        .then(res => res.json()).then(console.log)

    };
  }
}
