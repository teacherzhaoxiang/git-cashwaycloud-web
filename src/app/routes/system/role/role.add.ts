import {Component, Input, ViewChild} from '@angular/core';
import {NzModalRef, NzTreeNode,NzMessageService} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from '@delon/form';
import {environment} from '@env/environment';
let TIMEOUT = null;
@Component({
  selector: `app-role-add-modal`,
  template: `
      <div class="edit_box" drag>
          <div class="topper">
              <div class="title">新增</div>
              <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
          </div>
          <div (mousedown)="$event.stopPropagation()">
              <div nz-row class="edit_content">
                  <nz-col nzSpan="24">
                      <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none" style="width: 100%;">
                      </sf>
                  </nz-col>
              </div>
          </div>
          <div class="modal-footer">
              <button class="btn" nz-button type="button" (click)="close()" class="closeBtn">关闭</button>
              <button nz-button [nzLoading]="loading" type="submit" (click)="save(sf.value)" [disabled]="!sf.valid" [ngClass]="{'keep':sf.valid}">保存</button>
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
        .edit_box .topper{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            font-size: 16px;
            border-bottom: 1px solid #ececec;
        }
        .edit_box .topper .closer{
            cursor: pointer;
        }
        .edit_box .edit_content{
            padding: 20px 40px;
            max-height: 600px;
            overflow-y: scroll;
        }
        .modal-footer{
            margin: 0;
            padding: 20px 24px;
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
export class RoleAddModalComponent {
    loading = false;
  @Input()
  record: any;
  roleOrgFlag:boolean = environment['roleOrgFlag'];
    roleManageFlag:boolean = environment['roleManageFlag'];
  editSchema: any = {
      properties: {
      roleName: {type: 'string', format: 'regex', pattern: '^[\u4e00-\u9fa5_a-zA-Z0-9]+$', title: '角色名称', maxLength: 50, },
      // orgId: {
      //     type: 'string',
      //     title: '所属机构',
      //     maxLength: 32,
      //     // ui: {
      //     //     widget: 'org-tree-cashway',
      //     //     layer:1
      //     // },
      //     ui: {
      //         widget: "select",
      //         asyncData: "/engine/rest/common/monitor_terminal_brand/selects",
      //         mate: {
      //             id: "value",
      //             name: "label"
      //         },
      //         params: "",
      //     }
      //   },

          //
          // status1: {
          //     type: 'string',
          //     title: '基本',
          //     enum: [
          //         { title: '待支付', key: 'WAIT_BUYER_PAY' },
          //         { title: '已支付', key: 'TRADE_SUCCESS' },
          //         { title: '交易完成1', key: 'TRADE_FINISHED1' },
          //         { title: '交易完成2', key: 'TRADE_FINISHED2' },
          //         { title: '交易完成3', key: 'TRADE_FINISHED3' },
          //         { title: '交易完成4', key: 'TRADE_FINISHED4' },
          //         { title: '交易完成5', key: 'TRADE_FINISHED5' },
          //         { title: '交易完成6', key: 'TRADE_FINISHED6' },
          //         { title: '交易完成7', key: 'TRADE_FINISHED7' },
          //         { title: '交易完成8', key: 'TRADE_FINISHED8' },
          //         { title: '交易完成9', key: 'TRADE_FINISHED9' },
          //         { title: '交易完成10', key: 'TRADE_FINISHED10' },
          //         { title: '交易完成11', key: 'TRADE_FINISHED11' },
          //         { title: '交易完成12', key: 'TRADE_FINISHED12' },
          //         { title: '交易完成13', key: 'TRADE_FINISHED13' },
          //         { title: '交易完成', key: 'TRADE_FINISHED14' },
          //         { title: '交易完成', key: 'TRADE_FINISHED15' },
          //         { title: '交易完成', key: 'TRADE_FINISHED16' },
          //         { title: '交易完成', key: 'TRADE_FINISHED17' },
          //         { title: '交易完成', key: 'TRADE_FINISHED18' },
          //
          //     ],
          //     default: 'WAIT_BUYER_PAY',
          //     ui: {
          //         widget: 'tree-select-cashway',
          //         dropdownStyle: { 'max-height': '300px' }
          //     },
          // },

      // status: {type: 'string', title: '角色状态', enum: [
      //         { label: '正常', value: 1 },
      //         { label: '失效', value: 0 }
      //     ], ui: {widget: 'select'}},
      manageFlag: {type: 'string', title: '管理员标识', enum: [
              { label: '是', value: "1" },
              { label: '否', value: "0" }
          ], ui: {widget: 'select'}},
        remark: {type: 'string', title: '备注', maxLength: 500, ui: {
                    widget: 'textarea',
                    autosize: { minRows: 2, maxRows: 6 }
                }},
      },
      required: ['roleName', 'orgId', 'status']
  };
  @ViewChild('sf', { static: false })
  sf: SFComponent;
  constructor( private modal:NzModalRef,protected http: _HttpClient,private message: NzMessageService) {}
  save(value: any) {
      if(this.roleManageFlag){
          value["_roleManageFlag"]=true;
      }
      this.loading = true;
      TIMEOUT = setTimeout(() => {
          this.loading = false;
          clearTimeout(TIMEOUT);
      }, 5000);
      this.http.post(environment.manage_server_url + '/sys/roles', value).subscribe((res: any) => {
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
    console.log(JSON.stringify(this.record));
    if(environment['projectName'] == 'xjnx'){
        delete this.editSchema.properties.manageFlag;
    }
    if(this.roleOrgFlag == false){
        delete this.editSchema.properties.orgId;
        this.editSchema.required = ['roleName', 'status'];
    }
  }
}
