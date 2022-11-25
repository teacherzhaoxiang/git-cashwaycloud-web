import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef, Input,
    OnInit,
    ViewChild
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {STChange, STColumn, STColumnButton, STComponent, STData, STPage} from '@delon/abc';
import {SFComponent, SFSchema} from '@delon/form';
import {ActivatedRoute} from '@angular/router';
import {NzFormatEmitEvent, NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {environment} from './../../../../environments/environment';
import {OrgDetailDrawerComponent} from './org.detail';
import {OrgEditModalComponent} from './org.edit';
import {OrgAddModalComponent} from './org.add';
import {UserService} from '../../service/user.service';
import {TreeComponent} from "../../components/tree/tree.component";
import { Location } from '@angular/common';
import { deepCopy } from '@delon/util';

@Component({
  selector: 'app-org',
  templateUrl: './../org-tree-table.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .as-split-back{
            background-image: url('/assets/tree-icon/tree-background.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        :host {
            display: block;
            width: 100%;
            height:  -webkit-calc(100% - 90px);
        }
        .serachMatch {
            color: red;
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
    `],
})
export class OrgTableComponent implements OnInit {
  // 查询条件绑定参数
  params: any = {};
    loading = false;
    newPerms: any = 'sys:org:save';
    deletePerms: any = 'sys:org:delete';
  // 表格中数据绑定参数
  data: any;
  parentId: any;
    defaultCheckedKeys = [];
    defaultSelectedKeys = [];
    defaultExpandedKeys = [];
    nodes = [];
  // 对象id，唯一标识一个页面
  // id = "user";
  // name = "用户管理";
    pageTitle = '机构管理';
    treeTitle = '机构目录';
    readable:boolean = true;
  @ViewChild('st', { static: false })
  st: STComponent;

  @ViewChild('sf', { static: false })
  sf: SFComponent;
  searchSchema: any = {
    properties: {
        code: {type: 'string', title: '机构号', maxLength: 50, ui: {width: 300}},
        orgName: {type: 'string', title: '机构名称', maxLength: 50, ui: {width: 300}},

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
    @Input()
    orgId:string;
    @Input()
    orgPath:string;


    @ViewChild('tree', { static: true })
    tree: TreeComponent;

    // 当前页
// 绑定分页参数改变想要事件
    tableChange(e: STChange) {
        // console.log('tableChange:' + JSON.stringify(e));
        if (e.type == 'pi' || e.type == 'ps') {
            this.pageNumber = e.pi;
            this.pageSize = e.ps;
            this.getData1(this.parentId,true);
        }

        if (e.checkbox != undefined) {
            this.selections = e.checkbox;
        }
    }

  constructor(private http: _HttpClient,
              private message: NzMessageService,
              private route: ActivatedRoute,
              private modalSrv: NzModalService,
              public changeDetectorRef: ChangeDetectorRef,
              public userService: UserService,
              private el: ElementRef,
              private location: Location
              ) {
  }

  // 表格绑定参数
  columns: any = [
      { title: '选中', index: 'checked', type: 'checkbox', },
      { title: '机构号', index: 'code' },
      { title: '机构名称', index: 'name' },
     /* {
          title: '机构类型', index: 'show', type: 'tag',
          tag:{'0': {text: '部门', color: 'blue'}, '1': {text: '机构', color: 'green'},}
      },*/

      { title: '地址', index: 'address' },
      // { title: '联系人', index: 'contact' },
      // { title: '联系电话', index: 'phone' },
      //{ title: '上级机构编号', index: 'parentId' },
      { title: '上级机构名称', index: 'parentName' },
      // { title: '排序', index: 'orderNum' },
      // { title: '状态', index: 'status', type: 'badge',
      //     badge: {'0': {text: '失效', color: 'error'}, '1': {text: '正常', color: 'success'}} },
      { title: '操作',
          buttons: [
              {iif:()=>{return this.readable},text: '编辑', icon: 'edit', type: 'modal', modal: {modalOptions:{   nzMaskClosable: false,nzClosable:false,nzBodyStyle:{width: '900px',background:'rgba(255,255,255,1)',position:'fixed',left:'50%',top:'50%',"transform":"translate(-50%,-50%)"}},component: OrgEditModalComponent,}, click: (recode: any, modal) => {this.edit(recode, modal); }},
              {text: '详情', type: 'drawer', drawer:{title: '信息', component: OrgDetailDrawerComponent}, click: (recode: any, modal) => {this.detail(recode, modal); }},
            //   {iif:()=>{return this.readable},text: '删除', icon: 'delete', type: 'del', click: (recode: any) => {this.delete(recode); }},
              {iif:()=>{return this.readable},text: '删除', icon: 'delete', type: 'modal', click: ($event) => {this.delete($event); }},
          ]
      }
   ];

    add() {
        this.ngOnInit()
        const record = {parentId: this.parentId};
        const modal = this.modalSrv.create({
            nzTitle: '机构管理',
            nzContent: OrgAddModalComponent,
            nzComponentParams: {
                record: record
            },
            nzFooter: null,
            nzMaskClosable: false,
        });


        modal.afterClose.subscribe(() => {

                this.getData(this.parentId);
                this.getLeftTreeDate(this.orgId);
        });
    }


  edit(record, modal) {
      if (modal) {
          this.getData(this.parentId);
          this.getLeftTreeDate(this.orgId);
      }
  }

  detail(record, modal) {
      // if(modal["result"]){
      //     this.st.reload();
      // }
      modal.afterClose.subscribe(() => {
          this.getData(this.parentId);
      });
  }

//   delete(record) {
//     const param: any = {ids: [record.id]};
//     console.log(param,'param')

//     this.http.delete(environment.manage_server_url + '/sys/orgs', param).subscribe((res: any) => {
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
//         this.getData(this.parentId);
//         this.getLeftTreeDate(this.orgId);
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
                this.http.delete(environment.manage_server_url + '/sys/orgs', param).subscribe((res: any) => {
                    console.log(res,'这是res')
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
                    this.getData(this.parentId);
                    this.getLeftTreeDate(this.orgId);
                });
            }
        });
    }
    // deletes(){
    //     let selectedIds : Array<string> = [];
    //     for (let selection of this.selections){
    //         selectedIds.push(selection["id"]);
    //     }
    //     let param:any = {id:selectedIds};
    //     this.http.delete(environment.busi_server_url+"/orgs",param).subscribe((res:any)=>{
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
        this.http.delete(environment.manage_server_url + '/sys/orgs', param).subscribe((res: any) => {
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
            this.getData(this.parentId);
            this.getLeftTreeDate(this.orgId);
        });

        this.selections = [];
    }

    refresh() {

        this.getData(this.parentId);
    }

    buttonGetData(id) {
        this.pageNumber = 1;
        this.getData(id);
    }

    getData(id) {
        this.pageNumber = 1;
        this.pageSize = 10;
        this.getData1(id, false);
    }

    getData1(id, pageFlag) {
        if (this.parentId != undefined) {
            this.getTableData(this.parentId, pageFlag);
        }
        //this.getLeftTreeDate(id);
    }


    getTableData(id, pageFlag) {
        console.log("======" + id);
        const params = {};
        // if(id != undefined){
        //     params["parentId"] = id;
        //     this.parentId = id;
        // }
        params["parentId"] = id;

        if (pageFlag) {
            params["pageSize"] = this.pageSize;
            params["pageNumber"] = this.pageNumber;
        } else {
            params["pageSize"] = 10;
            params["pageNumber"] = 1;
        }

        if (this.sf != null && this.sf.value != undefined) {
            params["name"] = this.sf.value.orgName;
            params["code"] = this.sf.value.code;
        }

        const sendParams: any = { filter: JSON.stringify(params) };
        this.http.get(environment.manage_server_url + "/sys/orgs", sendParams).subscribe((res: any) => {
            if (res) {
                this.data = res["rows"];
                this.total = res["total"];
                this.changeDetectorRef.detectChanges();
                console.log(this.data,'这是data')
            }
        });
    }

    homeNodeKey: any = "";
    searchValue = "";
    origin: any;

    treeListData: any = {};
    treeMapData: any[] = [];

    getLeftTreeDate(id) {
        this.http.get(environment.manage_server_url + "/sys/orgs/tree?show=1&orgId=" + this.userService.getUser().orgId).subscribe((res: any) => {
            let url = environment.manage_server_url + "/sys/orgs/tree?show=1&orgId=" + this.userService.getUser().orgId
            console.log(res,url,'树的res')
            this.origin = res;
            this.initData(res);
        });
    }


    initData(res) {
        if (this.orgId != null && this.orgId != this.userService.getUser().orgId) {

            for (let i = 0; i < this.treeMapData.length; i++) {
                if (this.orgId == this.treeMapData[i].key) {
                    this.orgPath = this.treeMapData[i].orgPath;
                }
            }

            this.defaultSelectedKeys = [this.orgId];
            this.treeId = this.orgId;

            let orgPathArray: string[] = this.orgPath.split(".");
            //orgPathArray.pop();
            let expandKeys: string[] = orgPathArray;
            this.defaultExpandedKeys = expandKeys;
            let expandkeysReverse: string[] = this.defaultExpandedKeys.reverse();
            let resTemp2: any = JSON.parse(JSON.stringify(res));
            this.intTreeData(expandkeysReverse, resTemp2);
            this.nodes = resTemp2;
        } else {
            //默认打开第二级别
            let resTemp: any = JSON.parse(JSON.stringify(res));
            let initData = resTemp[0];
            if (initData.children != null && initData.children.length > 0) {
                for (let index in initData.children) {
                    initData.children[index].children = null;
                }
            }
            let initDataTemp: any = JSON.parse(JSON.stringify(initData));
            this.nodes = [initDataTemp];
        }


        //转换数据 key children 形式
        let resTemp1: any = JSON.parse(JSON.stringify(res));
        this.getTreeListData(resTemp1[0]);
        //清理孙元素
        this.clearGrandsonListData();
        if (this.nodes != null && this.nodes.length == 1) {
            this.homeNodeKey = this.nodes[0].key;
        }
        this.changeDetectorRef.detectChanges();
    }

    intTreeData(expandkeysReverse: string[], resTemp: any) {

        for (let i = 0; i < resTemp.length; i++) {
            let flag: boolean = false;
            for (let j = 0; j < expandkeysReverse.length; j++) {
                if (resTemp[i].key == expandkeysReverse[j]) {
                    flag = true;
                    break;
                }
            }
            if (flag == false) {
                resTemp[i].children = null;
            } else {
                if (resTemp[i].children != null && resTemp[i].children.length > 0) {
                    this.intTreeData(expandkeysReverse, resTemp[i].children);
                }
            }
        }
    }


    getTreeListData(data) {
        let listData = data.children;
        let node: any = {};
        node.key = data.key;
        node.title = data.title;
        node.orgPath = data.orgPath;
        this.treeMapData.push(node);
        this.treeListData[data.key] = listData;
        this.treeDadaFlagMap[data.key] = false;
        //往下遍历
        if (data.children != null && data.children.length > 0) {
            for (let index in data.children) {
                let newData = data.children[index];
                this.getTreeListData(newData);
            }
        }
    }

    clearGrandsonListData() {
        for (let key in this.treeListData) {
            let son = this.treeListData[key];
            if (son != null && son.length > 0) {
                for (let index in son) {
                    son[index]["children"] = null;
                }
            }
        }

    }


    height = 400;

    ngOnInit() {
        if (!environment["orgEdit"]) {
            this.readable = false;
        }
        this.parentId = this.userService.getUser().orgId;
        this.orgId = this.userService.getUser().orgId;
        this.getData(this.userService.getUser().orgId);
        this.getLeftTreeDate(this.userService.getUser().orgId);
        this.buttonFilter()
    }


    treeId: string;
    id:string = ''
    searchValueTemp: string;
    //匹配到的key
    searchMatchKey: any[] = [];
    searchMatchKeyOrgPathExpandKeys: any = {};
    searchMatchKeyExpandArrays: string[] = [];
    treeDadaFlagMap: any = {};
    menuButton : object  = JSON.parse(localStorage.getItem('menuButton'))
    showButton = {
        '新增':true,
        '删除':true
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
    searchData2() {

        let data: any = JSON.parse(JSON.stringify(this.origin));
        if (this.searchValueTemp == null || this.searchValueTemp.trim() == "") {
            this.initData(data);
            return;
        }
        for (let key in this.treeDadaFlagMap) {
            this.treeDadaFlagMap[key] = false;
        }
        //根据匹配到的数据和orgpath，设置Flag数据
        this.searchKeyMatchHandle(data[0]);
        //查找遍历数据
        this.searchKeyDataMatchHandle(data[0], data, 0);
        this.nodes = data;
        // if(this.searchValueTemp == null || this.searchValueTemp ==""){
        //     return;
        // }
        // this.searchMatchKey = [];
        // this.searchMatchKeyOrgPathExpandKeys = {};
        // this.searchMatchKeyExpandArrays = [];
        // for(let i=0;i<this.treeMapData.length;i++){
        //     let node = this.treeMapData[i];
        //     if(node.title.indexOf(this.searchValueTemp)>=0){
        //         this.searchMatchKey.push(node.key);
        //         let orgPathArray:string[] = node.orgPath.split(".");
        //         orgPathArray.pop();
        //         for(let j=0;j<orgPathArray.length;j++){
        //             this.searchMatchKeyOrgPathExpandKeys[orgPathArray[j]] = orgPathArray[j];
        //         }
        //     }
        // }
        //
        // for(let key in this.searchMatchKeyOrgPathExpandKeys){
        //     this.searchMatchKeyExpandArrays.push(key);
        // }
        // let data:any = JSON.parse(JSON.stringify(this.origin));
        // data.expanded = false;
        // this.defaultExpandedKeys = this.searchMatchKeyExpandArrays;
        // this.defaultSelectedKeys = [];
        // this.treeId = "";
        // this.intTreeData(this.defaultExpandedKeys,data);
        // this.nodes = data;
        // console.log(this.searchMatchKey)
    }

    searchKeyMatchHandle(node: any) {

        //寻找打开的key数据
        if (node.title.indexOf(this.searchValueTemp) >= 0 || node.code.indexOf(this.searchValueTemp) >= 0) {
            let orgPath = node.orgPath;
            let orgPathKeyArray: string[] = orgPath.split(".");
            for (let i = 0; i < orgPathKeyArray.length; i++) {
                this.treeDadaFlagMap[orgPathKeyArray[i]] = true;
            }

        }

        //往下遍历
        if (node.children != null && node.children.length > 0) {
            for (let index in node.children) {
                let newData = node.children[index];
                this.searchKeyMatchHandle(newData);
            }
        }
    }

    searchKeyDataMatchHandle(node: any, nodeArray: any[], position): any {
        if (this.treeDadaFlagMap[node.key] == false) {
            node = null;
            nodeArray.splice(position, 1);
            position = position - 1;
            return position;
        }

        //往下遍历
        if (node.children != null && node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
                let newData = node.children[i];
                i = this.searchKeyDataMatchHandle(newData, node.children, i);
            }
            if (node.children != null && node.children.length > 0) {
                node.expanded = true;
            } else {
                node.expanded = false;
            }
        }
        return position;
    }


    nzEvent(event: NzFormatEmitEvent): void {
        let treeListDataTemp: any = JSON.parse(JSON.stringify(this.treeListData));
        if (!event.node.isDisabled) {
            this.treeId = event.node.key;
            let key = event.node.key;

            if (environment["orgLeafCheckable"] != null && environment["orgLeafCheckable"] == false) {
                if (this.treeListData[key] != null && this.treeListData[key].length > 0) {
                    this.getData(event.node.key);
                }
            } else {
                this.getData(event.node.key);
            }

            this.parentId = this.treeId;
            this.orgId = this.treeId;
            console.log("========treeEvent ---========");

            this.searchMatchKey = this.searchMatchKey.filter(function(item) {
                return item != event.node.key;
            });
        }
        //
        if (event.eventName === "expand") {
            const node = event.node;
            if (node.isExpanded == true) {
                node.addChildren(treeListDataTemp[node.key]);
            } else {
                node.clearChildren();
            }
        } else if (event.eventName == "click") {
            const node = event.node;
            if (node.isExpanded == true) {
                if (treeListDataTemp[node.key] != null && treeListDataTemp[node.key].length > 0) {
                    node.clearChildren();
                    node.isExpanded = false;
                    // for(let i=0;i<this.defaultExpandedKeys.length;i++){
                    //     if(this.defaultExpandedKeys[i] == node.key){
                    //         this.defaultExpandedKeys.splice(i,1);
                    //         break;
                    //     }
                    // }

                }
            } else {
                if (treeListDataTemp[node.key] != null && treeListDataTemp[node.key].length > 0) {
                    node.addChildren(treeListDataTemp[node.key]);
                    node.isExpanded = true;
                    // this.defaultExpandedKeys.push(node.key);
                }
            }
            // if(this.parentComponent !=null){
            //     this.parentComponent.detectChanges();
            // }
        }
    }


    treeSize = 15;
    tableSize = 85;

    resize(type: string, e: { gutterNum: number, sizes: Array<number> }) {

        if (type === "gutterClick") {
            this.gutterClick(e);
        } else if (type === "dragEnd") {
            this.treeSize = e.sizes[0];
            this.tableSize = e.sizes[1];
        }
    }

    gutterClick(e: { gutterNum: number, sizes: Array<number> }) {
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

    dragEnd(e: { gutterNum: number, sizes: Array<number> }) {
        this.treeSize = e.sizes[0];
        this.tableSize = e.sizes[1];
    }

    checkNodeType(node) {
        if (this.homeNodeKey == node.key) {
            return "home";
        } else {
            if (node.isLeaf) {
                return "leaf";
            } else {
                if (node.isExpanded) {
                    return "open";
                } else {
                    return "close";
                }
            }
        }
    }
}
