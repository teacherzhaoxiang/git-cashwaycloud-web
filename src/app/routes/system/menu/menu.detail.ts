import {Component, Input, ViewChild} from '@angular/core';
import {NzDrawerRef, NzTreeNode} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFRenderSchema, SFSchema, SFSchemaEnumType, SFUISchema} from '@delon/form';
import {environment} from '@env/environment';
@Component({
  selector: `app-org-detail-modal`,
  template: `
    <!--<div class="modal-header">-->
      <!--<div class="modal-title">{{record.__title}}</div>-->
    <!--</div>-->
    <sf #sf [schema]="detailSchema" [formData]="record" button="none" >
  </sf>`,
})
export class MenuDetailDrawerComponent {
  @Input()
  record: any;
  detailSchema: any = {
      properties: {
          id: {type: 'string', title: '菜单id', maxLength: 36, readOnly: true},
          name: {type: 'string', title: '菜单名称', maxLength: 36, readOnly: true},
          type: {type: 'string', title: '菜单类型', enum: [{label: '目录', value: 0}, {label: '菜单', value: 1}, {label: '按钮', value: 2}], readOnly: true},
          parentName: {
              type: 'string', title: '上级菜单', maxLength: 36,
              readOnly: true,
          },
          url: {type: 'string', title: 'url', maxLength: 100, readOnly: true,ui:{visibleIf:{type:value => value === 0||value === 1}}},
          perms: {type: 'string', title: '权限标识', maxLength: 100, readOnly: true,ui:{visibleIf:{type:value => value === 0||value === 1}}},
          icon: {type: 'string', title: '图标', maxLength: 50, readOnly: true,ui:{visibleIf:{type:value => value === 0||value === 1}}},
          approveFlag: {type: 'string', title: '审批标识',ui:{visibleIf:{type:value => value === 0||value === 1}},
              enum: [{label: '无需审批', value: 0}, {label: '同步审批', value: 1}, {label: '异步审批', value: 2}]},
          orderNum: {title: '排序', type: 'integer', maximum: 200, readOnly: true,ui:{visibleIf:{type:value => value === 0||value === 1}}},
          status: { title: '状态', type: 'string',ui:{visibleIf:{type:value => value === 0||value === 1}},
              enum: [{label: '正常', value: 1}, {label: '失效', value: 0}], readOnly: true},
          method: {type: 'string', title: '方法类型', maxLength: 36, readOnly: true,ui:{visibleIf:{type:value => value === 0||value === 1}}},
          author: {type: 'string', title: '创建人名称',
              ui: {
                  widget: 'select',
                  asyncData: () => this.http.get<SFSchemaEnumType[]>(environment.gateway_server_url + '/engine/rest/common/sys_user/selects?mate={id: "value",user_name: "label"}'),
              },
              readOnly: true
          },
          gmtCreated: {type: 'string', title: '创建时间', ui: { widget: 'date' }, readOnly: true},
          gmtModified: {type: 'string', title: '最后修改时间', ui: { widget: 'date' }, readOnly: true}
      },
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
  }
}
