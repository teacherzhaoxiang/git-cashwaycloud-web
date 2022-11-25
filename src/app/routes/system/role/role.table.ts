import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {STChange, STColumn, STComponent, STData, STPage} from '@delon/abc';
import {SFComponent, SFSchema, SFSchemaEnum, SFSchemaEnumType} from '@delon/form';
import {ActivatedRoute,Params} from '@angular/router';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {from} from "rxjs";
import {environment} from "./../../../../environments/environment"
import {RoleDetailDrawerComponent} from "./role.detail";
import {RoleEditModalComponent} from "./role.edit";
import {UserEditModalComponent} from "../user/user.edit";
import {UserAddModalComponent} from "../user/user.add";
import {RoleAddModalComponent} from "./role.add";
import {UserDetailDrawerComponent} from "../user/user.detail";
import {RoleAuthModalComponent} from "./role.auth";
import {UserService} from "../../service/user.service";
import { Location } from '@angular/common';
import { deepCopy } from '@delon/util';
let TIMEOUT = null;
@Component({
  selector: 'app-role',
  templateUrl: './../table.template.html',
    styles:[
        `
             ::ng-deep  .ant-select-dropdown-menu-item{
               white-space: normal;
            }
             ::ng-deep .modal-footer .ant-btn-default[type='button']{
                 border: 1px solid #1890ff !important;
                 color: #1890ff;
             }
             ::ng-deep .modal-footer .ant-btn-default[type='submit']{
                 background:  #1890ff;
                 color: #fff !important;
             }
             ::ng-deep .modal-footer .ant-btn:disabled{
                 color: rgba(0, 0, 0, 0.25) !important;
                 background-color: #f5f5f5;
                 border: 1px solid #d9d9d9;
             }
`]
})
export class RoleTableComponent implements OnInit, AfterViewInit {
    loading = false;
    modal=true;
  //查询条件绑定参数
  params: any = {};
  //表格中数据绑定参数
  data : any;
  //对象id，唯一标识一个页面
  // id = "user";
  // name = "用户管理";
    pageTitle = '角色管理';
  newPerms: any = 'sys:role:save';
  deletePerms: any = 'sys:role:delete';
    roleOrgFlag:boolean = environment['roleOrgFlag'];
    roleManageFlag:boolean = environment['roleManageFlag'];
    @ViewChild('am',{static:true}) am:any;
  @ViewChild('sf', { static: true })
  sf: SFComponent;

  searchSchema: any = {
      ui:{
          grid:{
              span:8
          }
      },
    properties: {
        roleName: {type: "string",title: "角色名称",maxLength: 50,ui: {
                width:300
            }},
        // orgId: {type: "string",title: "所属机构",maxLength: 100,ui: {
        //         widget: "select",
        //         asyncData: "/engine/rest/common/monitor_terminal_brand/selects",
        //         mate: {
        //             id: "value",
        //             name: "label"
        //         },
        //         params: "",
        //         width: 300
        //     }
        // },
        // orgId: {type: "string",title: "机构名称",maxLength: 100,ui: {
        //             widget: 'org-tree-cashway',
        //             layer: 1,
        //             width:350
        //         }
        //     },
        // orgIdTemp: {type: 'string', title: '所属机构', maxLength: 100, default: null, ui: {width: 300, widget: 'org-tree-cashway'}}
        // orgIdTemp: {type: 'string', title: '所属机构', maxLength: 100, default: null, ui: {
        //         widget: "select",
        //         asyncData: "/engine/rest/common/monitor_terminal_brand/selects",
        //         mate: {
        //             id: "value",
        //             name: "label"
        //         },
        //         params: "",
        //         width: 300
        //     }}
    }
  }
  //数据总数
  total = 0;
  //分页参数
  page : STPage = {
    front:false,
    showQuickJumper:true,
    total:true,
    showSize:true
  }
    pageNumber:number = 1;
    pageSize : number = 10;
    selections : STData[] = [];
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
    //当前页
//绑定分页参数改变想要事件
    tableChange(e : STChange){
        if(e.type == 'pi' || e.type == 'ps'){
            this.pageNumber = e.pi;
            this.pageSize = e.ps;
            this.getData();
        }
        if (e.checkbox != undefined) {
            this.selections = e.checkbox;
        }
    }

  constructor(private location: Location ,private http: _HttpClient,private message: NzMessageService,private route: ActivatedRoute,private modalSrv: NzModalService,public userService:UserService) {}

  //表格绑定参数
  columns: any = [
      { title: '选中', index: 'checked',type: "checkbox", },
      //{title:'序号',index:'serialNumber'},
      { title: '角色名称', index: 'roleName' },
      // { title: '所属机构', index: 'orgName' },
      // { title: '角色状态', index: 'status',type: "badge",
      //     badge: {"0": {text: "失效",color: "error"},"1": {text: "正常",color: "success"}},default:"0" },
      // { title: '管理员标识', index: 'manageFlag',type: "badge",
      //     badge: {"0": {text: "否",color: "error"},"1": {text: "是",color: "success"}},default:"0" },
      { title: '备注', index: 'remark' },
      { title: "操作",
          buttons: [
              {text: "编辑",icon: "edit",type: "modal",modal: {
                  component: RoleEditModalComponent,
                  params:(recode:any)=>{recode.from='编辑'},
                  modalOptions:{
                          nzMaskClosable:false,
                          nzClosable:false,
                          nzBodyStyle:{width: 0,background:'rgba(0,0,0,0)',position:'fixed',left:'50%','margin-left':'-400px',"top":"50%",
                          "transform":"translateY(-50%)"}
                      },},click: (recode:any,modal)=>{this.edit(recode,modal)}},
              {text: "详情",type: "modal", modal:{
                  title:'信息',
                  component: RoleEditModalComponent,
                  params:(recode:any)=>{recode.from='详情'},
                  modalOptions:{
                    nzMaskClosable:false,
                    nzClosable:false,
                    nzBodyStyle:{width: 0,background:'rgba(0,0,0,0)',position:'fixed',left:'50%','margin-left':'-400px',"top":"50%","transform":"translateY(-50%)"}
                  },
                },click: (recode:any,modal)=>{this.detail(recode,modal)}},
            //   {text: "删除",icon: "delete",type: "del",click: (recode:any)=>{this.delete(recode)}},
              {text: "删除",icon: "delete",type: 'modal', click: ($event) => {this.delete($event); }},
              {text: "授权",type: "modal",modal:{component: RoleAuthModalComponent,modalOptions:{
                          nzMaskClosable:false,
                          nzClosable:false,
                          nzBodyStyle:{width: 0,background:'rgba(0,0,0,0)',position:'fixed',left:'50%','margin-left':'-400px',top:'50%',"transform":"translateY(-50%)"}
              }},click: (recode:any)=>{this.auth(recode)}
              }
          ]
      }
   ];
   menuButton : object  = JSON.parse(localStorage.getItem('menuButton'))
    showButton = {
        '新增':false,
        '删除':false,
        '授权':false
    }
    id:string;
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
    ngAfterViewInit(): void {

    }
    add(){
        const modal = this.modalSrv.create({
            //nzTitle: '角色管理',
            nzContent: RoleAddModalComponent,
            nzComponentParams: {
            },
            nzFooter:null,
            nzMaskClosable:false,
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
        // modal.afterOpen.subscribe((e)=>{
        //     console.log(modal.getElement().getElementsByClassName('ant-modal'));
        //     modal.getElement().getElementsByClassName('ant-modal').style.backgroundColor = 'red';
        // })

        modal.afterClose.subscribe(()=>{
            this.getData();
        })
    }



  edit(record, modal){
      if(modal){
          this.getData()
      }
  };

    auth(record){

    };

  detail(record, modal){
      // if(modal["result"]){
      //     this.getData()
      // }
  };

    // delete(record){
    //     let param : any = {ids:[record.id]}
    //     this.http.delete(environment.manage_server_url+"/sys/roles",param).subscribe((res:any)=>{
    //         let code = res["code"];
    //         if (code != null) {
    //             if (code == 0 || code == 200) {
    //                 this.message.info(("数据删除成功"));
    //             } else {
    //                 this.message.error(res["msg"]);
    //             }
    //         }else {
    //             this.message.info(("数据删除成功"));
    //         }
    //         this.getData()
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
                this.http.delete(environment.manage_server_url+"/sys/roles",param).subscribe((res:any)=>{
                    let code = res["code"];
                    if (code != null) {
                        if (code == 0 || code == 200) {
                            this.message.info(("数据删除成功"));
                        }
                    }else {
                        this.message.info(("数据删除成功"));
                    }
                    this.getData()
                });
            }
        });
    }
    // deletes(){
    //     let selectedIds : Array<string> = [];
    //     for (let selection of this.selections){
    //         selectedIds.push(selection["id"]);
    //     }
    //     let param:any = {ids:selectedIds};
    //     this.http.delete(environment.busi_server_url+"/roles",param).subscribe((res:any)=>{
    //         this.message.info(("数据删除成功"));
    //         this.getData()
    //     });
    // }

    deletes(): void {
        if(this.selections == null || this.selections.length == 0){
            this.message.error(("请选择一条数据"));
            return;
        }
        this.modalSrv.confirm({
            nzTitle     : '确定删除?',
            nzContent   : '<b style="color: red;"></b>',
            nzOkText    : '是',
            nzOkType    : 'danger',
            nzOnOk      : ()=>{this.showDeleteConfirm()},
            nzCancelText: '否',
            nzOnCancel  : () => console.log('Cancel')
        });
    }

    showDeleteConfirm(){
        let selectedIds : Array<string> = [];
        for (let selection of this.selections){
            selectedIds.push(selection["id"]);
        }
        if(selectedIds.length == 0){
            this.message.info('请选择其中一项');
            return;
        }
        let param:any = {ids:selectedIds};
        this.http.delete(environment.manage_server_url+"/sys/roles",param).subscribe((res:any)=>{
            let code = res["code"];
            if (code != null) {
                if (code == 0 || code == 200) {
                    this.message.info(("数据删除成功"));
                } else {
                    this.message.error(res["msg"]);
                }
            }else {
                this.message.info(("数据删除成功"));
            }
            this.getData();
        });

        this.selections = [];
    }



    refresh(){
        this.getData()
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
        let params = {};
        if(this.sf.value!= undefined){
            params = this.sf.value
        }
        params["pageSize"] = this.pageSize;
        params["pageNumber"] = this.pageNumber;
        let sendParams:any = {filter:JSON.stringify(params)}
        this.http.get(environment.manage_server_url+"/sys/roles?perms=sys:role",sendParams).subscribe((res:any)=>{
            this.showLoadingAnime('close')
            this.data = res["rows"];
            // let page = (this.pageNumber- 1)*this.pageSize
            // this.data.forEach((ele,index)=>{
            //     ele['no']= page + index +1 + ''
            //     ele['no'].length == 1?ele['no']='0'+ele['no']:''
            // })
            this.total = res["total"];
        },error=>{

        },()=>{
            this.loading = false;
            clearTimeout(TIMEOUT);
        })
    }

  ngOnInit() {
        console.log(this.am)
      // if(environment['orgSelect'] == null){
      //     this.searchSchema.properties.orgId = this.searchSchema.properties.orgIdTemp;
      // }
      // delete this.searchSchema.properties.orgIdTemp;
      // if(this.roleOrgFlag == false){
      //     delete this.searchSchema.properties.orgId;
      // }

      console.log("role")
      this.getData()
      this.buttonFilter()
  }
}
