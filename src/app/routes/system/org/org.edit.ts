import {Component, Input, ViewChild} from '@angular/core';
import {NzModalRef, NzTreeNode,NzMessageService} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from '@delon/form';
import {environment} from '@env/environment';
import * as  G2 from '@antv/g2';
@Component({
  selector: `app-org-edit-modal`,
  template: `
<!--    <div class="modal-header">
      <div class="modal-title">编辑</div>
    </div>-->
    <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none" >
      <div class="modal-footer">
          <button nz-button type="button" (click)="close()">关闭</button>
          <button nz-button type="submit" (click)="save(sf.value)" [disabled]="!sf.valid" >保存</button>
      </div>
  </sf>`,
})
export class OrgEditModalComponent {
  @Input()
  record: any;

  editSchema: any = {
      properties: {
        id: {type: 'string', title: '机构id', maxLength: 36, readOnly: true},
        name: {type: 'string', title: '机构名称', maxLength: 50, },
        parentId: {
            type: 'string', title: '上级机构', maxLength: 36,
            ui: {
                widget: 'org-tree-cashway'
            },
        },
        address: { type: 'string', title: '地址', maxLength: 100,},
        //phone: { type: 'string', title: '联系电话', maxLength: 100, },
        /*show:{ title: '类型', type: "string",
          enum: [{ label: "机构", value: 1 }, { label: "部门", value: 0 }],
        },*/
      
        code: {type: 'string', format: 'regex', pattern: '^[0-9a-zA-Z]{1,20}$', title: '机构编号', maxLength: 50, },
        // orderNum: {title: '排序', type: 'integer', maximum: 99},
        status: { title: '状态', type: 'string',
            enum: [{label: '正常', value: 1}, {label: '失效', value: 0}], },
      },
      required: ['name', 'parentId', 'code', 'orderNum', 'status',"show"]
  };
  @ViewChild('sf', { static: false })
  sf: SFComponent;
  constructor(private modal: NzModalRef, protected http: _HttpClient,private message: NzMessageService) {}
  save(value: any) {
      this.http.put(environment.manage_server_url + '/sys/orgs/' + value.id, value).subscribe((res: any) => {
          //弹窗保存成功
          this.message.success('保存成功');
          this.modal.close(true);
          this.close();
      }, (res: any) => {

      });
  }
  close() {
    this.modal.destroy();
  }
  ngOnInit() {
    console.log(JSON.stringify(this.record));
  }
}
