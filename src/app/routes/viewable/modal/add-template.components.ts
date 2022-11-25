import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DelonFormModule, SFComponent, SFSchema } from '@delon/form';
import {NzModalRef} from 'ng-zorro-antd';
import { config } from "process";
import {HttpClient} from '@angular/common/http'
import { deepCopy } from "@delon/util";
@Component({
  selector: 'add-modal',
  template: `
  <div class="add-modal">
    <div class="sf-area">
      <sf #sf mode="edit" [schema]="schema" [(formData)]="record" button="none"></sf>
    </div>
    <div class="btn-area">
      <button nz-button type="button" (click)="close()" class="closeBtn">关闭</button>
      <button nz-button type="submit" (click)="save()" class="save-btn">保存</button>
    </div>
  </div>
  `,
  styles:[
    `
    .add-modal{
    }
    .sf-area{
      padding-top:30px;
    }
    .btn-area{
      display:flex;
      justify-content:flex-end;
      padding-top:30px;
    }
    .save-btn{
      background-color:#1890FF;
      color:white;
      margin-left:20px;
    }
    `

  ]
})
export class AddModalComponent {
  data:any;//从search传过来的data
  constructor(private modal: NzModalRef,private http:HttpClient){}
  @ViewChild('sf', { static: false })
  sf: SFComponent;
  schema: any = {
    properties: {
    }
  };
  record:any={};
  type:any;
  relateName:string;
    ngOnInit(): void {
      console.log(this.record,this.type)
      this.getData()
    }
    getData():void{
      //来自操作区的add
      if(this.type=='operate'){
        this.getOperationSchema()
      }
      if(this.type=='st'){
        this.getTableSchema()
      }
      if(this.type == 'stButton'){
        this.schema = {
          properties: {
          text:{title:'标题',type:'string'},
          icon:{title:'图标',type:'string'},
          type:{title:'类型',type:'string',enum:['none','del','modal','static','drawer','link']},
          click:{
            title:"点击",
            type:'string',
            ui:{
              visibleIf:{
                type:(value)=>(['modal','drawer'].indexOf(value) != -1)
              }
            }
          },
          component:{
            title:'组件',
            type:'string',
            ui:{
              visibleIf:{
                type:(value)=>(['modal','drawer'].indexOf(value) != -1)
              }
            }
          }
          }
        }
      }
    }
    getOperationSchema():void{
      this.schema = {
        properties:{
          type:{
            title:'类型',
            type:'string',
            enum:[
              {"label": "新增","value": "add"},
              {"label": "删除","value": "delete"},
              {"label": "导出","value": "export"},
              {"label": "引入","value": "import"},
              {"label": "刷新","value": "refresh"}
            ],
            ui:{
              widget:'select'
            }
          },
          label:{
            title:'名称',
            type:'string'
          },
          icon:{
            title:'图标',
            type:'string',
            enum:[
              {"label": "add","value": "add"},
              {"label": "delete","value": "delete"},
              {"label": "export","value": "export"},
              {"label": "import","value": "import"},
              {"label": "refresh","value": "refresh"}
            ],
            config:{ui:'select'}
          },
          click:{
            title:'点击事件',
            type:'string',
            enum:[
              {"label": "add(新增)","value": "add"},
              {"label": "refresh(刷新)","value": "refresh"},
              {"label": "modal(弹框)","value": "modal"},
              {"label": "deletes(删除全部)","value": "deletes"},
              {"label": "downloadTemplate(下载模板)", "value": "downloadTemplate"},
              {"label": "export(导出)","value": "export"},
              {"label": "download(下载文件)","value": "download"},
              {"label": "serviceUrl(调用后端接口)","value": "serviceUrl"},
              {"label": "router(跳转到链接)", "value": "router"},
              {"label": "jump(新窗口打开链接)","value": "jump"}
            ],
            ui:{
              widget:'select',
            }
          },
          class:{
            title:'样式',
            type:'string'
          },
          option:{
            title:'option',
            type:'string',
            ui:{
              visibleIf:{
                click:(value)=>(['modal'].indexOf(value)!=-1)
              }
            }
          },
          url:{
            title:'url',
            type:'string',
            ui:{
              visibleIf:{
                click:(value)=>(['export','serviceUrl'].indexOf(value)!=-1)
              }
            }
          },
          exportColumns:{
            title:'exportColumns',
            type:'string',
            ui:{
              visibleIf:{
                click:(value)=>(['export'].indexOf(value)!=-1)
              }
            }
          },
          selectionsFlag:{
            title:'selectionsFlag',
            type:'string',
            ui:{
              visibleIf:{
                click:(value)=>(['serviceUrl'].indexOf(value)!=-1)
              }
            }
          },
          afterOption:{
            title:'afterOption',
            type:'string',
            ui:{
              visibleIf:{
                click:(value)=>(['serviceUrl'].indexOf(value)!=-1)
              }
            }
          },
        }
      }
    }
    getTableSchema():void{
      this.schema = {
        properties: {
          title:{title:'标题',type:'string'},
          _relate:{title:'字段名',type:'string'},
          index:{title:'映射名称',type:'string'},
        }
      }
    }
    handlerSt(){  //处理st表格数据
      let obj = {...this.record}
      return obj
    }
    handlerStButton(){  //处理stButton表格数据
      let obj = {...this.record}
      obj.component?(obj['modal']={},obj['modal']['component'] = this.record.component,delete obj.component):''
      return obj
    }
    handlerOperate(){ //处理操作区弹窗数据
      let template = {
        modal:['option'],
        serviceUrl:['selectionsFlag','afterOption','url'],
        export:['exportColumns','url'],
      }
      let total =['option','selectionsFlag','afterOption','exportColumns','url']
      let obj = {...this.record}
      if(template[obj.click]){
        total.forEach(ele=>{
          template[obj.click].indexOf(ele)==-1?(obj[ele]?delete obj[ele]:''):''
        })
      }else{
        total.forEach(ele=>{
          obj[ele]?delete obj[ele]:''
        })
      }
      console.log(obj)
      return obj
    }
    close():void{
      this.modal.destroy();
    }
    save():void{
      this.record = {...this.sf.value}
      //需要是否存在重名
      switch(this.type){
        case 'stButton':this.modal.close(this.handlerStButton());break;
        case 'st':this.modal.close(this.handlerSt());break;
        case 'operate':this.modal.close(this.handlerOperate());break;
      }
      console.log(this.record,this.type)
    }
}
