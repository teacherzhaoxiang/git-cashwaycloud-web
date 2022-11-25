import { Component, Input, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef, NzTreeNode } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFSchemaEnumType } from '@delon/form';
import { environment } from '@env/environment';
import { UserService } from '../../service/user.service';
import { Md5 } from 'ts-md5';
@Component({
    selector: `reset-password`,
    template: `
        <sf #sf mode="edit" [schema]="editSchema" button="none" >
            <div class="modal-footer">
                <button nz-button type="button" (click)="this.sf.reset()">重置</button>
                <button nz-button type="submit" (click)="save(sf.value)" [disabled]="!sf.valid" >保存</button>
            </div>
    </sf>`,
})
export class ResetPasswordComponent {
    @Input()
    userName: any;
    editSchema: any = {
        properties: {
            oldPassword: { type: 'string', title: '旧密码', maxLength: 36, ui: { type: 'password' } },
            newPassword: {
                type: 'string', title: '新密码', format: "regex", pattern: ".{8,16}", maxLength: 36, ui: {
                    type: 'password', errors: { pattern: "必须包含数字,大小写字母和特殊字符" }, validator: (value: any) => {
                        return this.checkPassword(value);
                    }
                }
            },
            confirmPassword: { type: 'string', title: '确认密码', maxLength: 36, ui: { type: 'password' } },
        },
        required: ['oldPassword', 'newPassword', 'confirmPassword']
    };
    @ViewChild('sf', { static: false })
    sf: SFComponent;
    constructor(protected http: _HttpClient, private message: NzMessageService, private userService: UserService, private modal: NzModalRef,) { }

    save(value: any) {
        if (this.sf.value.newPassword != this.sf.value.confirmPassword) {
            this.message.error("两次输入密码不一致，请重新输入");
            return;
        }
        let url = environment.manage_server_url + '/sys/users/password/update';
        url = url + '?userName=' + this.userName + '&oldPassword=' + Md5.hashStr(this.userService.encryptedDES(this.sf.value.oldPassword)) + '&newPassword=' + Md5.hashStr(this.userService.encryptedDES(this.sf.value.newPassword));
        this.http.put(url).subscribe((res: any) => {
            if (res.code != 0) {
                this.message.error(res.msg);
            } else {
                // this.sf.reset();
                this.message.success('修改成功');
                this.modal.close();
            }

        }, (res: any) => {
            this.message.error('修改失败');
        });
    }

    checkPassword(value: string) {
        if (value == null) {
            return;
        }
        let length = this.passwordRules.minLength ? this.passwordRules.minLength : 8;
        if (value.length < length) {
            return [{ keyword: 'required', message: '密码长度必须大于' + length   }];
        }

        // if ((!/\d/.test(value) && this.passwordRules.number) && (!/[a-z]/.test(value) && this.passwordRules.alphabet) && (!/\W/.test(value) && this.passwordRules.specialCha)) {
        //     return [{ keyword: 'required', message: '密码必须包含数字、字母、特殊字符' }];
        // }

        if (!/\d/.test(value) && this.passwordRules.number) {
            return [{ keyword: 'required', message: '必须包含数字,大小写字母和特殊字符' }];
        }
        if ((!/[a-z]/.test(value) && this.passwordRules.alphabet)) {
            return [{ keyword: 'required', message: '必须包含数字,大小写字母和特殊字符' }];
        }
        if (!/[A-Z]/.test(value) && this.passwordRules.alphabet) {
            return [{ keyword: 'required', message: '必须包含数字,大小写字母和特殊字符' }];
        }
        if (!/\W/.test(value) && this.passwordRules.specialCha) {
            return [{ keyword: 'required', message: '必须包含数字,大小写字母和特殊字符' }];
        }
        let maxLength = this.passwordRules.maxLength ? this.passwordRules.maxLength : 16;
        if (value.length > maxLength) {
            return [{ keyword: 'required', message: '密码长度必须小于' + maxLength + '位' }];
        }
    }

    passwordRules: any = {}
    ngOnInit() {
        // console.log(environment, 'bbbb');
        this.passwordRules = environment["password"] ? environment["password"] : {};
        // console.log(this.passwordRules, 'aaaa');
    }
}
