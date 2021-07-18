import { AppService } from './app.service';
import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'webapp';

  constructor(
    private service: AppService
  ) {}

  ngAfterViewInit(): void {
    this.service.ping('guiseek')
    // const eventSource = new EventSource('/gateway/ping');
    // eventSource.onmessage = ({ data }) => {
    //   console.log('New message', JSON.parse(data));
    //   this.service.ping('/gateway/pong', { from: 'guiseek' })
    //     .subscribe(console.log)
    // };

  }
}
