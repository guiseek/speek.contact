import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MeetComponent } from './meet.component';


const routes: Routes = [
  { path: '', component: MeetComponent }
];

@NgModule({
  declarations: [
    MeetComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MeetModule { }
