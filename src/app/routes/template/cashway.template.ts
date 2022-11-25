import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { CashwayRoutingTemplate } from './cashway-routing.template';
import {TableTemplateComponent} from "./table-template/table.template";
import {TableEditModalComponent} from "./table-template/edit.template";
import {MenuTreeTemplateComponent} from "./table-template/menu-tree.template";
import {TableDetailDrawerComponent} from "./table-template/detail.template";
import {CustomerModalTemplate} from "./table-template/customer.modal.template";
import {AuditModalTemplate} from "./table-template/audit.modal.template";

import {MonitorTemplateComponent} from "./card-list-template/card-list.template";
import {TableAddModalComponent} from "./table-template/add.template";
import {MonitorDetailModalComponent} from "./card-list-template/card-list.detail";
import {PictureLabelWidget} from "./form-item/picture-label.formItem";
import {DelonFormModule, WidgetRegistry} from "@delon/form";
import {LineFormItemWidget} from "./form-item/line.formItem";
import {TextTagFormItemWidget} from "./form-item/text-tag.formItem";
import {StepFormComponent} from "./step-form-template/step-form.component";
import {TableUpDownTemplateComponent} from "./table-up-down-template/table-up-down.template";
import {StepComponent} from "./step-form-template/step.component";
import {BaseFormComponent} from "../components/form/base.form";
import {SearchTableComponent} from "../components/search-table/search.table";
import {NumberRangeFormItemWidget} from "./form-item/numberRange.formItem";
import {CustomerDrawerTemplate} from "./table-template/customer.drawer.template";
import {CustomerModalSingleTemplate} from "./table-template/customer.modal.single.template";
import {TreeTableTemplateComponent} from "./tree-table-template/tree-table.template";
import {CustomerModalStSfTemplate} from "./table-template/customer.modal.st.sftemplate";
import {TreeSelectCashwayFormItemWidget} from "./form-item/tree-select-cashway.formItem";
import {AngularSplitModule} from "angular-split";
import {TableCloneModalComponent} from "./table-template/clone.template";
import {ClosableTagFormItemWidget} from "./form-item/closable-tag.formItem";
import {CascaderFormItemWidget} from "./form-item/cascader.formItem";

import {MultipleSelectFormItemWidget} from "./form-item/multiple-select.formItem";
import {TagGroupFormItemWidget} from "./form-item/tag-group.formItem";
import {ModuleResetComponent} from "../components/module-reset/module.reset";
import {TerminalCheckFormItemWidget} from "./form-item/terminal-check.formItem";
import {SvComponent} from "../components/sv.component";
import {TreeCashwayFormItemWidget} from "./form-item/tree-cashway.formItem";
import {SfComponent} from "../components/sf.component";
import {ImageFormItemWidget} from "./form-item/image.formItem";
import {HardDriveCapacityComponent} from "../components/hard-drive-capacity";
import {ModifyCheckModalTemplate} from "./table-template/modify-check.modal.template";
import {FormTabsBasicComponent} from "../components/tab/tab.component";
import {TabTemplateComponent} from "./tab-template";
import {CardListComponent} from "./card-list";
import {EquipmentMonitorComponent} from "./equipment-Monitor";
import {ExportTemplateComponent} from "./export-template";
import {ImageMessageListTemplateComponent} from "./image-message-list-template/image-message-list.template";
import {ImageMessageModalComponent} from "./image-message-list-template/image-message-list.detail";
import {MenuMoudelComponent} from "./tab-template/menu-moudel";
import {PublishModalDetials} from "./table-template/publish-modal-detials";
import {FormMoudelComponent} from "./tab-template/form-moudel";
import {UploadFileComponent} from "./tab-template/upload-file";
import {PageTemplateComponent} from "./page-template";
import {MenuTabTemplateComponent} from "./menuTab-template";
import {OnlineConfigTemplateComponent} from "./online-config-template/online-config-template.component";
import {SimpleProgramComponent} from "./simple-program/simple-program.component";
import {SimpleProgramPreviewModalComponent} from "./simple-program/simple-program-preview.modal";
import {InnerEditPageComponent} from "./inner-edit-page/inner-edit-page.component";

const COMPONENT = [
    TableTemplateComponent,
    MonitorTemplateComponent,
    TableUpDownTemplateComponent,
    TreeTableTemplateComponent,
    TabTemplateComponent,
  CardListComponent,
    EquipmentMonitorComponent,
    ExportTemplateComponent,
    ImageMessageListTemplateComponent,
  MenuMoudelComponent,
  FormMoudelComponent,
  UploadFileComponent,
  PageTemplateComponent,
  MenuTabTemplateComponent,
  OnlineConfigTemplateComponent,
  SimpleProgramComponent,
    InnerEditPageComponent
];

const COMPONENT_NOROUNT = [
    TableEditModalComponent,
  MenuTreeTemplateComponent,
    TableDetailDrawerComponent,
  TabTemplateComponent,
    TableCloneModalComponent,
    CustomerDrawerTemplate,
    CustomerModalTemplate,
    AuditModalTemplate,
    CustomerModalSingleTemplate,
    CustomerModalStSfTemplate,
    MonitorDetailModalComponent,
    ImageMessageModalComponent,
    TableAddModalComponent,
    StepFormComponent,
    TableUpDownTemplateComponent,
    StepComponent,
    BaseFormComponent,
    SearchTableComponent,
    ModuleResetComponent,
    HardDriveCapacityComponent,
    FormTabsBasicComponent,
    ModifyCheckModalTemplate,
  PublishModalDetials,
    SimpleProgramPreviewModalComponent,
];

@NgModule({
    imports: [CommonModule, SharedModule, CashwayRoutingTemplate,AngularSplitModule.forRoot()],
    declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
    entryComponents: COMPONENT_NOROUNT,
    providers: [
    ],
})
export class CashwayTemplate {
    constructor(widgetRegistry: WidgetRegistry) {
    }
}
