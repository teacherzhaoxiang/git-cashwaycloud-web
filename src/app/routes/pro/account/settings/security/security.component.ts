import { Component, ChangeDetectionStrategy } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-account-settings-security',
  templateUrl: './security.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProAccountSettingsSecurityComponent {
  constructor(public msg: NzMessageService) {}

    psasswordStrength:String = "未知";


    modifyPassword(){

    }

    ngOnInit() {
      try{
          this.psasswordStrength = sessionStorage.getItem("psasswordStrength");
      }catch (e) {

      }
    }
}
