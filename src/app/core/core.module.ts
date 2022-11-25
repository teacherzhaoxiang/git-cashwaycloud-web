import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';
import {AuditModalComponent} from '@core/net/audit';
import {SharedModule} from '@shared/shared.module';
import {CommonModule} from '@angular/common';
import {CashwayRoutingSystem} from '../routes/system/cashway-routing.system';
import {AngularSplitModule} from 'angular-split';

const COMPONENTS_NOROUNT = [
    AuditModalComponent
];

@NgModule({
    imports: [CommonModule, SharedModule, AngularSplitModule.forRoot()],
    declarations: [...COMPONENTS_NOROUNT],
    entryComponents: COMPONENTS_NOROUNT,
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
