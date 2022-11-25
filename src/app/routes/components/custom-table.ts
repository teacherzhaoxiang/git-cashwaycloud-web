import { Component, OnInit, ViewChild, Input, Output, OnDestroy, AfterViewInit, EventEmitter } from "@angular/core";
import {ActivatedRoute, Params,Router} from "@angular/router";
import {WidgetService} from "../service/widget.service";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";
import {NzMessageService} from "ng-zorro-antd";
import {Subscription} from "rxjs";

interface ItemData {
  id: string;
  checked: boolean;
  name: string;
  age: string;
  address: string;
}
@Component({
  selector: 'custom-table',   //自定义表格
  template: `
      <div class="options" *ngIf="!list_item.readOnly">
          <!--<button nz-button nzType="primary"
                  nz-popconfirm
                  nzPopconfirmTitle="确定删除?"
                  (nzOnConfirm)="deleteList()"
          >删除</button>-->
          <button nz-button (click)="addRow()" nzType="primary" [disabled]="disabled">添加</button>
      </div>
      <br />
      <div class="opt_table" *ngIf="editField">
          <nz-table #editRowTable nzBordered [nzData]="listOfData" style="width: 100%" [nzShowPagination]="false" [nzLoading]="loading">
              <thead>
              <tr>
                  <!--<th *ngIf="config.checked">
                      
                  </th>-->
                  <!--<th>
                      <label nz-checkbox [(ngModel)]="config.checked" (ngModelChange)="onAllChecked($event)">
                      </label>
                  </th>
                  <th *ngIf="item.relate!=='checked'">
                      {{item.title}}
                  </th>-->
                  <th *ngFor="let item of editField">
                      <label *ngIf="item.relate==='checked'" nz-checkbox [(ngModel)]="checked" [nzDisabled]="list_item.readOnly" (ngModelChange)="onAllChecked($event)">
                      </label>
                      <div *ngIf="item.relate!=='checked'">{{item.title}}</div>
                  </th>


                  <!--<th nzWidth="20%">key</th>
                  <th>中文</th>
                  <th>英文</th>
                  <th>Action</th>-->
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let data of listOfData;let i=index" class="editable-row">
                  <td *ngFor="let item of editField;let index=index">
                      <div *ngIf="editField[index].type=='checkbox'">
                          <label nz-checkbox [(ngModel)]="data[item.relate]" [nzDisabled]="list_item.readOnly">
                          </label>
                      </div>
                      <div *ngIf="item.type=='select'">
                          <nz-select ngModel="data[item.relate]">
                              <nz-option nzValue="jack" nzLabel="Jack"></nz-option>
                              <nz-option nzValue="lucy" nzLabel="Lucy"></nz-option>
                              <nz-option nzValue="disabled" nzLabel="Disabled" nzDisabled></nz-option>
                          </nz-select>
                      </div>
                      <div *ngIf="item.type=='input'">
                          <div class="editable-cell" [hidden]="editId === data.id" (click)="startEdit(data)">
                              {{ data[item.relate] }}
                          </div>
                          <input [hidden]="editId !== data.id" type="text" nz-input [(ngModel)]="data[item.relate]"  />
                      </div>
                      <div *ngIf="item.type=='text'">
                          <div>
                              {{ data[item.relate] }}
                          </div>
                      </div>
                      <div *ngIf="item.type=='option'">
                          <div *ngIf="list_item.readOnly">/</div>
                          <!--<div *ngIf="!list_item.readOnly">-->
                              <!--<div  *ngFor="let action of item.actions">-->
                                  <!--<a *ngIf="action.method==='delete'" nz-popconfirm [nzPopconfirmTitle]="action['tips']" (nzOnConfirm)="deleteRow(action['deleteUri'],data.id,i)">{{action.title}}</a>-->
                                  <!--<a *ngIf="action.method==='cancel'&&editId==data.id" (click)="cancel()">{{action.title}}</a>-->
                                  <!--<a *ngIf="action.method==='save'&&editId==data.id" (click)="saveRow(action,data)">{{action.title}}</a>-->
                              <!--</div>-->
                          <!--</div>-->
                      </div>
                  </td>
                  <!--<td>
                      <label nz-checkbox [(ngModel)]="data.checked">
                      </label>
                  </td>
                  <td>
                      <div class="editable-cell" [hidden]="editId === data.id" (click)="startEdit(data.id)">
                          {{ data.chinese }}
                      </div>
                      <input [hidden]="editId !== data.id" type="text" nz-input [(ngModel)]="data.name"  />
                  </td>
                  <td>
                      <div class="editable-cell" [hidden]="editId === data.id" (click)="startEdit(data.id)">
                          {{ data.chinese }}
                      </div>
                      <input [hidden]="editId !== data.id" type="text" nz-input [(ngModel)]="data.age" />
                  </td>
                  <td>
                      <div class="editable-cell" [hidden]="editId === data.id" (click)="startEdit(data.id)">
                          {{ data.chinese }}
                      </div>
                      <input [hidden]="editId !== data.id" type="text" nz-input [(ngModel)]="data.address" />
                  </td>
                  <td>
                      <a nz-popconfirm nzPopconfirmTitle="Sure to delete?" (nzOnConfirm)="deleteRow(data.id)">Delete</a>
                  </td>-->
              </tr>
              </tbody>
          </nz-table>
          <nz-pagination class="pagination" [nzPageIndex]="pageNo" nzShowSizeChanger  [nzTotal]="total" [nzPageSize]="pageSize" nzShowQuickJumper (nzPageIndexChange)="pageIndexChange($event)" (nzPageSizeChange)="pageSizeChange($event)"></nz-pagination>
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
    .pagination{
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
  `]
})
export class CustomTableComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private service: WidgetService, private http: _HttpClient, private message: NzMessageService) { }
  @Input() list_item;
  @Output('out') out = new EventEmitter();
  pageConfig = {};   //页面配置数据
  editField: any[];  //表格配置数据
  checked = false; //
  editId: string | null; //当前正在编辑的行id，如果行id等于editId，那么此行处于编辑状态
  listOfData: Array<any> = [];
  pageNo = 1;  //页数
  pageSize = 10; //每页显示的条目数
  total:number; //总条目数
  dic = {};
  versionService:Subscription; //保存订阅对象，用于销毁当前组件的时候取消订阅
  versionData = {}; //保存选中的版本数据
  disabled = false;  //判断是否可添加，true:不可添加，false:可添加；新增或者编辑行的时候要先保存或者删除当前行才能添加一行
  newRow = true;  //判断当前行是新添加的还是在原来的数据上修改数据，true:新添加的行，false:在原来的数据上修改
  requestLen = 0; // 数据字典请求次数
  loading = false;  //用于显示数据加载的loading
  initUri = '';
  getInitData() {
    // let pageConfig = {
    //   initUri:"",
    //   id:'',
    //   dicConfig: [{
    //     key:"termType",
    //     url:'',
    //   }],
    //   editField:[
    //     {title:'checked',relate:'checked',type: 'checkbox',width:'20%'},
    //     //{title:'key',relate:'key',width:'20%', type: 'select', enums: [], enumsKey: 'termType' },
    //     {title:'中文',relate:'chinese',type: 'input',width:'20%'},
    //     {title:'英文',relate:'english',type: 'input',width:'20%'},
    //     {title:'操作',relate:'action',width:'20%', type: 'option', actions: [{title: '删除', method: 'delete'}, {title: '添加', method: 'add'}]}
    //   ]
    // };


  }
  ngOnInit(): void {
    let url = environment.runtime_server_url + '/init/table/' + this.list_item.id;
    this.http.get(url).subscribe(res => {
      this.initUri = res.initUri||this.list_item['initUri'];
      this.pageSize = res['pageSize']||10;
      if(this.list_item.readOnly) {
        res['columns'].map(item=>{
          if(item.type!=='checkbox'&&item.type!=='option'){
            item.type = 'text';
          }
        });
      }
      this.editField = res['columns'];
      this.pageConfig = res;
     /* let dicConfig = res['dicConfig'];
      for ( let i = 0; i < dicConfig.length; i++) {
        this.getEnums( dicConfig[i] );
      }*/
      this.versionService = this.service.list_version.subscribe(res=>{
        if(res&&JSON.stringify(res)!='{}'&&this.service.tab_menu.value['softType']==res['softType']&&this.versionData['version']!=res['version']){
          this.versionData = res;
          this.getData();
        }
      });
    })
    /*this.versionService =this.service.list_version.subscribe(res=>{
      debugger
      if(JSON.stringify(res)!='{}'){
        console.log(res);
      }
    })*/
    /*this.versionService = this.service.list_version.subscribe(res=>{
      console.log(res);
    })*/
    /*this.addRow();
    this.addRow();
    this.addRow();
    this.addRow();*/

    console.log(this.listOfData);
  }
  getData() {  //获取表格数据
    this.loading = true;
    /*if (!this.list_item.item) {
      this.list_item['item'] = this.versionData;
    }*/
    if(JSON.stringify(this.versionData)!=='{}'){
      this.list_item['item'] = this.versionData;
    }
    let url = environment.atmcManageUrl + this.service.handleUrl(this.initUri,this.list_item.item) + '&param={pageNo:'+this.pageNo+',pageSize:'+this.pageSize+'}';
    this.http.get(url).subscribe(res => {
      if(res) {
        this.total = res.total;
        this.listOfData = res['rows'];
        this.editId = '';
        this.disabled = false;
        this.loading = false;
        if(res['rows'].length>0){
          this.service.sendPublishDisable(1);
        }else {
          this.service.sendPublishDisable(0);
        }
      }else {
        this.service.sendPublishDisable(0);
      }
    });
  }
  pageIndexChange(e) {  //页数发生改变时触发
    this.pageNo = e;
    this.getData();
  }
  pageSizeChange(e) { //每页显示的条目数发生改变时触发
    this.pageSize = e;
    if(this.pageSize>this.total){
      this.pageNo = 1;
    }
    this.getData();
  }
  getEnums (data) {  //获取数据字典
    setTimeout(function() {
      /*this.dic[data.key] = [{key: '0', lable: 'false'}, {key: '1', lable: 'true'}]; //将请求到的数据赋值给全局的数据字典
      this.requestLen++;
      if (this.requestLen === this.pageConfig.dicConfig.length) {
        this.editField.map((item) => {
          if (item.enumsKey) {  // 如果配置了enumsKey数据字典数据请求完毕之后赋值给editField的enums
            this.editField['enums'] = this.dic[item.enumsKey];
          }
        });
      }*/
    }, 300 );
  }
  onAllChecked(e) { // 选择全部
    let checked = e;
    for ( let i = 0; i < this.listOfData.length; i++) {
      this.listOfData[i].checked = checked;
    }
  }
  deleteList() {  //删除数据
    this.listOfData = this.listOfData.filter(d => !d.checked );
  }
  startEdit(data): void {
    if(this.disabled){
      this.message.error('请先保存或删除当前编辑内容');
      return;
    };
    this.editId = data.id;
    this.disabled = !this.disabled;
    this.newRow = false;
  }
  cancel() {
    this.editId = '';
    this.disabled = !this.disabled;
    this.newRow = false;
  }
  addRow(): void {   //添加行
    let id = 'new_' + this.listOfData.length + 1;
    this.editId = id;
    this.newRow = true;

    let temp = {};
    this.editField.filter((item)=>{
      if(item.type!='option'){
        temp[item['relate']] = '';
      }
    })
    temp['id'] = id;
    if(this.listOfData.length+1>this.pageSize){
      this.listOfData.splice(this.pageSize-1,1);
    }
    this.listOfData.splice(0,0,temp);
    this.disabled = true;
  }
  saveRow (action, item) {
    item['version'] = this.list_item.item['version'];
    this.disabled = false;
    let saveUri = this.service.handleUrl(action['saveUri']);
    if(this.newRow || item.id.indexOf('new_')!= -1){

      delete item.id;
      this.http.post(environment.atmcManageUrl + saveUri, item).subscribe(res=>{
        if(res.code==0){
          this.service.sendPublishDisable(1);
          this.message.success('保存成功！')
          this.getData();
        }else {
          this.message.error(res.msg||'保存失败！');
        }
        this.editId = '';
      });
    }else {
      this.http.put(environment.atmcManageUrl + saveUri, item).subscribe(res=>{
        if(res.code==0){
          this.message.success('修改成功！');
          this.getData();
        }else {
          this.message.error(res.msg||'修改失败！');
        }
        this.editId = '';
      });
    }
  }
  deleteRow(url,id='',index): void {   //删除行
    if(id.indexOf('new_')!= -1){
      this.listOfData.splice(index,1);
      if(this.editId==id){
        this.disabled = false;
      }
      return;
    }
    let deletUri = this.service.handleUrl(url, {id: id});
    let version_data = this.service.list_version.value;
    this.disabled = false;
    this.http.delete(environment.atmcManageUrl+deletUri).subscribe(res => {
      if(res.code==0){
        this.message.success('删除成功！');
        this.getData();
      }else {
        this.message.error(res.msg||'删除失败！');
      }
    });
  }
  ngAfterViewInit() {

  }
  ngOnDestroy() {
    this.out.emit(false);
    console.log('destroy');
    this.versionService.unsubscribe();
  }

}
