import {Component, Input, OnInit} from '@angular/core';
import {NzMessageService, NzModalRef} from "ng-zorro-antd";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";

@Component({
    selector: 'nz-demo-tabs-basic',
    template: `
    <nz-tabset>
      <nz-tab *ngFor="let tab of tabs" [nzTitle]="tab.title" (nzSelect)="select(tab)">
          <ng-template nz-tab>
              <my-sf [initUri]="tab.initUri" [buttonVisible]="tab.buttons" [formData]="tab.record"></my-sf>
          </ng-template>
      </nz-tab>
    </nz-tabset>
  `,
    styles:[
        `
            ::ng-deep .ant-tabs .modal-footer{
                margin: 0px;
            }
        `
    ]
})
export class FormTabsBasicComponent implements OnInit{
    @Input()
    record: any;
    options:any[];
    entityName: string = "";  //实体名
    modalId: string = "";  // 自定义json的文件名称
    initUri = "";           //数据初始化的uri
    saveUri = "";
    id:string = "";

    constructor(private modal: NzModalRef, private message: NzMessageService,protected http: _HttpClient) {

    }
    ngOnInit(){
        this.entityName = this.record.__entity;
        this.modalId = this.record.__modalId;
        this.options = this.record.__options;
        this.id = this.record.id;
        this.handleTabs();
        this.select(this.tabs[0]);
    }

    handleTabs(){
        console.log("tabs~~~~~~~~~~~~~~~~~")
        if(this.options!= null && this.options.length>0){
            let tabTemps:any[] = [];

            this.options.forEach((item,index)=>{
                let url = environment.runtime_server_url + '/table/customer/' + this.entityName + '?option=' + item.option;
                let tabTemp:any = {};
                tabTemp.title = item.name;
                tabTemp.initUri = url;
                tabTemp.record = this.record;
                if(item.buttons){
                    tabTemp.buttons = true;
                }else {
                    tabTemp.buttons = false;
                }
                tabTemps.push(tabTemp);

            })
            this.tabs = tabTemps;
        }
    }

    select(tab:any){
        // alert(tab.title);
    }
    tabs:any[]=[/*{
        title: "下拉框",
        schema: {
            properties: {
                status: {
                    type: 'string',
                    title: '状态',
                    enum: [
                        {label: '待支付', value: 'WAIT_BUYER_PAY'},
                        {label: '已支付', value: 'TRADE_SUCCESS'},
                        {label: '交易完成', value: 'TRADE_FINISHED'},
                    ],
                    default: 'WAIT_BUYER_PAY',
                    ui: {
                        widget: 'select',
                    },
                },
                // 标签
                tags: {
                    type: 'string',
                    title: '标签',
                    enum: [
                        {label: '待支付', value: 'WAIT_BUYER_PAY'},
                        {label: '已支付', value: 'TRADE_SUCCESS'},
                        {label: '交易完成', value: 'TRADE_FINISHED'},
                    ],
                    ui: {
                        widget: 'select',
                        mode: 'tags',
                    },
                    default: null,
                },
            }
        }
    },
    {
        title: "输入框",
        schema: {
            properties: {
                id1: { type: 'number', ui: { widget: 'text' } },
                id2: { type: 'number', ui: { widget: 'text', defaultText: 'default text' } }
            }
        }
    }*/]
}