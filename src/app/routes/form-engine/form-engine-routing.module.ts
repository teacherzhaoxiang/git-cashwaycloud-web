import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FormModelComponent} from "./dynamic-form/form-model.component";


const routes: Routes = [
  {
    path: 'dynamic-form', component: FormModelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormEngineRoutingModule {}
