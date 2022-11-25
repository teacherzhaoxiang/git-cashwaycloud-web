import {Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {_HttpClient, TitleService} from '@delon/theme';
import {STChange, STColumn, STColumnButton, STComponent, STData, STPage} from '@delon/abc';
import {SFComponent, SFSchema, SFSchemaEnum, SFSchemaEnumType} from '@delon/form';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NzDrawerService, NzFormatEmitEvent, NzMessageService, NzModalService} from 'ng-zorro-antd';
import {TableEditModalComponent} from "./../table-template/edit.template";
import {TableDetailDrawerComponent} from "./../table-template/detail.template";
import {environment} from "./../../../../environments/environment"
import {TableAddModalComponent} from "./../table-template/add.template";
import {CustomerModalTemplate} from "./../table-template/customer.modal.template";
import {CustomerDrawerTemplate} from "./../table-template/customer.drawer.template";
import {CustomerModalSingleTemplate} from "./../table-template/customer.modal.single.template";
import {CustomerModalStSfTemplate} from "../table-template/customer.modal.st.sftemplate";
import {UserService} from "../../service/user.service";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {init} from "protractor/built/launcher";
import {FormTabsBasicComponent} from "../../components/tab/tab.component";
import {EventService} from "@shared/event/event.service";
import {Subscription} from "rxjs";
import {url} from 'inspector';
import {HttpHeaders} from "@angular/common/http";
let TIMEOUT = null;
let TIMEOUT2 = null;
@Component({
    selector: 'app-table-template',
    templateUrl: './tree-table.template.html',
    styles:[`
        .split-container{
            
        }
        /*:host ::ng-deep .ant-table-tbody > tr:nth-child(4n+1)  {*/
        /*background-color:#FFFFFF;*/
        /*}*/
        /*:host ::ng-deep .ant-table-tbody > tr:nth-child(4n+3)  {*/
        /*background-color: #f0f3f7;*/
        /*}*/
        /*:host ::ng-deep .ant-table-tbody > tr > td{*/
        /*padding: 10px;*/
        /*}*/
        /*:host ::ng-deep .ant-table-thead > tr > th{*/
        /*background-color: #dbebfd;*/
        /*}*/
        /*:host ::ng-deep .ant-table{*/
        /*border-color: #cdcdcd;*/
        /*border-style: solid;*/
        /*border-width: 1px;*/
        /*}*/
        /*:host ::ng-deep .ant-card-head{*/
        /*background-color: #e4f6fe;*/
        /*}*/
        /*:host ::ng-deep .ant-tree li .ant-tree-node-content-wrapper{*/
        /*height: 19px;*/
        /*line-height: 19px;*/
        /*}*/
        /*:host ::ng-deep .ant-tree li span.ant-tree-switcher {*/
        /*width: 18px;*/
        /*height: 18px;*/
        /*}*/
        /*:host ::ng-deep .ant-tree li{*/
        /*padding-top: 2px;*/
        /*padding-bottom: 2px;*/
        /*}*/
        /*:host ::ng-deep .ant-card-body{*/
        /*background-color: #eef9fe;*/

        /*}*/
        /*:host ::ng-deep .ant-card-bordered{*/
        /*border: none;*/
        /*}*/
        :host ::ng-deep .modal-footer .ant-btn-default[type='button']{
            border: 1px solid #1890ff;
            color: #1890ff
        }
        :host ::ng-deep .modal-footer .ant-btn-default[type='submit']{
            background:  #1890ff !important;
            color: #fff !important;
        }
        :host ::ng-deep .modal-footer .ant-btn-default[type='submit'] span{
            color: #fff !important;
        }
        :host ::ng-deep .modal-footer .ant-btn:disabled{
            color: rgba(0, 0, 0, 0.25) !important;
            background-color: #f5f5f5;
            border: 1px solid #d9d9d9 !important;
        }
        :host ::ng-deep .table .ng-star-inserted{
            text-align: center;
        }
        :host ::ng-deep .ng-star-inserted a{
            white-space: nowrap
        }
        .as-split-back{
            background-image: url('./assets/tree-icon/tree-background.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        :host {
            display: block;
            width: 100%;
            height:  calc(100% - 90px);
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
        .search{
            width: 100%;
            padding: 10px 0;
            display: flex;
            justify-content: flex-end;
        }
        :host ::ng-deep .ant-card-body{
            margin-right: 0 !important;
        }
    `]
})
export class TreeTableTemplateComponent implements OnInit,OnDestroy{
  treeInitUri: string ;
    trade_monitor = environment.trade_monitor;//是否显示交易记录控件
    loading = false;
    loading2 = false;
    hasHeader:any = true;//是否显示header
    //查询条件绑定参数
    params: any = {};
    //查询结果绑定url
    url = '/cis/busi/report/terminal/terminalStatusStatisticalDetail';
    tabListConfig:any;
    //表格中数据绑定参数
    data : any;
    searchValue:any;
    //对象id，唯一标识一个页面
    id = "";
    name = "";
    editFlag = true;
    @ViewChild('container',{ static: true }) container:any;
    @ViewChild('st',{ static: true })
    st: STComponent;
    treeId:string;
    term_status:string;
    doc_name:any = '';
    @ViewChild('sf',{ static: true })
    sf: SFComponent;
    defaultCheckedKeys = [];
    defaultSelectedKeys = [];
    defaultExpandedKeys = [];
    nodes = [];

    //自定义删除的url
    deleteMoreUri = "";

    newPerms:any = "";
    deletePerms:any = "";
    @ViewChild('buttonsDiv',{static:true})
    buttonsDiv:ElementRef;
    buttons:string[];
    //统计栏
    statisticFlag = false;
    statisticLabels:any = [];
    statisticCols:number = 4;
    staticAsyncData:string = "";
    statisticEnum:any
    nzAction:string = environment.file_server_url+"/upload?typeName=hall";
    treeDisplay:boolean = environment['treeDisplay'];
    searchSchema: any = {
        properties: {
        }
    }
    menuButton: object = JSON.parse(localStorage.getItem('menuButton'));

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
    //当前页
//绑定分页参数改变想要事件
    tableChange(e : STChange){
        if(e.type == 'pi' || e.type == 'ps'){
            this.pageNumber = e.pi;
            this.pageSize = e.ps;
            this.getData(false);
        }

        if(e.checkbox != undefined){
            this.selections = e.checkbox;
        }

    }

    constructor(private eventService:EventService,private http: _HttpClient, private titleService: TitleService,private message: NzMessageService,private route: ActivatedRoute,private modalSrv: NzModalService,private drawerSrv:NzDrawerService,public render: Renderer2,public userService:UserService,@Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,private router: Router) {}
    defaultParams = {};
    //表格绑定参数
    columns: STColumn[] = [{ title: '编号', index: 'id' }];
    searchbeforeResult;
    initUri = "";
    dateMap ={};
    modalResult:Map<string,Object> = new Map<string, Object>();
    genInitUri(url:string,params){
        while (url.indexOf("{{") > 0 && url.indexOf("}}") > 0) {
            let i = url.indexOf("{{");
            let j = url.indexOf("}}");
            if (j > i) {
                let key = url.substring(i + 2, j);
                console.log(key);
                url = url.replace("{{" + key + "}}", this.modalResult[key]==null?params[key]:this.modalResult[key]);
            }
        }
        return url;
    }
    getColumns(org_id='',term_status=''){
        let url = environment.runtime_server_url+'/tree-table'+'/init/'+this.id;
        this.http.get(url).subscribe((res: any) => {
            console.log('获取columns', res);
            let veTableTemplate = res["veTableTemplateVO"];
            this.deleteMoreUri = veTableTemplate["deleteMoreUri"];
            this.name = veTableTemplate["name"];
            this.editFlag = !veTableTemplate['readOnly'];
            this.defaultParams = res["defaultParams"];
            this.genSearchSchema(veTableTemplate["searchFields"]);
            this.genTableColumns(veTableTemplate["viewFields"]);
            this.getLeftTreeDate(res["treeFields"]);
            if(veTableTemplate["statistic"] != null){
                this.tabListConfig = veTableTemplate["statistic"];
                console.log(this.tabListConfig)
                this.url = this.tabListConfig["asyncData"];
                this.statisticFlag = true;
                this.statisticLabels = veTableTemplate["statistic"]["labels"];
                this.statisticCols =  veTableTemplate["statistic"]["cols"];
                this.staticAsyncData =  veTableTemplate["statistic"]["asyncData"];
                this.statisticEnum = veTableTemplate["statistic"]["enum"];
            }
            if(veTableTemplate["initUri"]!=null){
                this.initUri = veTableTemplate["initUri"]
            }
            this.searchbeforeResult = veTableTemplate["searchBeforeFunction"];//查询前后台做的处理

            this.getData(true,org_id,term_status);
        });
    }

    add(){
        const modal = this.modalSrv.create({
            nzContent: TableAddModalComponent,
            nzWidth:0,
            nzComponentParams: {
                entity:this.id,
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
        modal.afterClose.subscribe(()=>{
            this.getData(false);
        })
    }

    edit(record, modal){
        if(modal){
            this.getData(false);
        }
    };

    detail(record, modal){
        if(modal["result"]){
            this.getData(false);
        }
    };

    delete(record){
        // let param : any = {ids:[record.id]}
        // this.http.delete(environment.common_crud_url+"/"+this.id,param).subscribe((res:any)=>{
        //     let code = res["code"];
        //     if (code != null) {
        //         if (code == 0 || code == 200) {
        //             this.message.info(("数据删除成功"));
        //         } else {
        //             this.message.error(res["msg"]);
        //         }
        //     }else {
        //         this.message.info(("数据删除成功"));
        //     }

        //     this.getData(false);
        // });
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
                let param : any = {ids:[record.id]}
                this.http.delete(environment.common_crud_url+"/"+this.id,param).subscribe((res:any)=>{
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
        
                    this.getData(false);
                });
            }
        });
    }

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

    showDeleteConfirm() {
        let selectedIds : Array<string> = [];
        for (let selection of this.selections){
            selectedIds.push(selection["id"]);
        }
        let param:any = {ids:selectedIds};

        let url = environment.common_crud_url+"/"+this.id;
        if(this.deleteMoreUri!=null && this.deleteMoreUri !=""){
            url = environment.gateway_server_url+"/"+this.deleteMoreUri;
        }

        this.http.delete(url,param).subscribe((res:any)=>{
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
            this.getData(false);
        });

        this.selections = [];
    }

    genSearchSchema(searchField:any){
        let properties = {};
        for(let field of searchField){
            let data = field["config"];
            let key = field["key"];
            if(data["ui"]!= null ){
                let ui = data["ui"];
                if(ui["asyncData"]!=null && ui["mate"]!=null){
                    let uri:string = ui["asyncData"];
                    let mate = ui["mate"];
                    let param = ui["params"];
                    if(!uri.startsWith("http")){
                        uri = environment.gateway_server_url+uri;
                    }
                    ui["asyncData"] = ()=>this.http.get<SFSchemaEnumType[]>(uri,{mate:JSON.stringify(mate),params:param});

                }
                if(ui["widget"] == 'slider' && ui['formatter'] !=null){
                    ui['formatter'] = (value)=>{return value;};
                }

                if(ui["widget"]=="date" && ui["mode"]=="range"){
                    ui["onOpenChange"]=(status)=>{
                        if(!status){
                            console.log(this.sf.value[key])
                            // let value:any[] = this.sf.value[key];
                            // if(value.length==2){
                            //     if(value[0]==value[1]){
                            //         let dateArray:any[]=[];
                            //         if(value[0].split(' ').length==1){
                            //             dateArray.push(value[0]+" 00:00:00");
                            //         }else {
                            //             dateArray.push(value[0]);
                            //         }
                            //         if(value[1].split(' ').length==1){
                            //             dateArray.push(value[1]+" 23:59:59");
                            //         } else {
                            //             dateArray.push(value[1]);
                            //         }
                            //         this.sf.value[key] = dateArray;
                            //     }
                            // }

                        }
                    }
                }

                data["ui"] = ui;
            }
            if(typeof field["required"]!== 'undefined'){
                data["required"] = field["required"];
            }else {
                data['required'] = false;
            }
            properties[key] = data;
        }
        this.searchSchema = {properties:properties};
    }

    genTableColumns(tableColumns:any){
        let tempColumn:STColumn[] = [];
        //遍历后端配置页面设计数据包
        for(let _jsonObj of tableColumns){

            if(_jsonObj["index"] == "id"){
                continue;
            }

            //获取动态操作列内容，将详情查阅，编辑，删除三个操作提取转换
            if(_jsonObj["index"] == null && _jsonObj["buttons"] == null){
                continue;
            }
            if("none" == _jsonObj["display"]){
                continue;
            }
            if(_jsonObj["click"] != null) {
                let _clickObj = _jsonObj["click"];
                let comp: any;
                switch (_clickObj["type"]) {
                    case "drawer":

                        if ("TableDetailDrawerComponent" == _clickObj['component']) {
                            comp = TableDetailDrawerComponent;
                            _jsonObj["click"] = (record,instance) => {
                                record.__entity = _clickObj["entity"];
                                record.__id = record[_clickObj["mateKey"]];
                                this.drawerSrv.create({
                                    nzTitle: _clickObj["title"],
                                    nzContent: comp,
                                    nzWidth:400,
                                    nzContentParams: {
                                        record: record,
                                    },
                                })
                                // alert("1")
                            }
                        }

                        break;
                    case "modal":
                        if("CustomerModalSingleTemplate" == _clickObj['component']){
                            comp = CustomerModalSingleTemplate;
                            _jsonObj["click"] = (record,instance) => {
                                record["__entity"] = this.id;
                                record["__title"] = _clickObj["name"];
                                record["__modalId"] = _clickObj["option"];
                                this.modalSrv.create({
                                    nzContent: CustomerModalSingleTemplate,
                                    nzWidth:800,
                                    nzComponentParams: {
                                        record:record,
                                    },
                                    nzFooter:null,
                                });
                                // alert("1")
                            }
                        }
                    case "serviceUrl":
                        _jsonObj["click"]= (record, modal, comp) => {
                            let url = _jsonObj["serviceUrl"];
                            if(!url.startsWith("http")&&!url.startsWith("https")){
                                url = environment.gateway_server_url + url;
                            }
                            url = this.genServletUri(url,record)
                            let method = _jsonObj["method"];
                            if(method == null){
                                method = 'get';
                            }

                            this.http[method](url).subscribe((res:any)=>{
                                this.message.success("操作成功")
                                if(_jsonObj["afterOption"] == "refresh"){
                                    this.getData(false);
                                }else{
                                    this.data = res["rows"];
                                    this.total = res["total"]
                                }
                            },(res:any)=>{
                                this.message.success("操作失败")
                            })
                            // this.http.get(environment.gateway_server_url+"/"+_jsonObj["serviceUrl"]+record.id).subscribe((res:any)=>{
                            //     this.data = res["rows"];
                            //     this.total = res["total"]
                            // })
                        };
                        break;
                }
            }
            if(_jsonObj["buttons"] != null){
                _jsonObj["render"] = 'option';
                let _buttons:Array<any> = [];
                for (let _buttonObj of _jsonObj["buttons"] ) {
                    let button = this.genButtonClick(_buttonObj);
                    // 操作按钮提示框的提示问题
                    console.log(this.id)
                    if (button.popTitle) {
                        button.pop = {
                            title: button.popTitle,
                        }
                    }
                    // if (button != null) {
                    //     _buttons.push(button);
                    // }
                    // console.log('-------------menuButton-----------------------');
                    // let menuObj = this.menuButton[this.id];
                    // console.log(menuObj, 'menuObj');
                    // console.log(this.id, 'this.id');
                    // if (button != null && menuObj != null && menuObj.some(ele => ele.text == button.text)) {
                        _buttons.push(button);
                    // }
                }
                _jsonObj["buttons"] = _buttons;
            }
            tempColumn.push(_jsonObj);
        }
        this.columns = tempColumn;
        console.log(this.columns,'这是表头');
        //console.log(this.columns[this.columns.length-1]['buttons'][0]['click'])
        //let buttons = this.columns[this.columns.length-1]['buttons'];
        // for(let i in buttons){
        //     buttons[i]['click'] = (_record, modal) => this.message.success(`重新加载页面，回传值：${JSON.stringify(modal)}`);
        //
        // }
    }

    refresh(){
        this.getData(false);
    }

    buttonGetData(org_id ='',term_status='') {
        this.loading = true;
        TIMEOUT = setTimeout(() => {
            this.loading = false;
            clearTimeout(TIMEOUT);
        }, 5000);
        this.pageNumber = 1;
        this.treeId = '';
        this.term_status = '';
        this.getData(false, org_id ,term_status);
    }

    buttonResetData() {
        this.pageNumber = 1;
        this.params = this.defaultParams==null?{}:this.defaultParams;
        this.treeId = '';
        this.term_status = '';
        this.sf.reset();
        this.statisticParams = {};
        this.getData(true);
    }


    getData(initFlag:boolean,org_id='',term_status=''){
        this.st.clearStatus();
        let params;
        if (this.searchbeforeResult != null && this.searchbeforeResult != '') {
            console.log('后台返回的function', this.searchbeforeResult);
            params = this.sf?JSON.parse(JSON.stringify(this.sf.value)):{};
            eval(this.searchbeforeResult);
        }else{
            params = this.sf?JSON.parse(JSON.stringify(this.sf.value)):{};
        }
        if(initFlag){
            params = this.defaultParams==null?{}:this.defaultParams;
        }
        if(this.statisticParams != null){
            for(let key in this.statisticParams){
                params[key] = this.statisticParams[key];
            }
        }
        if(this.treeId!=''){
            params["org_id"] = this.treeId;
        }
        // if(org!=''){
        //     params["org"] = org;
        // }
        if(this.term_status!=''){
            params["term_status"] = this.term_status;
        }
        params["pageSize"] = this.pageSize;
        params["pageNumber"] = this.pageNumber;
        // if(this.treeId !=null){
        //     params["org_id"] = this.treeId;
        // }
        let sendParams:any = {param:JSON.stringify(params)}
        if(this.initUri!=null&&this.initUri.indexOf('/')>-1){
            let url
            console.log(this.initUri)
            let params = this.sf.value
            let date = this.dateMap["dateArray"];
            if(params["approve_time"] != null && date != null){
                params["approve_time"][0] = date[0];
                params["approve_time"][1] = date[1];
    
            }
            params["pageSize"] = this.pageSize;
            params["pageNumber"] = this.pageNumber;
            if(!this.initUri.startsWith("http")&&!this.initUri.startsWith("https")){
                url = environment.gateway_server_url + this.initUri;
            }
            url = this.genInitUri(url,params);
            console.log('inituri',url)
            this.http.get(url, sendParams).subscribe((res: any) => {
                console.log('树表格的数据',res);
                for(let i in res['rows']){
                    console.log(!!res['rows'][i]['vou_type'])
                    res['rows'][i]['vou_type'] = res['rows'][i]['vou_type']?res['rows'][i]['vou_type']:'';
                }
                this.data = res["rows"];
                this.total = res["total"]
            },error=>{},()=>{
                this.loading = false;
                clearTimeout(TIMEOUT);
            })
        }else{
            this.http.get(environment.common_crud_url + "/" + this.id, sendParams).subscribe((res: any) => {
                console.log('树表格的数据',res);
                for(let i in res['rows']){
                    console.log(!!res['rows'][i]['vou_type'])
                    res['rows'][i]['vou_type'] = res['rows'][i]['vou_type']?res['rows'][i]['vou_type']:'';
                }
                this.data = res["rows"];
                this.total = res["total"]
            },error=>{},()=>{
                this.loading = false;
                clearTimeout(TIMEOUT);
            })
        }
    }
    genServletUri(url:string,record:any){

        while (url.indexOf("{{") > 0 && url.indexOf("}}") > 0) {
            let i = url.indexOf("{{");
            let j = url.indexOf("}}");
            if (j > i) {
                let key = url.substring(i + 2, j);
                url = url.replace("{{" + key + "}}", record[key]);
            }
        }
        return url;
    }

    statisticParams:any = {};
    getParam(e){
        console.log(e);
        this.st.clearStatus();
        this.statisticParams = {};
        let key = e[0];
        let val = e[1];
        this.statisticParams[key] = val;
        this.getData(false);
    }
    getTable(){
        this.st.clearStatus();
        let params = {};
        params["pageSize"] = this.pageSize;
        params["pageNumber"] = this.pageNumber;
        let sendParams:any = {param:JSON.stringify(params)}
        this.http.get(environment.common_crud_url + "/" + this.id, sendParams).subscribe((res: any) => {
            console.log(res,'table')
            this.data = res["rows"];
            this.total = res["total"]
        })
    }
    genButtonClick(_buttonObj : any){
        switch (_buttonObj["type"]) {
            case "modal":
                if("TableEditModalComponent" == _buttonObj["modal"]["component"]){
                    let _modal = _buttonObj["modal"];
                    _modal["component"] = TableEditModalComponent;
                    _modal["params"] = (recode:any)=>{
                        recode["__entity"] = this.id;
                        recode["__title"] = this.name;
                        recode["__modalTitle"] = _modal["title"];
                        if(_modal["disabled"]== true){
                            recode["__disabled"] = true;
                        }else {
                            recode["__disabled"] = false;
                        }
                    }
                    _buttonObj["modal"] = _modal;
                    _buttonObj["click"] = (record, modal) => {
                        if(modal){
                            this.getData(false);
                        }
                    }
                }else if("CustomerModalTemplate" == _buttonObj["modal"]["component"]){
                    let _modal = _buttonObj["modal"];
                    _modal["component"] = CustomerModalTemplate;
                    _modal["params"] = (recode:any)=>{
                        recode["__entity"] = this.id;
                        recode["__title"] = _modal["name"];
                        recode["__modalId"] = _modal["option"];
                        recode["__modal"] = _modal;
                    }
                    _buttonObj["modal"] = _modal;
                    _buttonObj["click"] = (record, modal) => {
                        if(_buttonObj["afterOption"] == "refresh"){
                            this.getData(false);
                        }else{
                            // if(modal != null && modal.data!= null) {
                            //     modal.data.forEach((value: any, key: any) => {
                            //         this.modalResult.set(key, value);
                            //     })
                            // }
                        }
                    }

                }else if("CustomerModalSingleTemplate" == _buttonObj["modal"]["component"]){
                    let _modal = _buttonObj["modal"];
                    _modal["component"] = CustomerModalSingleTemplate;
                    _modal["params"] = (recode:any)=>{
                        recode["__entity"] = this.id;
                        recode["__title"] = _modal["name"];
                        recode["__modalId"] = _modal["option"];
                    }
                    _buttonObj["modal"] = _modal;
                    _buttonObj["click"] = (record, modal) => {
                    }
                }else if ("CustomerModalStSfTemplate" == _buttonObj["modal"]["component"]){
                    let _modal = _buttonObj["modal"];
                    _modal["component"] = CustomerModalStSfTemplate;
                    _modal["params"] = (recode:any)=>{
                        recode["__entity"] = this.id;
                        recode["__title"] = this.name;
                        recode["__columns"] = this.columns;
                        recode["__modalId"] = _modal["option"];
                    }
                    _buttonObj["modal"] = _modal;
                    _buttonObj["click"] = (record, modal) => {
                        if(modal){
                            this.getData(false);
                        }
                    }

                }else if ("FormTabsBasicComponent" == _buttonObj["modal"]["component"]) {
                    let _modal = _buttonObj["modal"];
                    _modal["component"] = FormTabsBasicComponent;
                    _modal["params"] = (recode: any) => {
                        recode["__entity"] = this.id;
                        recode["__title"] = this.name;
                        recode["__columns"] = this.columns;
                        recode["__options"] = _modal["options"];
                    }

                    _buttonObj["modal"] = _modal;
                    _buttonObj["click"] = (record, modal) => {
                        if (modal) {
                            this.getData(false);
                        }
                    }
                    let iif = _buttonObj["iif"]
                    _buttonObj["iif"] = (item: STData, btn: STColumnButton, column: STColumn) => {
                        let iifCode = true;
                        if (iif != null && iif != undefined)
                            eval(iif);
                        return iifCode;
                    }
                }
                let modal = _buttonObj["modal"];
                console.log(modal)
                if(modal['options']){
                    modal["modalOptions"]={
                        nzMaskClosable:false
                    }
                }else {
                    modal["modalOptions"]={
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
                    }
                }

                _buttonObj["modal"] = modal;
                let iifJs = _buttonObj["iif"]
                _buttonObj["iif"] = (item: STData, btn: STColumnButton, column: STColumn) => {
                    let iifCode = true;
                    if (iifJs != null && iifJs != undefined)
                        eval(iifJs);
                    return iifCode;
                };
                break;
            case "drawer":
                if("TableDetailDrawerComponent" == _buttonObj["drawer"]["component"]){
                    let _drawer = _buttonObj["drawer"];
                    _drawer["component"] = TableDetailDrawerComponent;

                    _drawer["params"] = (recode:any)=>{
                        recode["__entity"] = this.id;
                        recode["__id"] = recode.id;
                    }
                    _buttonObj["drawer"] = _drawer;
                    _buttonObj["click"] = (record, modal) => {
                        // this.st.reload();
                    }
                }else if("CustomerDrawerTemplate" == _buttonObj["drawer"]["component"]){
                    let _drawer = _buttonObj["drawer"];
                    _drawer["component"] = CustomerDrawerTemplate;
                    _drawer["params"] = (recode:any)=>{
                        recode["__entity"] = this.id;
                        recode["__title"] = _drawer["name"];
                        recode["__modalId"] = _drawer["option"];
                    }
                    _buttonObj["modal"] = _drawer;

                }
                break;
            case "del":
                _buttonObj["type"]='modal'
                _buttonObj["click"]= (record, modal, comp) => {
                    this.delete(record)
                };
                break;
            case "more":
                let children = _buttonObj["children"]
                let childrenButton = [];
                for (let _childObj of children ) {
                    childrenButton.push(this.genButtonClick(_childObj)) ;
                }
                _buttonObj["children"] = childrenButton;
                break;
            case "serviceUrl":

                let iif = _buttonObj["iif"]
                _buttonObj["iif"] = (item: STData, btn: STColumnButton, column: STColumn) => {
                    let iifCode = true;
                    if (iif != null && iif != undefined)
                        eval(iif);
                    return iifCode;
                }
                _buttonObj["click"]= (record, modal, comp) => {
                    let url = _buttonObj["serviceUrl"];
                    if(!url.startsWith("http")&&!url.startsWith("https")){
                        url = environment.gateway_server_url + url;
                    }
                    url = this.genServletUri(url,record);
                    let method = _buttonObj["method"];
                    if(method == null){
                        method = 'get';
                    }
                    this.http[method](url).subscribe((res:any)=>{
                        if(res ) {
                            if (0 == res.code) {
                                this.message.success(res.msg ? res.msg : "操作成功")
                            } else {
                                this.message.error(res.msg||"操作失败")
                            }
                        }
                        if(_buttonObj["afterOption"] == "refresh"){
                            this.getData(false);
                        }else if(_buttonObj["afterOption"] == "alert") {
                            let code = res["code"];
                            if (code != null) {
                                if (code == 0 || code == 200) {
                                    this.message.info(res["msg"]);
                                } else {
                                    this.message.error(res["msg"]);
                                }
                            }else {
                                this.message.info(("获取分量成功"));
                            }
                        }else{
                            this.data = res["rows"];
                            this.total = res["total"]
                        }

                    })
                };

                break;
            default:
                break;
        }
        return _buttonObj;
    }

    homeNodeKey: any = "";
    //获取左树的数据
    getLeftTreeDate(treeData){
        this.treeSize = treeData.treeDisplay?20:0;
        this.tableSize = treeData.treeDisplay?80:100;
        let url = treeData.initUri;
        if(treeData.type == "org"){
            url = environment.manage_server_url+"/sys/orgs/tree?orgId="+this.userService.getUser().orgId;
        }else if (!/^http[s]?:\/\/.*/.test(url)) {
            url = environment.gateway_server_url + url;
        }
        this.treeInitUri = url;
       /* this.http.get(url).subscribe((res:any)=>{
            this.treeData = res;
            //转换数据 key children 形式
            this.getTreeListData(res[0]);
            //清理孙元素
            this.clearGrandsonListData();

            let initData = res[0];
            if(initData.children!= null && initData.children.length>0){
                for(let index in initData.children){
                    initData.children[index].children = null;
                }
            }
            let initDataTemp:any = JSON.parse(JSON.stringify(initData));
            this.nodes = [initDataTemp];
            if(this.nodes != null && this.nodes.length == 1){
                this.homeNodeKey = this.nodes[0].key;
            }

        })*/

    }

    treeListData:any = {};
    getTreeListData(data){
        let listData = data.children;
        this.treeListData[data.key] = listData;
        //往下遍历
        if(data.children != null && data.children.length>0){
            for(let index in data.children){
                let newData = data.children[index];
                this.getTreeListData(newData);
            }
        }
    }

    clearGrandsonListData(){
        for(let key in this.treeListData){
            let son = this.treeListData[key];
            if(son !=null && son.length>0){
                for(let index in son) {
                    son[index]['children'] = null;
                }
            }
        }

    }


    // nzEvent(event: NzFormatEmitEvent): void {
    //     let treeListDataTemp:any = JSON.parse(JSON.stringify(this.treeListData));
    //     if(!event.node.isDisabled){
    //         this.treeId = event.node.key;
    //         this.getData(false);
    //     }
    //
    //     if (event.eventName === 'expand') {
    //         const node = event.node;
    //         if(node.isExpanded == true){
    //             node.addChildren(treeListDataTemp[node.key])
    //         }else{
    //             node.clearChildren();
    //         }
    //
    //         // let url = environment.manage_server_url+"/sys/orgs/orgTree/async?status=1&id="+node.key;
    //         // if (node && node.getChildren().length === 0 && node.isExpanded) {
    //         //     this.http.get(url).subscribe((res:any)=>{
    //         //         node.addChildren(res)
    //         //     })
    //         // }
    //     }
    //
    // }
    eventServiceResult:Subscription;

    ngOnInit() {
        
        console.log(environment,'环境')
        this.route.data.subscribe(res=>{
            this.hasHeader = res.header===false?res.header:true;
        })
        this.container.nativeElement.style.height = (window.innerHeight-150)+'px';
        this.pageNumber = 1;
        this.pageSize = 10;
        this.treeId = '';
        this.term_status = '';
        this.route.queryParams.subscribe(res=>{
            this.doc_name = res['title'];
            this.route.params
                .subscribe((params: Params) => {
                    this.ngOnDestroy();
                    this.eventServiceResult = this.eventService.subscribe(this.treeEvent,this);
                    this.statisticFlag = false;
                    this.data = new Array();
                    this.id = params['id'];
                    this.buttons = [];
                    this.tabListConfig = '';
                    this.url = '';
                    this.treeId = res['org_id'];
                    this.term_status = res['term_status'];
                    // setTimeout(()=> {
                    //     this.titleService.setTitle(this.doc_name)
                    // }, 1000 )
                    this.getColumns(res['org_id'],res['term_status']);
                    this.ngAfterViewInitl();
                })
        })
        this.newPerms = this.id+":table:template:add";
        this.deletePerms = this.id+":table:template:delete";
    }


    treeEvent(_event,_this){
        if(_event.key == "treeEvent"){
            _this.treeId = _event.value;
            _this.getData(false);
        }
    }

    treeSize:number = this.treeDisplay?20:0;
    tableSize:number = this.treeDisplay?80:100;

    resize(type: string, e: {gutterNum: number, sizes: Array<number>}) {
        if(type === 'gutterClick') {
            this.gutterClick(e);
        }
        else if(type === 'dragEnd') {
            this.treeSize = e.sizes[0];
            this.tableSize = e.sizes[1];
        }
    }

    gutterClick(e: {gutterNum: number, sizes: Array<number>}) {
        if(e.gutterNum === 1) {
            if (this.treeSize > 0) {
                this.tableSize += this.treeSize;
                this.treeSize = 0;
            }
            //     else if(this.tableSize > 25) {
            //         this.tableSize -= 20;
            //         this.treeSize = 20;
            //     }
            else {
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

    checkNodeType(node){
        if(this.homeNodeKey == node.key){
            return "home";
        }else{
            if(node.isLeaf){
                return "leaf";
            }else {
                if(node.isExpanded){
                    return "open"
                }else {
                    return "close"
                }
            }
        }
    }

    globalButtonClick(item:any){
        if(item['click'] == 'add'){
            this.add();
        }else if(item['click'] == 'modal'){
            this.openCustomerModal(item['option']);
        }else if(item['click'] == 'deletes'){
            this.deletes();
        }else if(item['click'] == 'downloadTemplate'){
            // 创建隐藏的可下载链接
            let eleLink = document.createElement('a');
            let url = environment.file_server_url+'/download?filename=templates/'+this.id+".xls";
            // let url = environment.file_server_url+'/download?filename=hall/monitor_crown_blacklist_manage.xls';
            eleLink.style.display = 'none';
            // 字符内容转变成blob地址
            //var blob = new Blob([content]);
            eleLink.href = url;
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
        }else if(item['click'] == 'export'){
            this.loading2 = true;
            TIMEOUT2 = setTimeout(() => {
                this.loading2 = false;
                clearTimeout(TIMEOUT2);
            }, 15000);
            let params = this.sf.value;
            params["pageSize"] = this.pageSize;
            params["pageNumber"] = this.pageNumber;
            //let sendParams:any = {param:JSON.stringify(params)}
            //let eleLink = document.createElement('a');
            // eleLink.download = item['url'];
            //eleLink.style.display = 'none';
            // 字符内容转变成blob地址
            let newVar = this.tokenService.get();
            let token = newVar['token'];
            let excelUrl = item["url"];
            let header = new HttpHeaders();
            header.append("Content-Type", "application/json");
            header.append("token", token);
            let url = '';
            console.log(this.sf.value)
            if (excelUrl == null || excelUrl == undefined || excelUrl == "") {
                url = environment.gateway_server_url + '/engine/excel/exportByConfig/'+ this.id +'?token='+ token+'&param='+JSON.stringify(params);
                //eleLink.href = encodeURI( environment.gateway_server_url + '/engine/excel/exportByConfig/'+ this.id +'?token='+ token+'&param='+JSON.stringify(params));
            } else {
                url = environment.gateway_server_url + excelUrl + '?token='+ token+'&param='+JSON.stringify(params);
                //eleLink.href = encodeURI( environment.gateway_server_url + excelUrl + '?token='+ token+'&param='+JSON.stringify(params));
            }
            let properties = this.searchSchema.properties;
            for(let i in properties){
                if(properties[i]['required']==true){
                    if(!params[i]){
                        this.message.error(properties[i]['title']+'是必须的');
                        return false;
                    }
                }
            }
            this.http.post(url, null,null, {
                responseType: "blob",
                headers: header
            }).subscribe(resp=>{
                // resp: 文件流
                this.downloadFile(resp,this.sf.value);
            },error=>{},()=>{
                this.loading2 = false;
                clearTimeout(TIMEOUT2);
            })
        }else if(item['click'] == 'download'){
            // 创建隐藏的可下载链接
            let eleLink = document.createElement('a');
            let url = environment.file_server_url+'/download?filename='+item.url;
            // let url = environment.file_server_url+'/download?filename=hall/monitor_crown_blacklist_manage.xls';
            eleLink.style.display = 'none';
            // 字符内容转变成blob地址
            eleLink.href = url;
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
        }else if(item['click'] == 'serviceUrl'){
            let url = item["url"];
            if(!url.startsWith("http")&&!url.startsWith("https")){
                url = environment.gateway_server_url + url;
            }
            let method = item["method"];
            if(method == null){
                method = 'get';
            }

            this.http[method](url).subscribe((res:any)=>{
                this.message.success("操作成功")
                if(item["afterOption"] == "refresh"){
                    this.getData(false);
                }else{
                    this.data = res["rows"];
                    this.total = res["total"]
                }
            },(res:any)=>{
                this.message.success("操作失败")
            })
        }else if(item['click'] == 'router'){
            console.log("009888888888");
            this.router.navigate([item.url]);
        }
    }
    //文件下载
    downloadFile(data,jsonData:any='') {
        console.log(jsonData);
        // 下载类型 xls
        const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        // 下载类型：csv
        const contentType2 = 'text/csv';
        const uA = window.navigator.userAgent;//判断本机内核
        const isIE = /msie\s|trident\/|edge\//i.test(uA) && !!("uniqueID" in document || "documentMode" in document || ("ActiveXObject" in window) || "MSInputMethodContext" in window);
        const blob = new Blob([data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        // 打开新窗口方式进行下载
        // window.open(url);

        // 以动态创建a标签进行下载
        const a = document.createElement('a');
        let fileName:any = new Date().toLocaleDateString();
        if(jsonData["statistic_date"]){
            fileName = jsonData["statistic_date"][0]+"—"+jsonData["statistic_date"][1];
        }
        a.href = url;
        a.download = this.name + fileName + '.xls';
        if (isIE) {
            // 兼容IE11无法触发下载的问题
            navigator.msSaveBlob(new Blob([data]),a.download);
        } else {
            a.click();
        }
        window.URL.revokeObjectURL(url);
    }
    ngAfterViewInitl() {
        let url = environment.runtime_server_url+'/table'+'/operation/'+this.id;
        this.http.get(url).subscribe((res: any) => {

            if(res == null || res.operations == null)return;
            this.buttons = res.operations;
            console.log(this.buttons);
        });
    }
    openCustomerModal(modalId:any){
        this.modalSrv.create({
            nzContent: CustomerModalTemplate,
            nzWidth:800,
            nzComponentParams: {
                record:{__entity:this.id,__modalId:modalId},
            },
            nzFooter:null,
        });
    }
    uploadChange(event){
        if(event.type == 'success'){
            let response = event.file.response;
            let path = response.path;
            // path = path.substring(5);
            path = path.toString().replace("/download?filename=","");
            let url1 = environment.gateway_server_url + '/engine/excel/import/'+this.id+'?path=' + path;
            this.http.get(url1).subscribe((res: any) => {
                this.message.success("导入成功");
                this.refresh();

            });
        }
    }
    ngOnDestroy(){
        this.eventService.unsubscribe(this.eventServiceResult);
        if(this.eventServiceResult!=null) {
            this.eventServiceResult.unsubscribe();
        }
        this.eventServiceResult = null;
    }
}
