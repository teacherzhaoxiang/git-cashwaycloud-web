import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd';
import {UserService} from "../../../../service/user.service";
import {environment} from "@env/environment";
import {CacheService} from "@delon/cache";

@Component({
    selector: 'app-account-settings-buttons-contain-icon',
    templateUrl: './buttons-contain-icon.component.html'
})
export class ProAccountSettingsButtonsContainIconComponent implements OnInit {

    value: boolean;

    constructor(private userService: UserService, private http: _HttpClient, private message: NzMessageService) {
        if (this.userService.user == null) {
            let userString: string = localStorage.getItem("user");
            this.userService.user = JSON.parse(userString);
        }
    }


    ngOnInit() {

        if (this.userService.user.sysUserExtensionDO.buttonIcon == 1) {
            this.value = true;
        } else {
            this.value = false;
        }

    }


    change() {
        console.log(this.value);
        let id = this.userService.user.sysUserExtensionDO.id;
        let buttonIcon = this.value == true ? 1 : 0;

        let param = {
            id: id,
            buttonIcon: buttonIcon
        }
        this.http.put(environment.manage_server_url + "/sys/users/extensions/update/" + id, param).subscribe((res: any) => {
            this.message.info("修改成功")
            this.userService.user.sysUserExtensionDO.buttonIcon = buttonIcon;
            localStorage.setItem("user", JSON.stringify(this.userService.user))
        })
    }
}
