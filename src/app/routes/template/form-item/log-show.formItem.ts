import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit, ChangeDetectorRef,
    Component,
    DoCheck, Injector,
    OnChanges,
    OnInit,
    SimpleChanges, ViewChild
} from '@angular/core';
import { ControlWidget } from '@delon/form';
import {NzCardComponent, NzCarouselComponent, NzTreeNode, NzTreeSelectComponent} from "ng-zorro-antd";
import {environment} from "@env/environment";
import {project} from '@env/environment.base';
import {_HttpClient} from "@delon/theme";

@Component({
    selector: 'log-show-formItem',
    template: `        
        <div class="container">
            <div class="search">
                <input type="text" class="searchInp" placeholder="搜索..."/>
                <i nz-icon nzType="search" class="icon" nzTheme="outline"></i>
            </div>
            <div class="details">
                <div>
                    设备编号：{{termNo}}
                </div>
                <div>
                    流水号：{{traceNo}}
                </div>
            </div>
            <div class="list">
                <div class="item" *ngFor="let item of this.value">
                    <div class="type marginR">[ {{item.type}}]</div>
                    <div class="logTime marginR blue">{{item.logTime}}</div>
                    <div class="nodeId marginR blue">{{item.nodeId}}</div>
                    <div class="nodeType marginR blue">{{item.nodeType}}</div>
                    <div class="message blue">
                        {{item.message}}
                    </div>
                    <div class="retCode marginR blue">{{item.retCode}}</div>
                </div>
            </div>
        </div>
        <!--<div *ngFor="let item of this.value" style="white-space: nowrap;">-->
               <!--<span  *ngFor="let key of objectKeys(item)">-->
                        <!--<font *ngIf="item[key]!=null && item[key]!='null'" style="color: #1a02fd;margin-right: 10px;">{{"["+item[key]+"]"}}</font>-->
               <!--</span>-->
        <!--</div>-->
           
        `,
    styles:[`    
        .details{
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            margin-top: 10px;
        }
        .search{
            border: 1px solid #ECECEC;
            padding: 0 8px;
            display: inline-block;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        .search .searchInp{
            outline: none;
            border: none;
            font-size: 14px;
        }
        .search .icon{
            font-size: 16px;
        }
        .list .item{
            display: flex;
            margin-bottom: 20px;
        }
        .marginR{
            margin-right: 8px;
            flex-shrink:0;
        }
        .list .item .type{
            color: red;
        }
        .logTime{
            font-size: 12px;
            line-height: 22px;
        }
        .message{
            line-height: 16px;
            overflow-y: auto;
            max-height: 140px;
            flex-shrink:1;
        }
        .blue{
            color: blue;
        }
    `]
})
export class LogShowFormItemWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'log-show';
    termNo = '';
    traceNo = '';
    objectKeys = Object.keys;
    constructor(protected http:_HttpClient,cd: ChangeDetectorRef, injector: Injector) {
        super(cd,injector);
    }
    ngOnInit(): void {
        this.detectChanges();
    }
    reset(value: any) {
        if (value) {
            for (let i = 0; i < value.length; i++) {
                value[i].logTime = this.getTime(value[i].logTime);
            }
            this.termNo = value[0].termNo;
            this.traceNo = value[0].traceNo;
        }

        this.detectChanges();

    }
    ngAfterViewInit():void{

    }
    getTime(timeStemp){
        const date = new Date(timeStemp);
        const year = date.getFullYear();
        let month: any = date.getMonth() + 1;
        let day: any = date.getDay();
        let hours: any = date.getHours();
        let minutes: any = date.getMinutes();
        let seconds: any = date.getSeconds();
        if ( month < 10 ) {
            month = '0' + month;
        }
        if ( day < 10 ) {
            day = '0' + day;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        const timeStr = '#' + year + '-' + month + '-' + day + ' ' + hours + ":" + minutes + ":" + seconds;
        return timeStr;
    }
}
