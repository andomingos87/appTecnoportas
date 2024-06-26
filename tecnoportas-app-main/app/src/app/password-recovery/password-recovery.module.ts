import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PasswordRecoveryPageRoutingModule } from './password-recovery-routing.module';
import { PasswordRecoveryPage } from './password-recovery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PasswordRecoveryPageRoutingModule
  ],
  declarations: [PasswordRecoveryPage]
})
export class PasswordRecoveryPageModule {}
