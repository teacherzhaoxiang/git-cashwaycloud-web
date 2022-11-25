import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NzListComponent, NzMessageService, NzModalService} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {ActivatedRoute, Params} from "@angular/router";
import {SFComponent, SFSchema, SFSchemaEnumType,} from "@delon/form";
import {environment} from "@env/environment";
import {EventService} from "@shared/event/event.service";
import Timer = NodeJS.Timer;
import {ImageMessageModalComponent} from "./image-message-list.detail";
import {TableAddModalComponent} from "../table-template/add.template";
import {MonitorDetailModalComponent} from "../card-list-template/card-list.detail";
@Component({
    selector: 'image-message-list-template',
    templateUrl: './image-message-list.template.html',
    styles: [
            `
            ::ng-deep .ant-avatar {
                margin-right: 3px;
                margin-left: 3px;
            }
            ::ng-deep .ant-card-body {
                padding: 20px;
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
            .list-span-simple{
                display: inline-block;
                padding: 0 4px;
                height: 26px;
                font-weight: bold;
                font-size: 16px;
                margin-right: 10px;
                display: inline-block;
                text-align: center;
                cursor:pointer;
                margin-bottom: 5px;
            }
            :host ::ng-deep .ant-col-xl-6{
                display: block;
                box-sizing: border-box;
                width: 33%;
            }

        `,
    ],
    encapsulation: ViewEncapsulation.Emulated,
})
export class ImageMessageListTemplateComponent implements OnInit,OnDestroy {
    @ViewChild('sf',{ static: true })
    sf: SFComponent;

    @ViewChild('listView',{ static: true })
    listView:NzListComponent;
    list: any[] = [null];
    checked:boolean = true;
    loading = false;
    isLoadingOne = false;
    id:string = "";
    total:0;
    page:any = {index:1,size:10};
    params: any = {};
    filePath:string;

    constructor(private http: _HttpClient,
                public msg: NzMessageService,
                private route: ActivatedRoute,
                private modalSrv: NzModalService,
                private activatedRoute: ActivatedRoute) {}

    searchSchema: any = {
        properties: {
        }
    }

    timer:Timer;
    modal = null;
    initUri = "";
    //循环间隔
    interval:number = 0;
    //循环条件
    exitInterval:string;
    maxTry:number = 0;
    maxTryErrorMsg:string = "";
    defaultParams = {};
    TIMEOUT:any=0;
    viewFields:any[];
    pageHeader:boolean=true;


    currentId:string;
    openStatusDetail(event,data){

        this.modal = this.modalSrv.create({
            nzContent: ImageMessageModalComponent,
            nzWidth:0,
            nzComponentParams: {
                record:data,
                imageSrc:this.filePath+data.src
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

            }
        });
        this.modal.afterOpen.subscribe(()=>{

        })
        this.modal.afterClose.subscribe(()=>{

        })

    }
    mouseLeave(id){

    }
    refresh(){
        debugger;
            
                let ids:any[] = [];
               
                if(this.list!=null){
                    for(let i=0;i<this.list.length;i++){
                        //当前页面的id
                    let dataObj = this.list[i];
                    ids.push(dataObj['id']);
                    }
               let url = environment.gateway_server_url + '/hall/publish_screen_manage/publishScreenManage/view/refresh';
               this.isLoadingOne = true;
                this.http.put(url,ids).subscribe((res:any)=>{            
                    if(res.code == 0){
                         this.msg.success('更新成功，请等待片刻。。。');
                      
                         this.TIMEOUT = setTimeout(() => {
                          //   this.getTableDatas(false);
                                this.isLoadingOne =false;
                             clearTimeout(this.TIMEOUT);
                         }, 60000);
                    }
                },()=>{
                    this.isLoadingOne = false;
                    this.clearIntervalFun();
                },()=>{
                //    this.loading = false;
               //     clearTimeout(this.TIMEOUT);
                }) 

        }
    }
 

    reset(){
        this.page = {index:1,size:10};
        this.params = this.defaultParams==null?{}:this.defaultParams;
        this.sf.reset();
        this.getData(true);
    }
    buttonGetData(){
      //  debugger;
        this.loading = true;
        this.TIMEOUT = setTimeout(() => {
            this.loading = false;
            clearTimeout(this.TIMEOUT);
        }, 5000);
        this.page.index = 1;
        this.getData(false);
    }


    clearIntervalFun(){
        if(this.timer!= null){
            clearInterval(this.timer);
            this._times = 0;
        }

    }
    _times = 0;
    getTableDatas(initFlag:boolean){
        let params = this.sf.value;
        if(initFlag){
            params = this.defaultParams==null?{}:this.defaultParams;
        }
        params["pageSize"] = this.page.size;
        params["pageNumber"] = this.page.index;
        let sendParams:any = {param:JSON.stringify(params)}
        let url = environment.common_crud_url+"/"+this.id;
        if(this.initUri != null &&  this.initUri != ""){

            if(!this.initUri.startsWith("http")&&!this.initUri.startsWith("https")){
                url = environment.gateway_server_url + this.initUri;
            }
        }
        //获取表格数据
        this.http.get(url,sendParams).subscribe((res:any)=>{
            if(res.code == 0){
                this.list = res["rows"];
                if(this.list!=null){
                    for(let i=0;i<this.list.length;i++){
                        let dataObj = this.list[i];
                        let displayFields:any[] = [];
                        for(let j=0;j<this.viewFields.length-1;j++){
                           for(let data in dataObj){
                               let display = this.viewFields[j]['display'];
                               if(!(display!=null && display== 'none')){
                                   if(data == this.viewFields[j]['index']){
                                       let tempData = {}
                                       tempData['key'] = this.viewFields[j]['title'];
                                       tempData['value'] = dataObj[data];
                                       dataObj[data] = tempData;
                                       displayFields.push(dataObj[data]);
                                   }
                               }
                           }
                        }
                        dataObj.displayFields = displayFields;
                    }
                }
                this.total = res["total"]
            }else {
                this.clearIntervalFun();
                alert(res.msg);
            }
        },()=>{
            this.clearIntervalFun();
        },()=>{
            this.loading = false;
            clearTimeout(this.TIMEOUT);
        })
    }

    getData(initFlag:boolean){
        if(this.interval != null && this.interval > 0){
            console.log("-----11getData111")
            this.getTableDatas(initFlag);
            this.timer = setInterval(()=>{
                if(this.exitInterval != null && this.exitInterval != ""){
                    let exitFlag:boolean = eval(this.exitInterval);
                    if(exitFlag){
                        this.clearIntervalFun();
                    }else {
                        if(this.maxTry ==null || this.maxTry ==undefined || this.maxTry == 0){
                            this.getTableDatas(initFlag);
                        }else{
                            if(this._times >= this.maxTry){
                                this.clearIntervalFun();
                                alert(this.maxTryErrorMsg);

                            }
                            this.getTableDatas(initFlag);
                            this._times++
                        }
                    }
                }

            },this.interval);

        }else {
            this.getTableDatas(initFlag);
        }
    }
    getColumns(){

        let url = environment.runtime_server_url+'/table'+'/init/'+this.id;
        this.http.get(url).subscribe((res:any)=>{
            this.initUri = res["initUri"];
            this.interval = res["interval"];
            this.exitInterval = res["exitInterval"];
            this.maxTry = res["maxTry"];
            this.maxTryErrorMsg = res["maxTryErrorMsg"];
            this.defaultParams = res["defaultParams"];
            this.genSearchSchema(res["searchFields"]);
            this.viewFields = res["viewFields"]
            this.getData(true);
            // this.list = res["rows"];
            // this.total = res["total"];
            console.log("getData")
        })
    }

    genSearchSchema(searchField:any){
        let properties = {};
        for(let field of searchField){
            //debugger
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

                data["ui"] = ui;
            }
            if(typeof field["required"]!== 'undefined'){
                data["required"] = field["required"];
            }else {
                data['required'] = false;
            }

            properties[key] = data;

            // let perm = 'template:table-template:'+this.id+":"+field["perm"];//权限
            // console.log('----perm----'+perm);
            // //默认显示所有超链接，但是如果，配置了权限，那么不显示按钮
            // if( field["perm"]!=null ){
            //     if(this.perms.includes(perm)){
            //         properties[key] = data;
            //     }
            // }else{
            //     properties[key] = data;
            // }

        }

        console.log(this.searchSchema)
        this.searchSchema = {properties:properties};
    }

    ngOnInit() {
        this.pageHeader = this.activatedRoute.snapshot.queryParams['pageHeader'];
        this.route.params
            .subscribe((params: Params) => {
                this.id = params['id'];
                this.getColumns();
                this.filePath = environment.file_server_url;
            })
    }

    ngOnDestroy(){
        this.clearIntervalFun();
    }
}
