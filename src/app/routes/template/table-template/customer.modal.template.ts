import { EventService } from './../../../shared/event/event.service';
import {Component, Input, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import { environment } from "@env/environment";
 
let TIMEOUT = null;
@Component({
    selector: `app-customer-modal`,
    template: `
        <div class="edit_box" drag>
            <div class="modal-header box_header" style="margin: 0">
                <div class="modal-title">{{name}}</div>
                <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
            </div>
            <div (mousedown)="$event.stopPropagation()">
                <div nz-row class="modal-content">
                    <nz-col nzSpan="24">
                        <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none" (formChange)="formChangeCb($event)">
                        </sf>
                    </nz-col>
                </div>
            </div>
            <div class="modal-footer">
                <button nz-button type="button" (click)="close()" class="closeBtn">关闭</button>
                <button [nzLoading]="loading" nz-button type="submit" [ngStyle]="{'display':saveButtonHidden}" (click)="save(sf.value)" [disabled]="!sf.valid" [ngClass]="sf.valid?'keep':''">保存</button>
                <span *ngFor="let item of buttons">
                    <button nz-button type="button" class="closeBtn" style="margin-left: 4px;" (click)="globalButtonClick(item)">{{item['label']}}</button>
                </span>
            </div>
        </div>
    `,
    styles:[
        `
 
            :host ::ng-deep .red > sf-item-wrap > .ant-form-item>.ant-form-item-label>label{
                color:red;
            }
            :host ::ng-deep .yellow > sf-item-wrap > .ant-form-item>.ant-form-item-label>label{
                color:yellow;
            }
            :host ::ng-deep .blue > sf-item-wrap > .ant-form-item>.ant-form-item-label>label{
                color:blue;
            }
            
            :host ::ng-deep  .ant-table table{
                table-layout: fixed;
                width: 100%;
                text-align: left;
                border-radius: 4px 4px 0 0;
                border-collapse: separate;
                border-spacing: 0;
            }
            .edit_box{
                background: #FFFFFF;
                width: 800px;
                z-index: 999999999999;
                border-radius: 6px;
            }
            .edit_box .box_header{
                margin: 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .edit_box  .closer{
                cursor: pointer;
            }
            .edit_box .modal-content{
                padding: 20px 40px;
                max-height: 600px;
                overflow-y: scroll;
            }
            .modal-footer{
                margin: 0;
                padding: 20px 24px;
            }
            .modal-footer .keep{
                background: #1890ff;
                color: #FFFFFF;
            }
            .closeBtn{
                border: 1px solid #1890ff;color: #1890ff
            }
`]
})
export class CustomerModalTemplate {
    loading = false;
    @Input()
    record: any;
    initData:Object;
    editSchema: any = {properties: {}};
    @ViewChild('sf',{ static: false })
    sf: SFComponent;
    name: any = "新窗口";
    entityName: string = "";  //实体名
    modalId: string = "";  // 自定义json的文件名称
    initUri = "";           //数据初始化的uri
    saveUri = "";
    id:string = "";
    ids = "";
    addBeforeSaveFunction = '';
    initFunction = '';
    saveButtonHidden = "inline";
    buttons:any[];
    modalObject:Object;
    constructor(private modal: NzModalRef, private message: NzMessageService,protected http: _HttpClient,private eventService: EventService,) {
 
    }
 
    mateRule: any = {};
    formChange: any = {}
    formChangeCb($event) {
        for (let key in this.formChange) {
            let flag = (this.formChange[key]['value'] != $event[key]) 
            if (this.formChange[key]['value'] == '') {
                this.formChange[key]['value'] = $event[key]
                this.orgIdChange(key, this.formChange[key]['sendTo'], flag)
                // console.log('给对应字段赋了值','触发事件')
            } else if (flag) {
                this.formChange[key]['value'] = $event[key]
                this.orgIdChange(key, this.formChange[key]['sendTo'], flag)
                // console.log('对应字段发生变更','触发事件')
            } else if (!flag) {
                // console.log('对应字段未变更','不触发事件')
            }
        }
    }
    orgIdChange(key, sendToArr, flag) {
        if (flag) {
            for (let index in sendToArr) {
                //relate是接收方 key是发送方
                let relate = sendToArr[index]
                let data = this.editSchema.properties[relate]
                let uri: string = data['ui']['asyncData'];
                let mate = data['ui']['mate'];
                let param = data['ui']['params'];
                let editAsyncData = data['ui']['editAsyncData'];
                if (!(uri.indexOf('http')==0)) {
                    uri = environment.gateway_server_url + uri;
                }
                uri = uri.replace(`{{${key}}}`, this.sf.value[key],)
                this.http.get(uri, { mate: JSON.stringify(mate), params: param, editData: JSON.stringify(editAsyncData) }).subscribe(res => {
                    const status = this.sf.getProperty(`/${relate}`)
                    status.schema.enum = res
                    status.schema.readOnly = false
                    status.widget.reset(res[0].value)
                    this.sf.setValue(`/${relate}`, res[0].value)
                })
            }
        }
    }
    test(){
        console.log(this.editSchema)
        
    }
    save(params: any) {
        console.log('点击了保存')
        this.loading = true;
        TIMEOUT = setTimeout(() => {
            this.loading = false;
            clearTimeout(TIMEOUT);
        }, 5000);
        params.id = this.id;
 
 
        let url = "";
 
 
 
        params.addBeforeSaveFunctionResult = true;
        // 数据保存之前处理，或者校验
        if (this.addBeforeSaveFunction != null && this.addBeforeSaveFunction != '') {
            //let addBeforeSaveFunctionResult = true;
            eval(this.addBeforeSaveFunction);
            if(params.addBeforeSaveFunctionResult  == false){
               return;
            }
        }
        let httpMethod = "put";
        if (params['saveMethod'] != true) {
            httpMethod = 'put';
        } else {
            httpMethod = 'post';
        }
        delete params['saveMethod'];
 
        if(this.saveUri != null){
            if (this.saveUri != null && this.saveUri != "") {
                if (!(this.saveUri.indexOf("http") == 0)) {
                    this.saveUri = environment.gateway_server_url + this.saveUri;
                }
                while (this.saveUri.indexOf("{{") > 0 && this.saveUri.indexOf("}}") > 0) {
                    let i = this.saveUri.indexOf("{{");
                    let j = this.saveUri.indexOf("}}");
                    if (j > i) {
                        let key = this.saveUri.substring(i + 2, j);
                        console.log(key);
                        this.saveUri = this.saveUri.replace("{{" + key + "}}", this.record[key]);
                    }
                }
            }
            url = this.saveUri;
        }else{
            params = {data: [params], mateRule: this.mateRule};
            url = environment.common_crud_url + "/" + this.record.__entity + "/" + this.record.id;
        }
        this.http[httpMethod](url, params).subscribe((res: any) => {
            console.log(res,'res')
            // if(res == true){
                this.message.success("保存成功")
            // }
            this.modal.close(res);
            this.close();
        }, (error: any) => {
            this.message.error(error.msg)
        },()=>{
            this.loading = false;
            clearTimeout(TIMEOUT);
        })
    }
 
    globalButtonClick(item){
        let url = item.url;
        // console.log(item,url,'这是url')
        if (url != null && url != "") {
            if (!url.startsWith("http")) {
                url = environment.gateway_server_url + url;
            }
        }
        while (url.indexOf("{{") > 0 && url.indexOf("}}") > 0) {
            let i = url.indexOf("{{");
            let j = url.indexOf("}}");
            if (j > i) {
                let key = url.substring(i + 2, j);
                console.log(key);
                url= url.replace("{{" + key + "}}", this.record[key]);
            }
        }
        let httpMethod = "put";
        if (item['method'] != null && item['method']!=undefined) {
            httpMethod = item['method'];
        }
        this.http[httpMethod](url).subscribe((res: any) => {
           // debugger
            if (!res) {
                this.message.error('保存失败');
            } else if(res.code!=null && res.code!=0){
                this.message.error(res.msg?res.msg:'保存失败');
            }else {
                console.log(item['close']);
                if(item['close']!=null&&item['close']=="false"){
                    if(item['emit'] == "searchTable"){
                        this.eventService.emit("searchTable");
                       }
                    this.message.success('更新成功');
 
 
                }else{
 
                    this.message.success('保存成功');
                    this.modal.close(true);
                    this.close();
                }
 
            }
        }, (res: any) => {
 
        });
    }
 
 
    getForm() {
        let url = environment.runtime_server_url + '/table/customer/' + this.entityName + '?option=' + this.modalId;
        console.log(url)
        this.http.get(url).subscribe((res: any) => {
            console.log(res,'customermodal的schema res')
            this.name = res.name;
            this.initUri = res.initUri;
            this.saveUri = res.saveUri;
            this.addBeforeSaveFunction = res.addBeforeSaveFunction;
            this.initFunction = res.initFunction;
            let record = this.record;
            if(this.initFunction !=null && this.initFunction != ''){
                eval(this.initFunction);
            }
            this.getData(res);
            let properties = {};
            let required = [];
            let dataSources = res["dataSource"]
            for (let object of res["editField"]) {
                let data = object["config"];
                let key = object["key"];
                if(dataSources !=null && dataSources[key]!= null){
                    data["enum"] = dataSources[key];
                }
                let requiredString = object["required"];
                //debugger;
                if (data["ui"] != null) {
                    let ui = data["ui"];
                    if (ui['asyncData'] != null && ui['mate'] != null&&ui['receiveFromRelate']==null) {
                        //mark
                        let uri: string = ui["asyncData"];
                        uri = this.genInitUri(uri);
                        let mate = ui["mate"];
                        let param = ui["params"];
                        if (!uri.startsWith("http")) {
                            uri = environment.gateway_server_url + uri;
                        }
                        ui["asyncData"] = () => this.http.get<SFSchemaEnumType[]>(uri, {
                            mate: JSON.stringify(mate),
                            params: param
                        });
 
                    }
                    if(ui['asyncData'] != null && ui['mate'] != null&&ui['receiveFromRelate']!=null){
                        let url = environment.gateway_server_url + ui['asyncData']
                        let mate = ui['mate'];
                        let param = ui['params'];
                        let editAsyncData = ui['editAsyncData'];
                        data['readOnly'] = true
                        data['enum'] =[
                            {label:'',value:''}
                        ]
                    }
                    if(ui['sendToRelate']!=null){
                        this.formChange[key] = {sendTo:ui['sendToRelate'],value:''}
                    }
                    if (ui['action'] != null) {
                        ui['action'] = environment.file_server_url + ui['action'];
                    }
                    if (ui["displayWith"] != null) {
                        let display = ui["displayWith"];
                        ui["displayWith"] = (node: NzTreeNode) => node[display];
                    }
                    if (ui["widget"] == 'image'){
                        data['initUri'] = this.initUri
                        console.log(this.initUri)
                    }
                    if(this.sf.value!=null){
                        let _this = this;
                        if(ui['classIIF']!=null) {
                           eval(ui['classIIF']);
                        }
                    }
                    data["ui"] = ui;
                }
 
 
                if (data['type'] != null && data['type'] == 'object') {
                    let properties = data['properties'];
                    for (let key1 in properties) {
                        if (properties[key1]['ui']['action'] != null) {
                            let url = environment.gateway_server_url + properties[key1]['ui']['action'];
                            let mate = properties[key1]['ui']['mate'];
                            let param = properties[key1]['ui']['params'];
                            this.http.get(url, {
                                mate: JSON.stringify(mate),
                                params: param
                            }).subscribe((res: any) => {
                                console.log(res);
                                properties[key1]['enum'] = res;
                                this.sf.refreshSchema();
                            });
 
                        }
                    }
 
                }
                if(this.modalObject!=null && this.modalObject['fieldReadonly']=="true") {
                    data['readOnly'] = true;
                }
 
                properties[key] = data;
                if (requiredString) {
                    required.push(key);
                }
 
            }
            let ui = res.ui;
            if (ui == null) {
                ui = {
                    spanLabel: 2,
                    spanControl: 21
                }
            }else{
                ui = JSON.parse(ui);
            }
 
            // 没有saveUri 不显示保存按钮
            if (res["saveUri"] == null || res["saveUri"] == "" || res["saveUri"] == "/") {
                this.saveButtonHidden = "none";
            }
            if(this.modalObject!=null && this.modalObject['saveButtonDisplay']=="none"){
                this.saveButtonHidden = "none";
            }
            console.log(properties,'这是customermodal的schema')
            this.editSchema = {properties: properties, ui: ui, required: required};
        })
    }
 
    close() {
        this.modal.destroy();
        console.log();
    }
 
    getData(schema) {
        if (this.initUri != null && this.initUri != "") {
            if (!this.initUri.startsWith("http")) {
                this.initUri = environment.gateway_server_url + this.initUri;
            }
            while (this.initUri.indexOf("{{") > 0 && this.initUri.indexOf("}}") > 0) {
                let i = this.initUri.indexOf("{{");
                let j = this.initUri.indexOf("}}");
                if (j > i) {
                    let key = this.initUri.substring(i + 2, j);
                    console.log(key);
                    this.initUri = this.initUri.replace("{{" + key + "}}", this.record[key]);
                }
            }
            let flag = schema.editField.length == 1 && schema.editField.some(ele=>ele.config.ui.widget == 'image')
            !flag&&this.http.get(this.initUri).subscribe((res: any) => {
                this.record = res;
                if(this.initFunction !=null && this.initFunction != ''){
                    eval(this.initFunction);
                    this.sf.refreshSchema();
                }
            })
            
        }
    }
    genInitUri(url:string){
        while (url.indexOf("{{") > 0 && url.indexOf("}}") > 0) {
            let i = url.indexOf("{{");
            let j = url.indexOf("}}");
            if (j > i) {
                let key = url.substring(i + 2, j);
                console.log(key);
             //   let a = this.modalObject;
                url = url.replace("{{" + key + "}}", this.record[key]);
            }
        }
        return url;
    }
    ngOnInit() {
        console.log(this.record);
        //debugger;
        this.entityName = this.record.__entity;
        this.modalId = this.record.__modalId;
        this.id = this.record.id;
        this.modalObject = this.record.__modal;
        this.ids = this.record.ids;
        this.buttons = this.modalObject['buttons']
        if(this.modalObject['selectionsFlag'] == true){
            if(this.ids.length ==0){
                this.modal.close(false);
                this.close();
                this.loading = false;
                        this.message.error("请勾选设备");
                       // TIMEOUT = setTimeout(() => {
                      //      clearTimeout(TIMEOUT);
                     //   }, 1000);
 
            }else{
                this.getForm();
            }
        }else{
            this.getForm();
        }
    }
}