import { Component, OnInit,OnDestroy,ViewChild } from '@angular/core';
import {ActivatedRoute, Params,Router} from "@angular/router";
import {environment} from "@env/environment";
import {_HttpClient} from "@delon/theme";

@Component({
  selector: 'app-menu-moudel',
  template: `
        <!--<page-header [title]="''" #header></page-header>-->
        <tree-menu></tree-menu>
        <options-button (option)="getOption($event)" (cancel)="cancel($event)" (publish)="publish($event)" (keep)="keep($event)" [nzLoading]="nzLoading"></options-button>
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
      }
      .tab .active{
          color: #40a9ff;
      }
    `]
})
export class MenuMoudelComponent implements OnInit,OnDestroy {
  //schema = {'cancel': {'disabled': true, display: 'none'}, 'publish': {'disabled': true, display: 'none'}, 'keep': {'disabled': true, display: 'none'}};
  nzLoading = false; //按钮的加载状态
  constructor(private routes:ActivatedRoute,private http:_HttpClient,private router:Router) { }
  ngOnInit() {

  }
  ngOnDestroy(): void {
  }
  cancel(e) {
    console.log(e);
  }
  keep(e) {
    console.log(e);
    this.nzLoading = true; //点击按钮加载状态为加载中
    setTimeout(() => {
      this.nzLoading = false;  //请求执行完毕加载状态完成
    },5000 );
    // console.log(e);
  }
  publish(e) {
    console.log(e);
    this.nzLoading = true; //点击按钮加载状态为加载中
    setTimeout(() => {
      this.nzLoading = false;  //请求执行完毕加载状态完成
    },5000 );
    // console.log(e);
  }
  getOption(e) {
    this.nzLoading = true; //点击按钮加载状态为加载中
    setTimeout(() => {
      this.nzLoading = false;  //请求执行完毕加载状态完成
    },5000 );
   // console.log(e);
  }

}
