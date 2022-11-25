import {ChangeDetectorRef, Component, Injector, Input, OnInit} from '@angular/core';
import {ControlWidget, SFComponent, SFItemComponent} from '@delon/form';
import {TableAddModalComponent} from "../table-template/add.template";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {TerminalCheckTransferCustomItemComponent} from "../../components/terminal-table/terminal.table";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";
import {HttpClient} from "@angular/common/http";
import {ScreenCheckTransferCustomItemComponent} from "../../components/screen-table/screen.table";

@Component({
    selector: 'sf-terminal-check',
    template: `
  <sf-item-wrap nz-col nzSpan="24" style="display: inherit;justify-content: space-between;" [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
    <!-- 开始自定义控件区域 -->
      <div nz-row style="position: relative;z-index: 10">
          <!--<input  [ngModel]="value" (ngModelChange)="change($event)"/>-->
          <!--<label>{{label}}</label>-->
          <div *ngIf="showModel == 'tag'" nz-col nzSpan="24">
              <button title="{{title}}" 
                      [ngStyle]="{'display':showFlag}" class="ant-btn equipment">{{label}}</button>
              <button title="{{title}}" [ngStyle]="{'display':multiFlag}" class="ant-btn" style="color: black;border-color: #f5f7fa;background-color: #d9d9d9">...</button>
          </div>
          <button *ngIf="!readOnlyFlag" (click)="getCheckTerminal()" class="ant-btn" style="position: relative;color: black;border-color: #f5f7fa;background-color:#00a0e9;height: 24px;line-height:20px;padding: 0 2px;">
              <span>选择屏幕</span>
          </button>
          <div *ngIf="showModel == 'list'">
              <ul class="termListUl">
                  <li *ngFor="let item of selectedItemList" class="termListLi">
                      <span>{{item.title}}</span>
                  </li>
              </ul>
          </div>
          
      </div>
    <!-- 结束自定义控件区域 -->
  </sf-item-wrap>`,
    styles:[
        `
            .equipment{
                color: black;
                border-color: #f5f7fa;
                background-color: #d9d9d9;
                white-space: inherit;
                height: auto;
                text-align: left;
            }
            .termListUl {
                max-height: 100px;
                overscroll-behavior-y: auto;
                overflow: auto;
            }
            :host ::ng-deep .ant-btn{
                margin: 0;
            }
            :host ::ng-deep .ant-form-item{
                width: 100%;
            }
            .termListLi {
                height: 25px;
            }
        `
    ]
})
export class ScreenCheckFormItemWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'screen-check';
    data:any[] = [];
    dataType:any;
    resultParam:any;
    showFlag:string = "none";
    multiFlag:string = "none";
    singleCheck:boolean = false;
    label:any = "..."
    title = "";
    initDataMap:any = {};
    selectedItemList:any[] = [];
    showModel:string ;
    readOnlyFlag:boolean = false;
    dataUrl:string;
    typeKey:any;
    sfCompNew: SFComponent;
    typeTypeOld:string;
    ngOnInit(): void {
        console.log("TerminalCheckFormItemWidget ngOnInit");
        this.dataType = this.ui.dataType?this.ui.dataType:"string";
        this.resultParam = this.ui.resultParam?this.ui.resultParam:"id";
        this.showModel = this.ui.showModel?this.ui.showModel:"list";
        this.singleCheck = this.ui.singleCheck?this.ui.singleCheck:false;
        this.readOnlyFlag = this.schema.readOnly;
        this.dataUrl = this.ui.dataUrl;
        this.typeKey = this.ui.typeKey;
        this.getData();
    }
    ngAfterViewInit():void{

    }
    // reset 可以更好的解决表单重置过程中所需要的新数据问题
    reset(value: any) {
        console.log("TerminalCheckFormItemWidget reset:", JSON.stringify(value))
        this.data = value;
        this.handleDataResult();
    }

    constructor(sfComp: SFComponent,private message: NzMessageService,private http: _HttpClient,private modalSrv: NzModalService,cd: ChangeDetectorRef, injector: Injector) {
        super(cd,injector);
        this.sfCompNew =sfComp;
    };

    getCheckTerminal(){
        let typeTypeValue = null;
        if(this.typeKey!=null){
            if(this.sfCompNew.getValue("/"+[this.typeKey]) == null){
                this.message.error("请选择设备归类");
                return;
            }
            if(this.typeTypeOld == null){
                this.typeTypeOld = this.sfCompNew.getValue("/"+[this.typeKey]);
            }else if(this.typeTypeOld != this.sfCompNew.getValue("/"+[this.typeKey])){
                this.data = [];
            }
            typeTypeValue = this.sfCompNew.getValue("/"+[this.typeKey]);
        }

        const modal = this.modalSrv.create({
            //nzTitle: '选取屏幕',
            nzContent: ScreenCheckTransferCustomItemComponent,
            nzWidth:800,
            nzClosable:false,
            nzComponentParams:{
                selectedList:this.data?this.data:[],
                dataType:this.dataType,
                resultParam:this.resultParam,
                singleCheck:this.singleCheck,
                dataUrl:this.dataUrl,
                typeType:typeTypeValue
            },
            nzKeyboard:this.schema['download']?this.schema['download']:false,
            nzFooter:null,
            nzBodyStyle:{
                "width":"0px",
                "background":"rgba(0,0,0,0)",
                "position":"fixed",
                "left":"50%",
                "margin-left":"-400px",
                "top":"50%",
                "transform":"translateY(-50%)"
            }
        });
        modal.afterClose.subscribe((result:any[])=>{
            if(this.singleCheck){
                if(result.length != 1 ){
                    alert("请选择一台屏幕");
                }else {
                    this.setValue(result[0]);
                    this.data = result;
                    this.handleDataResult();
                }
            }else {
                this.setValue(result);
                this.data = result;
                this.handleDataResult();
            }
        })
    }

    handleDataResult(){
        let selectedItemListTmp:any[] = [];
        let label = "";
        if(this.data !=null && this.data.length>0){
            let title = "";
            this.data.forEach((item,index)=>{
                let itemValue = "";
                if(this.dataType == 'string'){
                    itemValue = item;
                }else {
                    itemValue = item[this.resultParam];
                }
                let item1 = this.initDataMap[itemValue];
                if(item1 != null){
                    title += item1["title"]+",";
                    if(index == 0){
                        label = item1["title"];
                    }
                    selectedItemListTmp.push(item1);
                }
            })
            if(title.length > 0 ){
                this.title = title.substr(0,title.length - 1);
            }
            this.selectedItemList = selectedItemListTmp;
            this.showFlag = "inline";
        }else {
            this.showFlag = "none";
        }
        if(this.data !=null && this.data.length > 1){
            this.multiFlag = "inline";
        }else {
            this.multiFlag = "none";
        }
        this.label = label;
        this.detectChanges();
        console.log(this.selectedItemList);
        console.log(this.data);
    }
    change(value: string) {

    }
    // 动、静选择框的数据列表
    getData(){
        let url = "";
        let sendParams = {};
        if(this.dataUrl == null || this.dataUrl == undefined){
            url = "/cis/busi/monitorTerminalManage?params={}";
        }else{
            url = this.dataUrl.split("?")[0];
            if(this.dataUrl.split("?").length==2){
                let params = this.dataUrl.split("?")[1];
                let paramsValue = params.substr(7,params.length);
                sendParams= {params:paramsValue?JSON.stringify(JSON.parse(paramsValue)):{}}
            }
        }
        this.http.get(environment.gateway_server_url+url,sendParams).subscribe((res:any)=>{
            this.putInitDataMap(res);
        })
    }

    putInitDataMap(list:any[]){
        list.forEach((item,index)=>{
            if(item[this.resultParam]!=null){
                this.initDataMap[item[this.resultParam]] = item;
            }
        })
        this.handleDataResult();
    }
}
