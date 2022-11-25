import { Component, ElementRef, OnInit, AfterViewInit, OnChanges, Input, AfterContentInit, OnDestroy } from "@angular/core";
import { PublishModalDetials } from "../../template/table-template/publish-modal-detials";
import {NzModalService} from "ng-zorro-antd";
import { STColumn, STColumnButton, STData } from "@delon/abc";
import {TableAddModalComponent} from "../../template/table-template/add.template";
import {WidgetService} from "../../service/widget.service";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";
import { CommonModalComponent } from "../commonModal";
import {NzMessageService} from "ng-zorro-antd";
import {Subscription} from "rxjs";

@Component({
  selector: "publish-list",   //发布历史列表控件
  template: `
        <div class="list_content" *ngIf="listConfig||dataList">
            <div class="detail">
                <div class="topper" [ngStyle]="listConfig.style.title">
                    <div class="title">{{listConfig.title.name}}</div>
                    <i nz-icon [nzType]="listConfig.title.icon" nzTheme="outline"></i>
                </div>
                <div class="list" [ngStyle]="listConfig.style.list">
                    <div class="noData" *ngIf="dataList&&dataList.length<1">暂无数据</div>
                    <div class="item" *ngFor="let listItem of dataList;let i=index" [ngStyle]="itemStyle(listItem)" (click)="handleItemClick(listItem,i)">
                        <div class="left" *ngIf="listItem['rowFlag']">
                            <div class="title" *ngFor="let config of listConfig.list">
                                <span [ngStyle]="listConfig.style?.label">{{config.label}}</span>
                                <span *ngIf="config['valueKey']!='createTime'&&config['valueKey']!='activeTime'">{{listItem[config['valueKey']]}}</span>
                                <span *ngIf="config['valueKey']=='createTime'||config['valueKey']=='activeTime'">{{listItem[config['valueKey']] | date:'yyyy-MM-dd HH:mm:ss'}}</span>
                            </div>
                            <!--<div *ngFor="let config of listConfig.list"><span>{{config.label}}</span> {{listItem[config['valueKey']]}}</div>-->
                        </div>
                        <!--<div class="right" *ngIf="listItem.iconFlag">-->
                            <!--<a nz-popconfirm [nzPopconfirmTitle]="listConfig.option.tips" (click)="$event.stopPropagation()" (nzOnConfirm)="confirm(i)" [nzIcon]="iconTpl">{{listConfig.option.name}}</a>-->
                            <!--<ng-template #iconTpl>-->
                                <!--<i nz-icon nzType="question-circle-o" style="color: red;"></i>-->
                            <!--</ng-template>-->
                        <!--</div>-->
                    </div>
                </div>
            </div>
        </div>
    `,
  styles: [`
    .noData{
        text-align: center;
        margin-top: 30px;
        color: #aaaaaa;
    }
        .list_content{
            width: 100%;
            height: 100%;
            overflow-y: auto;
            position: relative;
        }
        .detail {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 100%;
            z-index: 9;
            background: #ECECEC;
            display: flex;
            flex-direction: column;
        }
        .detail .topper{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;
            margin-bottom: 4px;
            font-size: 12px;
        }
        .detail .topper .title {
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            -ms-text-overflow: ellipsis;
            display: box;
            display: -webkit-box;
            line-clamp: 1;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
        .detail .topper .close{
            font-size: 18px;
            line-height: 18px;
            padding: 10px;
            color: #9e9c9c;
        }
        .detail .list {
            margin-left: 0px;
            margin-bottom: 0px;
            margin-top: 0;
            margin-right: 0;
            font-size: 12px;
            overflow-y: auto;
            height: 100%;
            flex: 1;
            background: #e6f7ff;
        }

        .detail .list .item {
            display: flex;
            justify-content: space-between;
            color: #36341e;
            padding: 12px 8px;
            cursor: pointer;
        }
        .detail .list .item .left{
            
        }
        .detail .list .item .left .title{
            overflow: hidden;
            text-overflow: ellipsis;
            -ms-text-overflow: ellipsis;
            display: box;
            display: -webkit-box;
            line-clamp: 1;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
        .detail .list .item span {
            padding-right: 4px;
        }

        .detail .list .item .right {
            font-weight: bold;
            color: #36341e;
            min-width: 34px;
            text-align: right;
        }
    .detail .list .item .right a{
        display: inline-block;
        padding-bottom: 10px;
    }
    .activeItem{
        background: #1890ff !important;
        color: #ffffff !important;
        border: 2px solid red;
    }
    `]
})
export class PublishListComponent implements OnInit, AfterContentInit, OnDestroy{
  userName = '信息发布';
  @Input() initData;  // 初始化数据
  ObjectKeys = Object.keys;
  publishHistory = false;
  rowFlag = [];
  dataList;
  listConfig;
  activeIndex = 0;
  id = '';
  versionId:string;
  listVersion:Subscription;
  pStatusVersion:Subscription;
  constructor(
    private modalSrv: NzModalService,
    private service: WidgetService,
    private http: _HttpClient,
    private msgService:NzMessageService
  ) {}
  ngOnInit() {
     this.id = this.initData.id;
     this.getConfig();
     this.pStatusVersion = this.service.publish_status.subscribe(res => {
       if(res==1){
         this.getInitData(this.service.list_version.value);
         this.service.sendPublishStatus(0);
       }
     });
     /*this.service.option.subscribe(res=>{
       debugger
       console.log(res);
     });*/
  }
  ngAfterContentInit() {
  }
  itemStyle(item) {  //获取行样式
    let style = this.listConfig.style['listItem'];
    style['background'] = this.listConfig['enums'][item.status]?this.listConfig['enums'][item.status]['color']:'';
    return style;
  }
  confirm(i) {
     let url = environment.atmcManageUrl+this.service.handleUrl(this.listConfig['option']['saveUri'],this.dataList[i]);
      this.http.post(url).subscribe(res => {
        if(res.code==0){
          this.msgService.success('取消成功！');
          this.getInitData(this.service.list_version.value);
        }
      });


  }
  getConfig() {
    // let url = environment.runtime_server_url + '/init/list/' + this.id;
    let url = environment.runtime_server_url + '/init/list/' + this.id;
    this.http.get(url).subscribe(res=>{
     // this.getInitData();
      res['option']['component'] = 'sf';
      this.listConfig = res;
      this.getInitData(res);
      this.listVersion = this.service.list_version.subscribe(res=>{
        if(res&&JSON.stringify(res)!='{}'&&this.versionId!=res['id']){
          this.versionId = res['id'];
          this.getInitData(res);
        }
      });
    });
  }

  getInitData(data) {
    //解释url并请求初始化列表数据
    let url = this.service.handleUrl(this.initData.initUri,data);
    this.http.get(environment.atmcManageUrl + url).subscribe(res => {
      //解释并执行配置文件的iif,控制内容的显示状态
      let rowIif = this.listConfig["iif"];
      let iconIif = this.listConfig.option['iif'];
       this.dataList = res.map(item=>{  // 格式化数据
         let iifCode = true;
         let iconCode = true;
         if (rowIif != null && rowIif != undefined){
           eval(rowIif);
         }
         if(iconIif != null && iconIif != undefined){
           eval(iconIif);
         }
         item['rowFlag'] = iifCode;  //控制行的显示状态
         item['iconFlag'] = iconCode; //控制功能按钮的显示状态
         return item;
       });
       console.log(this.dataList);
    });
  }
  handleClick(e, listItem) {
    e.stopPropagation();
    let option = this.listConfig.option;
    if (option.type=='confirm') {

    } else if(option.type=='edit') {
      let data = {
        id: listItem.id,
        component: option.component
      };
      this.showModal(data);
    }

    console.log(option.method, listItem);
  }
  handleItemClick(item, index) {
    console.log(this.listConfig)
    this.activeIndex = index;
    if (this.listConfig.click.type === 'edit') {
      item['page_id'] = this.listConfig.id;
      item['component'] = this.listConfig.click.component;
      item['readOnly'] = this.listConfig.click.readOnly;
      this.showModal(item);
    }
  }
  showModal(data) {
    const modal = this.modalSrv.create({
      //nzTitle: '菜单管理',
      nzContent: CommonModalComponent,
      nzComponentParams: {
        data: data
      },
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable:false,
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
    modal.afterClose.subscribe(() => {
      //this.getTableData(this.parentId);
    });
  }
  ngOnDestroy() {
    this.listVersion.unsubscribe();
    this.pStatusVersion.unsubscribe();
  }
}
