import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {STChange, STColumn, STComponent, STData, STPage} from '@delon/abc';
import {SFComponent, SFSchema, SFSchemaEnum, SFSchemaEnumType} from '@delon/form';
import {ActivatedRoute, Params} from '@angular/router';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {environment} from './../../../../environments/environment';
import {UserEditModalComponent} from './user.edit';
import {UserDetailDrawerComponent} from './user.detail';
import {UserAddModalComponent} from './user.add';
import {UserService} from '../../service/user.service';
import { Location } from '@angular/common';
import { deepCopy } from '@delon/util';
let TIMEOUT = null;
@Component({
  selector: 'app-user',
  templateUrl: './../table.template.html',
    styles:[
        `
             ::ng-deep  .ant-select-dropdown-menu-item{
               white-space: normal;
            }
`]
})

export class UserTableComponent implements OnInit {
    loading = false;
  // 查询条件绑定参数
  params: any = {};
  // 表格中数据绑定参数
  data: any;
  // 对象id，唯一标识一个页面
  // id = "user";
  // name = "用户管理";
    pageTitle = '用户管理';
  @ViewChild('sf', { static: true })
  sf: SFComponent;
  orgValue: any;
  newPerms: any = 'sys:user:save';
  deletePerms: any = 'sys:user:delete';
  searchSchema: any = {
    properties: {
        org: {type: 'string', title: '所属机构', maxLength: 100, default: null,
            ui: {
                width:300,
                hidden: environment['orgTree']
            },
            // ui: {
            //         widget: 'org-tree-cashway',
            //         layer: 1
            //     }
            },
        orgId: {type: 'string', title: '所属机构', maxLength: 100, default: null,
            ui: {
                    widget: 'org-tree-cashway',
                    layer: 1,
                hidden:!environment['orgTree']
                }
        },
         //orgName: {type: 'string', title: '机构名称', maxLength: 100, ui: {width: 300}},
        //orgIdTemp: {type: 'string', title: '所属机构', maxLength: 100, default: null, ui: {width: 300, widget: 'org-tree-cashway'}},
        userName: {type: 'string', title: '操作员账号', maxLength: 50, ui: {width: 300}},
        contact: {type: 'string', title: '操作员名称', maxLength: 50, ui: {width: 300}, format: 'regex', pattern: '^[\u4e00-\u9fa5.\\·]{1,20}$'}
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
    showLoading:boolean = true
    showLoadingAnime(judge){
        if(judge == 'show'){
            this.showLoading = true
            setTimeout(()=>{
                this.showLoading = false
            },1500)
        }
        if(judge == 'close'){
            if(this.showLoading == true){
                setTimeout(()=>{
                    this.showLoading = false
                },300)
            }
        }
    }
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
  columns: any = [
      { title: '选中', index: 'checked', type: 'checkbox', },
      { title: '操作员账号', index: 'userName' },
      { title: '操作员名称', index: 'contact' },
      {
          //title: '用户类型', index: 'userType', type: 'tag',
          tag:{'0': {text: '认证平台', color: 'blue'}, '1': {text: '本地用户', color: 'green'},}
      },
       { title: '邮箱', index: 'email' },
      { title: '手机号码', index: 'mobile'},
      //{ title: '微信号', index: 'wechatId' },

      { title: '用户状态', index: 'status', type: 'badge',
          badge: {'0': {text: '失效', color: 'error'}, '1': {text: '正常', color: 'success'}} },
      { title: '是否锁定', index: 'lockStatus', type: 'badge',
          badge: {'0': {text: '是', color: 'error'}, '1': {text: '否', color: 'success'}} },
       { title: '备注', index: 'remark' },
      { title: '所属机构', index: 'orgName'},
      { title: '操作',
          buttons: [
              {text: '编辑', icon: 'edit', type: 'modal', modal: {modalOptions: {
                          nzMaskClosable: false,
                          nzClosable:false,
                          nzBodyStyle:{width: 0,background:'rgba(0,0,0,0)',position:'fixed',left:'50%','margin-left':'-400px',top:'50%',"transform":"translateY(-50%)"}
              }, component: UserEditModalComponent}, click: (recode: any, modal) => { this.edit(recode, modal); } },

            //   { text: '详情', type: 'drawer', drawer: { title: '信息', component: UserDetailDrawerComponent }, click: (recode: any, modal) => { this.detail(recode, modal); } },
            {text: '删除',icon: 'delete', type: 'modal', click: ($event) => {this.delete($event); }},
            //   {text: '删除', icon: 'delete', pop: true, popTitle: '是否确认删除数据', click: (recode: any) => {this.delete(recode); }},
              { text: '重置密码', click: (recode: any) => { this.resetPasswd(recode); }, pop: true, popTitle: '是否确认重置该用户密码' },

            //   {text: '更多', children: [
            //       {text: '禁用', click: (recode: any) => {this.forbidden(recode); }, pop: true, popTitle: '是否确认禁用该用户', iif: (item: any) => item.status === 1, },
            //       {text: '启用', click: (recode: any) => {this.activate(recode); }, pop: true, popTitle: '是否确认启用该用户', iif: (item: any) => item.status === 0},
            //       {text: '解锁', click: (recode: any) => {this.unlock(recode); }, pop: true, popTitle: '是否确认解锁该用户', iif: (item: any) => item.lockStatus === 0}]
            //   }
          ]
      }
   ];
   menuButton : object  = JSON.parse(localStorage.getItem('menuButton'))
   showButton = {
       '新增':true,
       '删除':true
   }
   id:string;
   buttonFilter(){
       //表格区的按钮屏蔽
       this.id = this.location.path().split('/')[this.location.path().split('/').length - 1 ]
       this.menuButton[this.id].forEach(ele=>{
           this.showButton[ele.text] = true
       })
       console.log(this.showButton)
       let columns = deepCopy(this.columns)
       let index = columns.findIndex(ele=>ele['title'] == '操作')
       columns[index]['buttons'] = columns[index]['buttons'].filter(item=> !this.showButton[item.text] )
       this.columns = columns
       console.log(this.menuButton[this.id],'允许的按钮')
       //按钮区的按钮屏蔽

   }
  add() {
      const modal = this.modalSrv.create({
          //nzTitle: '用户管理',
          nzContent: UserAddModalComponent,
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
      console.log("===================edit=====");
      if (modal) {
          this.getData();
      }
  }

  detail(record, modal) {
      // if(modal["result"]){
      //     this.getData();
      // }
  }

  resetPasswd(record) {
      const param: any = {'id': record['id']};
        this.http.put(environment.manage_server_url + '/sys/users/password/reset', null, param).subscribe((res: any) => {
            this.message.info('密码重置成功，初始密码：' + res['msg']);
        });
  }

//   delete(record) {
//       const param: any = {ids: [record.id]};
//     this.http.delete(environment.manage_server_url + '/sys/users', param).subscribe((res: any) => {
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
//   }
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
            this.http.delete(environment.manage_server_url + '/sys/users', param).subscribe((res: any) => {
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
        this.http.delete(environment.manage_server_url + '/sys/users', param).subscribe((res: any) => {
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

  forbidden(record) {
    this.http.put(environment.manage_server_url + '/sys/users/disable/' + record.id).subscribe((res: any) => {
        this.message.info('用户已被禁用');
        this.getData();
    });
  }

  activate(record) {
      this.http.put(environment.manage_server_url + '/sys/users/enable/' + record.id).subscribe((res: any) => {
          this.message.info('用户已启用');
          this.getData();
      });
  }

    unlock(record) {
        this.http.put(environment.manage_server_url + '/sys/users/unlock/' + record.id).subscribe((res: any) => {
            this.message.info('用户已解锁');
            this.getData();
        });
    }

  refresh() {
      this.getData();
  }

    buttonGetData() {
        this.loading = true;
        TIMEOUT = setTimeout(() => {
            this.loading = false;
            clearTimeout(TIMEOUT);
        }, 5000);
        this.pageNumber = 1;
        this.getData();
    }

    buttonReset() {
        this.sf.reset();
        this.buttonGetData();
    }

  getData(){
    this.showLoadingAnime('show')
      let params = {}
      if(this.sf.value!= undefined){
          params = this.sf.value;
      }
      params['pageSize'] = this.pageSize;
      params['pageNumber'] = this.pageNumber;
      const sendParams: any = {filter: JSON.stringify(params)};
      this.http.get(environment.manage_server_url + '/sys/users?perms=sys:user', sendParams).subscribe((res: any) => {
        this.showLoadingAnime('false')
          this.data = res['rows'];
          this.total = res['total'];
      },error=>{

      },()=>{
          this.loading = false;
          clearTimeout(TIMEOUT);
      });
  }

  ngOnInit() {
      // if(environment['orgTree'] == null || environment['orgTree'] == false){
      //     this.searchSchema.properties.orgId = this.searchSchema.properties.orgIdTemp;
      // }
      // delete this.searchSchema.properties.orgIdTemp;
      this.getData();
     // this.buttonFilter();
      console.log('aaas');
  }
}
