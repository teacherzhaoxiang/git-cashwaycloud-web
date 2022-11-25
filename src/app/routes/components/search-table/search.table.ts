import {
    ChangeDetectorRef,
    Component,
    DoCheck,
    EventEmitter, Injector,
    Input,
    NgZone,
    OnInit,
    Output,
    ViewChild,
    OnDestroy
} from '@angular/core';
import {ControlWidget, SFComponent, SFItemComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {NzMessageService, NzModalRef, NzModalService, NzTreeNode} from "ng-zorro-antd";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";
import {TransferService} from "../../template/step-form-template/transfer.service";
import {STChange, STColumn, STColumnButton, STComponent, STData, STPage} from "@delon/abc";
import {ActivatedRoute, Params} from "@angular/router";
import {TableAddModalComponent} from "../../template/table-template/add.template";
import {TableEditModalComponent} from "../../template/table-template/edit.template";
import {TableDetailDrawerComponent} from "../../template/table-template/detail.template";
import {UtilsService} from "../../../utils.Service";
import {EventService} from "@shared/event/event.service";
import {TableCloneModalComponent} from "../../template/table-template/clone.template";
import {CustomerModalTemplate} from "../../template/table-template/customer.modal.template";
import {CustomerModalSingleTemplate} from "../../template/table-template/customer.modal.single.template";
import {CustomerModalStSfTemplate} from "../../template/table-template/customer.modal.st.sftemplate";
import {CustomerDrawerTemplate} from "../../template/table-template/customer.drawer.template";

@Component({
  selector: 'search-table',
    template: `
    <nz-card>
      <sf #sf *ngIf="searchFlag" mode="search" [button]="'none'" [schema]="searchSchema" [formData]="params" (formSubmit)="st.reset($event)" (formReset)="st.reset(params)" size="large">
        <button nz-button type="button" style="margin-top: 4px;" (click)="refresh()">查询</button>
      </sf>
  <st #st [data]="data" [(ps)]="pageSize" [columns]="columns" [req]="{params: params}" [page]="page" [total]="total" (change)="tableChange($event)"></st>
</nz-card>
  `,styles:[
        `
           :host ::ng-deep .ant-select, .ant-cascader-picker{
               width:120px;
           }
        `
    ]

})
export class SearchTableComponent extends ControlWidget implements OnInit,OnDestroy{


    static readonly KEY = 'searchTable';

    searchFlag:any = true;
    //查询条件绑定参数
    params: any = {};
    //表格中数据绑定参数

    @Input()
    data : any;


    @Input()
    public entity: string;
    @Input()
    serverData:any;
    valueSet = new Set();

    @Input()
    transferServiceData:TransferService;

    @ViewChild('st',{ static: false })
    st: STComponent;

    @ViewChild('sf',{ static: false })
    sf: SFComponent;
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
    pageSize : number = 0;
    pageSizes:any = [];  //分页器中每页显示条目数下拉框值
    selections : STData[] = [];
    viewFields:any;
    //当前页
    //绑定分页参数改变想要事件
    tableChange(e: STChange) {
        if(e.type == 'pi' || e.type == 'ps'){
            this.pageNumber = e.pi;
            this.pageSize = e.ps
            this.getData();
        }


        //控件在form里面的参数名
        let paramName = this.formProperty.path;
        if(paramName !=null && paramName!= undefined && paramName.length>0){
            paramName = paramName.substring(1,paramName.length);
        }


        if(e.checkbox != undefined){
            this.selections = e.checkbox;
        }
        if(this.selections == undefined){
            return;
        }


        console.log("======forEach===1===")
        console.log(this.valueSet)

        for(let key in this.data){
            if(this.valueSet.has(this.data[key]["id"])){
                this.valueSet.delete(this.data[key]["id"]);
            }
        }

        for(let key in this.selections){
            this.valueSet.add(this.selections[key]["id"]);
        }

        console.log("======forEach====2==")
        console.log(this.valueSet)

        let tempValues = "";
        this.valueSet.forEach(tempValue => {
            tempValues +=tempValue+","
        });


        if(tempValues.length>0){
            tempValues = tempValues.substring(0,tempValues.length-1);
        }
        this.eventService.emit({
            "eventType":EventService.formValueSetType,
            "paramName":paramName,
            "value":tempValues
        });
    }



    constructor(private eventService:EventService,private message: NzMessageService,private http: _HttpClient,private zone:NgZone,cd: ChangeDetectorRef, injector: Injector,sfItemComp: SFItemComponent , sfComp: SFComponent ) {
        super(cd,injector,sfItemComp,sfComp);
    };

    //表格绑定参数
    columns: STColumn[] = [{ title: '编号', index: 'id' }];
    createView(){

        this.http.get(environment.runtime_server_url + '/table/init/' + this.entity).subscribe((data: any) => {
                    console.log('search的init数据:',data);
                    if (data['pageSizes'] != null) {
                        this.pageSize = data['pageNumber'];   //接收一进来显示多少条
                        console.log('一进来接收到显示多少条:' + this.pageSize);
                    } else {
                        this.pageSize = 10;
                        this.pageNumber = 1;
                    }
                    this.genSearchSchema(data["searchFields"]);
                    this.viewFields = data["viewFields"];
                    this.genTableColumns(data["viewFields"]);
                    this.getData();

                    if (data['pageSizes'] != null) {
                        this.page = {
                            front:false,
                            showQuickJumper:true,
                            total:true,
                            showSize:true,
                            show:true,
                            pageSizes: data['pageSizes'],
                        }
                    }
                });
                this.eventService.subscribe(this.closeModal,this);

        //this.http.get(environment.runtime_server_url+'/table/edit/'+this.entity+"?childrenPath="+this.serverData["childrenPath"]).subscribe((data:any) =>{

            // for(let object of data["editField"]){
            //     let config = object["config"];
            //     let key = object["key"];
            //     let required = object["required"];
            //     if(config["ref"]!= null && config["ref"] == "searchField,viewColumn"){
            //         this.http.get(environment.runtime_server_url+'/table/init/'+this.entity+"?childrenPath="+this.serverData["childrenPath"]).subscribe((data:any) =>{
            //             this.genSearchSchema(data["searchFields"]);
            //             this.genTableColumns(data["viewFields"]);
            //             this.getData();
            //         });
            //     }
            // }
       // });
    }


    genServletUri(url:string,record:any){
        while (url.indexOf("{{") > 0 && url.indexOf("}}") > 0) {
            let i = url.indexOf("{{");
            let j = url.indexOf("}}");
            if (j > i) {
                let key = url.substring(i + 2, j);
                console.log(key);
                url = url.replace("{{" + key + "}}", record[key]);
            }
        }
        return url;
    }

    genSearchSchema(searchField:any){
        if(searchField == null || searchField.length == 0 ){
            this.searchFlag = false;
            return;
        }
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
            }
            properties[key] = data;
        }
        this.searchSchema = {properties:properties};
    }

    genTableColumns(tableColumns:any){
        let tempColumn:STColumn[] = [];
        console.log(JSON.stringify(tableColumns));
        //遍历后端配置页面设计数据包
        for(let _jsonObj of tableColumns){

            if(_jsonObj["index"] == "id"){
                continue;
            }

            //获取动态操作列内容，将详情查阅，编辑，删除三个操作提取转换
            if(_jsonObj["index"] == null && _jsonObj["buttons"] == null){
                continue;
            }
            if(_jsonObj["buttons"] != null){
                let _buttons:Array<any> = [];
                for (let _buttonObj of _jsonObj["buttons"] ) {
                    let button = this.genButtonClick(_buttonObj);
                    if(button !=null){
                        _buttons.push(button) ;
                    }
                }
                _jsonObj["buttons"] = _buttons;
            }
            tempColumn.push(_jsonObj);
        }
        this.columns = tempColumn;
    }

    genButtonClick(_buttonObj: any) {
        let iif = _buttonObj["iif"]
        _buttonObj["iif"] = (item: STData, btn: STColumnButton, column: STColumn) => {
            let iifCode = true;
            if (iif != null && iif != undefined)
                eval(iif);
            return iifCode;
        }

        switch (_buttonObj["type"]) {
            case "serviceUrl":
                _buttonObj["click"]= (record, modal, comp) => {
                    let url = _buttonObj["serviceUrl"];
                    if(!url.startsWith("http")&&!url.startsWith("https")){
                        url = environment.gateway_server_url + url;
                    }
                    url = this.genServletUri(url,record)
                    let method = _buttonObj["method"];
                    if(method == null){
                        method = 'get';
                    }


                    this.http[method](url).subscribe((res:any)=>{
                        this.message.success("操作成功")
                        if(_buttonObj["afterOption"] == "refresh"){
                            this.getData();
                        }else{
                            this.data = res["rows"];
                            this.total = res["total"]
                        }
                    },(res:any)=>{
                        this.message.success("操作失败")
                    })

                    // this.http[method](url).subscribe((res:any)=>{
                    //     if(res&& res.rows){
                    //         this.data = res["rows"];
                    //         this.total = res["total"]
                    //     }
                    // })
                };

                break;
            case "serviceUrlFile":
                _buttonObj["click"]= (record, modal, comp) => {
                    let url = _buttonObj["serviceUrl"];
                    if(!url.startsWith("http")&&!url.startsWith("https")){
                        url = environment.gateway_server_url + url;
                    }
                    console.log(record)
                    url = this.genServletUri(url,record);
                    console.log(url)
                    let eleLink:any = document.createElement('a');
                    // eleLink.href = encodeURI(record['url']);
                    eleLink.href = encodeURI(url);
                    // 触发点击
                    document.body.appendChild(eleLink);
                    eleLink.click();
                    document.body.removeChild(eleLink);
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
            case "a":
                _buttonObj["click"]= (record, modal, comp) => {
                    let eleLink = document.createElement('a');
                    // console.log("downloadTemplate:"+JSON.stringify(this.buttons))
                    let url =  record[_buttonObj['field']];
                    //let url ="http://www.baidu.com"
                    //console.log(url,"这是url");
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
                };
                break;
            case "a_blank":
                _buttonObj["click"]= (record, modal, comp) => {
                    let eleLink = document.createElement('a');
                    eleLink.setAttribute("target","_blank");
                    // console.log("downloadTemplate:"+JSON.stringify(this.buttons))
                    let url =  record[_buttonObj['field']];
                    //let url ="http://www.baidu.com"
                    //console.log(url,"这是url");
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
                };
                break;
            default:
                break;
        }
        console.log(_buttonObj)
        return _buttonObj;
    }
    closeModal(_event,_this){
        // debugger;
        console.log("+++++++++++++++++++++++++++++")
        if(_event == "searchTable"){
            _this.refresh();
        }
    }
    ngOnDestroy(){

        this.eventService.unsubscribe(this.eventService.subscribe(this.closeModal,this));
        if(this.eventService!=null) {
            this.eventService.unsubscribe(this.eventService.subscribe(this.closeModal,this));
        }
        this.eventService = null;
    }

    refresh(){
        this.getData();
    }
    getData(){
        let params;
        if (this.sf != null) {
            params = this.sf.value;
        }else {
            params = {};
        }
        params["pageSize"] = this.pageSize;
        params["pageNumber"] = this.pageNumber;
        let sendParams:any = {param:JSON.stringify(params)}
        console.log(this.ui["entity"])
        let uri:string = environment.gateway_server_url+"/"+this.entity;
        console.log("===9999999=222=== initUri:" + uri.toString());
        if(this.ui.initUri != null){
            uri  = this.ui.initUri;
            if(!uri.startsWith("http")){
                uri = environment.gateway_server_url+uri;
            }
            while(uri.indexOf("{{")>0 && uri.indexOf("}}") >0){
                let i = uri.indexOf("{{");
                let j = uri.indexOf("}}");
                if(j>i){
                    let key = uri.substring(i+2,j);
                    console.log(key);
                    uri = uri.replace("{{"+key+"}}",this.sfComp.formData[key]);
                }

            }
        }
        console.log("===9999999=333=== initUri:" + uri.toString());
         this.http.get(uri,sendParams).subscribe((res:any)=>{
        // this.http.get(environment.gateway_server_url+"/"+this.entity,sendParams).subscribe((res:any)=>{
             if(res){
                 if (res["rows"]!=null){
                     this.data = res["rows"];
                 } else {
                     this.data = res["records"];
                 }

                 this.total = res["total"];
             }


               //this.tableChange();


            //重新复制checkbox
            if(this.valueSet.size!=0){
                for(let i=0;i<this.data.length;i++){
                    if(this.valueSet.has(this.data[i]["id"])){
                        this.data[i].checked = true;
                    }
                }
            }

             //
             // this.viewFields[this.viewFields.length-1]['className'] = 'text-center';
             // console.log(this.viewFields);
             // //获取viewFileds中check的装填
             // let viewTemp = null;
             // for(let i=0;i<this.viewFields.length;i++){
             //     let data = this.viewFields[i];
             //     let type = data.type;
             //     let _relate = data._relate;
             //     if(type == 'img' && _relate != null && _relate.split('.')[1]!=''){
             //         for(let j=0;j<res['rows'].length;j++){
             //             res['rows'][j][_relate.split('.')[1]]  = environment.file_server_url + res['rows'][j][_relate.split('.')[1]];
             //         }
             //     }
             //     if(this.viewFields[i]['index'] == "checked"){
             //         viewTemp = this.viewFields[i];
             //     }
             // }

            this.detectChanges();
            console.log("===9999999====");
            console.log("===9999999====");
            console.log(this.data);
            console.log(this.total);
            // if(this.transferServiceData.tempParams[this.transferServiceData.currentStep]["tableData"] == undefined){
            //     return;
            // }

            // for(let i=0;i<this.data.length;i++){
            //     console.log(this.transferServiceData.tempParams[this.transferServiceData.currentStep]["tableData"][this.data[i]["id"]]);
            //     if(this.transferServiceData.tempParams[this.transferServiceData.currentStep]["tableData"][this.data[i]["id"]]!=null){
            //         this.data[i].checked = true;
            //     }
            // }

        })
    }
    dd(){
        console.log(this.value)

    }

    reset(value: string) {
        console.log("========searchtable===="+this.value)
        if(this.value!= null){
            let tempValue:string = this.value;
            let array:any []=tempValue.split(",");
            for(let i=0;i<array.length;i++){
                this.valueSet.add(array[i]);
            }
        }
    }
    ngOnInit() {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"+this.value)
        if(this.value!= null){
            let tempValue:string = this.value;
            let array:any []=tempValue.split(",");
            for(let i=0;i<array.length;i++){
                this.valueSet.add(array[i]);
            }
        }
        this.entity = this.ui.entity;
        this.createView();

        // this.page = {
        //     front:false,
        //     showQuickJumper:true,
        //     total:true,
        //     showSize:true,
        //     show:true,
        //     pageSizes: [10,20,30,40,50,100],
        // }
    }

}
