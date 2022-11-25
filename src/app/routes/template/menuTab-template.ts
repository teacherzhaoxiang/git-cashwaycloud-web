import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  AfterContentInit,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild,
} from "@angular/core";
import {coms} from "../components/comWidget/exportWidget";
import {WidgetService} from "../service/widget.service";
import { ActiveWidgetComponent } from "../components/comWidget/active-widget";
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
import {_HttpClient} from "@delon/theme";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'menu-tab-template',
  template: `
      <div class="container" *ngIf="pageConfig">
          <page-header [title]="pageConfig?.name"></page-header>
          <div class="split-container" style="overflow: hidden;">
              <tab-menu [id]="pageConfig?.id"></tab-menu>
              <page-template [id]="pageConfig?.id"></page-template>
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
          overflow-y: auto;
          overflow-x: hidden;
      }
      :host ::ng-deep  .is-horizontal{
          height: calc( 100% - 40px) !important;
          overflow: hidden;
      }
      .alain-default__content {
          margin: 0 !important;
      }

      .as-split-back {
          background-image: url('./assets/tree-icon/tree-background.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
      }
    .container{
        
    }
  `]
})
export class MenuTabTemplateComponent implements OnInit, OnDestroy, AfterContentInit {
  constructor(private resolver: ComponentFactoryResolver, private service: WidgetService, private activatedRoute: ActivatedRoute, private http: _HttpClient) { }
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;
  compRef: ComponentRef<any>; //  加载的组件实例
  pageConfig: object;
  id = '';
  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.id = res.id;
      this.getPageConfig();
    });
  }
  getPageConfig() {   // 获取页面配置数据
    let url = environment.runtime_server_url+'/init/tab_page/' + this.id;
    this.http.get(url).subscribe(res => {
      this.pageConfig = res;
    });
    //let url = 'http://114.116.120.8:8090/engine/view-engine/runtime/init/tab/' + this.id;
  }
  ngAfterContentInit() {

  }
  ngOnDestroy() {

  }

}
