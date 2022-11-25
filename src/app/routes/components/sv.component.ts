import {ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';

// import * as echarts from 'echarts';
import {_HttpClient} from "@delon/theme";
import {EventService} from "@shared/event/event.service";

@Component({
    selector: 'my-sv',
    template: `
        <sv-container [col]="svs.cols" class="my_sv_container" *ngFor="let svs of labels">
            <sv  class="statistics-view" [label]="statistic.label" type="{{statistic.type}}" *ngFor="let statistic of svs.svs" >
                <a href="javascript:void(0);" (click)="statisticSearch()"><span>{{enum[svs.key][statistic.key]}}</span></a></sv>
        </sv-container>
    `,
    styles:[`
        .statistics-view{
            border-style: outset;
            padding-left: 8px !important;
        }

        .sv-label{
            float: left;
        }

        .my_sv_container{
            padding-top: 10px;
            padding-left: 15px;
            padding-bottom: 5px;
        }
        .my_sv_container:last-child{
            padding-bottom: 10px;
        }
        :host ::ng-deep .sv__label{
            padding-bottom: 8px;
            padding-top: 8px;
        }

        :host ::ng-deep .sv__detail{
            padding-bottom: 8px;
            padding-top: 8px;
        }
    `]
})
export class SvComponent implements OnInit,OnDestroy {
    @Input()
    enum = {};
    @Input()
    labels = new Array();
    @Input()
    cols = 4;
    @Input()
    asyncData:string = "";
    constructor(
        protected http:_HttpClient,
        private eventService:EventService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {}

    searchDatas(_event,_this){
        if("svSearch" == _event.eventType && "" != _this.asyncData){
            console.log("svSearch:" + new Date());
            // _this.datas = {errorTotals:{error1:1,error2:2,error3:3,error4:4}};

            _this.http.get(_this.asyncData,JSON.stringify(_event.value)).subscribe((res:any)=>{
                if(res != null){
                    _this.enum = res;
                }else {
                    _this.enum = {};
                }
                _this.handleDatas();
                _this.changeDetectorRef.detectChanges();
            })

        }
    }
    eventServiceResult:any;
    ngOnInit(): void {
        this.eventServiceResult = this.eventService.subscribe(this.searchDatas,this);
        this.handleDatas();
    }

    statisticSearch(){

    }
    handleDatas(){
        if(this.labels != null && this.labels.length > 0){
            this.labels.forEach((value => {
                if(this.enum[value.key] == null){
                    this.enum[value.key] = {};
                }
            }))
        }
    }
    ngOnDestroy(){
        this.eventService.unsubscribe(this.eventServiceResult);
        if(this.eventServiceResult!=null) {
            this.eventServiceResult.unsubscribe();
        }
        this.eventServiceResult = null;
    }

}
