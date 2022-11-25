import {Component, Input, ViewChild} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
import {getData} from "@delon/form/src/utils";
import {STColumn, STColumnButton, STComponent, STData} from "@delon/abc";
import {NzModalRef} from "ng-zorro-antd";

/**
 * 上面是表格,下面是输入框
 * 表格现在默认用上级表格
 * 下级输入框自定义
 */
@Component({
    selector: `app-customer-modal`,
    template: `
        <div class="edit_box" drag>
            <div class="modal-header box_header" style="margin: 0">
                <div class="modal-title">{{name}}</div>
                <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
            </div>
            <div (mousedown)="$event.stopPropagation()">
                <div nz-row class="modal-content">
                    <nz-col nzSpan="24">
                        <st #st [data]="tableData" [columns]="tableColumn" [req]="{params: params}"></st>
                    </nz-col>
                </div>
            </div>
            <div class="modal-footer">
                <button nz-button type="button" (click)="close()" class="closeBtn">关闭</button>
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
export class PublishModalDetials {
    @Input()
    record:any;
    params = '';
    name: any = "";
    id: string = "";
  tableColumn = [
    { title: '设备号', index: 'device_num', width: '20%' },
    { title: '升级时间', index: 'time', width: '20%' },
    { title: '下发状态', index: 'status', width: '20%' },
    { title: '操作', index: 'options', width: '20%' }
  ];
  tableData = [
    {
      'device_num': '721362187312',
      'time': '2020/04/27 11:33:29',
      'status': '成功',
      'options': '/'
    },
    {
      'device_num': '721362187312',
      'time': '2020/04/27 11:33:29',
      'status': '成功',
      'options': '/'
    },
    {
      'device_num': '721362187312',
      'time': '2020/04/27 11:33:29',
      'status': '成功',
      'options': '/'
    },
    {
      'device_num': '721362187312',
      'time': '2020/04/27 11:33:29',
      'status': '成功',
      'options': '/'
    },
    {
      'device_num': '721362187312',
      'time': '2020/04/27 11:33:29',
      'status': '成功',
      'options': '/'
    },
    {
      'device_num': '721362187312',
      'time': '2020/04/27 11:33:29',
      'status': '成功',
      'options': '/'
    }
  ]
  constructor(private modal: NzModalRef ) {
  }
    ngOnInit() {
        console.log(JSON.stringify(this.record));
        this.id = this.record.id;
        this.name = this.record.name;
    }

    close() {
        this.modal.destroy();
    }
}
