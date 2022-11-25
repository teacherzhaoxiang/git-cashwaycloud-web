import {Component, Input, ViewChild} from '@angular/core';
import {NzModalRef, NzTreeNode,NzMessageService} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from '@delon/form';
import {environment} from '@env/environment';
@Component({
  selector: `app-dictonary-add-modal`,
  template: `
      <div class="edit_box" drag>
          <div class="topper">
              <div class="title">数据字典类型管理</div>
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
              <button nz-button type="button" (click)="close()" class="closeBtn">关闭</button>
              <button nz-button type="submit" (click)="save(sf.value)" [disabled]="!sf.valid" [ngClass]="sf.valid?'keep':''">保存</button>
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
export class DictonaryAddModalComponent {
  @Input()
  record: any;
  editSchema: any = {
      properties: {
          /*type: {type: 'string', title: '字典类型',
                ui: {
                    widget: 'select',
                    asyncData: () => this.http.get<SFSchemaEnumType[]>(environment.manage_server_url + '/sys/dictonarys/type')
                }
          },*/
          key: {type: 'string', title: '字典key', maxLength: 100, },
          value: {type: 'string', title: '字典值', maxLength: 100, },
          description: {type: 'string', title: '参数描述', maxLength: 100},

          /*          orderNum: {type: 'string', title: '顺序', maxLength: 50, },*/
          status: {
              type: 'string', title: '状态',
              ui: { widget: 'select'}, enum: [
                      {label: '启用', value: '0'},
                      {label: '停用', value: '1'},
                  ],
          },
          /*language: {
              type: 'string', title: '语言',
              ui: { widget: 'select'},
              enum: [
                  {label: '中文', value: 'CN'},
                  // {label: '英文', value: 'EN'},
              ],
          }*/
      },
      required: [ 'key', 'value','description',  'status'],
     // required: ['type', 'key', 'value', 'status', 'language'],

  };
  @ViewChild('sf', { static: false })
  sf: SFComponent;
  constructor(private modal: NzModalRef, protected http: _HttpClient,private message: NzMessageService) {}
  save(value: any) {
      this.http.post(environment.manage_server_url + '/sys/dictonarys', value).subscribe((res: any) => {
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
