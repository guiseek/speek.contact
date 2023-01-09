import {NgModule} from '@angular/core'
import {OverlayModule} from '@angular/cdk/overlay'
import {DialogModule} from '@angular/cdk/dialog'
import {LayoutModule} from '@angular/cdk/layout'
import {DragDropModule} from '@angular/cdk/drag-drop'
import {ClipboardModule} from '@angular/cdk/clipboard'
import {PlatformModule} from '@angular/cdk/platform'

@NgModule({
  exports: [
    OverlayModule,
    DialogModule,
    LayoutModule,
    DragDropModule,
    ClipboardModule,
    PlatformModule,
  ],
})
export class CdkModule {}
