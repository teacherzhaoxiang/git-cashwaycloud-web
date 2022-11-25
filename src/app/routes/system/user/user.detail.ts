import {Component, Input, ViewChild} from '@angular/core';
import {NzDrawerRef, NzTreeNode} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {FormProperty, SFComponent, SFSchema, SFSchemaEnumType} from '@delon/form';
import {environment} from '@env/environment';
@Component({
    selector: `app-user-detail-modal`,
    template: `
        <!--<div class="modal-header">-->
        <!--<div class="modal-title">{{record.__title}}</div>-->
        <!--</div>-->
        <sf #sf [schema]="detailSchema" [formData]="record" button="none" >
        </sf>`,
})
export class UserDetailDrawerComponent {
    @Input()
    record: any;
    multiFlag:boolean = false;
    detailSchema: any = {
        properties: {
            userName: {type: 'string', title: '操作员账号', maxLength: 36, minLength: 5, readOnly: true},
            contact: {type: 'string', title: '操作员名称', maxLength: 50, format: 'regex', pattern: '^[\u4e00-\u9fa5]{1,5}$', readOnly: true},
            orgId: {
                type: 'string',
                title: '所属机构',
                ui: {
                    widget: 'org-tree-cashway',
                    params:"/manage/sys/orgs/tree?"
                 //  layer:1
                },
                readOnly: true
            },
            role: {
                type: 'string',
                title: '角色',
                ui: {
                    widget: 'select',
                    mode: !this.multiFlag?'default':'tags',
                    maxMultipleCount: 1,
                    asyncData: () => this.http.get<SFSchemaEnumType[]>(environment.manage_server_url + '/sys/roles/listUserRole?perms=sys:user')
                },
                readOnly: true
            },
            defaultRoleId: {
                type: 'string',
                title: '默认角色',
                ui: {
                    widget: 'select',
                    asyncData: () => this.http.get<SFSchemaEnumType[]>(environment.manage_server_url + '/sys/roles/listUserRole?perms=sys:user'),
                    hidden: true
                },
            },
            email: {type: 'string', title: '邮箱', maxLength: 100,firstVisual:true,onlyVisual:true,
                ui: {
                    validator: (value: string,formProperty: FormProperty, form: any) => {
                        if(formProperty == null)return [];
                        console.log("11111122");
                        if(value == null || value =='')return [];
                        let reg=new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);

                        let flag =  reg.test(value);//检测字符串是否符合正则表达式
                        if(flag){
                            return []
                        }else{
                            return [{ keyword: 'required', message: '请输入正确的邮箱格式'}];
                        }
                    }
                }, readOnly: true},
            mobile: {type: 'string', title: '手机号码', maxLength: 100, format: 'mobile', readOnly: true },
          //  telephone: {type: 'string', title: '电话号码', maxLength: 16, readOnly: true },
            //fax: {type: 'string', title: '传真', maxLength: 32 , readOnly: true},
            remark: {type: 'string', title: '备注', maxLength: 500, ui: {widget: 'textarea', autosize: { minRows: 2, maxRows: 6 }}, readOnly: true},
        },
        required: ['userName', 'orgId', 'role', 'mobile'],
        ui: {
            spanLabel: 8,
            spanControl: 16,
            width: 380
        }

    };
    @ViewChild('sf', { static: false })
    sf: SFComponent;
    constructor(private ref: NzDrawerRef, protected http: _HttpClient) {}

    save(value: any) {
        console.log(JSON.stringify(value));
        this.ref.close(`new time: ${+new Date()}`);
        this.close();
    }

    close() {
        this.ref.close();
    }
    ngOnInit() {
        console.log(JSON.stringify(this.record));
        this.http.get(environment.manage_server_url + '/sys/users/' + this.record['id']).subscribe((res: any) => {
            this.record = res['rows'];
            if(!this.multiFlag){
                this.record["role"] = this.record["roleIdList"]?this.record["roleIdList"][0]:null;
            }else {
                this.record["role"] = this.record["roleIdList"];
            }
        });
    }
}
