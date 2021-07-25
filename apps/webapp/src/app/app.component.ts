import { AfterViewInit, Component } from '@angular/core';
import { Signaling } from '@speek/common-definitions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'webapp';


  constructor(private signaling: Signaling) {
    console.log(signaling);
  }

  ngAfterViewInit(): void {

  }
}
