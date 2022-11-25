import {EventService} from "@shared/event/event.service";
import {Component, Input, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import { environment } from "@env/environment";

let TIMEOUT = null;
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
                        <sf #sf mode="edit" [schema]="editSchema" [formData]="data" button="none">
                        </sf>
                    </nz-col>
                </div>
            </div>
            <div class="modal-footer">
                <button nz-button type="button" (click)="close()" class="closeBtn">关闭</button>
                <button nz-button type="submit" (click)="save(sf.value)" >保存</button>
            </div>
        </div>
    `,
    styles:[
        `

            :host ::ng-deep .red > sf-item-wrap > .ant-form-item>.ant-form-item-label>label{
                color:red;
            }
            :host ::ng-deep .yellow > sf-item-wrap > .ant-form-item>.ant-form-item-label>label{
                color:yellow;
            }
            :host ::ng-deep .blue > sf-item-wrap > .ant-form-item>.ant-form-item-label>label{
                color:blue;
            }
            
            :host ::ng-deep  .ant-table table{
                table-layout: fixed;
                width: 100%;
                text-align: left;
                border-radius: 4px 4px 0 0;
                border-collapse: separate;
                border-spacing: 0;
            }
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
            .modal-footer .keep{
                background: #1890ff;
                color: #FFFFFF;
            }
            .closeBtn{
                border: 1px solid #1890ff;color: #1890ff
            }
`]
})
export class EditTableModalTemplate {
    @Input()
    record: any;
    data:any = {};
    tableKey:any;
    editSchema: any = {properties: {}};
    @ViewChild('sf',{ static: false })
    sf: SFComponent;
    name: any = "新窗口";
    constructor(private modal: NzModalRef) {

    }

    save(params: any) {
        this.modal.close(this.sf.value["tableEdit"]);
    }


    getForm() {
        this.editSchema = {properties: {
                tableEdit:
                    {
                        type: 'string',
                        title: '配置',
                        ui: {
                            widget: "edit-table",
                            tableKey: this.tableKey
                        },
                    }
            }
        };
    }

    close() {
        this.modal.close(false);
    }

    ngOnInit() {
        console.log(JSON.stringify(this.record));
        //debugger;
        this.tableKey = this.record.tableKey;
        let data = {};
        data['tableEdit'] = this.record.data;
        this.data = data;
        this.getForm();
    }
}
