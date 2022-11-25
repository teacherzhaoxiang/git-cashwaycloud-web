import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  ComponentFactoryResolver,
  ComponentRef,
  ViewContainerRef
} from "@angular/core";
import { NzModalRef } from "ng-zorro-antd";
import {coms, modalComs} from "./comWidget/exportWidget";
import {_HttpClient} from "@delon/theme";
import {WidgetService} from "../service/widget.service";
import { DatePipe } from "@angular/common";
import {PublicSFComponent} from "./publicSF";
import {PublicSTComponent} from "./publicST";
import {TreeComponent} from "./tree/tree.component";
import {CustomTableComponent} from "./custom-table";
import {TerminalProcessComponent} from "../template/tab-template/terminal-process";
import {environment} from "@env/environment";
import {EditFormComponent} from "./edit-form/edit-form.component";
import {MenuTreeComponent} from "./menu-tree.component";

@Component({
  selector: 'common-modal',
  entryComponents: [PublicSFComponent,PublicSTComponent,EditFormComponent],
  template: `
      <div class="edit_box" drag>
          <div class="topper">
              <div class="title">{{title}}</div>
              <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
          </div>
          <div (mousedown)="$event.stopPropagation()">
              <div nz-row class="edit_content">
                  <nz-col nzSpan="24">
                      <div #content></div>
                  </nz-col>
              </div>
          </div>
          <div class="modal-footer">
              <button nz-button type="button" nzType="primary" (click)="keep()" *ngIf="!readOnly" [nzLoading]="loading">保存</button>
              <button nz-button type="button" class="closeBtn" (click)="close()">关闭</button>
          </div>
      </div>
  `,
  styles: [ `
      .edit_box{
          background: #FFFFFF;
          width: 800px;
          /*position: fixed !important;*/
          z-index: 999999999999;
          border-radius: 6px;
          /*margin-left: -400px;*/
          /*left: 50%;*/
      }
      .edit_box .topper{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          color: rgba(0, 0, 0, 0.85);
          font-weight: 500;
          font-size: 16px;
          border-bottom: 1px solid #ececec;
      }
      .edit_box .topper .closer{
          cursor: pointer;
      }
      .edit_box .edit_content{
          padding: 20px 40px;
          max-height: 600px;
          overflow-y: scroll;
      }
      .modal-footer{
          margin: 0;
          padding: 20px 24px;
      }
      :host ::ng-deep sf-item{
          width: 100% !important;
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
export class CommonModalComponent implements OnInit, OnChanges {
  @ViewChild('content', { read: ViewContainerRef, static: true }) content: ViewContainerRef;
  @Input() data;
  initUri: any;  //获取页面初始化配置
  compRef: ComponentRef<any>; //  加载的组件实例
  component = {sf:EditFormComponent,form:PublicSFComponent, st: PublicSTComponent,tree: TreeComponent, table:CustomTableComponent, treeSelect:TerminalProcessComponent,menuTree:MenuTreeComponent};
  title:string;
  readOnly = false;  //弹出框默认为只读
  loading = false;
  constructor(private modal: NzModalRef, private resolver: ComponentFactoryResolver, private http: _HttpClient, private service:WidgetService, private datePipe: DatePipe) {}
  ngOnInit() {
    if(this.data.component) {
      let list_item = this.data;
      if(this.data){
        this.title = this.data.title;
      }else {
        this.title = this.service.tab_menu['value']['name'] + '-' + list_item.version + '-' + this.datePipe.transform(list_item.createTime, 'yyyy-MM-dd hh:mm');
      }
      this.loadComponent(this.data.component, this.data.readOnly);
      this.readOnly = this.data.readOnly;
    }else {
      this.getPageConfig();
    }
  }
  getPageConfig() {
    let url = environment.runtime_server_url + '/init/customer-modal/' + this.data['page_id'];
    this.http.get(url).subscribe(res => {
      this.title = this.data.title;
      let componentName = res.component;
      this.readOnly = res.readOnly;
      this.loadComponent(componentName, res.readOnly, res.initUri);
    });
  }
  loadComponent(name, readOnly, initUri='') {
    if ( this.compRef ) {
      this.compRef.destroy();
    }
    this.content.clear();
    if(name=='menuTree'){
      this.http.get(environment.runtime_server_url+'/init/tree/'+this.data.page_id).subscribe(res=>{
        let factory = (this.resolver as any).resolveComponentFactory(this.component[name]);
        this.compRef = this.content.createComponent(factory); //创建组件
        (this.compRef.instance as any).list_item = {item: this.data,id:this.data.page_id,initUri:initUri,readOnly:readOnly,config:res};
        (this.compRef.instance as any).out.subscribe(res => {
          this.loading = false;
          if (res) {
            this.service.sendPublishStatus(1);
            this.modal.close(res);
          }
        });
      })
    }else {
      let factory = (this.resolver as any).resolveComponentFactory(this.component[name]);
      this.compRef = this.content.createComponent(factory); //创建组件
      (this.compRef.instance as any).list_item = {item: this.data,id:this.data.page_id,initUri:initUri,readOnly:readOnly};
      (this.compRef.instance as any).out.subscribe(res => {
        this.loading = false;
        if (res) {
          this.service.sendPublishStatus(1);
          this.modal.close(res);
        }
      });
    }

  }
  ngOnChanges() {

  }
  keep() {
    this.loading = true;
    this.service.sendOption('save');
  }
  close() {
    this.modal.destroy();
  }
}
