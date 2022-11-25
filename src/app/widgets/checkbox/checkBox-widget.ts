import { Component, OnInit, OnDestroy, AfterViewInit,ChangeDetectorRef,Injector } from "@angular/core";
import { ControlWidget } from "@delon/form";
import {NgZone} from "@angular/core";
import {WidgetService} from "../../routes/service/widget.service";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";
import {NzMessageService} from "ng-zorro-antd";
import {Subscription} from "rxjs";
import { CommonModalComponent } from "../../routes/components/commonModal";
import {NzModalService} from "ng-zorro-antd";

let TIMEOUT = null;

@Component({
  selector: "checkBox-widget",
  template: `
      <sf-item-wrap  nz-col nzSpan="24" [schema]="schema" [ui]="ui" [showError]="showError" [error]="ui.error" [showTitle]="schema.title">
          <nz-row class="list" style="width: 100%;" *ngIf="listConfig.length>0">
              <nz-col *ngFor="let item of listConfig" [nzSpan]="ui.colSpan||12" [ngStyle]="ui.styles" class="item">
                  <label nz-checkbox [nzDisabled]="readOnly" [(ngModel)]="item.checked" class="left"></label>
                  <label class="center" [title]="item.name">{{item.name}}</label>
                  <a class="right" (click)="showDetails(item)">查看</a>
              </nz-col>
          </nz-row>
      </sf-item-wrap>
  `,
  styles: [`
      .error{
          color: red;
      }
      .list .item{
          display: flex;
          align-items: center;
      }
      .list .item .left{
          padding-right: 6px;
      }
      .list .item .center{
          width: 60px;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow:ellipsis;
          text-align: left;
      }
      .list .item .right{
          width: 30px;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow:ellipsis;
      }
  `]
})
export class CheckBoxWidgetComponent extends ControlWidget implements OnInit, OnDestroy, AfterViewInit {
  /*schema = {  //schema的配置
    properties: {
      name: {
        type: 'string',
        title: '',
        minLength: 3,
        dicUri:'www.baidu.com',  //获取映射条件数据的url
        dataUri:'www.baidu.com',  //获取数据源的url
        ui: {
          widget:'checkBoxSelect',  //要展示的小部件名
          styles: {'padding':'10px 20px'}, //控制列的属性
          colSpan: 6    //一列占据的栅格数，共24格
        }
      }
    },
    ui: {
      // 指定 `label` 和 `control` 在一行中各占栅格数
      spanLabel: 0,
      spanControl: 24,
      grid:{
        span:24,
      }
    }
  };*/
  /* 用于注册小部件 KEY 值 */
  static readonly KEY = "checkBox";
  list: Array<object>;
  checked = true;
  enums;
  Objectkeys = Object.keys;
  readOnly: boolean; //控制组件是否可操作
  dictionary:object;  //下拉框数据字典
  listConfig:any[]=[];  //控件配置
  versionId:any;
  version:string;
  versionService:Subscription;
  optionService:Subscription;
  eventServiceResult:any;
  // 组件所需要的参数，建议使用 `ngOnInit` 获取
  constructor(private service: WidgetService, private http:_HttpClient,cd: ChangeDetectorRef, injector: Injector,
              private msg:NzMessageService, private modalSrv: NzModalService) {
    super(cd,injector);
  }
  ngOnInit(): void {
    this.readOnly = this.ui['readOnly'];
    if(this.readOnly){
      let dataSource = this.schema['dataSource'];   //处理资源数据
      dataSource = dataSource.map(item=>{
        item.checked = false;
        item.value = '';
        return item;
      });
      this.detectChanges();  //更新视图
      this.getData(this.schema['versionMsg'],JSON.stringify(dataSource)); //版本改变重新获取流程数据
    }else {
      this.versionService = this.service.list_version.subscribe(res=>{   //监听list_version版本信息数据的改变
        if(res&&JSON.stringify(res['id'])!='{}'&&res['id']!=this.versionId){
          this.versionId = res['id'];
          this.version = res['version'];
          this.listConfig = [];   //先清空select下拉控件组的数据，避免选中为空时渲染数据的默认选中数据不变
          let dataSource = this.schema['dataSource'];   //处理资源数据
          dataSource = dataSource.map(item=>{
            item.checked = false;
            return item;
          });
          this.detectChanges();  //更新视图
          this.getData(res,JSON.stringify(dataSource)); //版本改变重新获取流程数据
        }
      });
      this.optionService = this.service.option.subscribe(res=>{
        if(JSON.stringify(res)!='{}'&&res=='keep'){
          this.save();
        }
      })
    }
  }
  ngAfterViewInit() {

  }
  getData(versionMsg={},config) {
    let data = JSON.parse(config);  //用于重新刷新select控件的选中数据，避免选中为空时控件不刷新
    let url = '';
    if(this.readOnly){
      url = this.service.handleUrl(this.schema['dataUri'],versionMsg);  //处理url
    }else {
      let tabMsg = this.service.tab_menu.value['softType'];  //tab菜单数据
      url = this.service.handleUrl(this.schema['dataUri'],{...versionMsg,softType:tabMsg});  //处理url
    }
    this.http.get(environment.atmcManageUrl+url).subscribe(res=>{   //获取下拉配置
      this.listConfig = data;
      if(res&&res.length>0){
        //处理select控件的选中值
        this.service.sendPublishDisable(1);
        for(let i=0;i<this.listConfig.length;i++){
          for(let j=0;j<res.length;j++){
            if(res[j]==this.listConfig[i]['id']){
              this.listConfig[i].checked = true;
              break;
            }
          }
        }
      }else{
        this.service.sendPublishDisable(0);
      }
      this.detectChanges();  //更新视图
    })
    console.log(url);
  }
  save() {   //保存当前操作数据
    let url = environment.atmcManageUrl + this.schema['saveUri'];
    let vDetail = [];
    let list = this.listConfig;
    for(let i=0;i<list.length;i++) {
      if(list[i]['checked']){
        vDetail.push(list[i]['id']);
      }
    }
    this.http.post(url,{version:this.version,groupList:vDetail}).subscribe(res=>{
      this.service.sendOption(false);
      if(res.code==0){
        if(vDetail.length>0){
          this.service.sendPublishDisable(1);
        }else {
          this.service.sendPublishDisable(0);
        }
        this.msg.success('保存成功！');
      }else {
        this.msg.error(res.msg||'保存失败！');
      }
      setTimeout(()=>{
        this.service.sendOption(false);
      },1000);
    });


  }
  showDetails(data) {
    let item = {'page_id':'menu','groupId':data['id']};
    const modal = this.modalSrv.create({
      //nzTitle: '新增',
      nzContent: CommonModalComponent,
      nzWidth:0,
      nzComponentParams: {
        data: item
      },
      nzFooter:null,
      nzMaskClosable:false,
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
    modal.afterClose.subscribe(()=>{
    });
  }
  change(value: string,multipleOf) {
  }
  // reset 可以更好的解决表单重置过程中所需要的新数据问题
  reset(value: string){
  }
  ngOnDestroy() {   //取消订阅
    if(!this.readOnly){
      this.versionService.unsubscribe();
      this.optionService.unsubscribe();
    }

  }
}
