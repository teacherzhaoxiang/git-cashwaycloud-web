import { NgModule } from '@angular/core';

import { FormModelComponent } from './dynamic-form/form-model.component';

import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import {FormEngineRoutingModule} from "./form-engine-routing.module"
@NgModule({
  imports: [
    DynamicFormModule,FormEngineRoutingModule
  ],
  bootstrap: [
    FormModelComponent
  ],
  declarations: [
    FormModelComponent
  ]
})
export class FormEngineModule {}
