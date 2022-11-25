import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { CashwayRoutingSystem } from './cashway-routing.system';
import {UserTableComponent} from "./user/user.table";
import {UserEditModalComponent} from "./user/user.edit";
import {UserDetailDrawerComponent} from "./user/user.detail";
import {UserResetPasswdModalComponent} from "./user/user.resetPasswd";
import {RoleTableComponent} from "./role/role.table";
import {RoleDetailDrawerComponent} from "./role/role.detail";
import {RoleEditModalComponent} from "./role/role.edit";
import {OrgEditModalComponent} from "./org/org.edit";
import {OrgDetailDrawerComponent} from "./org/org.detail";
import {OrgTableComponent} from "./org/org.table";
import {MenuTableComponent} from "./menu/menu.table";
import {MenuEditModalComponent} from "./menu/menu.edit";
import {MenuDetailDrawerComponent} from "./menu/menu.detail";
import {UserAddModalComponent} from "./user/user.add";
import {OrgAddModalComponent} from "./org/org.add";
import {MenuAddModalComponent} from "./menu/menu.add";
import {RoleAddModalComponent} from "./role/role.add";
import {RoleAuthModalComponent} from "./role/role.auth";
import {AngularSplitModule} from "angular-split";
import {WidgetRegistry} from "@delon/form";
import {TreeSelectCashwayFormItemWidget} from "../template/form-item/tree-select-cashway.formItem";
import {ImageFormItemWidget} from "../template/form-item/image.formItem";
import {DictonaryAddModalComponent} from "./dictonary/dictonary.add";
import {DictonaryTableComponent} from "./dictonary/dictonary.table";
import {DictonaryTypeAddModalComponent} from "./dictonary/dictonary-type.add";
import {DictonaryEditModalComponent} from "./dictonary/dictonary.edit";
import {DictonaryDetailDrawerComponent} from "./dictonary/dictonary.detail";
import {DictonaryTypeEditModalComponent} from "./dictonary/dictonary-type.edit";

const COMPONENT = [
    UserTableComponent,
    RoleTableComponent,
    OrgTableComponent,
    MenuTableComponent,
    DictonaryTableComponent,
];

const COMPONENT_NOROUNT = [
    UserAddModalComponent,
    UserEditModalComponent,
    UserDetailDrawerComponent,
    UserResetPasswdModalComponent,
    RoleAddModalComponent,
    RoleDetailDrawerComponent,
    RoleEditModalComponent,
    RoleAuthModalComponent,
    OrgEditModalComponent,
    OrgDetailDrawerComponent,
    OrgAddModalComponent,
    MenuAddModalComponent,
    MenuEditModalComponent,
    MenuDetailDrawerComponent,
    DictonaryAddModalComponent,
    DictonaryDetailDrawerComponent,
    DictonaryEditModalComponent,
    DictonaryTypeAddModalComponent,
    DictonaryTypeEditModalComponent,
];

@NgModule({
  imports: [SharedModule, CashwayRoutingSystem,AngularSplitModule.forRoot()],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class CashwaySystem {
    constructor(widgetRegistry: WidgetRegistry) {

    }
}
