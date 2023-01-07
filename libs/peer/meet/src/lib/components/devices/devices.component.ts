import {
  Input,
  Output,
  Renderer2,
  Component,
  ElementRef,
  EventEmitter,
} from '@angular/core'
import {
  NgControl,
  FormControl,
  SelectControlValueAccessor,
} from '@angular/forms'
import {fromEvent, map, startWith, switchMap} from 'rxjs'

@Component({
  selector: 'peer-devices',
  template: `
    <mat-form-field *ngIf="devices$ | async as devices">
      <mat-label>{{ label }}</mat-label>

      <mat-select
        [formControl]="control"
        (selectionChange)="selectionChange.emit(control.value)"
      >
        <mat-option
          *ngFor="
            let device of devices | filterDevices : 'kind' : kind;
            index as i
          "
          [value]="device.deviceId"
        >
          {{ device.label | formatDeviceLabel : i : fallbackLabel }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      :host .mat-mdc-form-field {
        width: 100%;
      }
    `,
  ],
})
export class DevicesComponent extends SelectControlValueAccessor {
  @Input() label = ''

  get fallbackLabel() {
    switch (this.kind) {
      case 'videoinput':
        return 'Câmera'

      case 'audiooutput':
        return 'Alto-falanta'

      case 'audioinput':
      default:
        return 'Microfone'
    }
  }

  @Input() kind: 'audioinput' | 'videoinput' | 'audiooutput' = 'audioinput'

  @Output() selectionChange = new EventEmitter<string>()

  private _devices = navigator.mediaDevices
  readonly devices$ = fromEvent(this._devices, 'devicechange').pipe(
    startWith(() => this._devices.enumerateDevices()),
    switchMap(() => this._devices.enumerateDevices()),
    map((devices) => devices.map((device) => device.toJSON()))
  )

  get control() {
    return this.ngControl.control as FormControl<string>
  }

  constructor(
    _renderer2: Renderer2,
    _elRef: ElementRef<HTMLElement>,
    protected ngControl: NgControl
  ) {
    super(_renderer2, _elRef)

    this.ngControl.valueAccessor = this
  }
}
