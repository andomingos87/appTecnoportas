import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BrMaskerModule } from 'br-mask';
import { DoorPaintComponent } from './door-paint.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrMaskerModule as any,
    IonicModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DoorPaintComponent,
  ],
  exports: [
    DoorPaintComponent
  ]
})
export class DoorPaintModule { }
