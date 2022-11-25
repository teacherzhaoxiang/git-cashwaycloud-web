import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  AfterContentInit,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild
} from "@angular/core";
import {coms} from "../components/comWidget/exportWidget";
import {WidgetService} from "../service/widget.service";
import { ActiveWidgetComponent } from "../components/comWidget/active-widget";
import {NzModalService} from "ng-zorro-antd";
import { TableAddModalComponent } from "./table-template/add.template";
import {_HttpClient} from "@delon/theme";
import {environment} from "../../../environments/environment";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'page-template',
  template: `
      <div>
          <page-header [title]="name" *ngIf="!id"></page-header>
          <div class="split-container" *ngIf="splitPane.direction">
              <as-split [direction]="splitPane.direction" class="as-split-back" (dragEnd)="resize('dragEnd', $event)">
                  <as-split-area *ngFor="let pane of splitPane.split" [size]="pane.size||'20'">
                      <as-split [direction]="pane.direction" (dragEnd)="resize('dragEnd', $event)"  style="height: 100% !important;">
                          <as-split-area *ngFor="let item of pane.split" [size]="item.size||'20'">
                              <app-common-widget [componentName]="item.component" [initUrl]="item.initUrl" [initData]="item"></app-common-widget>
                          </as-split-area>
                      </as-split>
                  </as-split-area>
              </as-split>
          </div>
      </div>
  `,
  styles: [ `
      :host ::ng-deep .split-container{
        background: #e6f7ff;
    }
      :host ::ng-deep .ant-card .ant-card-body {
          padding: 0 !important;
          margin-right: 0 !important;
          overflow: hidden;
          /*overflow-y: auto;
          overflow-x: hidden;*/
          
      }
      .alain-default__content {
          margin: 0 !important;
      }

      .as-split-back {
          background-image: url('./assets/tree-icon/tree-background.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
      }
    .split-container{
        padding: 0;
        margin: 0;
    }
  `]
})
export class PageTemplateComponent implements OnInit, OnDestroy, AfterContentInit {
  constructor(private resolver: ComponentFactoryResolver, private service: WidgetService,
              private modalSrv: NzModalService, private http: _HttpClient, private actRoute:ActivatedRoute) { }
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;
  compRef: ComponentRef<any>; //  加载的组件实例
  splitPane:any={};
  treeSize:number = 15;
  tableSize:number = 85;
  size: any = 0;
  name:string;
  @Input() id;      //需要加载的组件名
  ngOnInit() {
      this.actRoute.params.subscribe(param=>{
        let url = environment.runtime_server_url+'/init/page_template/' + param['id'];
        //let url = environment.runtime_server_url + '/init/page_template/' + 'page_template';
        this.http.get(url).subscribe(res => {
          if(res['config']){
            this.service.sendTabMenu(res['config']);
          }
          this.name = res['name']||'';
          this.splitPane = res;
          /*this.splitPane = {
            direction: 'horizontal',
            split: [
              {size: 11, direction: 'vertical', split: [
                  {id: 'menu', size: 100, component: 'list', initUrl: 'menu'}
                ]},
              {size: 88, direction: 'vertical', split: [
                  {id: 'activeWidget', size: 100, component: 'activeWidget', initUrl: 'http://114.116.103.133:8090/manage/sys/orgs/tree?orgId=0'},
                ]},
              {size: 1, direction: 'horizontal', split: [
                  {id: 'list', size: 100, component: 'list', initUrl: 'list'},
                ]}
            ] };*/
        });
      });
  }
  ngAfterContentInit() {

  }
  ngOnDestroy() {

  }
  resize (type, e) {
    this.size = e;
  }
  publish() {
    const modal = this.modalSrv.create({
      //nzTitle: '新增',
      nzContent: 'jhbhjzc',
      nzWidth:0,
      nzComponentParams: {
        entity:'askdn',
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
    console.log(this.modalSrv);
    modal.afterClose.subscribe(()=>{

    })
  }
}
