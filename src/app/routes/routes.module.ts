import {NgModule} from '@angular/core';

import {SharedModule} from '@shared/shared.module';
import {RouteRoutingModule} from './routes-routing.module';
import {PreviewPdfWidget} from './components/previewPDF/previewPDF.widget';
import {PreviewVideoWidget} from './components/previewVideo/previewVideo.widget';
// dashboard pages
// passport pages
import {UserLoginComponent} from './passport/login/login.component';
import {UserRegisterComponent} from './passport/register/register.component';
import {UserRegisterResultComponent} from './passport/register-result/register-result.component';
// single pages
import {UserLockComponent} from './passport/lock/lock.component';
import {CallbackComponent} from './callback/callback.component';
import {Exception403Component} from './exception/403.component';
import {Exception404Component} from './exception/404.component';
import {Exception500Component} from './exception/500.component';
import {HomeTemplateComponent} from "./template/chart-list-template/chart-list.template";
import {CardMangeHomeTemplateComponent} from "./template/chart-list-template/card-mange-home.template";
import {CustomerPageTemplateComponent} from "./template/customer-page/customer-page.template";
import {WidgetRegistry} from "@delon/form";
import {ImageFormItemWidget} from "./template/form-item/image.formItem";
import {VideoFormItemWidget} from "./template/form-item/video.formItem";
import {CustomerPageAddModalComponent} from "./template/customer-page/customer-page.add";
import {TextTagFormItemWidget} from "./template/form-item/text-tag.formItem";
import {LineFormItemWidget} from "./template/form-item/line.formItem";
import {SearchTableComponent} from "./components/search-table/search.table";
import {NumberRangeFormItemWidget} from "./template/form-item/numberRange.formItem";
import {PictureLabelWidget} from "./template/form-item/picture-label.formItem";
import {CarouselFormItemWidget} from "./template/form-item/carousel.formItem";
import {CustomerPagePlayTemplateComponent} from "./template/customer-page/customer-page-play.template";
import {ElectronicWaterComponent} from "./template/electronic-water/electronic-water.component";
import {AngularSplitModule} from 'angular-split';
import {GutterClickComponent} from "./split/gutterClick.route.component";
import {TreeSelectCashwayFormItemWidget} from "./template/form-item/tree-select-cashway.formItem";
import {ClosableTagFormItemWidget} from "./template/form-item/closable-tag.formItem";
import {CustomerPagePlayNewTemplateComponent} from "./template/customer-page/customer-page-play-new.template";
import {TerminalCheckFormItemWidget} from "./template/form-item/terminal-check.formItem";
import {TerminalCheckTransferCustomItemComponent} from "./components/terminal-table/terminal.table";
import {ResetPasswordComponent} from "./passport/login/reset.password.component";
import {CascaderFormItemWidget} from "./template/form-item/cascader.formItem";
import {TreeCashwayFormItemWidget} from "./template/form-item/tree-cashway.formItem";
import {MultipleSelectFormItemWidget} from "./template/form-item/multiple-select.formItem";
import {TagGroupFormItemWidget} from "./template/form-item/tag-group.formItem";
import {NewsComponent} from "./template/chart-list-template/news.component";
import {MultiTreeComponent} from './components/tree/treeTest.component';
import {PopUpTreeFormItemWidget} from "./template/form-item/pop-up-tree.formItem";
import {PopUpMultiTreeFormItemWidget} from "./template/form-item/pop-up-multi-tree.formItem"; //下拉多选树
import {HardDriveCapacityComponent} from "./components/hard-drive-capacity";
import {ButtonGroupFormItemWidget} from "./template/form-item/button-group.formItem";
import {TestComponent} from './components/test/test.component';
import {HtmlPipe} from './pipe/html.pipe';
import {ScreenCheckTransferCustomItemComponent} from "./components/screen-table/screen.table";
import {ScreenCheckFormItemWidget} from "./template/form-item/screen-check.formItem";
import {LogShowFormItemWidget} from "./template/form-item/log-show.formItem";
import {ModuleComponent} from './components/module/module.component';
import {FormCompletionComponent} from './components/form-completion/form-completion.component';
import {LangTransferPipe} from "./pipe/lang-transfer.pipe";
import {EditTableFormItemWidget} from "./template/form-item/edit-table.formItem";
import {LoginFromOtherWebComponent} from "./passport/login-from-other-web/login-from-other-web.component";
import {PreviewPdfComponent} from './components/previewPDF/previewPDF.template';
import {TableListComponent} from "./viewable/table-list.component"
import {TableAreaComponent} from "./viewable/table-area/table-area.component"
import {SearchAreaComponent} from "./viewable/search-area/search-area.component"
import {OperateAreaComponent} from "./viewable/operate-area/operate-area.component"
import {EditAreaComponent} from "./viewable/edit-area/edit-area.component"
import {AddModalComponent} from './viewable/modal/add-template.components';
import {EditModalComponent} from './viewable/modal/edit-template.components';
import {MultiDatePicker} from './template/form-item/multi-date-picker'
import {OrgSelectWidget} from './template/form-item/org-select.forItem'
import {InputMultiTreeComponent} from './components/tree/inputTree.components';
import {PopUpMultiInputTreeFormItemWidget} from "./template/form-item/pop-up-multi-input-tree.formItem"

const COMPONENTS = [
    // DashboardV1Component,
    // DashboardAnalysisComponent,
    // DashboardMonitorComponent,
    // DashboardWorkplaceComponent,
    // passport pages
    UserLoginComponent,
    UserRegisterComponent,
    UserRegisterResultComponent,
    // single pages
    UserLockComponent,
    CallbackComponent,
    Exception403Component,
    Exception404Component,
    Exception500Component,
    HomeTemplateComponent,
    NewsComponent,
    CardMangeHomeTemplateComponent,
    GutterClickComponent,
    CustomerPageTemplateComponent,
    CustomerPagePlayTemplateComponent,
    CustomerPagePlayNewTemplateComponent,
    ElectronicWaterComponent,
    LoginFromOtherWebComponent,
    MultiTreeComponent,
    InputMultiTreeComponent
];
const COMPONENTS_NOROUNT = [
    VideoFormItemWidget,
    CarouselFormItemWidget,
    LineFormItemWidget,
    EditTableFormItemWidget,
    CustomerPageAddModalComponent,
    TerminalCheckFormItemWidget,
    ScreenCheckFormItemWidget,
    TerminalCheckTransferCustomItemComponent,
    ScreenCheckTransferCustomItemComponent,
    ImageFormItemWidget,
    ResetPasswordComponent,
    TreeSelectCashwayFormItemWidget,
    TextTagFormItemWidget,
    NumberRangeFormItemWidget,
    ClosableTagFormItemWidget,
    CascaderFormItemWidget,
    TreeCashwayFormItemWidget,
    MultipleSelectFormItemWidget,
    TagGroupFormItemWidget,
    PictureLabelWidget,
    PopUpTreeFormItemWidget,
    PopUpMultiTreeFormItemWidget,
    ButtonGroupFormItemWidget,
    LogShowFormItemWidget,
    PreviewPdfComponent,
    MultiDatePicker,
    OrgSelectWidget,
    PopUpMultiInputTreeFormItemWidget,
    PreviewPdfWidget,
    PreviewVideoWidget
    // ClosableTagFormItemWidget
];
const VIEWABLE = [
    TableListComponent,
    TableAreaComponent,
    SearchAreaComponent,
    OperateAreaComponent,
    EditAreaComponent,
    AddModalComponent,
    EditModalComponent

]

@NgModule({
    imports: [SharedModule, RouteRoutingModule, AngularSplitModule.forRoot(),],
    declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT, ...VIEWABLE, TestComponent, HtmlPipe, ModuleComponent, FormCompletionComponent, LangTransferPipe],
    entryComponents: [COMPONENTS_NOROUNT, VIEWABLE, ModuleComponent, FormCompletionComponent],
})
export class RoutesModule {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(VideoFormItemWidget.KEY, VideoFormItemWidget);
        widgetRegistry.register(CarouselFormItemWidget.KEY, CarouselFormItemWidget);
        widgetRegistry.register(PictureLabelWidget.KEY, PictureLabelWidget);
        widgetRegistry.register(LineFormItemWidget.KEY, LineFormItemWidget);
        widgetRegistry.register(EditTableFormItemWidget.KEY, EditTableFormItemWidget);
        widgetRegistry.register(TextTagFormItemWidget.KEY, TextTagFormItemWidget);
        widgetRegistry.register(SearchTableComponent.KEY, SearchTableComponent);
        widgetRegistry.register(NumberRangeFormItemWidget.KEY, NumberRangeFormItemWidget);
        widgetRegistry.register(ClosableTagFormItemWidget.KEY, ClosableTagFormItemWidget);
        widgetRegistry.register(CascaderFormItemWidget.KEY, CascaderFormItemWidget);
        widgetRegistry.register(TreeCashwayFormItemWidget.KEY, TreeCashwayFormItemWidget);
        widgetRegistry.register(MultipleSelectFormItemWidget.KEY, MultipleSelectFormItemWidget);
        widgetRegistry.register(TagGroupFormItemWidget.KEY, TagGroupFormItemWidget);
        widgetRegistry.register(ButtonGroupFormItemWidget.KEY, ButtonGroupFormItemWidget);
        widgetRegistry.register(TerminalCheckFormItemWidget.KEY, TerminalCheckFormItemWidget);
        widgetRegistry.register(ScreenCheckFormItemWidget.KEY, ScreenCheckFormItemWidget);
        widgetRegistry.register(HardDriveCapacityComponent.KEY, HardDriveCapacityComponent);
        widgetRegistry.register(TreeSelectCashwayFormItemWidget.KEY, TreeSelectCashwayFormItemWidget);
        widgetRegistry.register(ImageFormItemWidget.KEY, ImageFormItemWidget);
        widgetRegistry.register(PopUpTreeFormItemWidget.KEY, PopUpTreeFormItemWidget);
        widgetRegistry.register(PopUpMultiTreeFormItemWidget.KEY, PopUpMultiTreeFormItemWidget);
        widgetRegistry.register(LogShowFormItemWidget.KEY, LogShowFormItemWidget);
        widgetRegistry.register(PreviewPdfComponent.KEY, PreviewPdfComponent);
        widgetRegistry.register(MultiDatePicker.KEY, MultiDatePicker);
        widgetRegistry.register(OrgSelectWidget.KEY, OrgSelectWidget);
        widgetRegistry.register(PopUpMultiInputTreeFormItemWidget.KEY, PopUpMultiInputTreeFormItemWidget),
            widgetRegistry.register(PreviewPdfWidget.KEY, PreviewPdfWidget);
        widgetRegistry.register(PreviewVideoWidget.KEY, PreviewVideoWidget);
    }
}
