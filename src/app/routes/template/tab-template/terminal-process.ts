import { Component, OnInit,OnDestroy,ViewChild, Input } from '@angular/core';
import {_HttpClient} from "@delon/theme";
import { environment } from "../../../../environments/environment";
import { getData } from "@delon/form/src/utils";

@Component({
  selector: 'app-terminal-process',
  template: `
    <div class="container" *ngIf="schema">
        <div class="search">
            <input class="searchInp" nz-input [(ngModel)]="inpVal" />
            <button class="searchBtn" nz-button nzType="primary" (click)="search()">查询</button>
        </div>
        <sf [schema]="schema" [button]="'none'"></sf>
        <!--<nz-row class="list">
            <nz-col [nzSpan]="6" class="item" *ngFor="let item of [1,2,3,4,5,6,7,8,9,10]">
                <label nz-checkbox [(ngModel)]="checked" class="left"></label>
                <label class="center">流程1：</label>
                <nz-select ngModel="v1.0" class="right">
                    <nz-option nzValue="v1.0" nzLabel="v1.0"></nz-option>
                    <nz-option nzValue="v1.1" nzLabel="v1.1"></nz-option>
                    <nz-option nzValue="disabled" nzLabel="Disabled" nzDisabled></nz-option>
                </nz-select>
            </nz-col>
            <nz-col [nzSpan]="6" class="item" *ngFor="let item of [1,2,3,4,5,6,7,8,9,10]">
                <label nz-checkbox [(ngModel)]="checked" class="left"></label>
                <label class="center">流程1：</label>
                <nz-select ngModel="v1.0" class="right">
                    <nz-option nzValue="v1.0" nzLabel="v1.0"></nz-option>
                    <nz-option nzValue="v1.1" nzLabel="v1.1"></nz-option>
                    <nz-option nzValue="disabled" nzLabel="Disabled" nzDisabled></nz-option>
                </nz-select>
            </nz-col>
            <nz-col [nzSpan]="6" class="item" *ngFor="let item of [1,2,3,4,5,6,7,8,9,10]">
                <label nz-checkbox [(ngModel)]="checked" class="left"></label>
                <label class="center">流程1：</label>
                <nz-select ngModel="v1.0" class="right">
                    <nz-option nzValue="v1.0" nzLabel="v1.0"></nz-option>
                    <nz-option nzValue="v1.1" nzLabel="v1.1"></nz-option>
                    <nz-option nzValue="disabled" nzLabel="Disabled" nzDisabled></nz-option>
                </nz-select>
            </nz-col>
        </nz-row>
        <div class="options">
            <options-button (option)="getOption($event)" (cancel)="cancel($event)" (publish)="publish($event)" (keep)="keep($event)" [nzLoading]="nzLoading"></options-button>
        </div>-->
    </div>
  `,
  styles: [ `
    .container{
        /*margin-right: 30px;*/
    }
    .search{
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0;
    }
    .search .searchInp{
        width: 200px;
    }
    .search .searchBtn{
        margin-left: 10px;
    }
    .list{
    }
    .list .item{
        padding: 5px 0;
        display: flex;
        align-items: center;
    }
    .list .item .left{
        margin-right: 10px;
        flex-shrink: 0;
    }
    .list .item .center{
        flex-shrink: 0;
    }
    .list .item .right{
        flex: 1;
    }
    .options{
        margin: 20px 0;
    }
  `]
})
export class TerminalProcessComponent implements OnInit,OnDestroy {
  @Input() list_item;
  schema;
  inpVal = '';
  checked = true;
  nzLoading = false;
  constructor(private http: _HttpClient) { }
  ngOnInit() {
    this.getConfig();
  }
  getConfig() {
    let url = environment.runtime_server_url + '/init/form/' + this.list_item.id;
    this.http.get(url).subscribe(res => {
      res.editField['ui']['initUri'] = environment.atmcManageUrl + this.handleUrl(this.list_item.initUri);
      if (this.list_item.readOnly) {
        res.editField['ui']['readOnly'] = true;
      }
      this.schema = res.editField;
      /*this.schema = {
        "properties": {
          "process": {
            "type": "string",
            "title": "",
            "ui": {
              "widget":"checkBoxSelect",
              "readOnly":true,
              "styles": {"padding":"6px 10px"},
              "colSpan": 6
            }
          }
        }};*/

    });
  }
  getData() {
    let url = environment.atmcManageUrl + this.handleUrl(this.list_item.initUri);
    this.http.get(url).subscribe(res => {
      console.log(res);
    });
  }
  handleUrl(url,source={}) {  //处理url
    let urlArr = url.split('$');
    for(let i=0;i<urlArr.length;i++) {
      let index1 = urlArr[i].indexOf('{{');
      let index2 = urlArr[i].indexOf('}}');
      if (index1>-1&&index2>index1) {
        let key = urlArr[i].substring(index1+2,index2);
        let value = '';
        if(JSON.stringify(source)!=='{}'){
          value = source[key] || '';
        }else {
          value = this.list_item.item[key] || '';
        }
        let reg = '{{'+key+'}}';
        urlArr[i] = urlArr[i].replace(reg,value);
      }
    }
    return urlArr.join('');
  }
  ngOnDestroy(): void {
  }
  search() {

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
