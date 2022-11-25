import { Component, OnInit , Input, ViewChild, Output, EventEmitter,} from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { DelonFormModule, SFSchema } from '@delon/form';
import {HttpClient, HttpParams} from '@angular/common/http'
import { NzModalService } from 'ng-zorro-antd';
import { EditModalComponent } from '../modal/edit-template.components';
import { ActivatedRoute } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AddModalComponent } from '../modal/add-template.components';
import { Console } from 'console';
import { RESOURCE_CACHE_PROVIDER } from '@angular/platform-browser-dynamic';
@Component({
  selector: 'app-search-area',
  template: `
  <div class="search-area">
    <div style="font-size: 26px;">查询区</div>
    <div class="search-row">
      <div>
        <span class="btn-plus" (click)="add()">
          <i nz-icon nzType="plus" nzTheme="outline"></i>
        </span>
        点击编辑：
      </div>
      <div style="display:flex;flex-wrap:wrap;" >
        <span *ngFor="let item of data.searchFields;let i = index" class="inputBox">
            {{item.config.title}}:
            <input nz-input  [value]="item.key" class="nz-input" (click)="edit(item.key,i)"/>
            <i nz-icon nzType="close-circle" nzTheme="fill" class="btn deleteBtn" (click)="del(item)"></i>
            <i nz-icon nzType="left" nzTheme="outline" class="btn leftBtn" (click)="move('left',i)"></i>
            <i nz-icon nzType="right" nzTheme="outline" class="btn rightBtn" (click)="move('right',i)"></i>
        </span>
      </div>
    </div>
</div>
  `,
  styles: [`
  .search-area{
    margin:0px 30px 20px 30px;
  }
  .search-row{
    margin:8px 0;
    align-items: center;
  }
  .nz-select{
    margin-right:30px;
  }
  .btn-plus{
    display:inline-block;
    margin-right:20px;
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
    margin:5px 0;
  }
  .inputBox{
    position:relative;
    padding:5px 10px;
    margin-top:15px;
    margin-right:15px;
  }
  .deleteBtn{
    right:-5px;
    top:-10%;
    font-size:20px;
    color:red;
  }
  .leftBtn{
    left:-12px;
    height:50%;
    transform: translateY(14px);
  }
  .rightBtn{
    right:-12px;
    height:50%;
    transform: translateY(14px);
  }
  .btn{
    position:absolute;
    display:none;
    background-color:none;
    cursor:pointer;
  }
  .inputBox:hover .btn{
    display:inline-block;
  }
  `]
})
export class SearchAreaComponent implements OnInit {
  @ViewChild('sf', { static: false })
  sf:SFSchema;
  @Input() fatherComponent:any;
  @Output() getSearch = new EventEmitter();
  _data:any={
    searchFields:[]
  };
  schema: SFSchema = {
    properties: {
    }
  };
  record:any
  constructor(
    private http:HttpClient,
    private modalSrv: NzModalService,
    private route: ActivatedRoute,
    ){}
  value=""
  selectedValue=""
  title=''
  listOfData = []
  data:any={
    mateRules:[],
    searchFields:[]
  };

  ngOnInit() {
  }
  getData(data){
    this.data = data['sf-search']
  }
  move(forward,index){
    let mateRules = [...this.data.mateRules]
    let searchFields = [...this.data.searchFields]
    if(forward == 'left'){   //向前移
      if(index == 0){
        this.modalSrv.create({
          nzContent: '该字段已是最前',
          nzFooter: [
            {label: '关闭',onClick: () => {this.modalSrv.closeAll()}}
          ]
        });
      }else{
        mateRules[index] =this.data.mateRules[index - 1]
        searchFields[index] =this.data.searchFields[index - 1]
        mateRules[index - 1] = this.data.mateRules[index]
        searchFields[index - 1] =this.data.searchFields[index]
        let data = {id:this.data.id,mateRules,searchFields}
        this.data = data
      }
    }
    if(forward == 'right'){
      if(index == this.data.mateRules.length -1){
        this.modalSrv.create({
          nzContent: '该字段已是最后',
          nzFooter: [
            {label: '关闭',onClick: () => {this.modalSrv.closeAll()}}
          ]
        });
      }else{
        mateRules[index] =this.data.mateRules[index + 1]
        searchFields[index] =this.data.searchFields[index + 1]
        mateRules[index + 1] = this.data.mateRules[index]
        searchFields[index +1] =this.data.searchFields[index]
        let data = {id:this.data.id,mateRules,searchFields}
        this.data = data
      }
    }
  }
  add(){
    this.getSearch.emit(this.data)
  }
  del(item){
    this.modalSrv.create({
      nzContent:'确定要删除吗?',
      nzStyle:{

      },
      nzOnOk:()=>{
        let mateRules = this.data.mateRules.filter(ele=>ele.key != item.key)
        let searchFields = this.data.searchFields.filter(ele=>ele.key != item.key)
        this.data = {id:this.data.id,mateRules,searchFields}
      }
    })
  }
  edit(value,index){
    console.log('点击了编辑',this.data)
    this.data.findIndex = index
    this.getSearch.emit(this.data)
  }
}
