import { Component, OnInit,Input ,Output,ViewChild, EventEmitter} from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { DelonFormModule, SFSchema ,SFComponent} from '@delon/form';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http'
import { ActivatedRoute } from '@angular/router';
import { AddModalComponent } from '../modal/add-template.components';
import { EditModalComponent } from '../modal/edit-template.components';
import { type } from 'os';
import { deepCopy } from '@delon/util';
@Component({
  selector: 'app-operate-area',
  template: `
  <div class="operate-area">
    <div style="font-size: 26px;">操作区</div>
    <div class="operate-row">
      <span class="btn btn-plus" (click)="add()">
        <i nz-icon nzType="plus" nzTheme="outline"></i>
      </span>
      <span *ngFor="let item of data;let i = index" class="btn">
          <a nz-dropdown [nzDropdownMenu]="menu1"  style="">
            <button nz-button [nzType]="item.type" style="width:80px" (click)="edit(item,i)">{{item.label}}</button>
          </a>
          <nz-dropdown-menu #menu1="nzDropdownMenu" >
            <ul nz-menu style="margin-top:7px;">
              <li nz-menu-item (click)="edit(item,i)">配置按钮</li>
              <li nz-menu-item (click)="del(item,i)">删除按钮</li>
              <li nz-menu-item *ngIf="item.type == 'add'" nz-submenu nzTitle="sf-edit">
                <ul>
                  <li nz-menu-item (click)="sfEditEdit('sf-edit-public')">公共配置</li>
                  <li nz-menu-item *ngFor="let item of sfEdit.editField;let i = index" (click)="sfEditEdit(i)">{{item.key}}</li>
                  <li nz-menu-item (click)="sfEditEdit('sf-edit-new')">新建字段</li>
                </ul>
              </li>
              <li nz-menu-item nz-submenu nzTitle="移动">
                <ul>
                  <li nz-menu-item (click)="move('front',i)">往前移</li>
                  <li nz-menu-item (click)="move('back',i)">往后移</li>
                </ul>
              </li>
            </ul>
          </nz-dropdown-menu>
      </span>
    </div>
  </div>
  `,
  styles: [`
    .operate-area{ 
        margin:30px 30px;
    }
    .operate-row{
        margin-top:20px;
    }
    .btn{
        margin-right:20px;
    }
    .btn-plus{
      display:inline-block;
      box-sizing: border-box;
      color:white;
      background-color:#1890FF;
      width:20px;
      height:20px;
      border-radius: 50%;
      text-align:center;
      line-height: 20px;
      cursor:pointer
    }
    .nz-input{
      width:150px;
      cursor: pointer;
      margin:5px 20px 5px 0;
    }
    .relateName:hover{
      color:red;
    }
    .relateDel{
      margin:0 5px ;
    }
    .relateDel:hover{
      color:red;
    }
    `]
})
export class OperateAreaComponent implements OnInit {
  constructor(
    private modalSrv: NzModalService,
    private http:HttpClient,
    private route: ActivatedRoute
    ) { }
  title:string;
  data:any=[];
  @Input() fatherComponent:any;
  @Output() newItemEvent = new EventEmitter<string>();
  @Output() passSfEdit = new EventEmitter();
  addButtonArr=[];
  selectedButton:any;
  sfEdit:any={editField:[]};
  ngOnInit() {
  }
  getButton(data){
    this.data = data['operation']['operations']
    this.sfEdit = data['sf-edit']
  }
  move(forward,index){
    let data = deepCopy(this.data)
    if(forward == 'front'){   //向前移
      if(index == 0){
        this.modalSrv.create({
          nzContent: '该按钮已是最前',
          nzFooter: [
            {label: '关闭',onClick: () => {this.modalSrv.closeAll()}}
          ]
        });
      }else{
        data[index] =this.data[index - 1]
        data[index - 1] = this.data[index]
        this.data = data
      }
    }
    if(forward == 'back'){
      if(index == this.data.length -1){
        this.modalSrv.create({
          nzContent: '该按钮已是最后',
          nzFooter: [
            {label: '关闭',onClick: () => {this.modalSrv.closeAll()}}
          ]
        });
      }else{
        data[index] =this.data[index + 1]
        data[index + 1] = this.data[index]
        this.data = data
      }
    }
  }
  add(){
    console.log('点击了add')
    this.modalSrv.create({
      nzTitle: '',
      nzContent: AddModalComponent,
      nzMaskClosable:false,
      nzComponentParams: {
        type:'operate'
      },
      nzFooter: null
    }).afterClose.subscribe(res=>{
        if(res){
          let data = deepCopy(this.data)
          data.push(res)
          this.data = data
        }
    })
  }
  edit(item,i){
    this.modalSrv.create({
      nzTitle: '',
      nzContent: EditModalComponent,
      nzComponentParams: {
        data:item,
        type:'operate'
      },
      nzFooter: null
    }).afterClose.subscribe(res=>{
      if(res){
        this.data[i] = res
      }
    })
  }
  sfEditEdit(i){
    if(i == 'sf-edit-public'){
      this.sfEdit['from'] = i
      this.passSfEdit.emit(this.sfEdit)
    }
    if(typeof(i) == 'number'){
      this.sfEdit.findIndex = i
      this.sfEdit.from = 'sf-edit-relate'
      this.passSfEdit.emit(this.sfEdit)
    }
    if(i == 'sf-edit-new'){
      this.sfEdit['from'] = i
      this.passSfEdit.emit(this.sfEdit)
    }
  }
  del(item,index){
    this.modalSrv.create({
      nzContent:'确定要删除这个按钮吗?',
      nzStyle:{
        position:'absolute',
        top:'50%',
        left:'50%',
        transform:'translate(-50%,-50%)'
      },
      nzOnOk:()=>{
        console.log('点击了删除',item,index)
        delete this.data[index]
        this.data = this.data.filter(ele=>ele)
      }
    })
  }
}
