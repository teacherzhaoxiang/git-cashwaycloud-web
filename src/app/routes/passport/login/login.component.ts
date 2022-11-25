import {_HttpClient, ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService} from '@delon/theme';
import {Component, OnDestroy, Inject, Optional, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import {Md5} from 'ts-md5/dist/md5';
import {SFSchemaEnumType} from '@delon/form';
import {TranslateService} from '@ngx-translate/core';
import {I18NService} from '@core/i18n/i18n.service';
import {ACLService} from '@delon/acl';
import {HttpClient} from '@angular/common/http';
import {UtilsService} from '../../../utils.Service';
import {UserService} from '../../service/user.service';
import {UserAddModalComponent} from '../../system/user/user.add';
import {ResetPasswordComponent} from './reset.password.component';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
    styles:[
        `    
            .transformLang{
                position: fixed;
                top: 30px;
                right: 0;
                width: 100px;
                z-index: 99999;
            }
            .ant-form{
                display:block;
            }
            .login_container{
                width: 30%;
                max-width: 315px;
                /*position: absolute;*/
                /*top:35%;*/
                /*right: 10%;*/
            }
            .tips_box{
                text-align: center;
                margin-bottom: 40px;
                visibility: hidden;
                animation: tips 2s;
            }
            .tips_box .tips{
                height: 41px;
                line-height: 41px;
                background: #fff;
                border-radius: 4px;
                padding: 0 20px;
                color: #d81e06;
                display: inline-flex;
            }
            .tips_box .tips .img{
                width: 20px;
                height: 20px;
                margin-right: 10px;
            }
            .tips_box .tips .img img{
                width: 100%;
                height: 100%;
            }
            .login_box{
                position: relative;
                padding-bottom: 10px;
                border-radius: 4px;
                overflow: hidden;
            }
            .headerBg{
                width: auto;
                height: 72px;
                background: url("../../../../assets/images/loginBg.png");
                position: relative;
                z-index: 99;
                background-repeat: no-repeat;
            }
            .imgBg{
                height: 58%;
                margin-top: 3%;
                margin-left: 3%;
            }
        
            .contentBg{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,0.5);
            }
            .loginAct{
                width: 35%;
                margin-top: 41px;
                max-width: 360px;
            }
            .loginAct img{
                width: 100%;
                height: 100%;
            }
        `
    ],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy, OnInit {
  lang = 'zn-CH';  //中文：zn-CH   英文：en-US
  form: FormGroup;
  error = '';
  type = 0;
  loading = false;
  loaded = false;
    loginBg: string = environment.loginBg;
    logoFullImage = environment.logoFullImage;
    gif = environment.gif;
    psasswordStrength = '';
    err = '';
    @ViewChild('tips',{static:true}) tips:any;
  constructor(
    fb: FormBuilder,
    private router: Router,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private startupSrv: StartupService,
    private http: _HttpClient,

    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    // private settingService: SettingsService,
    private titleService: TitleService,
    private utilsService: UtilsService,
    private userService: UserService,

  ) {
    this.form = fb.group({
      userName: [null, [Validators.required]],
      password: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true],
    });
    modalSrv.closeAll();
  }

  ngOnInit(): void {
        localStorage.setItem('lang', this.lang);
        if (this.router.url != '/home') {
            this.utilsService.loginUrl = this.router.url;
            localStorage.setItem('loginUrl', this.router.url);
        }
        this.getCaptchaImage();
    }

  // region: fields

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
    get captcha() {
        return this.form.controls.captcha;
    }

  // endregion

  switch(ret: any) {
    this.type = ret.index;
  }

  // region: get captcha

  count = 0;
  interval$: any;

  src:string = "";
  captchaId:string = "";
  getCaptchaImage() {
      setTimeout(()=>{
        console.log("---------------------------------3456");
        this.captchaId = new Date().getTime()+''+Math.floor(Math.random() * Math.pow(10, 8));
        console.log(environment.gateway_server_url,environment,'验证码')
        this.src = environment.gateway_server_url+"/manage/sys/users/captcha?id="+this.captchaId;
        console.log(this.captchaId);
      },0)
      // this.http.get(environment.gateway_server_url+"/manage/sys/users/captcha?id="+this.captchaId).subscribe((res:any)=>{
      //     this.src = res;
      // })
  }


    checkPsasswordStrength(val) {
        const aStr = ['弱', '中', '强', '牛逼'];
        let modes = 0;
        if (val.length < 6) modes = 0;
        if (/\d/.test(val)) modes++; // 数字
        if (/[a-z]/.test(val)) modes++; // 小写
        if (/[A-Z]/.test(val)) modes++; // 大写
        if (/\W/.test(val)) modes++; // 特殊字符
        if (val.length > 12) modes = 4;
        if (modes == 0)modes = 1;
        this.psasswordStrength = aStr[modes - 1];
    }
  // endregion

    submit2() {
        this.tokenService.set({
            token: '1111'
            // token: res["token"]
            // name: this.userName.value,
            // email: `cipchk@qq.com`,
            // id: 10000,
            // time: +new Date(),
        });
        this.utilsService.setMenu();
        this.router.navigate(['/']);
    }
    loginText = '登录'
    timer=null;
    beforeSubmit(){
      if(!this.timer){
        this.submit()
        this.loginText = '登录中'
        this.timer = setTimeout(()=>{
          this.timer=null
          this.loginText = '登录'
        },5000)
      }
    }
    submit() {
      console.log('你点击了登录');
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
        this.password.markAsDirty();
      this.password.updateValueAndValidity();
        if (this.userName.invalid || this.password.invalid) return;
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) return;
    }

    // **注：** DEMO中使用 `setTimeout` 来模拟 http
    // 默认配置中对所有HTTP请求都会强制[校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    // this.loading = true;
    // setTimeout(() => {
    //   this.loading = false;
    //   if (this.type === 0) {
    //     if (
    //       this.userName.value !== 'admin' ||
    //       this.password.value !== '888888'
    //     ) {
    //       this.error = `账户或密码错误`;
    //       return;
    //     }
    //   }
    //
    //   // 清空路由复用信息
    //   this.reuseTabService.clear();
    //   // 设置Token信息
    //   this.tokenService.set({
    //     token: '123456789',
    //     name: this.userName.value,
    //     email: `cipchk@qq.com`,
    //     id: 10000,
    //     time: +new Date(),
    //   });
    //   // 重新获取 StartupService 内容，若其包括 User 有关的信息的话
    //   // this.startupSrv.load().then(() => this.router.navigate(['/']));
    //   // 否则直接跳转
    //   this.router.navigate(['/template/monitor/terminal']);
    // }, 1000);
    //
    // let url = "http://localhost:8090/login";
    // let params = {userName:this.userName.value,password:this.password.value};
    // this.http.get(url,params).subscribe((res:any)=>{
    //   alert(3);
    //  // console.log(res);
    // });

    //let newPassword=this.userService.encryptedDES(this.password.value);

     let newPassword=Md5.hashStr(this.userService.encryptedDES(this.password.value));

        // if(environment['projectName'] =='xjnx'){
        //     newPassword = this.userService.encryptedDES(this.password.value);
        // }else{
        //     newPassword = Md5.hashStr(this.userService.encryptedDES(this.password.value));
        // }

      sessionStorage.setItem('psasswordStrength', this.psasswordStrength);
      this.http.get(environment.gateway_server_url+"/beforeLogin").subscribe((res:any)=>{
          const url = environment.gateway_server_url
              + '/login?userName=' + this.userName.value
              + '&password=' + newPassword
              +'&captcha='+this.captcha.value
              +'&captchaId='+this.captchaId;
          const params = {'userName': this.userName.value,
              'password': newPassword,
              'captcha':this.captcha.value,
              'captchaId':this.captchaId
          };
          this.http.post(url, params).subscribe((res: any) => {
              if (res['code'] == 0) {
                  if (environment.sessionLogin) {
                      sessionStorage.setItem('loginType', '1');
                  }
                  // 清空路由复用信息
                  this.reuseTabService.clear();
                  // 设置Token信息
                  console.log( res['msg']);
                  this.tokenService.set({
                      token: res['msg']
                      // token: res["token"]
                      // name: this.userName.value,
                      // email: `cipchk@qq.com`,
                      // id: 10000,
                      // time: +new Date(),
                  });



                  // 重新获取 StartupService 内容，若其包括 User 有关的信息的话
                  // this.startupSrv.load().then(() => this.router.navigate(['/']));
                  // 否则直接跳转
                  localStorage.setItem('login', '1');


                  if (this.router.url != '/home') {
                      this.utilsService.loginUrl = this.router.url;
                      localStorage.setItem('loginUrl', this.router.url);
                  }


                  console.log(' this.utilsService.loginUrl=====' + this.utilsService.loginUrl);





                  // this.setMenu();
                  this.utilsService.setMenu();
                  // this.login();
                  // this.startupSrv.loaded = true;
                  let _this = this;
                setTimeout(function () { _this.router.navigate(['/']) }, 500);

              } else if (res['code'] == 401) {
                  this.getCaptchaImage();
                  this.error = res['msg'];
                  const modal = this.modalSrv.create({
                      nzTitle: '修改密码',
                      nzContent: ResetPasswordComponent,
                      nzComponentParams: {
                          userName: this.userName.value
                      },
                      nzFooter: null
                  });
              } else {
                  this.getCaptchaImage();
                  //this.msg.error(res['msg']);
                  this.timer = null
                  console.log('登录失败')
                  this.loginText = '登录'
                  this.err = res['msg'];
                  this.showTips();
              }
          });
      },(res:any)=>{
          this.getCaptchaImage();
          //this.msg.error("网络异常");
          this.err = '网络异常';
          this.showTips();
      })
    }

    showTips(){
        this.tips.nativeElement.style.visibility = 'visible';
        setTimeout(()=>{
            this.tips.nativeElement.style.visibility = 'hidden';
        },3000)
    }
    login() {
        setTimeout(() => {
          if (this.userService.user == null) {
            this.login();
          } else {
              this.router.navigate([this.userService.user.sysUserExtensionDO.indexHtml]);
          }
        }, 500);
  }

  setMenu() {
      this.http.get(environment.manage_server_url + '/sys/menus/menu').subscribe((appData: any) => {
          const res1: any = appData;
          // 应用信息：包括站点名、描述、年份
          this.settingsService.setApp(res1.app);
          // 用户信息：包括姓名、头像、邮箱地址
          this.settingsService.setUser(res1.user);
          // // ACL：设置权限为全量
          // this.aclService.setFull(true);
          // 初始化菜单
          this.menuService.add(res1.menu);
          // 设置页面标题的后缀
          this.titleService.suffix = res1.app.name;
          this.loaded = true;
      });
  }

  // region: social

  open(type: string, openType: SocialOpenType = 'href') {
    let url = ``;
    let callback = ``;
    if (environment.production)
      callback = 'https://ng-alain.github.io/ng-alain/callback/' + type;
    else callback = 'http://192.168.10.103:4200/callback/' + type;
    switch (type) {
      case 'auth0':
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'github':
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'weibo':
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
    }
    if (openType === 'window') {
      this.socialService
        .login(url, '/', {
          type: 'window',
        })
        .subscribe(res => {
          if (res) {
            this.settingsService.setUser(res);
            this.router.navigateByUrl('/');
          }
        });
    } else {
      this.socialService.login(url, '/', {
        type: 'href',
      });
    }
  }

  // endregion

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
  langTransform(value): void {
    this.i18n.use('en-US');
    localStorage.setItem('lang', value);
  }
}
