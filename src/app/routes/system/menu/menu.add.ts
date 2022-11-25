import { Component, Input, ViewChild } from '@angular/core';
import { NzModalRef, NzTreeNode, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFSchemaEnumType } from '@delon/form';
import { environment } from '@env/environment';
let TIMEOUT = null;
@Component({
    selector: `app-menu-add-modal`,
    template: `
      <div class="edit_box" drag>
          <div class="topper">
              <div class="title">菜单管理</div>
              <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
          </div>
          <div (mousedown)="$event.stopPropagation()">
              <div nz-row class="edit_content">
                  <nz-col nzSpan="24">
                      <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none" >
                      </sf>
                  </nz-col>
              </div>
          </div>
          <div class="modal-footer">
              <button nz-button type="button" (click)="close()"  class="closeBtn">关闭</button>
              <button nz-button [nzLoading]="loading" type="submit" (click)="save(sf.value)" [disabled]="!sf.valid" [ngClass]="{'keep':sf.valid}">保存</button>
          </div>
      </div>
  `,
    styles: [`
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
export class MenuAddModalComponent {
    loading = false;
    @Input()
    record: any;
    editSchema: any = {
        properties: {
            name: {
                type: 'string',
                title: '菜单名称',
                maxLength: 20
            },
            type: {
                type: 'string',
                title: '菜单类型',
                enum: [{ label: '目录', value: 0 }, { label: '菜单', value: 1 }, { label: '按钮', value: 2 }]
            },
            parentId: {
                type: 'string', title: '上级菜单', maxLength: 36,
                ui: {
                    widget: 'select',
                    asyncData: () => this.http.get<SFSchemaEnumType[]>(environment.manage_server_url + '/sys/menus/directorylist')
                },
            },
            approveFlag: {
                type: 'string',
                title: '审批标识',
                enum: [{ label: '无需审批', value: 0 }, { label: '同步审批', value: 1 }, { label: '异步审批', value: 2 }]
            },
            url: {
                type: 'string',
                title: 'url',
                maxLength: 100
            },
            perms: {
                type: 'string',
                title: '权限标识',
                maxLength: 100
            },
            icon: {
                type: 'string',
                title: '图标',
                maxLength: 50,
            },
            orderNum: {
                title: '排序',
                type: 'integer',
                maximum: 999,
            },
            status: {
                title: '状态',
                type: 'string',
                enum: [{ label: '正常', value: 1 }, { label: '失效', value: 0 }],
            },
            method: {
                type: 'string',
                title: '方法类型',
                maxLength: 36,
                enum: [
                    { label: 'GET', value: 'GET' },
                    { label: 'POST', value: 'POST' },
                    { label: 'PUT', value: 'PUT' },
                    { label: 'DELETE', value: 'DELETE' }
                ],
            },
        },
        ui: { grid: 24 },
        required: ['name', 'type', 'parentId', 'url', 'perms', 'icon', 'orderNum', 'status', 'method', 'approveFlag'],
    };
    @ViewChild('sf', { static: false })
    sf: SFComponent;
    constructor(private modal: NzModalRef, protected http: _HttpClient, private message: NzMessageService) { }

    save(value: any) {
        this.loading = true;
        TIMEOUT = setTimeout(() => {
            this.loading = false;
            clearTimeout(TIMEOUT);
        }, 5000);
        this.http.post(environment.manage_server_url + '/sys/menus', value).subscribe((res: any) => {
            //弹窗保存成功
            this.message.success('保存成功');
            this.modal.close(true);
            this.close();
        }, (res: any) => {
        }, () => {
            clearTimeout(TIMEOUT);
            this.loading = false;
        });
    }
    close() {
        this.modal.destroy();
    }
    ngOnInit() {
        console.log(JSON.stringify(this.record));
    }
}
