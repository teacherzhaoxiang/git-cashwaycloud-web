import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from "@angular/core";
import { NzContextMenuService, NzDropdownMenuComponent } from "ng-zorro-antd/dropdown";
import { NzFormatEmitEvent, NzTreeNode } from "ng-zorro-antd/core";
import {environment} from "@env/environment";
import {_HttpClient} from "@delon/theme";
import { NzModalService } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd/message';
import {WidgetService} from "../../service/widget.service";
import {CommonModalComponent} from "../commonModal";
import {Subscription} from "rxjs";

@Component({
    selector: "app-version-list",
    template: `      
        <div class="topper" *ngIf="config">
            <span class="title">{{config.title?.name}}</span>
            <i style="font-size: 16px;padding: 10px;" nz-icon [nzType]="config.title?.icon" nzTheme="outline" (click)="add()"></i>
        </div>
        <div class="list" *ngIf="nodes" [ngStyle]="config.style?.list">
            <div *ngFor="let item of nodes"  class="item" [ngStyle]="activedNode[config['idKey']]==item[config['idKey']]?config.style?.active:config.style?.listItem||{}"  (click)="selectNode(item)">
                <span class="left">{{item[config['valueKey']]}}</span>
                <div class="right">
                    <a class="icon" nz-icon [nzType]="config['option']['delete']['icon']" nzTheme="outline" *ngIf="item.deleteFlag"
                       (click)="$event.stopPropagation()"
                       nz-popconfirm
                       nzPopconfirmTitle="确定删除?"
                       nzPopconfirmPlacement="bottom"
                       (nzOnConfirm)="confirm(item)"
                       (nzOnCancel)="cancel()"
                    ></a>
                    <i class="icon" nz-icon [nzType]="config['option']['copy']['icon']" nzTheme="outline" (click)="copy($event,item)" *ngIf="item.iconFlag"></i>
                </div>
            </div>
        </div>
    `,
    styles: [`
      .item{
          height: 40px;
          line-height: 40px;
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          align-items: center;
          cursor: pointer;
          border-bottom: 2px solid #ffffff;
      }
      .item .left{
          flex: 1;
          display: inline-block;
          white-space: nowrap;
          width: 100%;
          overflow: hidden;
          text-overflow:ellipsis;
      }
      .item .right{
          width: 50px;
          overflow: hidden;
      }
      .item .right .icon{
          width: 50%;
          text-align: center;
          padding: 10px 0;
      }
      .activeItem{
          background: #1890ff;
          color: #fff;
      }
      .topper{
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 10px;
          padding-right: 16px;
          border-bottom: 4px solid #ececec;
      }
      .topper .title{
          display: inline-block;
          white-space: nowrap;
          width: 100%;
          overflow: hidden;
          text-overflow:ellipsis;
      }
      .setVersion{
          display: flex;
          align-items: center;
      }
      .setVersion input{
          flex: 1;
      }
        /*:host ::ng-deep .ant-card-body{
            width: 100%;
            padding: 0;
        }
        :host ::ng-deep .custom-node[_ngcontent-kbi-c9]{
            line-height: 30px;
        }
        .topper{
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 10px;
            padding-right: 16px;
            border-bottom: 4px solid #ececec;
        }
        .topper .title{
            
        }
        .setVersion{
            display: flex;
            align-items: center;
        }
        .setVersion input{
            flex: 1;
        }
        :host ::ng-deep .ant-tree {
            overflow: hidden;
            margin: 0 -24px;
            padding: 0 24px;
        }

        :host ::ng-deep .ant-tree li {
            position: relative;
            padding: 0;
            border-bottom: 1px solid #ececec;
            user-select: none;
        }

        .custom-node {
            width: 100%;
            cursor: pointer;
            line-height: 40px;
            display: inline-block;
            margin-left: -18px;
            height: 40px;
        }

        .active {
            background: #1890ff;
            color: #fff;
            height: 40px;
            line-height: 40px;
        }
        .custom-node .icon{
            position: absolute;
            right: 26px;
            top: 0;
            padding: 0 10px;
            height: 40px;
            line-height: 40px;
        }
        
       .folder-name .title,.file-name .title{
            width: 100%;
            display: inline-block;
            overflow: hidden;
           padding-left: 10px;
           white-space: nowrap;
           text-overflow: ellipsis;
        }
        .file-name,
         .folder-name {
            display: block;
             margin-right: 50px;
         }

        .file-desc,
        .folder-desc {
            padding: 0 8px;
            display: inline-block;
            background: #87ceff;
            color: #ffffff;
            position: relative;
            left: 12px;
        }*/
    `]
})
export class VersionListComponent implements OnInit, OnDestroy{
    constructor(
        private nzContextMenuService: NzContextMenuService,
        private modalSrv: NzModalService,
        private message: NzMessageService,
        private service: WidgetService,
        private http: _HttpClient
    ) {}
  @Input() initData;  // 初始化数据
  activedNode: {}; //当前选中数据
    // congfig:any = {
    //     dataUri:'',
    //     titleTemplate:'{{label}}',
    //     popTemplate:'{{label}}|{{key}}',
    //     key: '{{key}}'
    // }
   config: {};  // 组件配置参数
   nodes: []; // 列表数据
   softType:string;
   deleteVersion;
   tabVersion:Subscription;
  selectNode(node): void {
        this.activedNode = node;
        this.service.sendListVersion(node);
    }
    ngOnInit() {
    this.getConfig((res) => {
      this.config = res;
      this.tabVersion = this.service.tab_menu.subscribe(tab => {
        if(JSON.stringify(tab)!=='{}'&&this.softType!=tab['softType']){
          this.softType = tab['softType'];
          this.nodes = [];
          this.getInitData();
        }
        console.log(tab);
      });
    });
    }
    getConfig(callBack) {
      let url = environment.runtime_server_url + '/init/list/' + this.initData.id;
      this.http.get(url).subscribe(res => {
        callBack(res);
        console.log(res);
      });
    }
    getInitData() {  //获取列表数据
      let url = this.service.handleUrl(this.initData.initUri,{...this.service.tab_menu['value'], ...this.initData});
      this.http.get(environment.atmcManageUrl + url).subscribe(res => {
        this.nodes = res.map(item=>{
          let iifCode = true;
          let deleteFlag = true;
          //解释执行iif，item['iconFlag']用于控制行功能按钮的显示状态
          if (this.config['option']&&this.config['option']['copy']&&this.config['option']['copy']['iif']) {
            eval(this.config['option']['copy']['iif']);
          }
          if (this.config['option']&&this.config['option']['delete']&&this.config['option']['delete']['iif']) {
            eval(this.config['option']['delete']['iif']);
          }
          item['iconFlag'] = iifCode;
          item['deleteFlag'] = deleteFlag;
          return item;
        });
        console.log(this.nodes);
        //默认第一个数据为选中状态
        this.activedNode = res[0];
        this.service.sendListVersion(this.activedNode);
        //把选中的值保存到服务，供全局使用
        this.service.sendListVersion(res[0]);
      });
    }
  copy(e, item) { // 复制事件
    e.stopPropagation();
    if (this.config['option']['copy'].type === 'edit') {
      let data = {
        page_id: this.config['id'],
          ...item,
        readOnly: this.config['option']['copy'].readOnly || false,
        title: this.config['option']['copy'].title,
        component: this.config['option']['copy'].component
      };
      this.showModal(data);
    }
  }
  add() {  //新添加
    let data = {
      page_id: this.config['title']['id'], //打开的弹出框通过page_id获取对应的配置数据
      softType: this.softType, //tab类型
      readOnly: this.config['title'].readOnly || false, //显示的组件是否只读
      title: this.config['option']['copy'].title,  //弹出框title
      component: this.config['title'].component, //要显示的组件
    };
    this.showModal(data);
  }
  delete(e,item) {   //删除

  }
  confirm(item) {
    if(this.deleteVersion!=item.version){
      this.deleteVersion = item.version;
      let url = environment.atmcManageUrl + '/soft/version/'+item['softType'];
      url = this.service.handleUrl(environment.atmcManageUrl+'/soft/version/${{softType}}?version=${{version}}',item);
      this.http.delete(url).subscribe(res=>{
        if(res.code==0){
          this.message.success('删除成功');
          this.getInitData();
        }else {
          this.message.error(res.msg);
          this.deleteVersion = '';
        }
      });
    }else {
      this.message.error('删除失败');
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
    modal.afterClose.subscribe((res) => {
      if (res){
        this.getInitData();
      }
      //this.getTableData(this.parentId);
    });
  }
  ngOnDestroy() {
    this.tabVersion.unsubscribe();
  }
}
