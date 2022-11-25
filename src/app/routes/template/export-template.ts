import {Component, ElementRef, Inject, OnInit, Renderer2, ViewChild} from '@angular/core';
import {STChange, STColumn, STColumnButton, STComponent, STData, STPage} from "@delon/abc";
import {SFComponent, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
import {_HttpClient} from "@delon/theme";
import {NzDrawerService, NzMessageService, NzModalService} from "ng-zorro-antd";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";
import {UserService} from "../service/user.service";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import Timer = NodeJS.Timer;
import {HttpHeaders} from "@angular/common/http";
let TIMEOUT = null;
@Component({
    selector: 'app-export-template',
    template: `
        <page-header [title]="name" *ngIf="hasHeader"></page-header>
        <nz-card>
            <sf style="margin-top: 70px;margin-bottom: 20px;" #sf [schema]="searchSchema" [formData]="params" (formSubmit)="getData(false)" (formReset)="st.reset(params)" size="large" button="none">

            </sf>
            <my-sv [cols]="statisticCols" [asyncData]="staticAsyncData" [enum]="statisticEnum"  [labels]="statisticLabels" ></my-sv>
            <nz-row  style="padding: 10px;display: flex;justify-content: center;">
                <div nz-col nzspan="10" nzOffset="4">
                    <span *ngFor="let item of buttons">
                          <button nz-button [nzLoading]="loading" *ngIf="item.type !== 'import'"    class="{{item['_class']?item['_class']:'ant-btn ant-btn-primary'}}"
                                  (click)="globalButtonClick(item)"
                                  type="button"
                                  style="margin-left: 4px;float: left" >{{item['label']}}</button>
                      </span>
                    <span *ngIf="buttons" style="display: inline-block;margin-left: 100px;"><button [ngStyle]="{'display':showResetButton}" nz-button (click)="buttonResetData()" class="ant-btn" ><i *ngIf="userService.user.sysUserExtensionDO.buttonIcon==1" class="anticon-cashway anticon-cashway-reset"></i>重置</button></span>
                </div>
                <!--<template id="uploadTemplate">-->
                <!--<button id="export" type="button"></button>-->
                <!--</template>-->
            </nz-row>
        </nz-card>

    `,
    styles: [`
        :host ::ng-deep .sf__inline sf-item-wrap .ant-form-item {
            width: 100%;
        }

        :host ::ng-deep .ant-card-bordered {
            height: 100%;
        }

        :host ::ng-deep .ant-card-body {
            height: 100%;
        }
        :host ::ng-deep .ant-calendar-picker{
            width: 100%;
        }
        :host ::ng-deep .ant-row{
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
        }
        :host ::ng-deep label{
            font-size: 18px;
        }
        :host ::ng-deep .ant-calendar-picker-input{
            height: 44px;
            line-height: 44px;
            font-size: 15px;
        }
        :host ::ng-deep button{
            width: 100px;
        }
    `]
})
export class ExportTemplateComponent implements OnInit {
    loading = false;
    //查询条件绑定参数
    params: any = {};
    //表格中数据绑定参数
    data : any;
    //对象id，唯一标识一个页面
    id = "";
    name = "";
    showResetButton = "inline";
    initUri = "";
    interval:number = 0;
    exitInterval:string;
    maxTry:number = 0;
    maxTryErrorMsg:string = "";
    editFlag = true;
    modalResult:Map<string,Object> = new Map<string, Object>();
    _this:any;
    @ViewChild('st',{ static: true })
    st: STComponent;

    @ViewChild('sf',{ static: false })
    sf: SFComponent;
    newPerms:any = "";
    deletePerms:any = "";
    buttons:string[];
    viewFields:any;
    delayFlag:boolean = false;
    nzAction:string = environment.file_server_url+"/upload?typeName=hall";
    perms:string[];

    searchSchema: any = {
        properties: {
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
    pageSize: number = 10;
    selections : STData[] = [];
    //统计栏
    statisticLabels:any = [];
    statisticCols:number = 4;
    staticAsyncData:string = "";
    statisticEnum:any;
    hasHeader:any = true;
    checkable:any;
    doc_name:any = '';
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

    pageHandle(showFlag){
        let pageTemp:STPage = {
            front:false,
            showQuickJumper:true,
            total:true,
            showSize:true
        }
        if(showFlag!=null && !showFlag){
            pageTemp.show = false;
            this.page = pageTemp;
        }
    }
    constructor(private http: _HttpClient,private message: NzMessageService,private route: ActivatedRoute,private modalSrv: NzModalService,private drawerSrv:NzDrawerService, private router: Router,public render: Renderer2, @Inject(DOCUMENT) private document,public userService:UserService, @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {}
    defaultParams = {};
    //表格绑定参数
    columns: STColumn[] = [{ title: '编号', index: 'id' }];
    getColumns(){
        this.pageNumber =1;
        let url = environment.runtime_server_url+'/table'+'/init/'+this.id;
        console.log(url)
        this.http.get(url).subscribe((res:any) =>{
            this.doc_name = res.name;
            console.log(res.name)
            // console.log(res)
            // this.name = res["name"];
            // this.initUri = res["initUri"];
            // this.delayFlag = res["delayFlag"];
            // this.editFlag = !res['readOnly'];
            // this.interval = res["interval"];
            // this.exitInterval = res["exitInterval"];
            // this.maxTry = res["maxTry"];
            // this.maxTryErrorMsg = res["maxTryErrorMsg"];
            // this.defaultParams = res["defaultParams"];
            // this.showResetButton = res["showResetButton"] == null ? "inline" : res["showResetButton"];
            // this.pageHandle(res["pageShow"]);
            this.genSearchSchema(res["searchFields"]);
            // console.log(this.sf.value);
            // this.viewFields = res["viewFields"];
            // if(res["statistic"] != null){
            //     this.statisticLabels = res["statistic"]["labels"];
            //     this.statisticCols =  res["statistic"]["cols"];
            //     this.staticAsyncData =  res["statistic"]["asyncData"];
            //     this.statisticEnum = res["statistic"]["enum"];
            // }
            // //this.genTableColumns(res["viewFields"]);
            // if(!this.delayFlag){
            //     this.getData(true);
            // }

        });
    }

    globalButtonClick(item:any){
        this.loading = true;
        TIMEOUT = setTimeout(() => {
            this.loading = false;
            clearTimeout(TIMEOUT);
        }, 15000);
        if(item['click'] == 'export'){
            let params = this.sf.value;
            this.pageNumber = 1;
            //this.getData(false);
            params["pageSize"] = this.pageSize;
            params["pageNumber"] = this.pageNumber;
            params["__orgId"] = this.userService.user.orgId;
            params["__userId"] = this.userService.user.id;
            // 字符内容转变成blob地址
            let newVar = this.tokenService.get();
            let token = newVar['token'];
            let excelUrl = item["url"];
            let header = new HttpHeaders();
            header.append("Content-Type", "application/json");
            header.append("token", token);
            let url = '';
            if (excelUrl == null || excelUrl == undefined || excelUrl == "") {
                url = environment.gateway_server_url + '/engine/excel/exportByConfig/'+ this.id +'?token='+ token+'&param='+JSON.stringify(params);
            } else {
                url = environment.gateway_server_url + excelUrl + '?token='+ token+'&param='+JSON.stringify(params);
                //eleLink.href = encodeURI( environment.gateway_server_url + excelUrl + '?token='+ token+'&param='+JSON.stringify(params));
            }
           //this.searchSchema['required'] = ['statistic_date'];
            //debugger
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
                console.log(resp)
                this.downloadFile(resp,this.sf.value);
            },error=>{},()=>{
                this.loading = false;
                clearTimeout(TIMEOUT);
            })
        }
    }
    //文件下载
    downloadFile(data,jsonData) {
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
        let fileName:any = "";
        try{
            if ((fileName = jsonData['statistic_date'][0]).length === 1) {
                fileName = jsonData['statistic_date'];
            }else {
                fileName = jsonData["statistic_date"][0]+"—"+jsonData["statistic_date"][1];
            }
        }catch(err){
            fileName = new Date().toLocaleDateString();
        }
        a.href = url;
        a.download = this.doc_name+fileName + '.xls';
        if (isIE) {
            // 兼容IE11无法触发下载的问题
            navigator.msSaveBlob(new Blob([data]),a.download);
        } else {
            console.log(123);
            console.log(a.href);
            a.click();
        }
        window.URL.revokeObjectURL(url);
    }

    genSearchSchema(searchField:any){
        console.log(searchField)
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
                            if(JSON.stringify(this.sf.value) != "{}"){
                                console.log(this.sf.value[key])
                                let value:any[] = this.sf.value[key];
                                if(value.length==2){
                                    if(value[0]==value[1]){
                                        let dateArray:any[]=[];
                                        if(value[0].split(' ').length==1){
                                            dateArray.push(value[0]+" 00:00:00");
                                        }else {
                                            dateArray.push(value[0]);
                                        }
                                        if(value[1].split(' ').length==1){
                                            dateArray.push(value[1]+" 23:59:59");
                                        } else {
                                            dateArray.push(value[1]);
                                        }
                                        this.sf.value[key] = dateArray;
                                    }
                                }
                            }
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
        // properties['statistic_date']['ui']["spanLabel"] = 3;
        // properties['statistic_date']['ui']["spanControl"] = 10;
        this.searchSchema = {properties:properties};
    }




    timer:Timer;

    buttonResetData() {
        this.pageNumber = 1;
        this.params = this.defaultParams==null?{}:this.defaultParams;
        this.sf.reset();
        this.getData(true);
    }

    clearIntervalFun(){
        if(this.timer!= null){
            clearInterval(this.timer);
            this._times = 0;
        }

    }
    _times = 0;
    getData(initFlag:boolean){
        //this.st.clearStatus();
        if(this.interval != null && this.interval > 0){
            this.timer = setInterval(()=>{
                if(this.exitInterval != null && this.exitInterval != ""){
                    let dom = this;
                    let exitFlag:boolean = eval(this.exitInterval);
                    if(exitFlag){
                        this.clearIntervalFun();
                    }else {
                        if(this._times >= this.maxTry){
                            this.clearIntervalFun();
                            alert(this.maxTryErrorMsg);

                        }
                        //this.getTableDatas(initFlag);
                        this._times++
                    }
                }

            },this.interval);

        }else {
            //this.getTableDatas(initFlag);
        }
    }

    ngAfterViewInitl() {
        let url = environment.runtime_server_url+'/table'+'/operation/'+this.id;
        this.http.get(url).subscribe((res: any) => {
            console.log(res)
            if(res == null || res.operations == null)return;
            this.buttons = res.operations;
        });
    }



    ngOnInit() {
        this.route.data.subscribe(res=>{
            this.hasHeader = res.header===false?res.header:true;
        })
        this._this = this;
        this.interval = 0;
        this._times = 0;
        if(this.timer!=null){
            clearInterval(this.timer);
        }
        let permsString:string = localStorage.getItem("perms");
        this.perms = permsString.split(",");
        this.pageSize=10;
        this.route.params
            .subscribe((params: Params) => {
                console.log(params)
                //this.getColumns();
                this.page = {
                    front:false,
                    showQuickJumper:true,
                    total:true,
                    showSize:true,
                    show:true,

                }
                this.pageNumber =1;
                this.data = new Array();
                this.id = params['id'];
                this.newPerms = this.id+":table:template:add";
                this.deletePerms = this.id+":table:template:delete";
                this.getColumns();
                this.ngAfterViewInitl();
            })
    }
}
