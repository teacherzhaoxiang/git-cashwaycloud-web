import {Injectable, Injector, Inject, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
    MenuService,
    SettingsService,
    TitleService,
    ALAIN_I18N_TOKEN,
} from '@delon/theme';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import {environment} from '@env/environment';
import {project} from '@env/environment.base';
import {UserService} from './routes/service/user.service';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class UtilsService {

    /**
     * 登录地址
     */
    loginUrl = '';
    passportLogin = '/passport/login';
    loginOperationPlatform = '/passport/login-operation-platform';

    loaded: any;
    constructor(
        private menuService: MenuService,
        private translate: TranslateService,
        private settingService: SettingsService,
        private aclService: ACLService,
        private titleService: TitleService,
        private httpClient: HttpClient,
        private injector: Injector,
        private userService: UserService,
    ) {

    }
    showTimes:number = 1
    menuButton : object = {}
    findButton(menu){
        if(menu.children != null && menu.children.length != 0){
            //还有下一级
            for(let key in menu.children){
                this.findButton(menu.children[key])
            }
        }else{
            let isTab = menu['button'].length > 0 && menu['button'].every(ele => ele.link != null) 
            if(!isTab){ //不是分页
                let url = this.getUrl(menu.link)
                this.menuButton[url] = menu['button']
            }
            if(isTab){  //是分页
                for(let k in menu['button']){
                    if(menu['button'][k].link){ //有分页,取内层link
                        let url = this.getUrl(menu['button'][k].link)
                        this.menuButton[url] = menu['button'][k]['button']
                    }
                }
            }
        }
    }
    getUrl(link){
        return link.split('/')[link.split('/').length - 1 ].replace('%7C','|')
    }
    setMenu() {

        console.log('setMenu11');
        if (localStorage.getItem('login') == null) {
            return;
        }

        // console.log('setMenu22');
        this.httpClient.get(environment.manage_server_url + '/sys/menus/menu').subscribe((appData: any) => {
            const res1: any = appData;
            // 应用信息：包括站点名、描述、年份
            this.settingService.setApp(res1.app);
            // 用户信息：包括姓名、头像、邮箱地址
            this.settingService.setUser(res1.user);
            console.log(res1.user,'user');
            // 用户信息：包括姓名、头像、邮箱地址
            this.userService.setUser(res1.user);
            localStorage.setItem('user', JSON.stringify(res1.user));
            localStorage.setItem('buttonIcon', res1.user.sysUserExtensionDO.buttonIcon);
            // 初始化菜单
            this.menuService.add(res1.menu);
            // console.log(appData);
            this.findButton(appData['menu'][0])
            console.log(this.menuButton)
            localStorage.setItem('menuButton',JSON.stringify(this.menuButton))
            // console.log('================2222===loginUrl====' + this.loginUrl);
            if (this.loginUrl == '' || this.loginUrl == '/home') {
                this.loginUrl = localStorage.getItem('loginUrl');
                // console.log('================33333===loginUrl====' + this.loginUrl);
            }
            // console.log('================44444===loginUrl====' + this.loginUrl);
            if (this.loginUrl == '/passport/login-operation-platform') {
                this.titleService.setTitle(environment.programName);
            } else if (this.loginUrl == '/passport/login') {
                this.titleService.setTitle(environment.programName);
            }

            // 设置页面标题的后缀
            // this.titleService.suffix = res1.app.name;
            this.loaded = true;
            // 菜单按钮权限
            this.httpClient.get(environment.manage_server_url + '/sys/users/perms').subscribe((permsData: any) => {
                 this.aclService.setAbility(permsData['rows']);
                 localStorage.setItem('perms', permsData['rows']);
            });

            // 审核权限
            this.httpClient.get(environment.manage_server_url + '/sys/roles/currentUser/menu').subscribe((roleMenuData: any) => {
                this.userService.setRoleMenuList(roleMenuData);
            });



            // 新疆农信项目，根据用户orgPath设置用户的上次文件地址
            if(environment['projectName'] == 'xjnx') {
                environment.file_server_url = project.baseUrl + '/zuul/file/file';
                    let orgPath = this.userService.getUser().orgPath;
                let orgPathArray = orgPath.split(".");
                if(orgPathArray.length<=2){
                    return;
                }else{
                    let continentId = orgPathArray[2];
                    this.httpClient.get(environment.gateway_server_url + '/hall/publish_continent_ip/publishContinentIp/list').subscribe((continentIpData: any) => {
                        let continentIpArray = JSON.parse(continentIpData['msg']);
                        for(let i=0;i<continentIpArray.length;i++){
                            if(continentId == continentIpArray[i]['continentId']){
                                environment.file_server_url = "http://"+continentIpArray[i]['ip']+":8885/file";
                                break;
                            }
                        }
                    });
                }
            }

          //  页面跳转
           // this.router.navigate([this.userService.user.sysUserExtensionDO.indexHtml]);
        });
    }

}
