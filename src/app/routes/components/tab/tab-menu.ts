import { Component, ElementRef, OnInit, AfterViewInit, OnChanges, Input } from "@angular/core";
import {WidgetService} from "../../service/widget.service";
import {Router} from "@angular/router";
import { TreeComponent } from "../tree/tree.component";
import {fromEvent} from "rxjs";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";

@Component({
    selector: 'tab-menu',   // tab切换菜单
    template: `
        <div #tab style="position: relative">
            <div class="menuList">
                <div class="more" *ngIf="canScroll>0" style="left:0;" (click)="tabScrollLeft()"><i nz-icon nzType="left" nzTheme="outline"></i></div>
                <ul class="tab" *ngIf="tabMenu.length>0" >
                                      <span *ngFor="let item of tabMenu">
                                          <a *ngIf="item['show_tab']!==false"><li [ngClass]="{'active':linkId==item['id']}" (click)="changeTab(item)">{{item["name"]}}</li></a>
                                      </span>
                </ul>
                <div class="more" *ngIf="canScroll>0" style="right:0;" (click)="scrollRight()"><i nz-icon nzType="right" nzTheme="outline"></i></div>
            </div>
        </div>
  `,
    styles: [
        `
            .menuList {
                justify-content: space-between;
                position: relative;
            }

            .menuList .more {
                width: 40px;
                height: 42px;
                line-height: 40px;
                position: absolute;
                top: 0;
                font-size: 26px;
                color: #ffffff;
                cursor: pointer;
                opacity: 0.5;
                background: #a9a9a9;
                text-align: center;
            }

            .menuList .tab {
                line-height: 40px;
                display: flex;
                overflow-x: auto;
                font-size: 16px;
                border-bottom: 2px solid #dddddd;
                margin-bottom: 0;
                padding: 0;
                padding-right: 10px;
            }

            .menuList .tab::-webkit-scrollbar {
                display: none;
            }

            .menuList .tab a {
                color: #aaa;
            }

            .menuList .tab li {
                list-style-type: none;
                padding: 0 20px;
                margin-left: 10px;
                height: 100%;
                min-width: 100px;
                white-space: nowrap;
                text-overflow: ellipsis;
                text-align: center;
                background: #ffffff;
                cursor: pointer;
            }

            .menuList .tab span:first-of-type li {
                margin-left: 0;
            }

            .menuList .tab .active {
                color: #ffffff;
                background: #40a9ff;
            }
        `
    ]
})
export class TabMenuComponent implements OnInit, AfterViewInit, OnChanges {
  tabMenu: Array<any> = [];//tab菜单
  scrollWidth:any = 0; //tab菜单可滚动宽度
  clientWidth:any = 0; //tab菜单实际宽度
  canScroll: any = 0;  // tab菜单可以滚动的距离
  linkId = ''; //tab菜单id
  name:any;
  @Input() id;
    constructor(private ref: ElementRef, private service: WidgetService, private router: Router, private http: _HttpClient) {
    }
    ngOnInit() {
      this.getMenu();
      fromEvent(window, "resize").subscribe((event:any) => {  // 监听浏览器窗口变化
        this.countScroll(); //浏览器窗口改变重新计算可滚动的长度
      });
      //this.service.send({componentData: this.tabMenu[0]}); //默认选择第一个tab,并在active-widget中显示
    }
    ngOnChanges() {
      console.log(this.name);
    }
    ngAfterViewInit() {


    }
    getMenu() {
      console.log(this.id);
      let url = environment.runtime_server_url + '/init/tab/' + this.id;
      //let url = environment.runtime_server_url + '/init/tab/' + this.id;
      //获取菜单数据
      this.http.get(url).subscribe(res => {
        this.tabMenu = res['menu_list'];
        this.linkId = res['menu_list'][0].id;
        this.service.sendTabMenu(res['menu_list'][0]);
        setTimeout(() => {
          this.countScroll();
        }, 1300);
      });
    }
    // tab菜单切换触发的事件
    changeTab(data) {
      if(this.linkId==data.id) return;
      this.linkId = data.id;
      this.service.sendTabMenu(data);
      console.log(this.linkId);
    }
    scrollRight() {  //点击Tab右箭头
      const scrollLeft = this.ref.nativeElement.querySelector('.tab').scrollLeft + 100;
      if (scrollLeft > this.canScroll){
        this.ref.nativeElement.querySelector('.tab').scrollLeft = this.canScroll;
      } else {
        this.ref.nativeElement.querySelector('.tab').scrollLeft = scrollLeft;
      }
    }
    tabScrollLeft() { //点击Tab左箭头
      const scrollLeft = this.ref.nativeElement.querySelector('.tab').scrollLeft - 100;
      if (scrollLeft < 0 ) {
        this.ref.nativeElement.querySelector('.tab').scrollLeft = 0;
      } else {
        this.ref.nativeElement.querySelector('.tab').scrollLeft = scrollLeft;
      }
    }

    countScroll() { //计算可滚动的长度
      this.scrollWidth = this.ref.nativeElement.querySelector('.tab').scrollWidth||0;
      this.clientWidth = this.ref.nativeElement.querySelector('.tab').clientWidth||0;
      this.canScroll = this.scrollWidth - this.clientWidth;
    }
 }