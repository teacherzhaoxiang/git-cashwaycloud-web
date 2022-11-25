import {Component, Input, ViewChild} from '@angular/core';
import {NzModalRef, NzTreeNode,NzMessageService} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from '@delon/form';
import {environment} from '@env/environment';
let TIMEOUT = null;
@Component({
  selector: `app-role-edit-modal`,
  template: `
      <div class="edit_box" drag>
          <div class="modal-header box_header" style="margin: 0">
              <div class="modal-title">编辑</div>
              <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
          </div>
          <div (mousedown)="$event.stopPropagation()">
              <div nz-row class="modal-content">
                  <nz-col nzSpan="24">
                      <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none" >
                      </sf>
                  </nz-col>
              </div>
          </div>
          <div class="modal-footer">
              <button nz-button type="button" (click)="close()" class="closeBtn">关闭</button>
              <button nz-button type="submit" [nzLoading]="loading" (click)="save(sf.value)" [disabled]="!sf.valid" [ngClass]="sf.valid?'keep':''">保存</button>
          </div>
      </div>
    `,
    styles:[`
        .edit_box{
            background: #FFFFFF;
            width: 800px;
            z-index: 999999999999;
            border-radius: 6px;
        }
        .edit_box .box_header{
            margin: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-footer{
            margin: 0;
        }
        .modal-content{
            padding: 16px;
            max-height: 600px;
            overflow-y: scroll;
        }
        .closer{
            cursor: pointer;
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
export class RoleEditModalComponent {
    loading = false;
  @Input()
  record: any;
  from:any;
  roleOrgFlag:boolean = environment['roleOrgFlag'];
    roleManageFlag:boolean = environment['roleManageFlag'];
  editSchema: any = {
      properties: {
        //id: {type: 'string', title: '角色id', maxLength: 36, readOnly: true},
        // orgId: {
        //     type: 'string',
        //     title: '所属机构',
        //     ui: {
        //         widget: 'org-tree-cashway',
        //         layer:1
        //         // asyncData:()=>this.http.get(environment.manage_server_url+"/sys/orgs/tree?perms=sys:org")
        //     },
        // },
        roleName: {type: 'string', title: '角色名称', maxLength: 50, },
          // status: {type: 'string', title: '角色状态', enum: [
          //         { label: '正常', value: 1 },
          //         { label: '失效', value: 0 }, ], ui: {widget: 'select', }},
      manageFlag: {type: 'string', title: '管理员标识', enum: [
              { label: '是', value: "1" },
              { label: '否', value: "0" }
          ], ui: {widget: 'select'}},
        remark: {type: 'string', title: '备注', maxLength: 500, ui: {
                    widget: 'textarea',
                    autosize: { minRows: 2, maxRows: 6 }
                }},
      },
      ui:{
          grid: {
              span: 24
          }
      },
      required: ['roleName', 'orgId', 'status']
  };
  @ViewChild('sf', { static: false })
  sf: SFComponent;
  constructor(private modal: NzModalRef, protected http: _HttpClient,private message: NzMessageService) {}
  save(value: any) {
      if(this.roleManageFlag){
          value["_roleManageFlag"]=true;
      }
      this.loading = true;
      TIMEOUT = setTimeout(() => {
          this.loading = false;
          clearTimeout(TIMEOUT);
      }, 5000);
      this.http.put(environment.manage_server_url + '/sys/roles/' + value.id, value).subscribe((res: any) => {
          //弹窗保存成功
          this.message.success('保存成功');
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
      this.from = ''
      console.log(this.record)
      this.from = this.record.from
      if(environment['projectName'] == 'xjnx'){
          delete this.editSchema.properties.manageFlag;
      }
      if(this.roleOrgFlag == false){
          delete this.editSchema.properties.orgId;
          this.editSchema.required = ['roleName', 'status'];
      }
      console.log('role');
      this.http.get(environment.manage_server_url + '/sys/roles/' + this.record['id']).subscribe((res: any) => {
          this.record = res['rows'];
      });
      console.log(this.from)
      if(this.from=='详情'){
          for(let key in this.editSchema.properties){
              this.editSchema.properties[key].readOnly = true
          }
      }
      console.log(this.record)
  }
}
