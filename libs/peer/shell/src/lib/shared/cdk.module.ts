import {NgModule} from '@angular/core'
import {OverlayModule} from '@angular/cdk/overlay'
import {DialogModule} from '@angular/cdk/dialog'
import {LayoutModule} from '@angular/cdk/layout'
import {DragDropModule} from '@angular/cdk/drag-drop'

@NgModule({
  exports: [OverlayModule, DialogModule, LayoutModule, DragDropModule],
})
export class CdkModule {}
