import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiclasesPage } from './miclases.page';

const routes: Routes = [
  {
    path: '',
    component: MiclasesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiclasesPageRoutingModule {}
