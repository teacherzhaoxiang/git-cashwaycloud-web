import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserTableComponent} from './user/user.table';
import {OrgTableComponent} from './org/org.table';
import {RoleTableComponent} from './role/role.table';
import {MenuTableComponent} from './menu/menu.table';
import {DictonaryTableComponent} from './dictonary/dictonary.table';

const routes: Routes = [
  { path: 'user', component: UserTableComponent },
    { path: 'org', component: OrgTableComponent },
    { path: 'role', component: RoleTableComponent },
    { path: 'menu', component: MenuTableComponent },
    { path: 'dictonary', component: DictonaryTableComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashwayRoutingSystem {}
