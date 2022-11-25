import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TableTemplateComponent} from "./table-template/table.template";
import {MonitorTemplateComponent} from "./card-list-template/card-list.template";
import {TableUpDownTemplateComponent} from "./table-up-down-template/table-up-down.template";
import {TreeTableTemplateComponent} from "./tree-table-template/tree-table.template";
import {TabTemplateComponent} from "./tab-template";
import {EquipmentMonitorComponent} from "./equipment-Monitor";
import {ExportTemplateComponent} from "./export-template";
import {ImageMessageListTemplateComponent} from "./image-message-list-template/image-message-list.template";
import {CardListComponent} from "./card-list";
import {MenuMoudelComponent} from "./tab-template/menu-moudel";
import {FormMoudelComponent} from "./tab-template/form-moudel";
import {UploadFileComponent} from "./tab-template/upload-file";
import {PageTemplateComponent} from "./page-template";
import {MenuTabTemplateComponent} from "./menuTab-template";
import {OnlineConfigTemplateComponent} from "./online-config-template/online-config-template.component";
import {SimpleProgramComponent} from "./simple-program/simple-program.component";
import {InnerEditPageComponent} from "./inner-edit-page/inner-edit-page.component";

const routes: Routes = [
    {
        path: 'tab/:id', component: TabTemplateComponent, children: [
            {path: 'table-template/:id', component: TableTemplateComponent,data:{header:false}},
            {path: 'tree-table-template/:id', component: TreeTableTemplateComponent,data:{header:false}},
            {path: 'monitor/:id', component: MonitorTemplateComponent,data:{header:false}},
            {path: 'table-up-down/:id', component: TableUpDownTemplateComponent,data:{header:false}},
            {path:'equipment-monitor/:id',component:EquipmentMonitorComponent,data:{header:false}},
            {path:'export-table/:id',component:ExportTemplateComponent,data:{header:false}},
        ]
    },
  {path: 'menuTab/:id', component: MenuTabTemplateComponent,children: [
      {path: 'test/:id', component: MenuMoudelComponent},
    ]},
  {path: 'menu_group_manage/:id', component: PageTemplateComponent},
    {path: 'page-template/:id', component: PageTemplateComponent,children: [
        {path: 'test/:id', component: MenuMoudelComponent},
      ]},
    {path: 'card-list/:id', component: CardListComponent, children: [
            {path: 'test/:id', component: MenuMoudelComponent},
            {path: 'params/:id', component: FormMoudelComponent},
            {path: 'uploadFile/:id', component: UploadFileComponent, data: { fileType: 'zip'}}
      ]},
    {path: 'table-template/:id', component: TableTemplateComponent},
    {path: 'tree-table-template/:id', component: TreeTableTemplateComponent},
    {path: 'monitor/:id', component: MonitorTemplateComponent},
    {path: 'table-up-down/:id', component: TableUpDownTemplateComponent},
    {path: 'export/:id', component: ExportTemplateComponent},
    {path: 'image-message/:id', component: ImageMessageListTemplateComponent},
    {path: 'online-config', component: OnlineConfigTemplateComponent},
    {path: 'simpleProgramEdit/:id', component: SimpleProgramComponent},
    {path: 'innerEditPageComponent/:id', component: InnerEditPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashwayRoutingTemplate {}
