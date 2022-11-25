import {_HttpClient, ALAIN_I18N_TOKEN, MenuService, TitleService} from '@delon/theme';
import {Component, OnDestroy, Inject, Optional, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
    SocialService,
    SocialOpenType,
    TokenService,
    DA_SERVICE_TOKEN,
} from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { StartupService } from '@core/startup/startup.service';
import {UtilsService} from '../../../utils.Service';
@Component({
    selector: 'login-from-other-web',
    templateUrl: './login-from-other-web.component.html',
    styles:[
        `
        `
    ],
    providers: [SocialService],
})
export class LoginFromOtherWebComponent implements OnDestroy, OnInit {
    error = '';
    type = 0;
    loading = false;
    loaded = false;
    logoFullImage = environment.logoFullImage;
    gif = environment.gif;
    err = '';
    @ViewChild('tips',{static:true}) tips:any;
    constructor(
        private router: Router,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private socialService: SocialService,
        @Optional()
        @Inject(ReuseTabService)
        private reuseTabService: ReuseTabService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
        private startupSrv: StartupService,
        private http: _HttpClient,

        private menuService: MenuService,
        // private settingService: SettingsService,
        private titleService: TitleService,
        private utilsService: UtilsService,

    ) {

        modalSrv.closeAll();
    }

    ngOnInit(): void {



        console.log("token");
        let token = this.getToken();
        console.log(token);
        if (environment.sessionLogin) {
            sessionStorage.setItem('loginType', '1');
        }
        // 清空路由复用信息
        this.reuseTabService.clear();
        this.tokenService.set({
            token: token
        });

        localStorage.setItem('login', '1');
        if (this.router.url != '/home') {
            this.utilsService.loginUrl = this.router.url;
            localStorage.setItem('loginUrl', this.router.url);
        }

        this.utilsService.setMenu();
        let _this = this;
        setTimeout(function () { _this.router.navigate(['/']) }, 500);

    }
    getToken () {
        let url = window.location.hash;
        let index = url.indexOf("token=");
        let token = url.substr(index+6);
        return token;
    }




    ngOnDestroy(): void {

    }
}
