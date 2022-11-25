import { Component, OnInit,OnDestroy,ViewChild, Input ,AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {ActivatedRoute, Params,Router} from "@angular/router";
import {environment} from "@env/environment";
import {MenuService, _HttpClient} from "@delon/theme";
import { Subscription } from 'rxjs/internal/Subscription';
 
@Component({
  selector: 'app-tab-template',
  template: `
        <div style="height:0;opacity:0;"><page-header [(title)]="name" class="header"></page-header></div> 
        <div class="myHeader">{{name}}</div>
        <page-header [title]="" *ngIf="hasHeader"></page-header>
        <ul class="tab" *ngIf="tabMenu.length>0">
            <span *ngFor="let item of tabMenu">
                <a *ngIf="item['show_tab']!==false" [routerLink]="[item['type'],item['id']]"><li [ngClass]="{'active':linkId==item['id']}" (click)="changeTab(item['id'])">{{item["name"]}}</li></a>
            </span>
        </ul>
        <ng-container>
            <router-outlet></router-outlet>
        </ng-container>
    `,
  styles: [ `
        .tab{
            background: #fff;
            line-height: 40px;
            border-radius: 4px 4px 0 0;
            display: flex;
            flex-wrap: wrap;
            font-size: 16px;
            border-bottom: 1px solid #ececec;
            margin-right: -18px;
            margin-bottom: 0;
            padding: 8px 0;
        }
        .tab a{
            color: #aaa;
        }
        .tab li{
            list-style-type: none;
            padding: 0 20px;
            margin: 0 10px;
            height: 100%;
            min-width: 200px;
            white-space: nowrap;
            text-overflow:ellipsis;
            text-align: center;
            border-bottom:2px solid #F0F3F7;
        }
        .tab .active{
            color: #40a9ff;
            border-bottom: 2px solid #40a9ff;
        }
        .myHeader{
          margin:10px 0;
          display:flex;
          background-color: white;
          padding: 10px 0;
          text-indent: 1rem;
          color:rgba(0, 0, 0, 0.45);
        }
    `]
})
export class TabTemplateComponent implements OnInit,OnDestroy {
  id = ''; //路由id
  linkId = ''; //tab菜单id
  tabMenu = [];//tab菜单
  showtitle = '';//显示头部标题
  hasHeader = true; //是否显示header头部
  pageName: any;
  breadCrump:Array<string> = []
  webTitle = ''
  header:any;
  name:string = ''
  private menuChange$: Subscription;
  list:any;
  pageId:any;
  constructor(private routes:ActivatedRoute,private http:_HttpClient,private router:Router,private titleService: Title,private menuSrv: MenuService,) { }
  ngOnInit() {
    //获取路由传参
    this.routes.url.subscribe(params=>{
      let url = this.router.url.split('/');
      this.linkId = url[url.length - 1].split('?')[0].replace(/%7C/,"|");
      this.id = params[1].path||'';
      this.getList()
      if (environment['projectName'] == 'xjnx') {
        this.showtitle = '';
        this.hasHeader = false;
      } else {
        this.showtitle = '列表';
        this.hasHeader = true;
      }
    })
  }
  ngAfterViewInit(){
    setTimeout(()=>{
      this.webTitle = this.titleService.getTitle()
    },50)
  }
  getList(){
    this.menuChange$ = <any>this.menuSrv.change.subscribe(res => {
      this.list = res
      this.getTabMenu(); // 获取菜单数据
      console.log(this.list,this.pageId,'list')
    });
  }
  ngOnDestroy(): void {
  }
  //tab菜单切换触发的事件
  changeTab(index){
    this.linkId = index;
    this.id = index;
    for(let item of this.tabMenu){
      if(this.id == item.id){
        this.breadCrump[this.breadCrump.length - 1] = item.name
        this.setBreadCrump()
        setTimeout(()=>{
          this.titleService.setTitle(item.name)
        },150)
        break
      }
    }
  }
  //获取tab菜单
  getTabMenu(){
    let url = environment.runtime_server_url+'/tab/init/'+this.id;
    this.http.get(url).subscribe((res: any) => {
      console.log(res,'res')
      this.tabMenu = res.tabs||"";
      let flag = true
      console.log(res,this.tabMenu,'tabmenu',this.linkId)
      for(let item of this.tabMenu){
        if(this.linkId == item.id){
          flag = false
          this.pageId = res.id
          this.pageName = res.name
          if(this.list.length>0){
            this.menuGenerator(this.list['0'])
          }
          setTimeout(()=>{
            this.titleService.setTitle(item.name)
          },0)
          break
        }
      }
    });
  }
  menuGenerator(menu){
    if(menu.children.length == 0 ){
      const linkId = menu.link.split('/')[menu.link.split('/').length - 1].replace('%7C','|')
      if(linkId == this.linkId){
        const tabName:string = this.tabMenu.filter(ele=>ele.id == linkId)[0]['name']
        this.breadCrump = ['首页', menu.__parent.__parent.text , menu.__parent.text , menu.text , tabName]
        this.setBreadCrump()
      }
    }else{
      for(let key in menu.children){
        this.menuGenerator(menu.children[key])
      }
    }
  }
  setBreadCrump(){
    this.name = this.breadCrump.join(' / ')
  }
}