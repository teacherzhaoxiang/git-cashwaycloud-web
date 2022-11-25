import {Component, Input, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {FormProperty, SFComponent, SFSchema, SFSchemaEnumType} from '@delon/form';
import {environment} from '@env/environment';
let TIMEOUT = null;
@Component({
  selector: `app-user-edit-modal`,
  template: `
      <div class="edit_box" drag>
          <div class="modal-header box_header" style="margin: 0">
              <div class="modal-title">编辑</div>
              <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
          </div>
          <div (mousedown)="$event.stopPropagation()">
              <div nz-row class="modal-content">
                  <nz-col nzSpan="24">
                      <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none">
                      </sf>
                  </nz-col>
              </div>

              <div class="modal-footer">
                  <button nz-button type="button" (click)="close()"  class="closeBtn">关闭</button>
                  <button nz-button type="submit" [nzLoading]="loading" (click)="save(sf.value)" [disabled]="!sf.valid" [ngClass]="sf.valid?'keep':''">保存</button>
              </div>
          </div>
      </div>
 `,
    styles:[`
        .edit_box{
            background: #FFFFFF;
            width: 800px;
            /*position: fixed !important;*/
            z-index: 999999999999;
            border-radius: 6px;
            /*margin-left: -400px;*/
            /*left: 50%;*/
        }
        .edit_box  .closer{
            cursor: pointer;
        }
        .edit_box .modal-content{
            padding: 20px 40px;
            max-height: 600px;
            overflow-y: scroll;
        }
        .modal-footer{
            margin: 0;
            padding: 20px 24px;
        }
        :host ::ng-deep sf-item{
            width: 100% !important;
        }
        .modal-footer .keep{
            background: #1890ff;
            color: #FFFFFF;
        }
        .closeBtn{
            border: 1px solid #1890ff;color: #1890ff
        }
        
    `]
})
export class UserEditModalComponent {
    loading = false;
  @Input()
  record: any;
  multiFlag:boolean = false;
    editSchema={properties: {}};
  editSchema2: any = {
      properties: {
          userName: {type: 'string', title: '操作员账号', maxLength: 36, minLength: 5,readOnly:true},
          contact: {type: 'string', title: '操作员名称', maxLength: 50, format: 'regex', pattern: '^[\u4e00-\u9fa5.\\·]{1,20}$'},
          orgId: {
              type: 'string',
              title: '所属机构',
              ui: {
                  widget: 'org-tree-cashway',
                  params:"/manage/sys/orgs/tree?"
              //    layer:1z
              },
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

              }},
          mobile: {type: 'string', title: '手机号码', maxLength: 100, format: 'mobile', },
         // wechatId: { type: 'string', title: '微信号', maxLength: 100, format:'regex',pattern:'^[a-zA-Z0-9\u4e00-\u9fa5]*$' },
          status: { title: '状态', type: 'string',enum: [{label: '禁用', value: 0}, {label: '启用', value: 1}], },

          //telephone: {type: 'string', title: '电话号码', maxLength: 16, },
         // fax: {type: 'string', title: '传真', maxLength: 32 },
          remark: {type: 'string', title: '备注', maxLength: 500, ui: {widget: 'textarea', autosize: { minRows: 2, maxRows: 6 }}},
      },
      required: ['userName', 'orgId', 'role', 'mobile','status']
  };
  @ViewChild('sf', { static: false })
  sf: SFComponent;
  constructor(private modal: NzModalRef, protected http: _HttpClient, private msg: NzMessageService) {}

  save(value: any) {
      this.loading = true;
      TIMEOUT = setTimeout(() => {
          this.loading = false;
          clearTimeout(TIMEOUT);
      }, 5000);
      // 辉哥说 把角色直接变成单选，然后不给默认角色选择, 银行一般不需要这种多角色的功能, 公司或者政府才会需要
      if(!this.multiFlag){
          value["roleIdList"] = [value.role];
      }else {
          value["roleIdList"] = value.role
      }

      this.sf.value.defaultRoleId = value.roleIdList[0];
      const defaultRoleId = this.sf.value.defaultRoleId;
      const roleIdList: string[] = value.roleIdList;
      let flag = false;
      for (const key in roleIdList) {
          if (roleIdList[key] == defaultRoleId) {
              flag = true;
              break;
          }
      }
      if (!flag) {
          this.msg.error('默认角色必须是角色项目的一项');
          return;
      }

      this.http.put(environment.manage_server_url + '/sys/users/' + value.id + '?defaultRoleId=' + defaultRoleId, value).subscribe((res: any) => {
          //弹窗保存成功
          this.msg.success('保存成功');
          this.modal.close(true);
          this.close();
      }, (res: any) => {

      },()=>{
          this.loading = false;
          clearTimeout(TIMEOUT);
      });
  }
  close() {
    this.modal.destroy();
  }
  ngOnInit() {
    console.log(JSON.stringify(this.record));
      // if(environment['hall-config']) {
      //     console.log("environment['hall-config']")
      //     this.editSchema.properties.contact = {type: 'string', title: '操作员名称', maxLength: 50, format: 'regex', pattern: '^[\u4e00-\u9fa5]{1,5}$'};
      // }
    this.http.get(environment.manage_server_url + '/sys/users/' + this.record['id']).subscribe((res: any) => {
            this.record = res['rows'];
            if(!this.multiFlag){
                this.record["role"] = this.record["roleIdList"]?this.record["roleIdList"][0]:null;
            }else {
                this.record["role"] = this.record["roleIdList"];
            }
            this.editSchema=this.editSchema2;
      });
  }
}
