import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {environment} from '@env/environment';
// layout
import {LayoutDefaultComponent} from '../layout/default/default.component';
import {LayoutFullScreenComponent} from '../layout/fullscreen/fullscreen.component';
import {LayoutPassportComponent} from '../layout/passport/passport.component';
// dashboard pages
// passport pages
import {UserLoginComponent} from './passport/login/login.component';
import {UserRegisterComponent} from './passport/register/register.component';
import {UserRegisterResultComponent} from './passport/register-result/register-result.component';
// single pages
import {CallbackComponent} from './callback/callback.component';
import {UserLockComponent} from './passport/lock/lock.component';
import {Exception403Component} from './exception/403.component';
import {Exception404Component} from './exception/404.component';
import {Exception500Component} from './exception/500.component';
import {TableTemplateComponent} from "./template/table-template/table.template";
import {HomeTemplateComponent} from "./template/chart-list-template/chart-list.template";
import {CustomerPageTemplateComponent} from "./template/customer-page/customer-page.template";
import {CustomerPagePlayTemplateComponent} from "./template/customer-page/customer-page-play.template";
import {CustomerPagePlayNewTemplateComponent} from "./template/customer-page/customer-page-play-new.template";
import {ElectronicWaterComponent} from "./template/electronic-water/electronic-water.component";
import {CardMangeHomeTemplateComponent} from "./template/chart-list-template/card-mange-home.template";
import {TestComponent} from "./components/test/test.component";
import {LoginFromOtherWebComponent} from "./passport/login-from-other-web/login-from-other-web.component";
import { TableListComponent } from './viewable/table-list.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutDefaultComponent,
        children: [
            {path: 'home', component: HomeTemplateComponent,data:{title:"首页"}},
            {path: 'card-mange-home', component: CardMangeHomeTemplateComponent},
            {path: 'publish', component: CustomerPageTemplateComponent},
            {path: 'viewable', component:TableListComponent},
            {path: 'test/:id', component: TestComponent, children: [
                {path: 'home/:id', component: HomeTemplateComponent}
              ]},
            /*      { path: '', redirectTo: 'passport/login', pathMatch: 'full' },
                 { path: 'dashboard', redirectTo: 'dashboard/v1', pathMatch: 'full' },
                  { path: 'dashboard/v1', component: DashboardV1Component },
                  { path: 'passport/login', component: DashboardV1Component },
                  { path: 'dashboard/analysis', component: DashboardAnalysisComponent },
                  { path: 'dashboard/monitor', component: DashboardMonitorComponent },
                  { path: 'dashboard/workplace', component: DashboardWorkplaceComponent },
                  {
                    path: 'widgets',
                    loadChildren: './widgets/widgets.module#WidgetsModule',
                  },
                  { path: 'style', loadChildren: './style/style.module#StyleModule' },
                  { path: 'delon', loadChildren: './delon/delon.module#DelonModule' },
                  { path: 'extras', loadChildren: './extras/extras.module#ExtrasModule' },*/
            {path: 'pro', loadChildren: './pro/pro.module#ProModule'},
            //{ path: 'form-engine', loadChildren: './form-engine/form-engine.module#FormEngineModule' },
            //{ path: 'template', loadChildren: './template/cashway.template#CashwayTemplate' },
            {path: '', redirectTo: environment.loginHome, pathMatch: 'full'},
            {path: 'loginFromOtherWeb', component: LoginFromOtherWebComponent, pathMatch: 'full'},
            {path: 'electronic-water', component: ElectronicWaterComponent},
            {path: 'template', loadChildren: './template/cashway.template#CashwayTemplate'},
            {path: 'sys', loadChildren: './system/cashway.system#CashwaySystem'},
        ],
    },
    {
        path: 'passport',
        component: LayoutPassportComponent,
        children: [
            {
                path: 'login',
                component: UserLoginComponent,
                data: {title: '登录', titleI18n: environment.programName},
            },
            // {
            //   path: 'register',
            //   component: UserRegisterComponent,
            //   data: { title: '注册', titleI18n: 'pro-register' },
            // },
            // {
            //   path: 'register-result',
            //   component: UserRegisterResultComponent,
            //   data: { title: '注册结果', titleI18n: 'pro-register-result' },
            // },
        ],
    },
    {
        path: 'show',
        loadChildren: './show/cashway.show#CashwayShow'
    },
    // 全屏布局
    {
        path: 'data-v',
        component: LayoutFullScreenComponent,
        children: [
            {path: '', loadChildren: './data-v/data-v.module#DataVModule'},
        ],
    },
    // passport

    // 单页不包裹Layout
    {path: 'callback/:type', component: CallbackComponent},
    {
        path: 'lock',
        component: UserLockComponent,
        data: {title: '锁屏', titleI18n: 'lock'},
    },
    {path: '403', component: Exception403Component},
    {path: '404', component: Exception404Component},
    {path: '500', component: Exception500Component},
    {path: 'publishPlay', component: CustomerPagePlayTemplateComponent},
    {path: 'publishPlayNew', component: CustomerPagePlayNewTemplateComponent},
    {path: '**', redirectTo: 'dashboard'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: environment.useHash})],
    exports: [RouterModule],
})
export class RouteRoutingModule {
}
