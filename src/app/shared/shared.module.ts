import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {DragDirective} from "../routes/directive/drag.directive";
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonChartModule } from '@delon/chart';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
// i18n
import { TranslateModule } from '@ngx-translate/core';
import {TradeMonitorComponent} from "../routes/components/trade_monitor";
// #region third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
// import { CountdownModule } from 'ngx-countdown';
import { UEditorModule } from 'ngx-ueditor';
import { NgxTinymceModule } from 'ngx-tinymce';
import {EventService} from '@shared/event/event.service';
import {TreeComponent} from "../routes/components/tree/tree.component";
import {SvComponent} from "../routes/components/sv.component";
import {SfComponent} from "../routes/components/sf.component";
import {tablistComponent} from "../routes/components/tabList.component";
import {MonitorStatusComponent} from "../routes/components/monitor_status";
import { ListComponent } from "../routes/components/list/list.component";
import {VersionListComponent} from "../routes/components/list/version-list.component";
import {TreeMenuComponent} from "../routes/components/tree-menu";
import {OptionsBtnComponent} from "../routes/components/optionsBtn";
import {CommonWidgetComponent} from "../routes/components/comWidget/common-widget";
import {TabMenuComponent} from "../routes/components/tab/tab-menu";
import {ActiveWidgetComponent} from "../routes/components/comWidget/active-widget";
import {PublishListComponent} from "../routes/components/list/publish-list.component";
import {TerminalProcessComponent} from "../routes/template/tab-template/terminal-process";
import {FormPageTemplate} from "../routes/components/page-template/form.page.template";
import {EditFormComponent} from "../routes/components/edit-form/edit-form.component";
import {PublicSFComponent} from "../routes/components/publicSF";
import {VersionMsgComponent} from "../routes/components/versionMsg";
import {ButtonGroupComponent} from "../routes/components/buttonGroup";
import {CommonModalComponent} from "../routes/components/commonModal";
import {CustomTableComponent} from "../routes/components/custom-table";
import {PublicSTComponent} from "../routes/components/publicST";
import {MenuTreeComponent} from "../routes/components/menu-tree.component";
import {EditTableModalTemplate} from "../routes/components/edit-table.modal.template";
const THIRDMODULES = [
  NgZorroAntdModule,
  // CountdownModule,
  UEditorModule,
  NgxTinymceModule,
];
// #endregion

// #region your componets & directives
const COMPONENTS = [];
const DIRECTIVES = [
    TreeComponent,
    SvComponent,
    SfComponent,
  TreeMenuComponent,
  OptionsBtnComponent,
  ListComponent,
  VersionListComponent,
    tablistComponent,
    MonitorStatusComponent,
    TradeMonitorComponent,
  CommonWidgetComponent,
  ActiveWidgetComponent,
  TabMenuComponent,
  PublishListComponent,
  TerminalProcessComponent,
    FormPageTemplate,
    EditFormComponent,
  TerminalProcessComponent,
  PublicSFComponent,
  VersionMsgComponent,
  ButtonGroupComponent,
  CommonModalComponent,
  CustomTableComponent,
  PublicSTComponent,
  MenuTreeComponent,
    EditTableModalTemplate
];
// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonChartModule,
    DelonACLModule,
    DelonFormModule,
    // third libs
    ...THIRDMODULES,
  ],
  declarations: [
    // your components
    DragDirective,
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonChartModule,
    DelonACLModule,
    DelonFormModule,
    // i18n
    TranslateModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    DragDirective
  ],
  entryComponents:DIRECTIVES,
})
export class SharedModule {}
