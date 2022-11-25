import {
    Component,
    ChangeDetectionStrategy,
    OnInit,
    ChangeDetectorRef,
    ViewChild,
    ElementRef,
    AfterViewInit
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { zip } from 'rxjs';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {FormProperty, SFComponent} from "@delon/form";
import {environment} from "@env/environment";
import {UserService} from "../../../../service/user.service";

@Component({
  selector: 'my-account-settings-base',
  template: `
      <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none" style="width: 100%">
          <div class="modal-footer" style="width: 100%">
              <button nz-button id="reset" type="button" (click)="this.sf.reset()">重置</button>
              <button nz-button type="submit" (click)="save(sf.value)" [disabled]="!sf.valid" >保存</button>
          </div>
      </sf>
  `,
    styles:[`
        :host ::ng-deep .modal-footer{
            width: 100%;
            padding: 24px 0;
            margin: 0;
        }
    `]
})
export class UserSettingComponent implements OnInit {
    record:any;
    userId:string = "";
    editSchema:any = {
        properties:{
            roleName:{type: 'string', title: '角色',maxLength: 50,ui:{ spanLabel:3,spanControl:21},readOnly: true},
            orgName:{type: 'string', title: '机构',maxLength: 50,ui:{ spanLabel:3,spanControl:21},readOnly: true},
            contact: {type: 'string', title: '联系人', maxLength: 50, format: 'regex', pattern: '^[\u4e00-\u9fa5]{1,5}$',
                ui:{ spanLabel:3,spanControl:21}},
            email: {type: 'string', title: '邮箱', maxLength: 100,firstVisual:true,onlyVisual:true,
                ui: {
                    spanLabel:3,
                    spanControl:21,
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

                }},
            mobile: {type: 'string', title: '手机号码', maxLength: 100, format: 'mobile',ui:{ spanLabel:3,spanControl:21} },
            telephone: {type: 'string', title: '电话号码', maxLength: 16,ui:{ spanLabel:3,spanControl:21} },
            fax: {type: 'string', title: '传真', maxLength: 32, ui:{ spanLabel:3,spanControl:21}},
            remark: {type: 'string', title: '备注', maxLength: 500, ui: {
                    spanLabel:3,
                    spanControl:21,
                    widget: 'textarea',
                    autosize: { minRows: 2, maxRows: 6 }
                }},
        },
        required:["oldPassword","newPassword","confirmPassword"],
        ui:{
            grid:{
                span:24
            }
        }
    };
    @ViewChild('sf',{ static: false })
    sf:SFComponent;
    constructor(protected http: _HttpClient, private msg: NzMessageService,private userService:UserService,private ref:ElementRef) {}
    ngOnInit(): void {
        this.userId = this.userService.user.id;
        //console.log(JSON.stringify(this.record));
        this.http.get(environment.manage_server_url + '/sys/users/' + this.userId).subscribe((res: any) => {
            this.record = res['rows'];
            console.log(this.record,'数据')
            this.ref.nativeElement.querySelector("#reset").click();
            //console.log(this.record);
        });
    }
    save(data:any) {
        delete data['roleName'];
        delete data['orgName'];
        this.http.put(environment.manage_server_url + '/sys/users/' + this.userId, data).subscribe((res: any) => {
            this.msg.success("修改成功");
        }, (res: any) => {
            this.msg.success("修改失败");
        });
    }
}
