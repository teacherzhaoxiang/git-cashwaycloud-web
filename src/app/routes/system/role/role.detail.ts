import {Component, Input, ViewChild} from '@angular/core';
import {NzDrawerRef, NzTreeNode} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from '@delon/form';
import {environment} from '@env/environment';
@Component({
  selector: `app-role-detail-modal`,
  template: `
    <!--<div class="modal-header">-->
      <!--<div class="modal-title">{{record.__title}}</div>-->
    <!--</div>-->
    <sf #sf [schema]="detailSchema" [formData]="record" button="none" >
  </sf>`,
})
export class RoleDetailDrawerComponent {
  @Input()
  record: any;
  roleOrgFlag:boolean = environment['roleOrgFlag'];
  detailSchema: any = {
      properties: {
          id: {type: 'string', title: '角色id', readOnly: true},
          // orgId: {
          //     type: 'string', title: '所属机构', maxLength: 36, readOnly: true,
          //     ui: {
          //         widget: 'select',
          //         asyncData: () => this.http.get<SFSchemaEnumType[]>(environment.manage_server_url + '/sys/orgs/list?perms=sys:user')
          //     },
          // },
          roleName: {type: 'string', title: '角色名称', maxLength: 50, readOnly: true},
          // status: {type: 'string', title: '角色状态', enum: [
          //         { label: '正常', value: 1 },
          //         { label: '失效', value: 0 }, ], ui: {widget: 'select', }, readOnly: true},
          manageFlag: {type: 'string', title: '管理员标识', enum: [
                  { label: '是', value: "1" },
                  { label: '否', value: "0" }
              ], ui: {widget: 'select'}, readOnly: true},
          remark: {type: 'string', title: '备注', maxLength: 500, readOnly: true, ui: {
                  widget: 'textarea',
                  autosize: { minRows: 2, maxRows: 6 }
              }},
          author: {type: 'string', title: '创建人名称',
              ui: {
                  widget: 'select',
                  asyncData: () => this.http.get<SFSchemaEnumType[]>(environment.gateway_server_url + '/engine/rest/common/sys_user/selects?mate={id: "value",user_name: "label"}'),
              },
              readOnly: true
          },
          gmtCreated: {type: 'string', title: '创建时间', ui: { widget: 'date' },readOnly: true},
          gmtModified: {type: 'string', title: '最后修改时间', ui: { widget: 'date' },readOnly: true}
      },
      required: ['roleName', 'status'],
      // required: ['roleName', 'orgId', 'status'],
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
      if(environment['projectName'] == 'xjnx'){
          delete this.detailSchema.properties.manageFlag;
      }
      if(this.roleOrgFlag == false){
          delete this.detailSchema.properties.orgId;
          this.detailSchema.required = ['roleName', 'status'];
      }
      this.http.get(environment.manage_server_url + '/sys/roles/' + this.record['id']).subscribe((res: any) => {
          this.record = res['rows'];
      });
  }
}
