import { Component, Inject } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {_HttpClient, SettingsService} from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import {UtilsService} from "../../../../utils.Service";
import {UserService} from "../../../../routes/service/user.service";
import {NzMessageService, NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'header-user',
  template: `
  <!--<nz-dropdown nzPlacement="bottomRight">-->
    <div routerLink="/pro/account/settings" class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown>
      <div style="background-image: url('/assets/images/user.png');background-size:14px 14px;width:14px;height: 14px;margin-right: 8px;"></div>
      {{userService.user.userName}}
    </div>
    <!--<div nz-menu class="width-sm">-->
      <!---->
      <!--&lt;!&ndash;-->
      <!--<div nz-menu-item routerLink="/pro/account/center"><i class="anticon anticon-user mr-sm"></i>-->
        <!--{{ 'menu.account.center' | translate }}-->
      <!--</div>-->
      <!--&ndash;&gt;-->
      <!--<div nz-menu-item routerLink="/pro/account/settings"><i class="anticon anticon-setting mr-sm"></i>-->
        <!--{{ 'menu.account.settings' | translate }}-->
      <!--</div>-->
      <!--<li nz-menu-divider></li>-->
      <!--<div nz-menu-item (click)="logout()"><i class="anticon anticon-logout mr-sm"></i>-->
        <!--{{ 'menu.account.logout' | translate }}-->
      <!--</div>-->
    <!--</div>-->
  <!--</nz-dropdown>-->
  `,
})
export class HeaderUserComponent {
  constructor(
    public settings: SettingsService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private utilsService:UtilsService,
    public userService:UserService,
    private modalSrv: NzModalService
  ) {}
  logout() {
    this.modalSrv.confirm({
      nzTitle     : '确定退出?',
      nzContent   : '<b style="color: red;"></b>',
      nzOkText    : '是',
      nzOkType    : 'danger',
      nzOnOk      : ()=>{
        this.tokenService.clear();
        console.log("=======logout:"+this.utilsService.loginUrl)

        if(this.utilsService.loginUrl == ""){
          this.utilsService.loginUrl = localStorage.getItem("loginUrl");
        }
        this.router.navigateByUrl(this.utilsService.loginUrl);
      },
      nzCancelText: '否',
      nzOnCancel  : () => console.log('Cancel')
    });

  }
}
