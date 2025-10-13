import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from '@dcd/config/config';

const routes: Routes = [
  {
    path: '',
    component: ConfigComponent
  }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ConfigRoutingModule {}
