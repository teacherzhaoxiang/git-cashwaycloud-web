import {Component, Input, ViewChild} from '@angular/core';
import {NzDrawerRef, NzTreeNode} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from '@delon/form';
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
export class OrgDetailDrawerComponent {
  // @Input()
  record: any;
  detailSchema: any = {
      properties: {
          name: {type: 'string', title: '机构名称', maxLength: 20, readOnly: true, },
          parentName: {
              type: 'string', title: '上级机构', maxLength: 36, readOnly: true,
              // ui: {
              //     widget: 'select',
              //     asyncData: () => this.http.get<SFSchemaEnumType[]>("")
              // },
          },
          code: {type: 'string', title: '机构编号', maxLength: 50, readOnly: true},
          address:{type: 'string',  title: '地址', readOnly: true, ui: {
                  widget: 'textarea',
                  autosize: { minRows: 2, maxRows: 6 }
              }},
          // contact:{type: 'string',  title: '联系人' ,readOnly: true},
          // phone:{type: 'string',  title: '联系电话', readOnly: true },
          // orderNum: {title: '排序', type: 'integer', maximum: 99, readOnly: true},
          status: { title: '状态', type: 'integer', readOnly: true,
              enum: [{label: '正常', value: 1}, {label: '失效', value: 0}],
              ui: {
                  widget: 'select'
              }},
         // author:{type:"string",title:"创建人id",readOnly:true},
          gmtCreated: {type: 'string', title: '创建时间', ui: { widget: 'date' }, readOnly: true},
          gmtModified: {type: 'string', title: '最后导入时间', ui: { widget: 'date' }, readOnly: true}
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
