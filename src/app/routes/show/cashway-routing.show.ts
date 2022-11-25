import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeShowComponent} from "./homeShow/home.show";
import {MonitorShowComponent} from "./monitorShow/monitor.show";
import {TradeTableComponent} from "./tradeShow/trade.table";

const routes: Routes = [
    { path: 'home', component: HomeShowComponent },
    { path: 'monitor', component: MonitorShowComponent },
    { path: 'trade', component: TradeTableComponent },
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashwayRoutingShow {}
