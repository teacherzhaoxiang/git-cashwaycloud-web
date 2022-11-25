import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DelonFormModule, SFComponent, SFSchema, SFSelectWidgetSchema } from '@delon/form';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd/message';
import { config } from "process";
import {HttpClient} from '@angular/common/http'
import { environment } from "@env/environment";
import { Button } from "selenium-webdriver";
import { deepCopy } from "@delon/util";
@Component({

  selector: 'edit-modal',
  template: `
  <div class="table-edit-modal">
    <div class="left-container">
      <div class="sf-area">
        <sf #sf mode="edit" [(schema)]="schema" [(formData)]="record" button="none"></sf>
      </div>
      <div class="btn-area">
        <button nz-button type="button" (click)="close()" class="closeBtn">关闭</button>
        <button nz-button type="submit" (click)="save()" class=" save-btn">保存</button>
      </div>
    </div>
  </div>
  
  `,
  styles:[
    `
    ::ng-deep .ant-modal{
      width:60% !important;
    }
    .table-edit-modal{
      display:flex;
      justify-content:center;
      width:100%;
    }
    .left-container{
      width:60%;
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
export class EditModalComponent {
  data:any;//从search传过来的data
  _data:any;//请求回来的sf json数据
  constructor(private modal: NzModalRef,private http:HttpClient,private modalSrv: NzModalService){}
  @ViewChild('sf', { static: false }) private sf: SFComponent;
  @ViewChild('dropdownRender', { static: true }) private dropdownRender!: TemplateRef<void>;
  showRight=false;
  relateName:any;
  schema: any = {
    properties: {
    }
  };
  originSchema:SFSchema;
  from:any;
  type:any;//判断来自哪个区的edit弹窗
  record:any={};
    ngOnInit(): void {
      this.record.from?(this.type = this.record.from,delete this.record.from):''
      console.log(this.record)
      this.getSchemaData()
    }
    getSchemaData():void{
      if(this.type=='operate'){ //操作区弹窗
        let record = {...this.data}
        this.record = record
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
                {"label": "刷新","value": "refresh"},
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
            }
          }
        }
      }
      if(this.type=='st'){  //表格区数据分页弹窗
        this.schema = {
          properties: {
          title:{title:'标题',type:'string'},
          _relate:{title:'字段名',type:'string'},
          index:{title:'映射名称',type:'string'},
          }
        }
      }
      if(this.type == 'stButton'){  //表格区按钮分页弹窗
        this.schema = {
          properties: {
          text:{title:'标题',type:'string'},
          icon:{title:'图标',type:'string'},
          type:{title:'类型',type:'string',enum:['none','del','modal','static','drawer','link','serviceUrl','a']},
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
          },
          serviceUrl:{
            title:'serviceUrl',
            type:'string',
            ui:{
              visibleIf:{
                type:(value)=>(['serviceUrl'].indexOf(value) != -1)
              }
            }
          },
          approve_button:{
            title:'approve_button',
            type:'string',
            ui:{
              visibleIf:{
                type:(value)=>(['a'].indexOf(value) != -1)
              }
            }
          },
          field:{
            title:'field',
            type:'string',
            ui:{
              visibleIf:{
                type:(value)=>(['a'].indexOf(value) != -1)
              }
            }
          }

          }
        }
      }
    }
    handlerSt(){  //处理st表格数据
      let obj = {...this.record}
      return obj
    }
    handlerStButton(){   //处理stButton表格数据
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
      return obj
    }
    close():void{
      this.modal.destroy();
    }
    save():void{
      //需要进行数据上传等异步操作，接口待完成
      this.record = {...this.sf.value}
      this.handlerOperate()
      switch(this.type){
        case 'stButton':this.modal.close(this.handlerStButton());break;
        case 'st':this.modal.close(this.handlerSt());break;
        case 'operate':this.modal.close(this.handlerOperate());break;
      }
    }
}
