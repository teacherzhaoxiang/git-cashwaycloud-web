import { Component, OnInit, ViewChild, Input, OnDestroy, Output, EventEmitter } from "@angular/core";
import {ActivatedRoute, Params,Router} from "@angular/router";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";
import {NzMessageService} from "ng-zorro-antd";
import {WidgetService} from "../service/widget.service";
@Component({
  selector: 'publicST',
  template: `
      <div *ngIf="columns">
          <st [data]="data"
              [req]="{params: params}" [columns]="columns"
              (change)="_click($event)" [pi]="pageNo" [total]="total" [ps]="pageSize" (change)="getTableChange($event)">
          </st>
      </div>
  `,
  styles: [ `
      .editable-cell {
          position: relative;
          padding: 5px 12px;
          cursor: pointer;
      }

      .editable-row:hover .editable-cell {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          padding: 4px 11px;
      }
      .options{
          padding-top: 20px;
      }
      nz-select {
          margin: 0 8px 10px 0;
          width: 120px;
      }
      .option{
          text-decoration: none;
          padding: 0 6px;
      }
  `]
})
export class PublicSTComponent implements OnInit, OnDestroy {
  @Input() list_item;
  @Output('out') out = new EventEmitter();
  params = { a: 1, b: 2 };
  columns:any[];
  data:any;
  initUri = '';
  pageNo = 1;
  total = 0;
  pageSize:number;
  constructor(private http: _HttpClient, private msgService: NzMessageService, private service: WidgetService) { }
  ngOnInit(): void {
    //this.list_item.item['softType'] = '04';
    this.getPageConfig();
    /*this.columns = [
      { title: '设备号', index: 'termNo' },
      { title: '升级时间', index: 'time' },
      { title: '下发状态', index: 'statu' },
      /!*{title:'操作',render: 'custom'}*!/
      {
        title: '操作',
        buttons: [
          {
            text: '取消',
            type: 'link',
            saveUrl: '/save',
            pop: true,
            popTitle: '确认取消',
            iif: "if(item.statu=='0'|| item.statu=='1'){iifCode=true}else{iifCode=false}"
          },
          {
            text: '重新下发',
            type: 'link',
            saveUrl: '/save',
            pop: true,
            popTitle: '确认取消',
            iif: "if(item.statu=='1' || item.statu=='3'){iifCode=true}else{iifCode=false}"
          }
        ],
      },
    ];*/
  }
  getPageConfig() {
    this.http.get(environment.runtime_server_url + '/init/table/' + this.list_item.id).subscribe(res=>{
      let columns = res['columns'];
      for (let i=0; i<columns.length; i++) {
        if (columns[i]['buttons']) {
          var iif = [];
          for(let j=0;j<columns[i]['buttons'].length;j++){
            var btn = columns[i]['buttons'][j];
            if(btn['iif']){
              //触发按钮的触发条件
              iif[j]= btn['iif'];
              btn['iif'] = (item, btn,col)=>{
                let iifCode=true;
                eval(iif[j]);   //执行条件语句
                return iifCode;
              };
            }
            if (btn['saveUrl']) {  //判断是否存在保存的url。存在则触发确认保存事件
              //触发确认保存事件
              btn['click'] = (record) => {
                let initUrl = this.service.handleUrl(btn['saveUrl'],record);
                this.http.post(environment.atmcManageUrl + initUrl).subscribe(res => {
                  if(res.code==0){
                    this.msgService.success('取消成功！');
                    this.getData();
                  }
                  console.log(res);
                })
                console.log(btn['saveUrl']);
              };
            }
          }
        }
      }
      if(res['initUri']){
        this.initUri = res['initUri'];
      } else {
        this.initUri = this.list_item['initUri'];
      }
      this.columns = columns;
      this.pageSize = res['pageSize']||10;
      this.getData();
      /*this.data = [{termNo:'1234',time:'2020-07-01 13:00',statu:'0'},
        {termNo:'1123',time:'2020-07-01 13:00',statu:'1'},
        {termNo:'34547',time:'2020-07-01 13:00',statu:'3'}];*/
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
  getData() {
    let url = this.service.handleUrl(this.initUri,{...this.list_item.item, pageNo:this.pageNo, pageSize:this.pageSize});
    this.http.get(environment.atmcManageUrl + url).subscribe(res => {
      if(res){
        this.data = res['rows'];
        this.total = res['total'];
      }
    });
  }
  getTableChange(e) {
    if(e.type == 'pi' || e.type == 'ps'){
      this.pageNo = e.pi;
      this.pageSize = e.ps;
      this.getData();
    }
  }
  modifyIif(buttons) {

  }
  ngOnDestroy() {
    this.out.emit(false);
  }
  _click(e) {
    console.log('aaaaaa');
  }
}
