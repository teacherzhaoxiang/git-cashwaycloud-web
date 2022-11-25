import {ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import {ControlWidget, SFComponent, SFItemComponent, SFSchemaEnumType} from '@delon/form';
import {WidgetService} from "../../service/widget.service";
import {_HttpClient} from "@delon/theme";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {forkJoin, Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";
import {CustomerModalTemplate} from "../table-template/customer.modal.template";
import {EditTableModalTemplate} from "../../components/edit-table.modal.template";

@Component({
    selector: 'custom-table',   //自定义表格
    template: `        
     <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
      <div class="options" *ngIf="!readOnly">
          <button nz-button (click)="addRow()" nzType="primary" [disabled]="disabled">添加</button>
      </div>
      <br />
      <div class="opt_table" *ngIf="editField">
          <nz-table #editRowTable [nzData]="listOfData" style="width: 100%" [nzShowPagination]="false" [nzLoading]="loading">
              <thead>
              <tr>
                  <th *ngFor="let item of editField">
                      <div>{{item.title}}</div>
                  </th>
              </tr>
              </thead>
              <tbody>
              <ng-container *ngFor="let data of listOfData;let i=index" >
              <tr class="editable-row">
                  <td *ngFor="let item of editField;let index=index" (click)="startEdit(data)">
                      <div *ngIf="item.type=='select'">
                          <nz-select  nzShowSearch nzAllowClear [(ngModel)]="data[item.relate]" [disabled]="!editFlag || !data.editFlag">
                              <nz-option *ngFor="let option of dictionaryData[item.options]" [nzLabel]="option.label" [nzValue]="option.value"></nz-option>
                          </nz-select>
                      </div>
                      <div *ngIf="item.type=='edit-table'">
                          <button nz-button type="button" (click)="openEditTableModal(item.relate,item.tableKey,data,i)" class="closeBtn" [disabled]="!editFlag || !data.editFlag">{{item.label}}</button>
                      </div>
                      <div *ngIf="item.type=='input'">
                          <div class="editable-cell" [hidden]="editFlag && data.editFlag" >
                              {{ data[item.relate] }}
                          </div>
                          <input [hidden]="!editFlag || !data.editFlag" type="text" nz-input [(ngModel)]="data[item.relate]"  />
                      </div>
                      <div *ngIf="item.type=='text'">
                          <div>
                              {{ data[item.relate] }}
                          </div>
                      </div>
                      <div *ngIf="item.type=='option'" style="width: 60px;">
                          <div *ngIf="!readOnly">
                              <div  *ngFor="let action of item.actions">
                                  <a *ngIf="action.method==='delete' && !editFlag" (click)="deleteRow(i)">{{action.title}}</a>
                                  <a *ngIf="action.method==='cancel' && data.editFlag && editFlag" (click)="cancel(i)">{{action.title}}</a>
                                  <a *ngIf="action.method==='save' && data.editFlag && editFlag" (click)="saveRow(data,i)">{{action.title}}</a>
                              </div>
                          </div>
                      </div>
                  </td>
              </tr>
              <tr [nzExpand]="expandKey && data[expandKey]">
                  <div *ngFor="let item of expandFormat(data[expandKey])">
                      <span>{{ item }}</span>
                  </div>
                  
              </tr>
              </ng-container>
              </tbody>
          </nz-table>
      </div>
     </sf-item-wrap>
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
export class EditTableFormItemWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'edit-table';

    // reset 可以更好的解决表单重置过程中所需要的新数据问题
    reset(value: string) {
    }

    change(value: string) {
    }
    constructor(
        private http: _HttpClient,
        cd: ChangeDetectorRef,
        injector: Injector,
        sfItemComp: SFItemComponent ,
        sfComp: SFComponent,
        private modalService: NzModalService,
        private message: NzMessageService
    ) {
        super(cd,injector,sfItemComp,sfComp);
    };
    editField: any[];  //表格配置数据
    listOfData: Array<any> = [];
    loading = false;  //用于显示数据加载的loading
    initDataUri = '';
    tableKey = "";
    readOnly = false;
    editFlag = false;
    expandKey = "";
    expandTemplate = "";
    childKey = "";
    editFieldChildren: any[];  //表格配置数据

    ngOnInit(): void {
        this.tableKey = this.ui.tableKey;
        this.initDataUri = this.ui.initDataUri;
        this.readOnly = this.ui.readOnly;
        this.expandKey = this.ui.expandKey;
        this.expandTemplate = this.ui.expandTemplate;
        this.tableInit();
    }

    genInitUri(url:string){
        while (url.indexOf("{{") > 0 && url.indexOf("}}") > 0) {
            let i = url.indexOf("{{");
            let j = url.indexOf("}}");
            if (j > i) {
                let key = url.substring(i + 2, j);
                console.log(key);
                url = url.replace("{{" + key + "}}", this.sfComp.formData[key]);
            }
        }
        return url;
    }

    tableInit(): void {

        // let url = environment.runtime_server_url + '/init/table/' + this.tableKey;
        let url = 'http://localhost:8090/engine/view-engine/runtime/init/table/' + this.tableKey;
        this.http.get(url).subscribe(res => {
            this.initDataUri = res.initUri||this.initDataUri;
            //转换uri
            if( this.initDataUri!=null) {
                this.initDataUri = this.genInitUri(this.initDataUri);
                this.initDataUri = environment.gateway_server_url+this.initDataUri;
            }
            if(this.readOnly) {
                res['columns'].map(item=>{
                    if(item.type!=='option'){
                        item.type = 'text';
                    }
                });
            }

            if (res.dic){
                this.getDicData(res.dic,res['columns']);
            } else {
                this.editField = res['columns'];
                this.getData();
            }
        })

    }

    dictionaryData = {};
    getDicData(dics:any[],columns){
        const requests = [];
        let dicKeyList = [];
        dics.forEach((dic, index, array) => {
            if (dic.type == 'async'){
                dicKeyList.push(dic.key);
                requests.push(this.requestDicData(dic.asyncData,dic.mate,dic.params))
            } else if (dic.type == 'enums'){
                this.dictionaryData[dic.key] = dic.enums;
            }
        });
        if (requests.length > 0){
            forkJoin(requests).subscribe(datas => {
                datas.forEach((value,index)=>{
                    this.dictionaryData[dicKeyList[index]] = value;
                })
                console.log(datas);
                console.log(this.dictionaryData);
                this.editField = columns;
                this.getData();
            })
        } else {
            this.editField = columns;
            this.getData();
        }

    }

    requestDicData(url:string,mate,param) {
        if(!url.startsWith("http")&&!url.startsWith("https")){
            // url = environment.gateway_server_url + url;
            url = "http://localhost:8090"+url;
        }
        return this.http.get(url, {
            mate: JSON.stringify(mate),
            params: param
        });
    }

    getData() {

        if(this.initDataUri==null){
            this.listOfData = this.value?JSON.parse(this.value):[];
            let value = JSON.stringify(this.listOfData)
            this.setValue(value);
            this.detectChanges();
        }else{
            //从后台获取表格数据
            this.loading = true;
            this.http.get(this.initDataUri).subscribe((res) => {
                if(res) {
                    if(res.rows){
                        this.listOfData = JSON.parse(res.rows);
                    }else {
                        this.listOfData = res;
                    }
                    let value = JSON.stringify(this.listOfData)
                    this.setValue(value);
                    this.editFlag = false;
                }
                this.loading = false;
                this.detectChanges();
            },(error1) => {
                this.loading = false;
                alert("数据加载失败");
            },()=>{
                this.loading = false;
            });
            console.log(this.listOfData);
        }

    }

    openEditTableModal(key:any,tableKey:any,item:any,index:any){
        const modal = this.modalService.create({
            nzContent: EditTableModalTemplate,
            nzWidth:800,
            nzComponentParams: {
                record:{tableKey:tableKey,data:item[key]},
            },
            nzFooter:null,
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
        modal.afterClose.subscribe((result:any)=>{
            if(result){
                item[key] = result;
                this.saveRow(item,index);
            }
        })

    }


    expandFormat(item:any){
        if (item){
            let texts:any[] = [];
            let expands = JSON.parse(item);
            expands.forEach((value:any) => {
                let text = "";
                let template:string  = this.expandTemplate;
                while (template.indexOf("${") >= 0 && template.indexOf("}") >= 0){
                    let i1 = template.indexOf("${");
                    let i2 = template.indexOf("}");
                    text  = text + template.substring(0,i1);
                    let key = template.substring(i1+2,i2);
                    if (value[key]){
                        text = text+value[key]
                    }
                    template = template.substring(i2+1);
                }
                text = text+template;
                texts.push(text)
            })
            return texts;
        } else {
            return [];
        }
    }
    //缓存当前编辑项，cancel操作用到
    editItem:any;
    startEdit(data): void {
        if (!data.editFlag) {
            if(this.editFlag){
                this.message.error('请先保存或删除当前编辑内容');
                return;
            }else {
                this.editItem = JSON.parse(JSON.stringify(data));
                data.editFlag = true;
                this.editFlag = true;
            }
        }
    }
    cancel(index) {
        if (this.editItem != null){
            this.listOfData.splice(index,1,this.editItem);
        } else {
            this.listOfData.splice(index,1);
        }

        this.listOfData = JSON.parse(JSON.stringify(this.listOfData));
        this.editItem = null;
        this.editFlag = false;
        this.detectChanges();
    }
    addRow(): void {   //添加行
        this.editItem = null;
        if (this.editFlag){
            alert("请先保存正在编辑行！");
            return;
        }
        this.editFlag = true;
        let temp = {};
        temp['editFlag'] = true;
        this.listOfData.splice(0,0,temp);
    }
    saveRow (item, index) {
        this.editFlag = false;
        delete item.editFlag;
        this.listOfData.splice(index,1,item);
        console.log(this.listOfData);
        let value = JSON.stringify(this.listOfData)
        this.setValue(value);
        this.listOfData = JSON.parse(value);
        this.detectChanges();
    }
    deleteRow(index): void {   //删除行
        this.listOfData.splice(index,1);
        this.editFlag = false;
        let value = JSON.stringify(this.listOfData)
        this.setValue(value);
        this.listOfData = JSON.parse(value);
        this.detectChanges();
    }

    ngAfterViewInit() {

    }
    ngOnDestroy() {
        console.log('destroy');
    }
}
