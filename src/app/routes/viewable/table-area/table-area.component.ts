import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {STChange, STColumn, STComponent, STPage} from "@delon/abc";
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map, tap } from 'rxjs/operators';
import { Button } from 'selenium-webdriver';
import { Widget } from '@delon/form';
// import { TableDetailDrawerComponent } from '../drawer/table-detail-drawer.component';
import { EditModalComponent } from '../modal/edit-template.components';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Console } from 'console';
import { SplitAreaDirective, SplitComponent } from 'angular-split';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AddModalComponent } from '../modal/add-template.components';
import { deepCopy } from '@delon/util';
import { NzModalRef } from 'ng-zorro-antd';
@Component({
  selector: 'app-table-area',
  templateUrl:`./table-area.component.html`,
  styles:[`
    ::ng-deep .ant-divider-horizontal{
      margin:12px 0 18px 0;
    }
    ::ng-deep .ant-card-body{
      background-color: #FFFFFF;
    }
    .container{
      width:100%;
      height:100vh;
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
    .input-group-row{
      position:relative;
    }
  `]
})

export class TableAreaComponent implements OnInit {
  constructor(
    private modalSrv: NzModalService,
    private http:HttpClient,
    private route: ActivatedRoute
    ) {}
  @ViewChild('st',{static:true})  private st!: STComponent;  
  @ViewChild('editmodal',{static:true}) private editmodal!:EditModalComponent;
  viewFields=[]
  params = [];
  buttons = [];
  record = {}
  isVisible = false;
  columns: STColumn[] = [
    {title:'??????',index:'checkbox',type:'checkbox',width:'5%'},
    { title: '??????', index: 'title', width: '8%' },
    { title: '????????????', index: 'index', width: '10%' },
    { title: '?????????', index: '_relate', width: '15%' },
    { title: '?????????', index: 'type', width: '8%' },
    { title: '??????', buttons:[],width: '20%'},
  ];
  data:any;
  table:any;
  buttonColumns:STColumn[] = [
    {title:'?????????',index:'text'},
    {title:'??????',index:'icon'},
    {title:'??????',index:'type'},
    {title:'??????',buttons:[]}
  ]
  buttonData:any=[];
  dataColumns:STColumn[] = [
    {title:'??????',index:'checkbox',type:'checkbox',width:'8%'},
  ]
  title:any;
  tabIndex:any=0;
  ngOnInit():void{
    this.getStButtons()
    this.getButtonButtons()
  }
  getStButtons(){   //????????????????????????
    let buttons = []
    buttons.push({  //??????
        icon:'edit',
        modal:{
          modalOptions: {title:'??????',nzMaskClosable: true},
          component: EditModalComponent,
          params:(recode:any)=>{recode['from']='st'},
        },
        text:'??????',
        type:'modal',
        click:(recode,receive)=>{
          let index = this.viewFields.findIndex(ele=>ele.index == recode.index)
          delete receive.from
          let viewFields = deepCopy(this.viewFields)
          viewFields[index]={...receive}
          this.viewFields = viewFields
        },
      })
    buttons.push({  //??????
      click:(item)=>{
        let index = this.viewFields.findIndex(ele=>(ele.index === item.index))
        let viewFields = deepCopy(this.viewFields.filter((ele,i)=>i!=index))
        this.viewFields = viewFields
      },
      icon:'delete',
      text:'??????',
      type:'del'
    })
    buttons.push({  //????????????
      click:(value)=>{
        let index = this.viewFields.findIndex(ele=>ele['_relate'] === value['_relate'])
        if(value.type == 'checkbox'){ //checkbox????????????
          this.modalSrv.create({
            nzContent: '?????????????????????',
            nzFooter: [
              {label: '??????',onClick: () => {this.modalSrv.closeAll()}}
            ]
          });
        }else
        if((this.viewFields[0].type == 'checkbox' && index == 1)||(this.viewFields[0].type != 'checkbox' && index ==0)){  //?????????????????????
          this.modalSrv.create({
            nzContent: '?????????????????????',
            nzFooter: [
              {label: '??????',onClick: () => {this.modalSrv.closeAll()}}
            ]
          });
        }else{
          let newViewFileds = [...this.viewFields]
          newViewFileds[index] =this.viewFields[index - 1]
          newViewFileds[index - 1] = this.viewFields[index]
          this.viewFields = newViewFileds
        }
        console.log(index)
      },
      text:'??????',
      type:'default'
    })
    buttons.push({  //????????????
      click:(value)=>{
        let index = this.viewFields.findIndex(ele=>ele['_relate'] === value['_relate'])
        if(value.type == 'checkbox'){ //checkbox????????????
          this.modalSrv.create({
            nzContent: '?????????????????????',
            nzFooter: [
              {label: '??????',onClick: () => {this.modalSrv.closeAll()}}
            ]
          });
        }else
        if(index == this.viewFields.length-1){  //????????????????????????
          this.modalSrv.create({
            nzContent: '?????????????????????',
            nzFooter: [
              {label: '??????',onClick: () => {this.modalSrv.closeAll()}}
            ]
          });
        }else{
          let newViewFileds = [...this.viewFields]
          newViewFileds[index] =this.viewFields[index + 1]
          newViewFileds[index + 1] = this.viewFields[index]
          this.viewFields = newViewFileds
        }
        console.log(index)
      },
      text:'??????',
      type:'default'
    })
    this.columns[this.columns.findIndex(ele=>ele.buttons)].buttons = buttons
  }
  getButtonButtons(){   //????????????????????????
    let buttons = []
    buttons.push({  //??????
      icon:'edit',
      modal:{
        modalOptions: {
          title:'??????',
          nzMaskClosable: true,
        },
        component: EditModalComponent,
        params:(recode:any)=>{
          console.log(this.data,recode)
          recode['from']='stButton'
        },
      },
      click:(recode,receive)=>{
        let index = this.buttonData.findIndex(ele=>ele.text == recode.text)
        delete receive.from
        let buttonData = deepCopy(this.buttonData)
        buttonData[index]={...receive}
        this.buttonData = buttonData
      },
      text:'??????',
      type:'modal'
    })
    buttons.push({  //??????
      click:(item)=>{
        let index = this.buttonData.findIndex(ele=>(ele.text === item.text))
        let buttonData = deepCopy(this.buttonData.filter((ele,i)=>i!=index))
        this.buttonData = buttonData
        console.log('????????????')
      },
      icon:'delete',
      text:'??????',
      type:'del'
    })
    buttons.push({  //??????
      click:(value)=>{
        let index = this.buttonData.findIndex(ele=>ele['text'] === value['text'])
        if(index ==0){  //?????????????????????
          this.modalSrv.create({
            nzContent: '?????????????????????',
            nzFooter: [
              {label: '??????',onClick: () => {this.modalSrv.closeAll()}}
            ]
          });
        }else{
          let buttonData = deepCopy(this.buttonData)
          buttonData[index] =this.buttonData[index - 1]
          buttonData[index - 1] = this.buttonData[index]
          this.buttonData = buttonData
        }
      },
      text:'??????',
      type:'default'
    })
    buttons.push({  //????????????
      click:(value)=>{
        let index = this.buttonData.findIndex(ele=>ele['text'] === value['text'])
        if(index == this.buttonData.length-1){  //????????????????????????
          this.modalSrv.create({
            nzContent: '?????????????????????',
            nzFooter: [
              {label: '??????',onClick: () => {this.modalSrv.closeAll()}}
            ]
          });
        }else{
          let buttonData = deepCopy(this.buttonData)
          buttonData[index] =this.buttonData[index + 1]
          buttonData[index + 1] = this.buttonData[index]
          this.buttonData = buttonData
        }
      },
      text:'??????',
      type:'default'
    })
    this.buttonColumns[this.buttonColumns.findIndex(ele=>ele.buttons)].buttons = buttons

  }
  getData(data){  //??????????????????????????????
    this.data = data['st']
    console.log(this.data)
    this.table = data['table']
    this.viewFields =this.data.viewFields.filter(ele=>!ele.buttons).filter(ele=>ele.index!='checked')
    console.log(this.viewFields)
    this.handleButton()
  }
  handleButton(){  //??????????????????????????????
    let index = this.data.viewFields.findIndex(item=>item.buttons)  
    let buttons = []
    index!=-1?buttons = deepCopy(this.data.viewFields[index].buttons):''
    this.buttonData = []
    for(let key in buttons){
      console.log(buttons[key])
      if(buttons[key].modal&&buttons[key].modal.component){
        buttons[key].component = buttons[key].modal.component
        delete buttons[key].modal
      }
      this.buttonData.push({
        ...buttons[key]
      })
    }

  }
  indexChange($event){  //????????????
    // if($event == 2){
    //   console.log(this.viewFields)
    //   this.dataColumns = []
    //   for(let key in this.viewFields){
    //     this.dataColumns.push(this.viewFields[key])
    //   }
    // }
  }
  add(){
    let type;
    type = ['st','stButton'][this.tabIndex]
    this.modalSrv.create({
      nzTitle: '',
      nzContent: AddModalComponent,
      nzMaskClosable:false,
      nzComponentParams: {
        type:type,
      },
      nzFooter: null
    }).afterClose.subscribe(res=>{
      if(res){
        if(this.tabIndex == 0){   //st??????????????????
          let viewFields = deepCopy(this.viewFields)
          viewFields.push(res)
          this.viewFields = viewFields
        }
        if(this.tabIndex == 1){   //stButton??????????????????
          let buttonData = deepCopy(this.buttonData)
          buttonData.push(res)
          this.buttonData = buttonData
        }
      }
    })
  }
  del(){
    let checkedArr = this.st['_data'].filter(ele=>ele.checked)
    this.modalSrv.create({
      nzContent:'???????????????????',
      nzStyle:{
        // position:'absolute',
        // top:'50%',
        // left:'50%',
        // transform:'translate(-50%,-50%)'
      },
      nzOnOk:()=>{
        let viewFields = deepCopy(this.viewFields)
        viewFields = viewFields.filter(ele=>!checkedArr.some(item=>item.index == ele.index))
        this.viewFields = viewFields
      }
    })
  }
}
