import {NgModule} from '@angular/core'
import {OverlayModule} from '@angular/cdk/overlay'
import {DialogModule} from '@angular/cdk/dialog'
import {LayoutModule} from '@angular/cdk/layout'
import {DragDropModule} from '@angular/cdk/drag-drop'
import {ClipboardModule} from '@angular/cdk/clipboard'

@NgModule({
  exports: [
    OverlayModule,
    DialogModule,
    LayoutModule,
    DragDropModule,
    ClipboardModule,
  ],
})
export class CdkModule {}
