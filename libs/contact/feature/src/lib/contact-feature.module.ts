import { ContactFeatureContainer } from './contact-feature.container';
import { DevicesConfigurationComponent } from './devices-configuration';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ContactFeatureGuard } from './contact-feature.guard';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatStepperModule,
    RouterModule.forChild([
      {
        path: '',
        component: ContactFeatureContainer,
        canActivate: [ContactFeatureGuard],
      },
    ]),
  ],
  declarations: [ContactFeatureContainer, DevicesConfigurationComponent],
})
export class ContactFeatureModule {}
