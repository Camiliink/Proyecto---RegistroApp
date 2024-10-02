import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiclasesPageRoutingModule } from './miclases-routing.module';

import { MiclasesPage } from './miclases.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiclasesPageRoutingModule
  ],
  declarations: [MiclasesPage]
})
export class MiclasesPageModule {}
