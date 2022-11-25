import { Component, OnInit,ViewChild, Input,OnChanges, OnDestroy } from '@angular/core';
import {WidgetService} from "../service/widget.service";
import {_HttpClient} from "@delon/theme";
import { environment } from "@env/environment";
import { CommonModalComponent } from "./commonModal";
import {NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'button-group',
  template: `
    <div class="buttons" *ngIf="buttonFlag">
        <button *ngFor="let item of buttons;let index=index" nz-button [nzType]="item.type" [disabled]="item.disabled" [ngStyle]="item.style" [nzLoading]="loadings[index]" (click)="handleClick(item.method,index)">{{item.name}}</button>
        <!--<button nz-button nzType="primary" (click)="handleClick('keep')">保存</button>
        <button nz-button nzType="primary" (click)="handleClick('publish')">发布</button>-->
    </div>
  `,
  styles: [ `
     
  `]
})
export class ButtonGroupComponent implements OnInit, OnChanges, OnDestroy {
  buttons = [];
  loadings = [];
  tab_service:any;
  index = -1;
  option_service:any;
  publish_index;
  version = '';
  buttonFlag = false;
  constructor(private service:WidgetService, private http: _HttpClient, private modalSrv: NzModalService) { }
  ngOnInit(): void {
    this.tab_service = this.service.tab_menu.subscribe(res => {
      if(res['showButtons']){
        this.getButtons(res['id']);
      }else {
        this.buttons = [];
      }
    });
    this.service.list_version.subscribe(res=>{
      if(res&&JSON.stringify(res)!='{}'){
        this.buttonFlag = true;
      }else {
        this.buttonFlag = false;
      }
    })
    this.service.publish_disable.subscribe(res=>{
      if(JSON.stringify(res)!='{}'&&this.buttons.length>0){
        if(res===0){
          this.buttons[this.publish_index]['disabled'] = true;
        }else if (res===1){
          this.buttons[this.publish_index]['disabled'] = false;
        }
      }
    });
  }
  getButtons(id) {  // 获取列表数据
    this.http.get(environment.runtime_server_url+'/init/buttonGroups/'+id).subscribe(res=>{
      this.buttons = res['buttons'];
      for(let i=0;i<this.buttons.length; i++ ) {
        this.loadings[i] = false;
        this.buttons[i]['disabled'] = false;
        if(this.buttons[i]['method']=='publish'){
          this.publish_index = i;
        }
      }
    });
  }
  handleClick(type, index) {
    this.index = index;
    if(type=='publish'){
      let data = {
        component: "form",
        page_id: "publish",
        readOnly: false,
        softType: "01",
        title: "发布",
      };
      this.showModal(data);
      return;
    }
    this.service.sendOption(type);
    this.loadings[index] = !this.loadings[index];
    this.option_service = this.service.option.subscribe(res=>{
      if(!res){
        this.loadings[this.index] = false;
      }
    });
    /*var loadingTime = setTimeout(()=>{
      this.loadings[index] = !this.loadings[index];
      clearTimeout(loadingTime);
    },2000);*/
    /*if(type=='cancel'){
      clearTimeout(loadingTime);
      this.loadings[index] = !this.loadings[index];
    }*/
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
    /*modal.afterClose.subscribe((res) => {
      if (res){

      }
      //this.getTableData(this.parentId);
    });*/
  }
  ngOnChanges() {

  }
  ngOnDestroy() {
    this.tab_service.unsubscribe();
  }
}
