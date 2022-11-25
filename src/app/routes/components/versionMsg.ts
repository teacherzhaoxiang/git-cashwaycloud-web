import { Component, OnInit,ViewChild, Input,OnChanges } from '@angular/core';
import {ActivatedRoute, Params,Router} from "@angular/router";
import { environment } from "@env/environment";
import {_HttpClient} from "@delon/theme";
import {NzModalService,NzMessageService} from "ng-zorro-antd";
import {CommonModalComponent} from "./commonModal";
import {WidgetService} from "../service/widget.service";

@Component({
  selector: 'versionMsg',
  template: `
    <!--版本信息-->
      <div style="display: flex;flex-wrap: wrap;padding: 0 20px;" *ngIf="data.length>0">
          <div class="container" *ngFor="let item of data;let index = index">
              <div class="title">{{titleEnums[item.softType]}}</div>
              <sv-container labelWidth="64" [layout]="'horizontal'" col="1" class="content">
                  <sv [label]="editField.publish.label">
                      <ng-template #label>
                          <span [nz-tooltip]="editField.publish.label">{{editField.publish.label}}</span>
                      </ng-template>
                      <div class="version">
                          <div class="center" *ngIf="list">
                              <nz-select nzPlaceHolder="Select a person" [(ngModel)]="item.selectedV">
                                  <nz-option *ngFor="let op of list[item['softType']]" [nzLabel]="op.label" [nzValue]="op.version"></nz-option>
                              </nz-select>
                          </div>
                          <div class="right" *ngIf="item.iconFlag" (click)="showDetails(item,editField.publish.option)">
                              <a>{{editField.publish.option.name}}</a>
                          </div>
                      </div>
                  </sv>
                  <sv [label]="editField.current.label">
                      <ng-template #label>
                          <span [nz-tooltip]="editField.current.label">{{editField.current.label}}</span>
                      </ng-template>
                      <div class="version">
                          <div class="center">
                              {{item[editField.current.relate]||'无'}}
                          </div>
                          <div class="right" (click)="showDetails(item,editField.current.option)" *ngIf="item.iconFlag">
                              <a>{{editField.current.option.name}}</a>
                          </div>
                      </div>
                  </sv>
                  <sv [label]="editField.upgrade.label">
                      <ng-template #label>
                          <span [nz-tooltip]="editField.upgrade.label">{{editField.upgrade.label}}</span>
                      </ng-template>
                      <div class="version">
                          <div class="center">
                              {{item[editField.upgrade.relate]||'无'}}
                          </div>
                          <div class="right" (click)="showDetails(item,editField.upgrade.option)" *ngIf="item.iconFlag">
                              <a>{{editField.upgrade.option.name}}</a>
                          </div>
                      </div>
                  </sv>
              </sv-container>
              <div style="display: flex;justify-content: center;padding-bottom: 14px">
                  <button nz-button nzType="default" (click)="cancelTask(item,index)" [disabled]="!item['cancelFlag']" [nzLoading]="item.loading">取消</button>
                  <!--<button nz-button nzType="primary">升级</button>-->
              </div>
          </div>
      </div>
  `,
  styles: [ `
      .container{
          border: 1px solid #ececec;
          width: 230px;
          margin: 20px 6px;
          background: #ffffff;
          border-radius: 6px;
          overflow: hidden;
          font-size: 12px;
      }
      .container .title{
          text-align: center;
          height: 30px;
          line-height: 30px;
          background: #ececec;
      }
      .container .content{
          padding: 14px;
          background: #ffffff;
          align-items: flex-end
      }
      .editable-cell {
          position: relative;
          padding: 0px 12px;
          cursor: pointer;
      }

      .editable-row:hover .editable-cell {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          padding: 4px 10px;
      }
      .options{
          padding-top: 20px;
      }
      nz-select {
          width: 100px;
      }
    .version{
        display: flex;
        align-items: center;
    }
      .version .center{
          flex: 1;
          margin-right: 6px;
      }
      .version .right{
          width: 24px;
      }
  `]
})
export class VersionMsgComponent implements OnInit, OnChanges {
  @Input('termMsg') termMsg;
  selectedValue;
  dic: object = {};
  pageConfig:object;
  editField = {};
  titleEnums = {};
  data: any = [];
  enumsKey: object = {};
  initUri = '';
  enumsUri = '';
  list;
  constructor(private http: _HttpClient, private modalSrv: NzModalService, private route:ActivatedRoute, private service:WidgetService, private message:NzMessageService) { }
  ngOnInit(): void {
    this.route.params.subscribe(param => {
      let url = environment.runtime_server_url + '/init/card_list/' + param['id'];
      this.http.get(url).subscribe(res => {
        //获取整个页面配置参数
        this.pageConfig = res;
        this.editField = res['editField'];
        this.titleEnums = res['titleEnums'];
        this.initUri = res['initUri'];
        this.enumsUri = res['enumsUri'];

        //this.getSelect();
      });
    });
  }
  getAllData(inintUrl) {
    //获取整个页面数据
    this.http.get(environment.atmcManageUrl + inintUrl).subscribe(res => {
      this.data = res;
      this.data = res.map(item => {
        var iconFlag = true;
        var cancelFlag = true;
        if(this.editField['iif']){
          eval(this.editField['iif']);
        }
        if(this.editField['cancelFlag']){
          eval(this.editField['cancelFlag']);
        }
        item.iconFlag = iconFlag;
        item.cancelFlag = cancelFlag;
        item.loading = false;
        return item;
      });
      console.log(this.data);
    });
  }
  getSelect() {
    //获取页面下拉选择控件数据
    this.http.get(environment.atmcManageUrl + '/soft/version/fullDetail/1234567/02?version=v1.1').subscribe(res => {
      console.log(res);
    });
  }
  cancelTask(item,index) {
    this.data[index]['loading'] = true;
    let url = this.service.handleUrl(this.editField['cancelUri'], item);
    this.http.post(environment.atmcManageUrl + url).subscribe(res=>{
      this.data[index]['loading'] = false;
      if(res.code==0){
        this.message.success('取消成功！');
      }else {
        this.message.error(res.msg);
      }
    })
  }
  showDetails(item,option) {  //点击详情按钮弹出详情框
    item['page_id'] = this.handleUrl(option.id,item)
    item['title'] = this.titleEnums[item['softType']];
    const modal = this.modalSrv.create({
      //nzTitle: '新增',
      nzContent: CommonModalComponent,
      nzWidth:0,
      nzComponentParams: {
        data: item
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
    modal.afterClose.subscribe(()=>{
    });
  }
  handleUrl(url,source={}) {  //处理url
    let urlArr = url.split('$');
    for(let i=0;i<urlArr.length;i++) {
      let index1 = urlArr[i].indexOf('{{');
      let index2 = urlArr[i].indexOf('}}');
      if (index1>-1&&index2>index1) {
        let key = urlArr[i].substring(index1+2,index2);
        let value = source[key] || '';
        let reg = '{{'+key+'}}';
        urlArr[i] = urlArr[i].replace(reg,value);
      }
    }
    return urlArr.join('');
  }
  getDictionary() {
    let config = this.pageConfig['dicConfig'];
    for(let i=0;i<config.length;i++){
      if(config[i].type=='url'){
        config[i]['url'] = this.handleUrl(config[i]['url']);  //解析url
      }
    }
    let params = [{"key": "softType", "dic": "softType","type":"dic"},{"key":"publishV","type":"url","url":"http://127.0.0.1:8280/soft/version/his/byTerm/1234567"}];
    this.http.post(environment.atmcManageUrl + '/dictionary',params,{}).subscribe(res=>{
      this.data.map( (item) => {
        item['selectVal'] = '';
        let publish = this.getDicKeys(this.editField['publish']['enumsKey']);
        item['options'] = res[publish['dicKey']][item[publish['valKey']]];
        let TKey = this.getDicKeys(this.editField['titleKey']);
        if (res[TKey['dicKey']] instanceof Array) {
          let title: object = {};
          res[TKey['dicKey']].forEach(val=>{
            let key = val.key;
            title[key] = val.value;
          });
          item['title'] = title[item[TKey['valKey']]];
        }

      });
      //this.editField[title] = res[publish['dicKey']][item[publish['valKey']]]
      console.log(this.data);
    });
    /*this.dic = {  //数据字典数据
      "publishV":
        {
        '01':[{'a':'asjdhsajd'},{'b':'asdsadas'}],
        '02':[{'a':'asjdhsajd'},{'b':'asdsadas'}],
        }
    };
    this.enumsKey['publish'] = this.getDicKeys(this.editField['publish']['enumsKey']);
    this.enumsKey['title'] = this.getDicKeys(this.editField['titleKey']);*/


  }
  getDicKeys(keyStr): object {
    let keys = keyStr.split('.');
    let index1 = keys[1].indexOf("${{");
    let index2 = keys[1].indexOf("}}");
    if (index1 > -1 && index2 > -1 && index2 > index1) {  // 分离${{}}包裹的key值，用于在数据字典中找到每条数据对应的下拉数据
      keys[1] = keys[1].substring(index1 + 3, index2);
    }
    return {dicKey: keys[0], valKey: keys[1]};
  }
  publishList(enumsUrl) {
    this.http.get(environment.atmcManageUrl + enumsUrl).subscribe(res=>{
      for(let i=0;i<this.data.length;i++){
        this.data[i]['selectedV'] = res[this.data[i]['softType']].length > 0 ? res[this.data[i]['softType']][0]['version'] : '';
      }
      console.log(this.data);
      this.list = res;
    });
  }
  ngOnChanges(e) {
    if(e['termMsg']&&JSON.stringify(e['termMsg']['currentValue'])!='{}') {
      let inintUrl = this.service.handleUrl(this.initUri,e['termMsg']['currentValue']);
      let enumsUrl = this.service.handleUrl(this.enumsUri,e['termMsg']['currentValue']);
      /*this.initUri = '/soft/version/detail/byTerm/1234567';
      this.enumsUri = '/soft/version/his/byTerm/1234567';*/
      this.getAllData(inintUrl);
      this.publishList(enumsUrl);
    }else {
      this.data = [];
      this.list = {};
    }
  }
}
