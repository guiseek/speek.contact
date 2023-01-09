import {NgModule} from '@angular/core'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatListModule} from '@angular/material/list'
import {MatBadgeModule} from '@angular/material/badge'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatInputModule} from '@angular/material/input'
import {MatButtonModule} from '@angular/material/button'
import {MatTooltipModule} from '@angular/material/tooltip'
import {MatDialogModule} from '@angular/material/dialog'
import {MatExpansionModule} from '@angular/material/expansion'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatNativeDateModule} from '@angular/material/core'
import {MatStepperModule} from '@angular/material/stepper'
import {MatTabsModule} from '@angular/material/tabs'
import {MatMenuModule} from '@angular/material/menu'
import {MatSelectModule} from '@angular/material/select'
import {MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card'

@NgModule({
  exports: [
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatTabsModule,
    MatMenuModule,
    MatSelectModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
  ],
})
export class MaterialModule {}
