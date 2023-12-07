import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';

import { StepsComponent } from './steps.component';
import { StepsDirective } from './steps.directive';

@NgModule({
  declarations: [StepsComponent, StepsDirective],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule,
  ],
  exports: [StepsComponent, StepsDirective],
})
export class StepsModule { }
