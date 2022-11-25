import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {STChange, STColumn, STComponent, STData, STPage} from '@delon/abc';
import {SFComponent, SFSchema} from '@delon/form';
import {ActivatedRoute, Router} from '@angular/router';
import {NzFormatEmitEvent, NzMessageService, NzModalService} from 'ng-zorro-antd';
import {environment} from './../../../../environments/environment';
import {MenuEditModalComponent} from './menu.edit';
import {MenuDetailDrawerComponent} from './menu.detail';
import {MenuAddModalComponent} from './menu.add';
import {UserService} from '../../service/user.service';
import { Location } from '@angular/common';
import { deepCopy } from '@delon/util';
let TIMEOUT = null;
@Component({
    selector: 'app-org',
    templateUrl: './../tree-table.template.html',
    styles: [`
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

        .active {
            color: #1890ff;
        }

        .imageActive{
            background-color: #1890ff;
        }
        .custom-node {
            cursor: pointer;
            line-height: 24px;
            margin-left: 4px;
            display: inline-block;
            margin: 0 -1000px;
            padding: 0 1000px;
        }
        :host ::ng-deep  .ant-table table{
            table-layout: fixed;
            width: 100%;
            text-align: left;
            border-radius: 4px 4px 0 0;
            border-collapse: separate;
            border-spacing: 0;
        }
        :host ::ng-deep  .ant-table table td{
            word-break: break-all;
            word-wrap: break-word;
        }
        :host ::ng-deep .table .ng-star-inserted{
            text-align: center;
        }
        :host ::ng-deep .ng-star-inserted a{
            white-space: nowrap
        }

        
    `],
})
export class MenuTableComponent implements OnInit {
    loading = false;
    // 查询条件绑定参数
    params: any = {};
    // 表格中数据绑定参数
    data: any;
    newPerms: any = 'sys:menu:save';
    deletePerms: any = 'sys:menu:delete';
    parentId: any;
    defaultCheckedKeys = [];
    defaultSelectedKeys = [];
    defaultExpandedKeys = [];
    nodes = [];
    // 对象id，唯一标识一个页面
    // id = "menu";
    // name = "菜单管理";

    pageTitle = '菜单管理';
    treeTitle = '菜单目录';
    @ViewChild('st', { static: true })
    st: STComponent;

    @ViewChild('sf', { static: true })
    sf: SFComponent;
    searchSchema: any = {
        properties: {
            menuName: {type: 'string', title: '菜单名称', maxLength: 50, ui: {width: 300}}
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
            this.getData(this.parentId);
        }

        if (e.checkbox != undefined) {
            this.selections = e.checkbox;
        }
    }

    constructor(private location: Location , private http: _HttpClient, private message: NzMessageService, private route: ActivatedRoute, private modalSrv: NzModalService, public userService: UserService,public router:Router) {}

    // 表格绑定参数
    columns: STColumn[] = [
        { title: '选中', index: 'checked', type: 'checkbox', },
        { title: '菜单', index: 'name' },
        { title: 'url', index: 'url' },
        { title: '方法类型', index: 'method' },
        // { title: '图标', index: 'icon',type:"img" },
        { title: '权限标识', index: 'perms' },
        { title: '上级菜单', index: 'parentName' },
        { title: '类型', index: 'type', type: 'tag',
            tag: {'0': {text: '目录', color: 'blue'}, '1': {text: '菜单', color: 'green'}, '2': {text: '按钮', color: '#66FFFF'}} },
        { title: '状态', index: 'status', type: 'badge',
            badge: {'0': {text: '隐藏', color: 'error'}, '1': {text: '正常', color: 'success'}} },
        {title: '审批标识', index: 'approveFlag', type: 'tag',
            tag: {0: {text: '无需审批', color: 'blue'}, 1: {text: '同步审批', color: 'green'}, 2: {text: '异步审批', color: '#66FFFF'}}
            },
        // { title: '排序', index: 'orderNum' },
        { title: '操作',
            buttons: [
                {text: '编辑', icon: 'edit', type: 'modal', click: (recode: any, modal) => {this.edit(recode, modal); }, modal: {component: MenuEditModalComponent, modalOptions: {
                    nzMaskClosable: false,
                    nzClosable:false,
                    nzBodyStyle:{width: 0,background:'rgba(0,0,0,0)',position:'fixed',left:'50%','margin-left':'-400px',top:'50%',"transform":"translateY(-50%)"}
                }}, },
                {text: '详情', type: 'drawer', drawer: {title: '信息', component: MenuDetailDrawerComponent, }, click: (recode: any, modal) => {this.detail(recode, modal); }},
                {text: '删除', icon: 'delete', type: 'modal', click: ($event) => {this.delete($event); }},
                // {text: '删除', icon: 'delete', type: 'del', click: (recode: any) => {this.delete(recode);}}
                // {text: '表单设置', click: ($event) => {
                //     console.log($event)
                //     if($event.url){
                //         this.router.navigate(['/viewable'],{queryParams:{uri:$event.url,name:$event.name}})
                //     }
                // }},
            ]
        }
    ];
    // menuButton : object  = JSON.parse(localStorage.getItem('menuButton'))
    showButton = {
        '新增':true,
        '删除':true
    }
    buttonFilter(){
        //表格区的按钮屏蔽
        // this.id = this.location.path().split('/')[this.location.path().split('/').length - 1 ]
        // this.menuButton[this.id].every(ele=>{
        //     this.showButton[ele.text] = true
        // })
        // let columns = deepCopy(this.columns)
        // let index = columns.findIndex(ele=>ele['title'] == '操作')
        // columns[index]['buttons'] = columns[index]['buttons'].filter(item=> this.showButton[item.text] )
        // this.columns = columns
        // console.log(this.menuButton[this.id],'允许的按钮')
        //按钮区的按钮屏蔽
        
    }
    add() {

         const record = {parentId: this.parentId};
        const modal = this.modalSrv.create({
            //nzTitle: '菜单管理',
            nzContent: MenuAddModalComponent,
            nzComponentParams: {
                record: record
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
            this.getTableData(this.parentId);
        });

    }

    reset() {

    }
    edit(record, modal) {
        if (modal) {
            this.getTableData(this.parentId);
        }
    }

    detail(record, modal) {

    }


    // delete(record) {
    //     const param: any = {ids: [record.id]};
    //     this.http.delete(environment.manage_server_url + '/sys/menus', param).subscribe((res: any) => {
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
    //         this.getTableData(this.parentId);
    //     });
    //     this.selections = [];
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
                this.http.delete(environment.manage_server_url + '/sys/menus', param).subscribe((res: any) => {
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
                    this.getTableData(this.parentId);
                });
                this.selections = [];
            }
        });
    }
    // deletes(){
    //     let selectedIds : Array<string> = [];
    //     for (let selection of this.selections){
    //         selectedIds.push(selection["id"]);
    //     }
    //     let param:any = {id:selectedIds};
    //     this.http.delete(environment.busi_server_url+"/menus",param).subscribe((res:any)=>{
    //         this.message.info(("数据删除成功"));
    //     });
    // }



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
        this.http.delete(environment.manage_server_url + '/sys/menus', param).subscribe((res: any) => {
            this.message.info(res.msg);
            this.getTableData(this.parentId);
        });
    }

    refresh() {
        this.getTableData(this.parentId);
        this.getLeftTreeDate();
    }

    buttonGetData(id) {
        this.loading = true;
        TIMEOUT = setTimeout(() => {
            this.loading = false;
            clearTimeout(TIMEOUT);
        }, 5000);
        this.pageNumber = 1;
        this.getData(id);
    }

    getData(id) {
        this.getTableData(id);
        this.getLeftTreeDate();
    }


    getTableData(id) {
        console.log('-----11');

        const params = {};
        params['parentId'] = id;
        this.parentId = id;
        params['pageSize'] = this.pageSize;
        params['pageNumber'] = this.pageNumber;
        if (this.sf.value != undefined) {
            params['name'] = this.sf.value.menuName;
        }
        const sendParams: any = {filter: JSON.stringify(params)};
        this.http.get(environment.manage_server_url + '/sys/menus', sendParams).subscribe((res: any) => {
            this.data = res['rows'];
            this.total = res['total'];
        },res=>{

        },()=>{
            this.loading = false;
            clearTimeout(TIMEOUT);
        });
    }

    homeNodeKey: any = '';
    searchValue = '';
    getLeftTreeDate() {
        this.http.get(environment.manage_server_url + '/sys/menus/tree').subscribe((res: any) => {
            this.nodes = res;
            if (this.nodes != null && this.nodes.length == 1) {
                this.homeNodeKey = this.nodes[0].key;
            }
        });
    }
    ngOnInit() {
        this.getData('0');
    }


    treeId: string;
    nzEvent(event: NzFormatEmitEvent): void {
        this.getTableData(event.node.key);
        this.treeId = event.node.key;
    }

    treeSize:number = 15;
    tableSize:number = 85;
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

    dragEnd(e: {gutterNum: number, sizes: Array<number>}) {
        this.treeSize = e.sizes[0];
        this.tableSize = e.sizes[1];
    }

    checkNodeType(node) {
        if (this.homeNodeKey == node.key) {
            return 'home';
        } else {
            if (node.isLeaf) {
                return 'leaf';
            } else {
                if (node.isExpanded) {
                    return 'open';
                } else {
                    return 'close';
                }
            }
        }
    }
}
