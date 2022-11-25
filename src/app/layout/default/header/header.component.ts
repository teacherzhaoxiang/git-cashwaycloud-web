import {ChangeDetectorRef, Component, Inject, NgZone, OnInit, ViewChild} from '@angular/core';
import {_HttpClient, SettingsService} from '@delon/theme';
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {copy, deepCopy, LazyService} from "@delon/util";
import {DOCUMENT} from "@angular/common";
import {environment} from "./../../../../environments/environment"
import {Router} from "@angular/router";
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import {UtilsService} from "../../../utils.Service";
import {UserService} from "../../../routes/service/user.service";

const ALAINDEFAULTVAR = 'alain-default-vars';
const DEFAULT_COLORS = [
    {
        key: 'dust',
        color: '#F5222D',
    },
    {
        key: 'volcano',
        color: '#FA541C',
    },
    {
        key: 'sunset',
        color: '#FAAD14',
    },
    {
        key: 'cyan',
        color: '#13C2C2',
    },
    {
        key: 'green',
        color: '#52C41A',
    },
    {
        key: 'daybreak',
        color: '#1890ff',
    },
    {
        key: 'geekblue',
        color: '#2F54EB',
    },
    {
        key: 'purple',
        color: '#722ED1',
    },
];
const DEFAULT_VARS = {
    'primary-color': { label: '主颜色', type: 'color', default: '#1890ff' },
    'alain-default-header-hg': {
        label: '高',
        type: 'px',
        default: '74px',
        max: 300,
        min: 24,
    },
    'alain-default-header-bg': {
        label: '背景色',
        type: 'color',
        default: '@primary-color',
        tip: '默认同主色系',
    },
    'alain-default-header-padding': {
        label: '顶部左右内边距',
        type: 'px',
        default: '16px',
    },
    // 侧边栏
    'alain-default-aside-wd': { label: '宽度', type: 'px', default: '200px' },
    'alain-default-aside-bg': {
        label: '背景',
        type: 'color',
        default: '#ffffff',
    },
    'alain-default-aside-collapsed-wd': {
        label: '收缩宽度',
        type: 'px',
        default: '64px',
    },
    'alain-default-aside-nav-padding-top-bottom': {
        label: '项上下内边距',
        type: 'px',
        default: '8px',
        step: 8,
    },
    // 主菜单
    'alain-default-aside-nav-fs': {
        label: '菜单字号',
        type: 'px',
        default: '14px',
        min: 14,
        max: 30,
    },
    'alain-default-aside-collapsed-nav-fs': {
        label: '收缩菜单字号',
        type: 'px',
        default: '24px',
        min: 24,
        max: 32,
    },
    'alain-default-aside-nav-item-height': {
        label: '菜单项高度',
        type: 'px',
        default: '38px',
        min: 24,
        max: 64,
    },
    'alain-default-aside-nav-text-color': {
        label: '菜单文本颜色',
        type: 'color',
        default: 'rgba(0, 0, 0, 0.65)',
        rgba: true,
    },
    'alain-default-aside-nav-text-hover-color': {
        label: '菜单文本悬停颜色',
        type: 'color',
        default: '@primary-color',
        tip: '默认同主色系',
    },
    'alain-default-aside-nav-group-text-color': {
        label: '菜单分组文本颜色',
        type: 'color',
        default: 'rgba(0, 0, 0, 0.43)',
        rgba: true,
    },
    'alain-default-aside-nav-selected-text-color': {
        label: '菜单激活时文本颜色',
        type: 'color',
        default: '@primary-color',
        tip: '默认同主色系',
    },
    'alain-default-aside-nav-selected-bg': {
        label: '菜单激活时背景颜色',
        type: 'color',
        default: '#fcfcfc',
    },
    // 内容
    'alain-default-content-bg': {
        label: '背景色',
        type: 'color',
        default: '#f5f7fa',
    },
    'alain-default-content-heading-bg': {
        label: '标题背景色',
        type: 'color',
        default: '#fafbfc',
    },
    'alain-default-content-heading-border': {
        label: '标题底部边框色',
        type: 'color',
        default: '#efe3e5',
    },
    'alain-default-content-padding': {
        label: '内边距',
        type: 'px',
        default: '24px',
        min: 0,
        max: 128,
        step: 8,
    },
    // zorro组件修正
    'form-state-visual-feedback-enabled': {
        label: '开启表单元素的视觉反馈',
        type: 'switch',
        default: true,
    },
    'preserve-white-spaces-enabled': {
        label: '开启 preserveWhitespaces',
        type: 'switch',
        default: true,
    },
    'nz-table-img-radius': {
        label: '表格中：图片圆角',
        type: 'px',
        default: '4px',
        min: 0,
        max: 128,
    },
    'nz-table-img-margin-right': {
        label: '表格中：图片右外边距',
        type: 'px',
        default: '4px',
        min: 0,
        max: 128,
    },
    'nz-table-img-max-width': {
        label: '表格中：图片最大宽度',
        type: 'px',
        default: '32px',
        min: 8,
        max: 128,
    },
    'nz-table-img-max-height': {
        label: '表格中：图片最大高度',
        type: 'px',
        default: '32px',
        min: 8,
        max: 128,
    },
};

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
    styles:[
        `
            .my-logout-icon{
                color: white;
                padding-right: 3px;
            }
        `
    ]
})
export class HeaderComponent implements OnInit{

    ngOnInit(): void {
        this.setNowLoginInterval()
    }
  searchToggleStatus: boolean;
    smallLogo = environment.smallLogo;
    private loadedLess = false;

    collapse = false;
    get layout() {
        return this.settingSrv.layout;
    }
    data: any = {};
    color: string;
    colors = DEFAULT_COLORS;
    logoFullImage:any = environment.logoFullImage;
    hallConfig:any = environment['hall-config'];
    hallHeadBigImage:any = environment['hallHeadBigImage'];


  constructor(public settings: SettingsService,
              private cd: ChangeDetectorRef,
              private msg: NzMessageService,
              private settingSrv: SettingsService,
              private lazy: LazyService,
              private zone: NgZone,
              private router: Router,
              @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
              private utilsService:UtilsService,
              public userService:UserService,
              private modalSrv: NzModalService,
              private http: _HttpClient ,
              @Inject(DOCUMENT) private doc: any,) {
      this.color = this.cachedData['@primary-color'] || this.DEFAULT_PRIMARY;
      this.resetData(this.cachedData, false);
  }

  toggleCollapsedSidebar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }


    private get cachedData() {
        return this.settingSrv.layout[ALAINDEFAULTVAR] || {};
    }

    private get DEFAULT_PRIMARY() {
        return DEFAULT_VARS['primary-color'].default;
    }

    private loadLess(): Promise<void> {
        if (this.loadedLess) return Promise.resolve();
        return this.lazy
            .loadStyle('./assets/alain-default.less', 'stylesheet/less')
            .then(() => {
                const lessConfigNode = this.doc.createElement('script');
                lessConfigNode.innerHTML = `
          window.less = {
            async: true,
            env: 'production',
            javascriptEnabled: true
          };
        `;
                this.doc.body.appendChild(lessConfigNode);
            })
            .then(() =>
                this.lazy.loadScript(
                    './assets/aliLess.min.js',
                ),
            )
            .then(() => {
                this.loadedLess = true;
            });
    }

    private genVars() {
        const { data, color, validKeys } = this;
        const vars: any = {
            [`@primary-color`]: color,
        };
        validKeys
            .filter(key => key !== 'primary-color')
            .forEach(key => (vars[`@${key}`] = data[key].value));
        this.setLayout(ALAINDEFAULTVAR, vars);
        return vars;
    }

    private runLess() {
        const { zone, msg, cd } = this;
        const msgId = msg.loading(`正在编译主题！`, { nzDuration: 0 }).messageId;
        setTimeout(() => {
            zone.runOutsideAngular(() => {
                this.loadLess().then(() => {
                    (window as any).less.modifyVars(this.genVars()).then(() => {
                        msg.success('成功');
                        msg.remove(msgId);
                        zone.run(() => cd.detectChanges());
                    });
                });
            });
        }, 200);
    }

    toggle() {
        this.collapse = !this.collapse;
    }

    changeColor(color: string) {
    console.log("11111")
        this.color = color;
        Object.keys(DEFAULT_VARS)
            .filter(key => DEFAULT_VARS[key].default === '@primary-color')
            .forEach(key => delete this.cachedData[`@${key}`]);
        console.log("22222")
        this.resetData(this.cachedData, true);
    }
    nowLoginUser : number = 0
    nowLoginInterval : any
    setNowLoginInterval(){
        this.getNowLoginUser()
        this.nowLoginInterval = setInterval(()=>{
            this.getNowLoginUser()
        },120000)
    }
    getNowLoginUser(){
        let user = this.userService.user.id
        this.http.get(environment['baseUrl_url'] + `/loginUserNumber?userId=${user}`).subscribe(res=>{
            this.nowLoginUser = res
        })
    }
    setLayout(name: string, value: any) {
        this.settingSrv.setLayout(name, value);
    }

    private resetData(nowData?: Object, run = true) {
        nowData = nowData || {};
        console.log("333")
        const data = deepCopy(DEFAULT_VARS);
        Object.keys(data).forEach(key => {
            const value = nowData[`@${key}`] || data[key].default || '';
            data[key].value = value === `@primary-color` ? this.color : value;
        });
        this.data = data;
        console.log("4444");
        if (run) {
            console.log("5555")
            this.cd.detectChanges();
            this.runLess();
        }
    }

    private get validKeys(): string[] {
        return Object.keys(this.data).filter(
            key => this.data[key].value !== this.data[key].default,
        );
    }

    apply() {
        this.runLess();
    }

    reset() {
        this.color = this.DEFAULT_PRIMARY;
        this.settingSrv.setLayout(ALAINDEFAULTVAR, {});
        this.resetData({});
    }

    copyVar() {
        const vars = this.genVars();
        const copyContent = Object.keys(vars)
            .map(key => `${key}: ${vars[key]};`)
            .join('\n');
        copy(copyContent);
        this.msg.success('Copy success');
    }

    logout() {
        console.log(this.userService.user.id)
        
        this.modalSrv.confirm({
            nzTitle     : '确定退出?',
            nzContent   : '<b style="color: red;"></b>',
            nzOkText    : '是',
            nzOkType    : 'danger',
            nzOnOk      : ()=>{
                let url = environment.gateway_server_url + '/logoutInserLog/' + this.userService.user.id
                this.http.get(url).subscribe(res=>{
                    this.tokenService.clear();
                    sessionStorage.clear();
                    console.log("=======logout:"+this.utilsService.loginUrl)
                    if(this.utilsService.loginUrl == ""){
                        this.utilsService.loginUrl = localStorage.getItem("loginUrl");
                    }
                    this.router.navigateByUrl(this.utilsService.loginUrl);
                })
            },
            nzCancelText: '否',
            nzOnCancel  : () => console.log('Cancel')
        });

    }
    ngOnDestroy(): void {
        clearInterval(this.nowLoginInterval)
    }
}
