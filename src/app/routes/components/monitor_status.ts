import { Component, OnInit, Input, OnChanges,Output, EventEmitter } from '@angular/core';
import {_HttpClient} from '@delon/theme';
@Component({
    selector: 'monitor_status',
    template: `
        <div class="list" *ngIf="monitorData.length>0">
            <div class="item"  *ngFor="let item of monitorData" (click)="send(item)">
                <div class="box">
                    <div class="flex">
                        <div class="icon" title="模块状态"><img [src]="'../../../assets/images/module_status'+item.modules_status+'.png'" /></div>
                        <div class="icon" title="资源状态"><img [src]="'../../../assets/images/resource_status'+item.resource_status+'.png'" /></div>
                    </div>
                    <div class="flex">
                        <div class="icon" title="通讯状态"><img [src]="'../../../assets/images/communication_status'+item.communication_status+'.png'" /></div>
                        <div class="icon" title="钞箱状态"><img [src]="'../../../assets/images/cash_box_status'+(item.cash_box_status=='0'||item.cash_box_status=='9'?'0':'1')+'.png'" /></div>
                    </div>
                    <div class="center_icon {{'statu'+ item.term_status}}" title="整机运行状态"></div>
                </div>
                <div>{{item.term_no}}</div>
            </div>
        </div>
    `,
    styles: [`       
        .statu0{
            /*正常*/
            background: green;
        }
        .statu1{
            /*暂停服务*/
            background: red;
        }
        .statu2{
            /*设备维护*/
            background: orange;
        }
        .statu3{
            /*离线*/
            background: blue; 
        }
        .statu4{
            /*资源预警*/
            background: yellow;
        }
        .statu5{
            /*未知*/
            background: blue;
        }
        .list{
            display: flex;
            flex-wrap: wrap;
            margin: 20px 0;
        }
        .list .item{
            margin-right: 10px;
            margin-bottom: 10px;
            font-size: 10px;
            text-align: center;
        }
        .list .item .box{
            background: #eae5e5;
            width: 62px;
            height: 62px;
            border-radius: 4px;
            position: relative;
            margin-bottom: 2px;
        }
        .list .item .box .icon{
            width: 30px;
            height: 30px;
            box-sizing: border-box;
            padding: 1px;
        }
        .list .item .box .icon img{
            width: 100%;
            height: 100%;
        }
        .list .item .box .center_icon{
            position: absolute;
            left: 22px;
            top: 22px;
            width: 16px;
            height: 16px;
            border-radius: 4px;
            box-shadow: 0 0 6px -3px;
            border: 1px solid #ececec;
        }
        .list .item .box .flex{
            display: flex;
        }
    `]
})
export class MonitorStatusComponent implements OnInit, OnChanges {
    @Input() monitorData:any;
    @Output() showDetails = new EventEmitter();
    ngOnInit() {

    }
    send(item){
        this.showDetails.emit(item);
    }
    ngOnChanges(changes) {
        if (changes['monitorData'] !== undefined) {
            this.monitorData = changes['monitorData'].currentValue;

        }
    }

}
