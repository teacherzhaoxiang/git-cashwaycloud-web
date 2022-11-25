import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import {AngularSplitModule} from "angular-split";
import {CashwayRoutingShow} from "./cashway-routing.show";
import {TradeTableComponent} from "./tradeShow/trade.table";
import {MonitorShowComponent} from "./monitorShow/monitor.show";
import {HomeShowComponent} from "./homeShow/home.show";
import {ShowStatisticComponent} from "./homeShow/statistic.labels";
import {AppMapComponent} from "../components/map.component";
import {NgxEchartsModule} from "ngx-echarts";
import {MonitorShowDetailModalComponent} from "./monitorShow/card-list.detail";
import {WidgetRegistry} from "@delon/form";
import {PictureLabelWidget} from "../template/form-item/picture-label.formItem";
import {LineFormItemWidget} from "../template/form-item/line.formItem";
import {TextTagFormItemWidget} from "../template/form-item/text-tag.formItem";
import {SearchTableComponent} from "../components/search-table/search.table";
import {NumberRangeFormItemWidget} from "../template/form-item/numberRange.formItem";
import {ClosableTagFormItemWidget} from "../template/form-item/closable-tag.formItem";
import {CascaderFormItemWidget} from "../template/form-item/cascader.formItem";
import {TreeSelectCashwayFormItemWidget} from "../template/form-item/tree-select-cashway.formItem";
import {TreeCashwayFormItemWidget} from "../template/form-item/tree-cashway.formItem";
import {MultipleSelectFormItemWidget} from "../template/form-item/multiple-select.formItem";
import {TagGroupFormItemWidget} from "../template/form-item/tag-group.formItem";
import {TerminalCheckFormItemWidget} from "../template/form-item/terminal-check.formItem";
import {ImageFormItemWidget} from "../template/form-item/image.formItem";
import {ScreenCheckFormItemWidget} from "../template/form-item/screen-check.formItem";
const COMPONENT = [
    TradeTableComponent,
    MonitorShowComponent,
    HomeShowComponent,
];

const COMPONENT_NOROUNT = [
    ShowStatisticComponent,
    AppMapComponent,
    MonitorShowDetailModalComponent,
];

@NgModule({
  imports: [CommonModule, SharedModule, CashwayRoutingShow,AngularSplitModule.forRoot(),NgxEchartsModule],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class CashwayShow {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(PictureLabelWidget.KEY, PictureLabelWidget);
        widgetRegistry.register(LineFormItemWidget.KEY, LineFormItemWidget);
        widgetRegistry.register(TextTagFormItemWidget.KEY, TextTagFormItemWidget);
        widgetRegistry.register(SearchTableComponent.KEY, SearchTableComponent);
        widgetRegistry.register(NumberRangeFormItemWidget.KEY, NumberRangeFormItemWidget);
        widgetRegistry.register(ClosableTagFormItemWidget.KEY, ClosableTagFormItemWidget);
        widgetRegistry.register(CascaderFormItemWidget.KEY, CascaderFormItemWidget);
        widgetRegistry.register(TreeSelectCashwayFormItemWidget.KEY, TreeSelectCashwayFormItemWidget);
        widgetRegistry.register(ImageFormItemWidget.KEY, ImageFormItemWidget);
        widgetRegistry.register(TreeCashwayFormItemWidget.KEY, TreeCashwayFormItemWidget);
        widgetRegistry.register(MultipleSelectFormItemWidget.KEY, MultipleSelectFormItemWidget);
        widgetRegistry.register(TagGroupFormItemWidget.KEY, TagGroupFormItemWidget);
        widgetRegistry.register(TerminalCheckFormItemWidget.KEY,TerminalCheckFormItemWidget);
        widgetRegistry.register(ScreenCheckFormItemWidget.KEY,ScreenCheckFormItemWidget);
    }
}
