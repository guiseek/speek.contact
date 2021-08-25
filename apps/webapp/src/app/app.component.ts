import {
  Component,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  })
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'webapp';

  @ViewChild('codeTmpl')
  codeTmpl!: TemplateRef<HTMLElement>;

  codeControl = new FormControl('', [Validators.required]);

  stream!: MediaStream

  constructor(
    readonly dialog: MatDialog
  ) {
    this.codeControl.setValue(uuid());
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => this.stream = stream)
  }

  ngAfterViewInit(): void {

  }

}
