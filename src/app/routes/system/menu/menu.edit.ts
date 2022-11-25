import { Component, Input, ViewChild } from '@angular/core';
import { NzModalRef, NzTreeNode, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFSchemaEnumType } from '@delon/form';
import { environment } from '@env/environment';
let TIMEOUT = null;
@Component({
    selector: `app-org-edit-modal`,
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
              <button nz-button type="submit" [nzLoading]="loading" (click)="save(sf.value)" [disabled]="!sf.valid" [ngClass]="{'keep':sf.valid}" >保存</button>
          </div>
      </div>
    <!--<div class="modal-header">-->
      <!--<div class="modal-title">编辑</div>-->
    <!--</div>-->
    <!--<sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none" >-->
      <!--<div class="modal-footer">-->
          <!--<button nz-button type="button" (click)="close()" class="closer">关闭</button>-->
          <!--<button nz-button type="submit" [nzLoading]="loading" (click)="save(sf.value)" [disabled]="!sf.valid" [ngClass]="{'keep':sf.valid}" >保存</button>-->
      <!--</div>-->
  <!--</sf>-->
  `,
    styles: [`
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
export class MenuEditModalComponent {
    loading = false;
    @Input()
    record: any;
    editSchema: any = {
        properties: {
            id: {
                type: 'string',
                title: '菜单id',
                maxLength: 36,
                readOnly: true
            },
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
                type: 'string',
                title: '上级菜单',
                maxLength: 36,
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
                maxLength: 120,
            },
            perms: {
                type: 'string',
                title: '权限标识',
                maxLength: 100,
            },
            icon: {
                type: 'string',
                title: '图标',
                maxLength: 50,
            },
            orderNum: {
                title: '排序',
                type: 'integer',
                maximum: 200,
            },
            status: {
                title: '状态',
                type: 'string',
                enum: [{ label: '正常', value: 1 }, { label: '隐藏', value: 0 }],
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
        ui: { grid: { span: 24 } },
        required: ['name', 'type', 'approveFlag', 'parentId', 'url', 'perms', 'icon', 'orderNum', 'status', 'method']
    };
    @ViewChild('sf', { static: false })
    sf: SFComponent;
    constructor(private modal: NzModalRef, protected http: _HttpClient, private message: NzMessageService) { }
    value: any;
    save(value: any) {
        this.loading = true;
        TIMEOUT = setTimeout(() => {
            this.loading = false;
            clearTimeout(TIMEOUT);
        }, 5000);
        this.http.put(environment.manage_server_url + '/sys/menus/' + value.id, value).subscribe((res: any) => {
            //弹窗保存成功
            this.message.success('保存成功');
            this.modal.close(true);
            this.close();
        }, (res: any) => {

        }, () => {
            this.loading = false;
            clearTimeout(TIMEOUT);
        });
    }
    close() {
        this.modal.destroy();
    }
    ngOnInit() {

    }
    ngAfterViewInit(): void {
    }
}
