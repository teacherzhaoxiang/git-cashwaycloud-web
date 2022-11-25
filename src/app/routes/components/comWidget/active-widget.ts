import { Component, Input, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef, OnInit, OnDestroy} from '@angular/core';
import {WidgetService} from "../../service/widget.service";
import { TreeComponent } from "../tree/tree.component";
import {activeComs, importComs} from "./exportWidget";
import {NzModalService} from "ng-zorro-antd";
import {Subscription} from "rxjs";
import {_HttpClient} from "@delon/theme";
import { environment } from "@env/environment";

@Component({
  selector: 'app-active-widget',  // 动态显示组件区域
  entryComponents: importComs,
  template: `
      <div class="outerContainer">
          <div #actContent></div>
          <div #bottom class="btnGroup" style="padding-top: 40px">
              <button-group></button-group>
          </div>
      </div>
    `,
  styles: [ `    
    .outerContainer{
        position: relative;
        height: 100%;
        padding: 20px;
    }
    .list_box{
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;

        background: #2D8CF0;container
    }
    .btnGroup{
        justify-content: center;
        text-align: center;
        margin: 40px auto;
    }
    `]
})
export class ActiveWidgetComponent implements OnInit, OnDestroy {
  @ViewChild('actContent', { read: ViewContainerRef, static: true }) actContent: ViewContainerRef;
  @Input() initUrl;      //需要加载的组件初始化数据接口
  @Input() initData;
  compRef: ComponentRef<any>; //  加载的组件实例
  componentName = '';      //需要加载的组件名
  version = ''; //当前版本数据
  tabService:Subscription;
  constructor(private resolver: ComponentFactoryResolver, private service: WidgetService, private modal:NzModalService, private http:_HttpClient) { }
  loadComponent(id) {
    if ( this.compRef ) {
      this.compRef.destroy();
    }
    if (this.componentName == 'menuTree') {
      this.http.get(environment.runtime_server_url+'/init/tree/'+id).subscribe(res=>{
        let factory = (this.resolver as any).resolveComponentFactory(activeComs[this.componentName]);
        this.compRef = this.actContent.createComponent(factory); //创建组件
        this.initData.id = id;
        this.initData['config'] = res;
        (this.compRef.instance as any).list_item = this.initData;
      });
    }else {
      let factory = (this.resolver as any).resolveComponentFactory(activeComs[this.componentName]);
      this.compRef = this.actContent.createComponent(factory); //创建组件
      this.initData.id = id;
      (this.compRef.instance as any).list_item = this.initData;
    }

  }
  ngOnInit() {
    this.tabService = this.service.tab_menu.subscribe(res => {
      if(JSON.stringify(res)!="{}"){
        this.componentName = res['type'];
        this.loadComponent(res['id']);
      }
    })
    /*this.versionService = this.service.list_version.subscribe(res => {
      if(JSON.stringify(res)!="{}"&&res['id']!=this.version){
        debugger
        this.loadComponent(res['id']);
        this.version = res['id'];
        this.initUrl = this.componentName + '/' + this.version;
      }
    });*/
  }
  ngOnDestroy() {
    this.tabService.unsubscribe();
  }

}
