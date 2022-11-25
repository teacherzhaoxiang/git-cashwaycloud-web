import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {STChange, STColumn, STComponent, STData, STPage} from '@delon/abc';
import {SFComponent, SFSchema, SFSchemaEnum, SFSchemaEnumType} from '@delon/form';
import {ActivatedRoute, Params} from '@angular/router';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {environment} from './../../../../environments/environment';
import {DictonaryDetailDrawerComponent} from './dictonary.detail';
import {DictonaryEditModalComponent} from './dictonary.edit';
import {UserEditModalComponent} from '../user/user.edit';
import {DictonaryAddModalComponent} from './dictonary.add';
import {UserService} from '../../service/user.service';
import {DictonaryTypeAddModalComponent} from './dictonary-type.add';
import {DictonaryTypeEditModalComponent} from './dictonary-type.edit';
import { Location } from '@angular/common';
import { deepCopy } from '@delon/util';
@Component({
  selector: 'app-dictonary',
    template: `
      <page-header [title]="pageTitle"></page-header>
      <nz-card class="split-container card_container">
          <sf #sf mode="search" [schema]="searchSchema" (formSubmit)="refresh()" [formData]="params" button="none" (formReset)="sf.reset()">
          </sf>

          <nz-row  style="padding: 10px">
              <nz-col [nzSpan]="12">
<!--                  <button nz-button (click)="addType()" class="ant-btn ant-btn-primary" *ngIf="showButton['新增类型']" ><i *ngIf="userService.user.sysUserExtensionDO.buttonIcon==1 " class="anticon-cashway anticon-cashway-add"></i>新增类型</button>-->
                  <button nz-button (click)="add()" class="ant-btn ant-btn-primary" *ngIf="showButton['新增']"><i *ngIf="userService.user.sysUserExtensionDO.buttonIcon==1 " class="anticon-cashway anticon-cashway-add"></i>新增</button>
                  <button nz-button (click)="deletes()" class="ant-btn ant-btn-danger" *ngIf="showButton['删除']"><i *ngIf="userService.user.sysUserExtensionDO.buttonIcon==1  " class="anticon-cashway anticon-cashway-delete"></i>删除</button>
              </nz-col>
              <nz-col [nzSpan]="12">    
                  <div style="float: right" >
                      <button nz-button (click)="buttonGetData()" class="ant-btn ant-btn-primary" ><i *ngIf="userService.user.sysUserExtensionDO.buttonIcon==1" class="anticon-cashway anticon-cashway-search"></i>查询</button>
                      <button nz-button (click)="buttonReset()" class="ant-btn" ><i *ngIf="userService.user.sysUserExtensionDO.buttonIcon==1" class="anticon-cashway anticon-cashway-reset"></i>重置</button>
                  </div>
              </nz-col>
          </nz-row>

          <st class="table" #st [data]="data" [columns]="columns" [req]="{params: params}" [page]="page" [total]="total" (change)="tableChange($event)"></st>
      </nz-card>
  `,
    styles:[`
        :host ::ng-deep .table .ng-star-inserted{
            text-align: center;
        }
        :host ::ng-deep .ng-star-inserted a{
            white-space: nowrap
        }
    `]
})
export class DictonaryTableComponent implements OnInit {
  // 查询条件绑定参数
  params: any = {};
  // 表格中数据绑定参数
  data: any;
  // 对象id，唯一标识一个页面
    pageTitle = '数字字典管理';
  newPerms: any = 'sys:role:save';
  deletePerms: any = 'sys:role:delete';
  @ViewChild('sf', { static: true })
  sf: SFComponent;
  searchSchema: any = {
    properties: {
        /*type: {type: 'string', title: '字典类型', maxLength: 50,
        ui: {
            width: 300,
            widget: 'select',
            asyncData: () => this.http.get<SFSchemaEnumType[]>(environment.manage_server_url + '/sys/dictonarys/type')
        }},*/
        key: {type: 'string', title: '字典key', maxLength: 50, ui: {width: 300}},
        value: {type: 'string', title: '字典值', maxLength: 50, ui: {width: 300}},
       /* language: {
            type: 'string', title: '语言',
            ui: {width: 300, widget: 'select'},
            enum: [
                    {label: '全部', value: ''},
                    {label: '中文', value: 'CN'},
                ],
        }*/
    }
  };
  // 数据总数
  total = 0;
  // 分页参数
  page: STPage = {
    front: false,
    showQuickJumper: true,
    total: true,
    showSize: true
  };
    pageNumber = 1;
    pageSize = 10;
    selections: STData[] = [];
    // 当前页
// 绑定分页参数改变想要事件
    tableChange(e: STChange) {
        if (e.type == 'pi' || e.type == 'ps') {
            this.pageNumber = e.pi;
            this.pageSize = e.ps;
            this.getData();
        }

        if (e.checkbox != undefined) {
            this.selections = e.checkbox;
        }
    }

  constructor(private location: Location , private http: _HttpClient, private message: NzMessageService, private route: ActivatedRoute, private modalSrv: NzModalService, public userService: UserService) {}

  // 表格绑定参数
  columns: STColumn[] = [
      { title: '选中', index: 'checked', type: 'checkbox', },
      /*{ title: '字典类型key', index: 'type' },
      { title: '字典类型值', index: 'typeValue' },*/
      { title: '字典key', index: 'key' },
      { title: '字典值', index: 'value' },
      { title: '参数描述', index: 'description' },

      { title: '状态', index: 'status', type: 'badge',
          badge: {'0': {text: '启用', color: 'success'}, '1': {text: '停用', color: 'error'}}, default: '0' },
    /*  { title: '语言', index: 'language', type: 'badge',
          badge: {'CN': {text: '中文', color: 'success'}, 'EN': {text: '英文', color: 'success'}}, default: 'CN'  },*/
      // { title: '字典语言', index: 'language',type: "badge",
      //     badge: {"CN": {text: "中文",color: "success"},"EN": {text: "英文",color: "Processing"}},default:"CN"  },
     /* { title: '排序', index: 'orderNum' },*/
      { title: '操作',
          buttons: [
              // {text: "编辑",icon: "edit",type: "modal",modal: {component: DictonaryEditModalComponent,modalOptions:{nzMaskClosable:false},},click: (recode:any,modal)=>{this.edit(recode,modal)}},
              {text: '编辑', icon: 'edit', type: 'modal', click: (recode: any) => {this.editWho(recode); }},
               {text: '复制', icon: 'edit', type: 'modal', click: (recode: any) => {this.copyWho(recode); }},
              {text: '详情', type: 'drawer', drawer: {title: '信息', component: DictonaryDetailDrawerComponent, }, click: (recode: any, modal) => {this.detail(recode, modal); }},
            //   {text: '删除', icon: 'delete', type: 'del', click: (recode: any) => {this.delete(recode); }},
              {text: '删除', icon: 'delete', type: 'modal', click: ($event) => {this.delete($event); }},
          ]
      }
   ];
   id:string = ''
   menuButton : object  = JSON.parse(localStorage.getItem('menuButton'))
    showButton = {
        '新增':false,
        '删除':false,
        '新增类型':false
    }
    buttonFilter(){
        //表格区的按钮屏蔽
        this.id = this.location.path().split('/')[this.location.path().split('/').length - 1 ]
        this.menuButton[this.id].forEach(ele=>{
            this.showButton[ele.text] = true
        })
        let columns = deepCopy(this.columns)
        let index = columns.findIndex(ele=>ele['title'] == '操作')
        columns[index]['buttons'] = columns[index]['buttons'].filter(item=> this.showButton[item.text] )
        this.columns = columns
        console.log(this.menuButton[this.id],'允许的按钮')
        //按钮区的按钮屏蔽
        
    }
    editWho(recode) {
        // 数据字典编辑
        if (recode.key != null && recode != undefined) {
            recode.typeValue = '';
            const modal = this.modalSrv.create({
                // nzTitle: '数据字典管理',
                nzContent: DictonaryEditModalComponent,
                nzComponentParams: {
                    record: recode
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
                this.getData();
            });
        } else {
        // 数据字典类型编辑
            this.editType(recode);

        }
    }
    copyWho(recode) {
        recode.id = null;
        // 数据字典编辑
        if (recode.key != null && recode != undefined) {
            recode.typeValue = null;
            const modal = this.modalSrv.create({
                //nzTitle: '数据字典管理',
                nzContent: DictonaryAddModalComponent,
                nzComponentParams: {
                    record: recode
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
                this.getData();
            });
        } else {
            const modal = this.modalSrv.create({
                //nzTitle: '数据字典类型管理',
                nzContent: DictonaryTypeAddModalComponent,
                nzComponentParams: {
                    record: recode
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
                this.getData();
            });

        }
    }

    add() {
        const modal = this.modalSrv.create({
            //nzTitle: '数据字典管理',
            nzContent: DictonaryAddModalComponent,
            nzComponentParams: {
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
            this.getData();
        });
    }

    editType(recode) {
        const modal = this.modalSrv.create({
            // nzTitle: '数据字典类型管理',
            nzContent: DictonaryTypeEditModalComponent,
            nzComponentParams: {
                record: recode
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
            this.getData();
        });
    }

    addType() {
        const modal = this.modalSrv.create({
            //nzTitle: '数据字典类型管理',
            nzContent: DictonaryTypeAddModalComponent,
            nzComponentParams: {

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
            this.getData();
        });
    }


  edit(record, modal) {
      if (modal) {
          this.getData();
      }
  }



  detail(record, modal) {
      // if(modal["result"]){
      //     this.getData()
      // }
  }

    // delete(record) {
    //     const param: any = {ids: [record.id]};
    //     this.http.delete(environment.manage_server_url + '/sys/dictonarys', param).subscribe((res: any) => {
    //         const code = res['code'];
    //         if (code != null) {
    //             if (code == 0 || code == 200) {
    //                 this.message.info(('数据删除成功'));
    //             } else {
    //                 this.message.error(res['msg']);
    //             }
    //         } else {
    //             this.message.info(('数据删除成功'));
    //         }
    //         this.getData();
    //     });
    // }
    delete($event) {
        const modal = this.modalSrv.create({
            nzTitle: '确认删除',
            nzContent: '请确认是否删除该信息',
            nzComponentParams: {
            },
            nzStyle:{
                width: '900px',
                position:'fixed',
                left:'50%',
                top:'50%',
                transform:"translate(-50%,-50%)"
            },
            nzOnOk:()=>{
                const param: any = {ids: [$event['id']]};
                this.http.delete(environment.manage_server_url + '/sys/dictonarys', param).subscribe((res: any) => {
                    const code = res['code'];
                    if (code != null) {
                        if (code == 0 || code == 200) {
                            this.message.info(('数据删除成功'));
                        } else {
                            this.message.error(res['msg']);
                        }
                    } else {
                        this.message.info(('数据删除成功'));
                    }
                    this.getData();
                });
            }
        });
    }

    deletes(): void {
        if (this.selections == null || this.selections.length == 0) {
            this.message.error(('请选择一条数据'));
            return;
        }
        this.modalSrv.confirm({
            nzTitle     : '确定删除?',
            nzContent   : '<b style="color: red;"></b>',
            nzOkText    : '是',
            nzOkType    : 'danger',
            nzOnOk      : () => {this.showDeleteConfirm(); },
            nzCancelText: '否',
            nzOnCancel  : () => console.log('Cancel')
        });
    }

    showDeleteConfirm() {
        const selectedIds: Array<string> = [];
        for (const selection of this.selections) {
            selectedIds.push(selection['id']);
        }
        if (selectedIds.length == 0) {
            this.message.info('请选择其中一项');
            return;
        }
        const param: any = {ids: selectedIds};
        this.http.delete(environment.manage_server_url + '/sys/dictonarys', param).subscribe((res: any) => {
            const code = res['code'];
            if (code != null) {
                if (code == 0 || code == 200) {
                    this.message.info(('数据删除成功'));
                } else {
                    this.message.error(res['msg']);
                }
            } else {
                this.message.info(('数据删除成功'));
            }
            this.getData();
        });

        this.selections = [];
    }



    refresh() {
        this.getData();
    }
    // 查询
    buttonGetData() {
        this.pageNumber = 1;
        this.getData();
    }
    // 重置
    buttonReset(){
        this.sf.reset();
        this.getData();
    }
    getData() {
        let params = {};
        if (this.sf.value != undefined) {
            params = this.sf.value;
        }
        params['pageSize'] = this.pageSize;
        params['pageNumber'] = this.pageNumber;
        const sendParams: any = {filter: JSON.stringify(params)};
        this.http.get(environment.manage_server_url + '/sys/dictonarys', sendParams).subscribe((res: any) => {
            this.data = res['rows'];
            this.total = res['total'];
        });
    }

  ngOnInit() {
      this.buttonFilter();
      this.getData();
  }
}
