import { Injectable, Injector, Inject } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
    MenuService,
    SettingsService,
    TitleService,
    ALAIN_I18N_TOKEN, _HttpClient,
} from '@delon/theme';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';
import {environment} from '@env/environment';
import {UserLoginComponent} from '../../routes/passport/login/login.component';
import {UtilsService} from '../../utils.Service';
import {UserService} from '../../routes/service/user.service';
import {project} from '@env/environment.base';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
    loaded: any;
  constructor(
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    private httpClient: HttpClient,
    private http: _HttpClient,
    private injector: Injector,
    private utilsModule: UtilsService,
    private userService: UserService,
    // private router: Router,

  ) {
      if (this.userService.user == null) {
          const userString: string = localStorage.getItem('user');
          this.userService.user = JSON.parse(userString);
          console.log(this.userService.user);
      }

      this.http.get('assets/localConfig-'+environment.programId+'.json').subscribe((res: any) => {
          try {
              const data: any = res;
              console.log(data);
              for(let key in data){
                  environment[key] = data[key];
              }
              console.log(environment['__url'],'56行')
              if (data['__url'].indexOf('http') > -1) {
                  console.log('11111111');
                  project.baseUrl = data['__url'];
                  for (const key of Object.keys(environment)) {
                      if (key.indexOf('url') > -1) {
                          const array: string[] = environment[key].split(':');
                          const value: string = array[2].substring(4, array[2].length);
                          environment[key] = project.baseUrl + value;
                          console.log(environment[key]);
                      }
                  }
              }
          } catch (e) {
              for (const key of Object.keys(environment)) {
                  if (key.indexOf('url') > -1) {
                       environment[key] = project.baseUrl + environment[key];
                  }
              }
          }
      }, (res: any) => {
          for (const key of Object.keys(environment)) {
              if (key.indexOf('url') > -1) {
                   environment[key] = project.baseUrl + environment[key];
              }
          }
      }, () => {});
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
// alert(this.router.url);
        if (window.location.href.indexOf('publishPlayNew') > 0) {
            resolve(null);
            return;
        }
      zip(
        //
        //

          this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
          // this.httpClient.get(`assets/tmp/i18n/zh-CN.json`),
        //  this.httpClient.get('assets/tmp/app-data.json'),
          // this.httpClient.get('http://localhost:8092/sys/menus/menu'),


      )
        .pipe(
          // 接收其他拦截器后产生的异常消息
          catchError(([langData, appData]) => {
            resolve(null);
            return [langData, appData];
          }),
        )
        .subscribe(
          ([langData, appData]) => {
            // setting language data
              console.log('=======2342342342342342342====');
            this.translate.setTranslation(this.i18n.defaultLang, langData);
            this.translate.setDefaultLang(this.i18n.defaultLang);

            console.log('=========router:url:' + window.location.href);
              const loginUrl = window.location.href;
              if (loginUrl.indexOf('passport/login') >= 0 || loginUrl.indexOf('publishPlay?id') >= 0) {
                  console.log('=========router:url222222:');
                  localStorage.removeItem('login');
              }
             // application data
            // const res: any = appData;
            // // 应用信息：包括站点名、描述、年份
            // this.settingService.setApp(res.app);
            // // 用户信息：包括姓名、头像、邮箱地址
            // this.settingService.setUser(res.user);
            // // ACL：设置权限为全量
            // this.aclService.setFull(true);
            // // 初始化菜单
            // this.menuService.add(res.menu);
            // // 设置页面标题的后缀
            // this.titleService.suffix = res.app.name;
              // alert(this.loaded);
             // alert(this.utilsModule);
             // if(this.loaded){
               //   alert(2);
                 this.utilsModule.setMenu();
              // }
          },
          () => {},
          () => {
            resolve(null);
          },
        );
    });
  }
}
