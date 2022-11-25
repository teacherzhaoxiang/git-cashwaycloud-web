import {Component, Input, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService, NzTreeNode} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
import {UserService} from "../../../../service/user.service";

@Component({
    selector: `default-role`,
    template: `
        <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none">
            <div class="modal-footer">
                <button nz-button type="button" (click)="this.sf.reset()">重置</button>
                <button nz-button type="submit" (click)="save(sf.value)" [disabled]="!sf.valid">保存</button>
            </div>
        </sf>`,
})
export class ProAccountSettingsDefaultRoleComponent {

    record: any = {};
    editSchema: any = {
        properties: {
            defaultRoleId: {
                type: 'string',
                title: '默认角色',
                ui: {
                    widget: 'select',
                    asyncData: () => this.http.get<SFSchemaEnumType[]>(environment.manage_server_url + "/sys/roles/listUserRoleByHadSelect?perms=sys:user&userId=" + this.userService.user.id)
                }
            }
        },
        required: ["defaultRoleId"]
    };
    @ViewChild('sf',{ static: false })
    sf: SFComponent;
    constructor(protected http: _HttpClient, private message: NzMessageService, private userService: UserService) {
        if (this.userService.user == null) {
            let userString: string = localStorage.getItem("user");
            this.userService.user = JSON.parse(userString);
            console.log(this.userService.user)
        }
    }

    save(value: any) {
        let url = environment.manage_server_url + "/sys/users/extensions/update/" + this.userService.user.sysUserExtensionDO.id;
        this.http.put(url, value).subscribe((res: any) => {
            if (res.code != 0) {
                this.message.error(res.msg)
            } else {
                this.userService.user.sysUserExtensionDO.defaultRoleId = this.sf.value.defaultRoleId;
                localStorage.setItem("user", JSON.stringify(this.userService.user))
                this.message.success("修改成功");
            }

        }, (res: any) => {
            this.message.error("修改失败")
        })
    }


    ngOnInit() {
        this.record = {
            defaultRoleId: this.userService.user.sysUserExtensionDO.defaultRoleId,
            id: this.userService.user.sysUserExtensionDO.id
        }
    }

}
