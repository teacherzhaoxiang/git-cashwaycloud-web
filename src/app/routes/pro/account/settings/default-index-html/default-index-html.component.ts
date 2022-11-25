import {Component, Input, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService, NzTreeNode} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
import {UserService} from "../../../../service/user.service";

@Component({
    selector: `default-index-html`,
    template: `
        <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none">
            <div class="modal-footer">
                <button nz-button type="button" (click)="this.sf.reset()">重置</button>
                <button nz-button type="submit" (click)="save(sf.value)" [disabled]="!sf.valid">保存</button>
            </div>
        </sf>`,
})
export class ProAccountSettingsDefaultIndexHtmlComponent {

    record: any = {};
    editSchema: any = {
        properties: {
            indexHtml: {
                type: 'string',
                title: '默认首页',
            }
        },
        required: ["indexHtml"]
    };
    @ViewChild('sf',{ static: false })
    sf: SFComponent;

    constructor(protected http: _HttpClient, private message: NzMessageService, private userService: UserService) {
        if (this.userService.user == null) {
            let userString: string = localStorage.getItem("user");
            this.userService.user = JSON.parse(userString);
        }
    }

    save(value: any) {
        console.log(this.sf.value);
        let url = environment.manage_server_url + "/sys/users/extensions/update/" + this.userService.user.sysUserExtensionDO.id;
        value.id = this.userService.user.sysUserExtensionDO.id;
        this.http.put(url, value).subscribe((res: any) => {
            if (res.code != 0) {
                this.message.error(res.msg)
            } else {
                this.userService.user.sysUserExtensionDO.indexHtml = this.sf.value.indexHtml;
                localStorage.setItem("user", JSON.stringify(this.userService.user))
                this.message.success("修改成功");
            }

        }, (res: any) => {
            this.message.error("修改失败")
        })
    }


    ngOnInit() {
      //  eval('setTimeout(this.save(this.sf.value),10000)');
        //eval('setTimeout(()=>{this.save(this.sf.value);},5000)');
        this.record.indexHtml = this.userService.user.sysUserExtensionDO.indexHtml
    }

}
