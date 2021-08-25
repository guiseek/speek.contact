import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OscilloscopeComponent } from './oscilloscope/oscilloscope.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    OscilloscopeComponent
  ],
  exports: [
    OscilloscopeComponent
  ],
})
export class MediaUiSharedModule {}
