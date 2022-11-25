import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation,ChangeDetectorRef} from '@angular/core';
import {NzFormatEmitEvent, NzListComponent, NzMessageService, NzModalService} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MonitorDetailModalComponent} from "./card-list.detail";
import {SFComponent, SFSchema, SFSchemaEnumType,} from "@delon/form";
import {environment} from "@env/environment";
import {from, TimeInterval} from "rxjs";
import {EventService} from "@shared/event/event.service";
import {CustomerModalTemplate} from "../table-template/customer.modal.template";
import {FormTabsBasicComponent} from "../../components/tab/tab.component";
import {tablistComponent} from './../../components/tabList.component'
import { PlatformLocation } from '@angular/common';
import {UserService} from '../../service/user.service';


@Component({
    selector: 'app-monitor-template',
    templateUrl: './card-list.template.html',
    styles: [
            `
            .webContainer{
                height: calc(100vh - 200px);
                overflow-y: scroll;
            }
            .webContainer::-webkit-scrollbar{

                display:none;
            }
            ::ng-deep .ant-avatar {
                margin-right: 3px;
                margin-left: 3px;
            }
            :host ::ng-deep .ant-card-body {
                padding: 0 20px;
                zoom: 1;
                height: 100%;
                box-sizing: border-box;
            }
            ::ng-deep .ant-card-actions > li {
                float: left;
                text-align: center;
                margin: 6px 0;
                color: rgba(0, 0, 0, 0.45);
            }
 
            ::ng-deep .page-header__desc{
                /*background-color: rgba(0, 0, 0, 0.45);*/
            }
            .list-container{
                display:flex;
                width:100%;
                flex-wrap: wrap;
                margin:10px 0;
            }
            .list-span-simple{
                padding:0 3px;
                padding-top:2px;
                font-weight: bold;
                font-size: 14px;
                margin-right: 10px;
                text-align: center;
                cursor:pointer;
                margin-bottom: 5px;
                border:1px solid grey;
            }
            .list-span-simple:hover{
                border:1px solid red;
            }
            .icon{
                margin:1px auto;
                width:30px;
                height:30px;
                overflow:hidden;
            }
            .icon img{
                width:100%;
                height:100%;
            }
            .pagination{
                margin-bottom:30px;
            }
            .myHeader{
                display:flex;
                background-color: white;
                padding: 12px 0;
                text-indent: 1.5rem;
                color:rgba(0, 0, 0, 0.45);
                margin-left:-24px;
                font-size:14px;
            }
            .goPage{
                cursor: pointer;
                text-indent:0;
            }
            .goPage:hover{
                color:#40A9FF;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.Emulated,
})
export class MonitorTemplateComponent implements OnInit {
    @ViewChild('sf',{ static: true })
    sf: SFComponent;

    @ViewChild('listView',{ static: true })
    listView:NzListComponent;

    @ViewChild(tablistComponent,{static:false})
    tablistComponent:tablistComponent;

    list: any[] = [];
    checked:boolean = true;
    loading = false;
    id:string = "";
    total:0;
    page:any = {index:1,size:50};
    interval:number = 60;
    inParams:any={};
    show_table = environment.monitor_table;
    tabListConfig = {
        "cols":5, //总条目数
        "colspan":5, //每个元素占据的网格数，一行有24个网格
        "spanLabel": 16,
        "spanControl": 8,
        "width":"100%", //组件总宽度
        "font-size": "14px",
        "line-height": "28px",
        "color": "#000000a6",
        "TitleBackground": "#eef9fe",
        "valBackground": "#f7f9fb",
        "asyncData":"/cis/busi/report/terminal/terminalStatusStatisticalDetail",
        "listCols":[
            {"title":"暂停服务","index": "error","span":4,"font-weight":"bold","font-size":"14px","valColor":"red","searchKey":"term_status","searchValue":"1"},
            {"title":"取款模块","index":"CDM","span":4,"valColor":"red","searchKey":"module_errors","searchValue":"CDM"},
            {"title":"存款模块","index":"CIM","span":4,"valColor":"red","searchKey":"module_errors","searchValue":"CIM"},
            {"title":"读卡器","index":"IDC","span":4,"valColor":"red","searchKey":"module_errors","searchValue":"IDC"},
            {"title":"凭条打印机","index":"PTR","span":4,"valColor":"red","searchKey":"module_errors","searchValue":"PTR"},
            {"title":"","index":"PTR","span":4,"valColor":"red","searchKey":"module_errors","searchValue":"00003"},//占据一个空位置
            { "title":"资源预警","index": "warn","span":4,"font-weight":"bold","valColor":"#efdb15","searchKey":"term_status","searchValue":"4"
            },
            {"title":"凭条/流水少纸","index":"paperResourceLack","span":4,"valColor":"#efdb15","searchKey":"paper_status","searchValue":"1"},
            {"title":"凭条/流水缺纸","index":"paperResourceEmpty","span":4,"valColor":"#efdb15","searchKey":"paper_status","searchValue":"2"},
            {"title":"钞箱少钞","index":"cashBoxResourceLack","span":4,"valColor":"#efdb15","searchKey":"cashbox_status","searchValue":"1"},
            {"title":"钞箱缺钞","index":"cashBoxResourceEmpty","span":4,"valColor":"#efdb15","searchKey":"cashbox_status","searchValue":"3"},
            {"title":"钞箱将满","index":"cashBoxResourceWillFull","span":4,"valColor":"#efdb15","searchKey":"cashbox_status","searchValue":"5"},
            {"title":"钞箱满","index":"cashBoxResourceFull","span":4,"valColor":"#efdb15","searchKey":"cashbox_status","searchValue":"4"},
            {"title":"","index":"PTR","span":4,"valColor":"red","searchKey":"module_errors","searchValue":"00003"},//占据一个空位置
            {"title":"","index":"PTR","span":4,"valColor":"red","searchKey":"module_errors","searchValue":"00003"},//占据一个空位置
            {"title":"","index":"PTR","span":4,"valColor":"red","searchKey":"module_errors","searchValue":"00003"},//占据一个空位置
            {"title":"","index":"PTR","span":4,"valColor":"red","searchKey":"module_errors","searchValue":"00003"},//占据一个空位置
            {"title":"","index":"PTR","span":4,"valColor":"red","searchKey":"module_errors","searchValue":"00003"},//占据一个空位置


            { "title":"服务正常","index": "normal","span":4,"font-weight":"bold","valColor":"lightgreen","searchKey":"term_status","searchValue":"0" },
            { "title":"正在维护","index": "maintain","span":4,"font-weight":"bold","valColor":"orange","searchKey":"term_status","searchValue":"2" },
            { "title":"网络离线","index": "outLine","span":4,"font-weight":"bold","valColor":"gray","searchKey":"term_status","searchValue":"3"}
        ]
    }
    hasHeader: boolean;
    parentId: any;
    orgId: any;
    origin: any;
    defaultSelectedKeys: any[];
    orgPath: any;
    treeMapData: any[] = [];
    treeId: any;
    defaultExpandedKeys: string[];
    nodes: any;
    homeNodeKey: any;
    treeListData: any = {};
    treeDadaFlagMap: any = {};
    //匹配到的key
    searchMatchKey: any[] = [];
    searchMatchKeyOrgPathExpandKeys: any = {};
    searchMatchKeyExpandArrays: string[] = [];
    treeSize = 15;
    tableSize = 85;
    searchValueTemp: any;
    treeTitle = '机构目录';
    defaultCheckedKeys = [];
    searchValue = "";
    constructor(private http: _HttpClient,
                public msg: NzMessageService,
                private route: ActivatedRoute,
                private modalSrv: NzModalService,
                private el: ElementRef,
                private eventService:EventService,
                private router:Router,
                private location: PlatformLocation,
                private userService:UserService,
                public changeDetectorRef: ChangeDetectorRef,

                ) {}


    config:any = {"term_status":{
            src:"/assets/tmp/img/status/status_terminal.png",
            enum:{"0": {"text": "正常", "color": "#02fd0e"}, "1": {"text": "暂停", "color": "red"}, "2": {"text": "正在维护", "color": "#fd9c04"}, "3": {"text": "通讯故障", "color": "#cacaca"},"4": {"text": "资源预警", "color": "#d9d900"}}
        },
        "modules_status":{
            src:"/assets/tmp/img/status/status_module.png",
            enum:{"0": {"text": "正常", "color": "#02fd0e"}, "1": {"text": "故障", "color": "#ff0000"}, "5": {"text": "未知", "color": "#cacaca"}}
        },
        "resource_status":{
            src:"/assets/tmp/img/status/status_cashBox.png",
            enum:{"0": {"text": "正常", "color": "#02fd0e"}, "1": {"text": "资源预警","color": "#fffc00"},"2": {"text": "部分故障","color": "#fd0379"}, "3": {"text": "警告","color": "#fffc00"}, "5": {"text": "未知","color": "#cacaca"}}
        },
        "communication_status":{
            src:"/assets/tmp/img/status/status_communication.png",
            enum:{"0": {"text": "正常","color": "#02fd0e"}, "1": {"text": "故障","color": "#ff0000"}}
        }
    }

    modules:any = [
        {
            id:"term_status",
            src:"/assets/tmp/img/status/status_terminal.png",
            enum:this.config["term_status"]["enum"]
        },
        {
            id:"modules_status",
            src:"/assets/tmp/img/status/status_module.png",
            enum:this.config["modules_status"]["enum"]
        },
        {
            id:"resource_status",
            src:"/assets/tmp/img/status/status_cashBox.png",
            enum:this.config["resource_status"]["enum"]
        },
        {
            id:"communication_status",
            src:"/assets/tmp/img/status/status_communication.png",
            enum:this.config["communication_status"]["enum"]
        }
    ]

    searchSchema: any = {
        properties: {
            org:{
                type: 'string',
                title: '所属机构',
                default: '',
                ui: {
                    width:300
                },
            },
            org_id:{
                type: 'string',
                title: '所属机构',
                default: '',
                ui: {
                    width:300,
                    hidden:true
                },
            },
            real_no: {type: "string",title: "设备编号",maxLength: 50,ui: {width: 300}},
            type_id:{type: "string",title: "设备类型",maxLength: 20,
                ui: {width: 300,widget: "select", asyncData:()=>this.http.get<SFSchemaEnumType[]>(environment.common_crud_url+ "/monitor_terminal_type/selects",{mate:JSON.stringify({id: "value", name: "label"}),params:""})}},
            brand_id:{type: "string",title: "设备厂商",maxLength: 20,
                ui: {width: 300,widget: "select", asyncData:()=>this.http.get<SFSchemaEnumType[]>(environment.common_crud_url+ "/monitor_terminal_brand/selects",{mate:JSON.stringify({id: "value", name: "label"}),params:""})}},
            term_status:{type: "string",title: "设备状态",maxLength: 50,
                enum: [{
                    "label": "正常",
                    "value": "0"
                }, {
                    "label": "暂停",
                    "value": "1"
                }, {
                    "label": "维护",
                    "value": "2"
                }, {
                    "label": "断网",
                    "value": "3"
                },{
                    "label": "资源预警",
                    "value": "4"
                }],
                ui: {widget: "select",width: 300}}
        }
    }
    monitorIcon:any=[
        'assets/monitor-icon/0.png',
        'assets/monitor-icon/1.png',
        'assets/monitor-icon/2.png',
        'assets/monitor-icon/3.png',
        'assets/monitor-icon/4.png'
    ]
    currentId:string = "";
    goPage(page){
        switch(page){
            case 'homepage':this.router.navigate(['/home']);break;
            case 'thispage':'';break;
        }
    }
    mouseLeave(id){
        // this.modal.close();
        // this.currentId = "";
    }
    modal = null;

    reset(){
        this.sf.reset();
        this.statisticParams = {};
        this.getData()
    }
    openStatusDetail(event,data){
        if(this.currentId == data.id){
            return;
        }else{
            this.currentId = data.id;
        }
        let left = event.x;
        console.log("============="+this.el.nativeElement.parentElement.offsetWidth + "------------" + event.x);
        if(this.el.nativeElement.parentElement.offsetWidth-event.x<400){
            left = event.x-350;
        }
        this.modal = this.modalSrv.create({
            nzTitle: null,
            nzClosable:false,
            nzStyle:{left:left+"px",top:event.y+"px",position:"absolute",opacity:0.9},
            nzContent: MonitorDetailModalComponent,
            nzComponentParams: {
                record:data,
                config:this.config
            },
            nzWidth:350,
            nzFooter:null
        });
        this.modal.afterOpen.subscribe(()=>{

        })
        this.modal.afterClose.subscribe(()=>{
            this.currentId = "";
        })

    }

    simpleClick(item:any){
        let record = item;
        record.__entity=this.id;
        record.__options=[
            {
                "option":"moduleDetail",
                "component": "CustomerModalTemplate",
                "name":"模块详情"
            },
            {
                "name": "钞箱详情",
                "option":"cxDetail",
                "component": "CustomerModalTemplate"
            },
            {
                "name": "交易详情",
                "option":"tradeDetail",
                "component": "CustomerModalTemplate"
            },
            {
                "name": "吞卡详情",
                "option":"retainDetail",
                "component": "CustomerModalTemplate"
            },
            // {
            //     "name": "硬盘使用量",
            //     "option":"hardDriveCapacity",
            //     "component": "CustomerModalTemplate"
            // }
        ];
        this.modalSrv.create({
            nzContent: FormTabsBasicComponent,
            nzWidth:800,
            nzComponentParams: {
                record:record
            },
            nzFooter:null,
        });
    }
    statisticParams = {};
    getParam(e){
        console.log(e,'1111');
        this.statisticParams = {};
        let key = e[0];
        let val = e[1];
        this.statisticParams[key] = val;
        this.getData();
        this.page.index = 1
    }

    getData(){
        let params ={};
        if(this.sf && this.sf.value){
            params = {...this.sf.value}
        }
        if(this.orgId){
            params = {...params,org_id:this.orgId}
        }
        console.log(params)
        if(this.statisticParams != null){
            for(let key in this.statisticParams){
                params[key] = this.statisticParams[key];
            }
        }
        params["pageSize"] = this.page.size;
        params["pageNumber"] = this.page.index;
        let sendParams:any = {param:JSON.stringify(params)};
        this.eventService.emitByType('svSearch',params);
        this.http.get(environment.common_crud_url+"/"+this.id,sendParams).subscribe((res:any)=>{
            this.list = res["rows"];
            console.log(this.list)
            this.total = res["total"];
            console.log("getData")
            this.tablistComponent.update()
        })
    }
    timeout:any;
    changeInterval(){
        let times = Number(this.interval)
        if(this.timeout !=null){
            clearInterval(this.timeout)
        }
        if(times>0){
            this.timeout = setInterval(()=>{
                this.getData();
            },times*1000);
        }
    }
    ngOnInit() {
        if(environment['projectName'] == 'xjnx'){
            this.hasHeader = true
        }
        this.route.params
            .subscribe((params: Params) => {
                this.id = params['id'];
                this.getData()
            })

        if(environment['listType']){
            this.inParams['listType'] = environment['listType'];
        }else {
            let params:Params =  this.route.snapshot.queryParams;
            for(let key in params){
                this.inParams[key] = params[key];
            }
        }
        this.parentId = this.userService.getUser().orgId;
        this.orgId = this.userService.getUser().orgId;
        this.getLeftTreeDate(this.userService.getUser().orgId);
    }
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
    nzEvent(event: NzFormatEmitEvent): void {
        let treeListDataTemp: any = JSON.parse(JSON.stringify(this.treeListData));
        if (!event.node.isDisabled) {
            this.treeId = event.node.key;
            let key = event.node.key;
            this.parentId = this.treeId;
            this.orgId = this.treeId;
            console.log("========treeEvent ---========",this.orgId);
            this.getData()
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
                }
            } else {
                if (treeListDataTemp[node.key] != null && treeListDataTemp[node.key].length > 0) {
                    node.addChildren(treeListDataTemp[node.key]);
                    node.isExpanded = true;
                }
            }
        }
    }
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
    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        if(this.timeout){
            clearInterval(this.timeout)
            console.log('清除了定时器')
        }
    }
}
