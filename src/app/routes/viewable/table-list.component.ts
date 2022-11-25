import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map, tap } from 'rxjs/operators';
import { Button } from 'selenium-webdriver';
import { Widget } from '@delon/form';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Console } from 'console';
import { SplitAreaDirective, SplitComponent } from 'angular-split';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EditAreaComponent } from './edit-area/edit-area.component';
import { SearchAreaComponent } from './search-area/search-area.component';
import { OperateAreaComponent } from './operate-area/operate-area.component';
import { TableAreaComponent } from './table-area/table-area.component';
import { environment } from '@env/environment';
import { Title } from '@angular/platform-browser';
import { type } from 'os';
import { encode } from 'punycode';

@Component({
  selector: 'app-table-list',
  templateUrl: `./table-list.component.html`,
  styles: [`
    ::ng-deep .ant-divider-horizontal{
      margin:12px 0 18px 0;
    }
    h2{
      margin:0;
      margin-top:10px;
      position: relative;
    }
    h2 .button{
      position: absolute;
      right:10px;
      top:0;
    }
    .container{
      width:100%;
      height:100vh;
      background-color:white;
      padding:0 0 80px 0;
      margin-left:-24px;
    }
    .content{
      padding:0px 20px;
    }
    .input-row{
      padding:5px 20px 0 0;
    }
    .switch-row{
      margin:8px 0;
      display:flex;
      justify-content:space-between;
    }
    .widget-add{
      cursor: pointer;
      font-size:10px;
      color:#1890FF;
      margin-top:20px;
    }
    .widget-enum{
      display:flex;
      align-items: center;
      position: relative;
    }
    .widget-delete{
      font-size: 20px;
      color:red;
      position: absolute;
      right: -35px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }
    ::-webkit-scrollbar{
      display:none;
    }
  `]
})

export class TableListComponent implements OnInit {
  [x: string]: any;
  constructor(
    private modalSrv: NzModalService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private titleService: Title
  ) { }
  @ViewChild(EditAreaComponent,{static:true}) private editArea!:EditAreaComponent;
  @ViewChild(SearchAreaComponent,{static:true}) private searchArea!:SearchAreaComponent;
  @ViewChild(OperateAreaComponent,{static:true}) private operateArea!:OperateAreaComponent;
  @ViewChild(TableAreaComponent,{static:true}) private tableArea!:TableAreaComponent;
  uri:any;
  name:any;
  ngOnInit(): void {
    this.getTitile()
  }
  showEdit: boolean;
  from: any;
  jsonName: any;
  getTitile(){
    this.uri = this.route.queryParams['_value'].uri
    this.route.queryParamMap.subscribe(res=>{
      this.uri = res['params'].uri
      this.name = res['params'].name
      console.log(this.uri,this.name)
      this.getData()
    })

  }
  test1(){
    //测试创建
    this.http.post(environment['baseUrl_url'] + '/engine/auto/createFile',{uri:this.uri,name:'aaa'}).subscribe(res=>{
      console.log('res')
    })
  }
  test2(){
    //测试保存
    this.tableArea.data.viewFields[0]['_relate'] = 'aaa.abcs'
    console.log(this.tableArea.data)
    let str = JSON.stringify(this.tableArea.data)
    console.log(str)
    let path = 'monitor\\\\st\\\\aaa.json'
    console.log(path)
    this.http.post(environment['baseUrl_url'] + `/engine/rest/common/saveFile`,{
      data:str,
      path:path
    }).subscribe(res=>{
      console.log(res)
      this.http.get(environment['baseUrl_url'] + '/engine/reload').subscribe(res=>{})

    })
  }
  getData(){
    console.log(this.uri,'这是uri')
    this.http.post(environment['baseUrl_url'] + '/engine/auto/editFile',{uri:this.uri},{}).subscribe(res=>{
      let data = {}
      let filterComment =(json)=>{
        while (json.indexOf("//")>0){
          let tag = json.substring(json.indexOf("//"),json.indexOf("\n",json.indexOf("//")));
          json = json.replace(tag,"");
        }
        while(json.indexOf('/*')>0){
          let a = json.substring(0,json.indexOf('/*'))
          let b = json.substring(json.indexOf('*/')+2,json.length)
          json = a + b
        }
        json = json.replace(/[\t\n]/g,'').replace(/\ +/g, "")
        let obj = eval("("+json+")")
        return obj
      }
      console.log(data,'这是data')
      for(let key in res){
        try{
          console.log(key)
          data[key] = filterComment(res[key])
        }catch{
          this.msg.error(`${key}处json格式错误`)
        }
      }
      data['sf-search']?this.searchArea.getData(data):''
      data['operation']?this.operateArea.getButton(data):''
      data['st']?this.tableArea.getData(data):''
    })
  }
  getSelectedFromSearch(value) {
    let index = value.findIndex
    delete value.findIndex
    this.editArea.getData('search',value,index)
  }
  getSelectedFromSfEdit(value) {
    if(value.from == 'sf-edit-public'){
      let from = value.from
      delete value.from
      this.editArea.getData(from,value)
    }
    if(value.from == 'sf-edit-relate'){
      let index = value.findIndex
      let from = value.from
      delete value.findIndex
      delete value.from
      this.editArea.getData(from,value,index)
    }
    if(value.from == 'sf-edit-new'){
      console.log(value)
      let from = value.from
      delete value.from
      this.editArea.getData(from,value)
    }
  }
  saveAll(){
    let pathArr = this.uri.split('/')[this.uri.split('/').length-1].split('|')
    let areaArr ={
      "searchArea":{"sf-search":this.searchArea.data},
      "operateArea":{"operation":{operations:this.operateArea.data},"sf-edit":this.operateArea.sfEdit},
      "tableArea":{"st":this.tableArea.data,"table":this.tableArea.table}
    }
    for(let key in areaArr){
      for(let keyword in areaArr[key]){
        let path = `${pathArr[0]}\\\\${keyword}\\\\${pathArr[1]}.json`
        console.log({
          data:areaArr[key][keyword],
          path:path
        })
        this.http.post(environment['baseUrl_url'] + `/engine/rest/common/saveFile`,{
          data:areaArr[key][keyword],
          path:path
        }).subscribe(res=>{
          console.log(res)
          this.http.get(environment['baseUrl_url'] + '/engine/reload').subscribe(res=>{})
        })
      }
    }
  }
  closeAll(){

  }
}
