import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// #region default language
// 参考：https://ng-alain.com/docs/i18n
import { default as ngLang } from '@angular/common/locales/zh';
import {NZ_I18N, NZ_MODAL_CONFIG, zh_CN as zorroLang} from 'ng-zorro-antd';
import { DELON_LOCALE, zh_CN as delonLang } from '@delon/theme';
const LANG = {
  abbr: 'zh',
  ng: ngLang,
  zorro: zorroLang,
  delon: delonLang,
};
//widgets
import { DelonFormModule, WidgetRegistry } from '@delon/form';
import {TitleWidgetComponent} from "./widgets/title-wedget/title-wedget.component";
import {ButtonWidgetComponent} from "./widgets/buttons/button-widget";
import {NumberWidgetComponent} from "./widgets/number/number-widget";
import {Calendar} from "./widgets/calendar/calendar";
import {CheckBoxSelectWidgetComponent} from "./widgets/checkbox-select/checkBoxSelect-widget";
import {CheckBoxWidgetComponent} from "./widgets/checkbox/checkBox-widget";
import {UploadFilesWidgetComponent} from "./widgets/uploadFiles/uploadFiles";
// register angular
import {DatePipe, registerLocaleData} from '@angular/common';
registerLocaleData(LANG.ng, LANG.abbr);
const LANG_PROVIDES = [
  { provide: LOCALE_ID, useValue: LANG.abbr },
  { provide: NZ_I18N, useValue: LANG.zorro },
  { provide: DELON_LOCALE, useValue: LANG.delon },
];
// #endregion

// #region i18n services
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { I18NService } from '@core/i18n/i18n.service';

// 加载i18n语言文件
export function I18nHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `assets/tmp/i18n/`, '.json');
}

const I18NSERVICE_MODULES = [
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: I18nHttpLoaderFactory,
      deps: [HttpClient],
    },
  }),
];

const I18NSERVICE_PROVIDES = [
  { provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false },
];

// #endregion

// #region global third module
import { UEditorModule } from 'ngx-ueditor';
import { NgxTinymceModule } from 'ngx-tinymce';
const GLOBAL_THIRD_MDOULES = [
  UEditorModule.forRoot({
    // **注：** 建议使用本地路径；以下为了减少 ng-alain 脚手架的包体大小引用了CDN，可能会有部分功能受影响
    js: [
      `//apps.bdimg.com/libs/ueditor/1.4.3.1/ueditor.config.js`,
      `//apps.bdimg.com/libs/ueditor/1.4.3.1/ueditor.all.min.js`,
    ],
    options: {
      UEDITOR_HOME_URL: `//apps.bdimg.com/libs/ueditor/1.4.3.1/`,
    },
  }),
  NgxTinymceModule.forRoot({
    baseURL: '//cdn.bootcss.com/tinymce/4.7.4/',
  }),
];
// #endregion

// #region JSON Schema form (using @delon/form)
import { JsonSchemaModule } from '@shared/json-schema/json-schema.module';
const FORM_MODULES = [JsonSchemaModule];
// #endregion

// #region Http Interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SimpleInterceptor } from '@delon/auth';
import { DefaultInterceptor } from '@core/net/default.interceptor';
const INTERCEPTOR_PROVIDES = [
  { provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
];
// #endregion

// #region Startup Service
import { StartupService } from '@core/startup/startup.service';
export function StartupServiceFactory(
  startupService: StartupService,
): Function {
  return () => startupService.load();
}
const APPINIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true,
  },
  {
    provide: NZ_MODAL_CONFIG,
    useValue: {
        nzMask : true, // 是否展示遮罩
        nzMaskClosable: false, // 点击蒙层是否允许关闭
    }
  }
];

const CHART_PROVIDERS = [
    PieService,
    CirclePieService,
    PolarService,
    FoldService,
    FoldHistogramService,
    ThetaListService,
    BarGroupService,
    PieShowService,
    FoldHistogramShowService,
    BarGroupShowService,
];
// #endregion

import { DelonModule } from './delon.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { RoutesModule } from './routes/routes.module';
import { LayoutModule } from './layout/layout.module';
import {UtilsService} from "./utils.Service";
import {PieService} from "./routes/service/chart-service/pie.service";
import {CirclePieService} from "./routes/service/chart-service/circle-pie.service";
import {PolarService} from "./routes/service/chart-service/polar.service";
import {FoldService} from "./routes/service/chart-service/fold.service";
import {FoldHistogramService} from "./routes/service/chart-service/fold-histogram.service";
import {ThetaListService} from "./routes/service/chart-service/theta-list.service";
import {BarGroupService} from "./routes/service/chart-service/bar-group.service";
import {EventService} from "@shared/event/event.service";
import {UserService} from "./routes/service/user.service";
import {WidgetService} from "./routes/service/widget.service";
import {PieShowService} from "./routes/service/chart-service/pie-show.service";
import {FoldHistogramShowService} from "./routes/service/chart-service/fold-histogram-show.service";
import {BarGroupShowService} from "./routes/service/chart-service/bar-group-show.service";

@NgModule({
  declarations: [AppComponent,TitleWidgetComponent,ButtonWidgetComponent,NumberWidgetComponent,Calendar,CheckBoxSelectWidgetComponent,CheckBoxWidgetComponent,UploadFilesWidgetComponent],
  entryComponents: [ TitleWidgetComponent,ButtonWidgetComponent,NumberWidgetComponent,Calendar,CheckBoxSelectWidgetComponent,CheckBoxWidgetComponent,UploadFilesWidgetComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DelonModule.forRoot(),
    CoreModule,
    SharedModule,
    LayoutModule,
    RoutesModule,
    ...I18NSERVICE_MODULES,
    ...GLOBAL_THIRD_MDOULES,
    ...FORM_MODULES,
  ],


  providers: [
    ...LANG_PROVIDES,
    ...INTERCEPTOR_PROVIDES,
    ...I18NSERVICE_PROVIDES,
    ...APPINIT_PROVIDES,
      UtilsService,
      EventService,
      UserService,
    WidgetService,
      DatePipe,
    ...CHART_PROVIDERS,

  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(widgetRegistry: WidgetRegistry) {
    widgetRegistry.register(TitleWidgetComponent.KEY, TitleWidgetComponent);
    widgetRegistry.register(ButtonWidgetComponent.KEY, ButtonWidgetComponent);
    widgetRegistry.register(NumberWidgetComponent.KEY, NumberWidgetComponent);
    widgetRegistry.register(CheckBoxSelectWidgetComponent.KEY, CheckBoxSelectWidgetComponent);
    widgetRegistry.register(CheckBoxWidgetComponent.KEY, CheckBoxWidgetComponent);
    widgetRegistry.register(UploadFilesWidgetComponent.KEY, UploadFilesWidgetComponent);
    widgetRegistry.register(Calendar.KEY, Calendar);
  }
}
