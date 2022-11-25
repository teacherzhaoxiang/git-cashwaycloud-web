import { Component, OnInit, ViewChild } from '@angular/core';
import { NzContextMenuService } from "ng-zorro-antd/dropdown";
import { STColumn } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { ModuleComponent} from "../module/module.component";
import {NzModalService} from "ng-zorro-antd";
import { FormCompletionComponent} from "../form-completion/form-completion.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'test',
  template: `
      <page-header></page-header>
      <div class="split-container">
          <as-split direction="horizontal" class="as-split-back"
                    (dragEnd)="resize('dragEnd', $event)"
                    (gutterClick)="resize('gutterClick', $event)">
              <as-split-area [size]="treeSize">
                  <as-split direction="vertical">
                      <as-split-area [size]="100">
                          <nz-card>
                              <app-list (outer)="getId($event)"></app-list>
                          </nz-card>
                      </as-split-area>
                  </as-split>
              </as-split-area>
              <as-split-area  [size]="tableSize">
                  <as-split direction="vertical">
                      <as-split-area [size]="100">
                          <nz-card [nzTitle]="menuTitle">
                              <!--<app-tab-template></app-tab-template>-->
                              <sf #sf mode="search" [schema]="searchSchema" [formData]="params" (formSubmit)="refresh()" (formReset)="st.reset(params)" button="none"></sf>
                              <nz-row  style="padding: 10px 0;">
                                  <nz-col [nzSpan]="12">
                                      <button nz-button (click)="add()" class="ant-btn ant-btn-primary" ><i  class="anticon-cashway anticon-cashway-add"></i>新增</button>
                                      <button nz-button (click)="deletes()" class="ant-btn ant-btn-danger"><i  class="anticon-cashway anticon-cashway-delete"></i>删除</button>
                                  </nz-col>
                                  <nz-col [nzSpan]="12">
                                      <div style="float: right" >
                                          <button nz-button (click)="buttonGetData()" class="ant-btn ant-btn-primary" ><i  class="anticon-cashway anticon-cashway-search"></i>查询</button>
                                          <button nz-button (click)="refresh()" class="ant-btn" ><i  class="anticon-cashway anticon-cashway-reset"></i>重置</button>
                                      </div>
                                  </nz-col>
                              </nz-row>
                              
                              <st #st [data]="data"  [columns]="columns"></st>
                              <!--<sf #sf mode="search" [schema]="searchSchema" [formData]="params" (formSubmit)="refresh()" (formReset)="st.reset(params)" button="none"></sf>-->
                              <!--<nz-row  style="padding: 10px 0;">-->
                              <!--<nz-col [nzSpan]="12">-->
                              <!--<button nz-button (click)="add()" class="ant-btn ant-btn-primary" ><i *ngIf="userService.user.sysUserExtensionDO.buttonIcon==1" class="anticon-cashway anticon-cashway-add"></i>新增</button>-->
                              <!--<button nz-button (click)="deletes()" class="ant-btn ant-btn-danger"><i *ngIf="userService.user.sysUserExtensionDO.buttonIcon==1" class="anticon-cashway anticon-cashway-delete"></i>删除</button>-->
                              <!--</nz-col>-->
                              <!--<nz-col [nzSpan]="12">-->
                              <!--<div style="float: right" >-->
                              <!--<button [nzLoading]="loading" nz-button (click)="buttonGetData(null)" class="ant-btn ant-btn-primary" ><i *ngIf="userService.user.sysUserExtensionDO.buttonIcon==1" class="anticon-cashway anticon-cashway-search"></i>查询</button>-->
                              <!--<button nz-button (click)="sf.reset(params)" class="ant-btn" ><i *ngIf="userService.user.sysUserExtensionDO.buttonIcon==1" class="anticon-cashway anticon-cashway-reset"></i>重置</button>-->
                              <!--</div>-->
                              <!--</nz-col>-->
                              <!--</nz-row>-->
                              <!--<st class="table" #st [data]="data" [columns]="columns" [req]="{params: params}" [page]="page" [total]="total" (change)="tableChange($event)"></st>-->
                          </nz-card>
                      </as-split-area>
                  </as-split>
              </as-split-area>
          </as-split>
      </div>
      
  `,
    styles: [
            `
            .as-split-back{
                background-image: url('./assets/tree-icon/tree-background.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            :host {
                display: block;
                width: 100%;
                height:  -webkit-calc(100% - 90px);
            }
           
        `]
})
export class TestComponent implements OnInit{
    constructor(private nzContextMenuService: NzContextMenuService, private message: NzMessageService, private modalSrv: NzModalService, private routes: ActivatedRoute, private router: Router) {}
    @ViewChild( 'st', { static: true } ) st: any;
    @ViewChild( 'sf', { static: true } ) sf: any;
   menuTitle:string = '';
    treeSize:number = 15;
    tableSize:number = 85;
  dateTime: any = '';
  showNum = 0;
  dateArr = [];
    columns: STColumn[] = [
        { title: '编号', index: 'id', type: 'checkbox' },
        { title: '序号', type: 'no' },
        { title: '姓名', index: 'name' },
        { title: '年龄', index: 'age' },
        {
            title: '操作区',
            buttons: [
                {
                    text: '编辑',
                    icon: 'edit',
                    type: 'modal',
                    click: (recode: any, modal) => {this.edit(recode, modal); },
                    modal: {
                        component: ModuleComponent,
                        modalOptions: {
                            nzMaskClosable: false,
                            nzClosable: false,
                            nzBodyStyle: {width: 0, background: 'rgba(0,0,0,0)', position: 'fixed', left: '50%', 'margin-left' : '-400px', top: '150px'}
                        }
                    }
                },
                {
                    text: '删除',
                    icon: 'delete',
                    type: 'del',
                    // pop: {
                    //     title: '确定删除？',
                    //     okType: 'danger',
                    //     icon: 'star',
                    // },
                    click: (record, _modal, comp) => {
                        this.message.success(`成功删除【${record.name}】`);
                        comp!.removeRow(record);
                    }
                }
                ]}
    ];
    data: any[] = Array(10)
        .fill({})
        .map((_item: any, idx: number) => {
            return {
                id: idx + 1,
                name: `name ${idx + 1}`,
                age: Math.ceil(Math.random() * 10) + 20,
            };
        });
    searchSchema = {
        properties: {
            email: {
                type: 'string',
                title: '邮箱',
                format: 'email',
                maxLength: 20
            },
            name: {
                type: 'string',
                title: '姓名',
                minLength: 3
            }
        }
    };
    params = {

    }

  changeCalendar(e){
      console.log(e)
    if(e.length==2){
      const date1 = new Date(e[0]);
      let dataStr1 = date1.getFullYear()+'-'+(date1.getMonth()+1)+'-'+date1.getDate();
      const date2 = new Date(e[1]);
      let dataStr2 = date2.getFullYear()+'-'+(date2.getMonth()+1)+'-'+date2.getDate();
      this.dateTime=[new Date('2020/04/21 00:00:00'),new Date('2020/04/22 23:59:59')];
      this.dateArr = [dataStr1,dataStr2];
    }
    console.log('----',this.dateTime)
  }
  confirmTime(e){  //触发确定事件
    console.log(this.dateTime);
    let time1 = this.formatDate(this.dateTime[0]);
    let time2 = this.formatDate(this.dateTime[1]);
    //this.setValue([this.dateArr[0]+' '+time1,this.dateArr[1]+' '+time2]);
  }
  ngOnInit() {
      this.routes.url.subscribe(params => {

        console.log(this.router.url);
        console.log(params);
      });
  }
  formatDate(dateStr){  //格式化时间
    const date = new Date(dateStr);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    let timeStr = (hours>9?hours:'0'+hours)+':'+(minutes>9?minutes:'0'+minutes)+':'+(seconds>9?seconds:'0'+seconds);
    return timeStr;
  }
    resize(type: string, e: {gutterNum: number, sizes: Array<number>}) {

        if (type === 'gutterClick') {
            this.gutterClick(e);
        } else if (type === 'dragEnd') {
            this.treeSize = e.sizes[0];
            this.tableSize = e.sizes[1];
        }
    }

    gutterClick(e: {gutterNum: number, sizes: Array<number>}) {
        if (e.gutterNum === 1) {
            if (this.treeSize > 0) {
                this.tableSize += this.treeSize;
                this.treeSize = 0;
            } else {
                this.treeSize = 20;
                this.tableSize = 80;
            }
        }
        // }
    }
    getId(e) {
        this.menuTitle = e.title;
        console.log(e.title);
    }
    edit(record, modal) {
        if (modal) {

        }
    }
    add() {
        const record = {parentId: '123'};
        const modal = this.modalSrv.create({
            //nzTitle: '菜单管理',
            nzContent: FormCompletionComponent,
            nzComponentParams: {
              //  record: record
            },
            nzFooter: null,
            nzMaskClosable: false,
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


        modal.afterClose.subscribe(() => {
            //this.getTableData(this.parentId);
        });
    }
    deletes() {
        this.modalSrv.confirm({
            nzTitle     : '确定删除?',
            nzContent   : '<b style="color: red;"></b>',
            nzOkText    : '是',
            nzOkType    : 'danger',
            nzOnOk      : () => {this.st.clear(); },
            nzCancelText: '否',
            nzOnCancel  : () => console.log('Cancel')
        });
    }
    refresh() {
        this.sf.reset();
    }
    buttonGetData() {
        console.log(this.sf.value);
    }
}
