import { Component, Input, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef, OnInit, AfterContentInit, OnDestroy, OnChanges} from '@angular/core';
import { coms, importComs } from './exportWidget'
import {WidgetService} from "../../service/widget.service";

@Component({
  selector: 'app-common-widget',
  entryComponents: importComs,
  template: `
      <div #container></div>
    `,
  styles: [ `    
    `]
})
export class CommonWidgetComponent implements OnInit, OnDestroy, AfterContentInit, OnChanges {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;
  @Input() initData;
  @Input() componentName;      //需要加载的组件名
  @Input() initUrl;      //需要加载的组件初始化数据接口
  @Input() size;
  compRef: ComponentRef<any>; //  加载的组件实例
  age = 'asd';
  constructor(private resolver: ComponentFactoryResolver, private service: WidgetService) { }
  loadComponent(name = '') {
    if ( this.compRef ) {
      this.compRef.destroy();
    }
    let factory = (this.resolver as any).resolveComponentFactory(coms[name||this.initData.component]);
   this.compRef = this.container.createComponent(factory); //创建组件
    console.log(this.service.tab_menu.value);
    (this.compRef.instance as any).initData = this.initData;
  }
  ngOnInit() {
   console.log(this.initUrl);
   console.log(this.componentName);
  }
  ngOnChanges() {
    /*if (this.componentName === 'TabMenuComponent') {
      this.service.send('componentNum' + (++this.componentNum));
    }*/
  }
  ngAfterContentInit() {
    this.loadComponent();
    /*this.service.get().subscribe(msg => {
      this.loadComponent(msg.componentName);
    });*/

  }
  ngOnDestroy() {
    /*if (this.compRef) {
      this.compRef.destroy();
    }*/
  }

}
