import {ChangeDetectorRef, Component, Input,OnInit, ViewChild} from '@angular/core';

import {_HttpClient} from "@delon/theme";
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
import {NzMessageService, NzModalRef, NzTreeNode} from "ng-zorro-antd";

@Component({
    selector: 'my-sf',
    template: `
        <sf #sf mode="edit" [schema]="editSchema" [formData]="formData" button="none">
        </sf>

        <div class="modal-footer" *ngIf="buttonVisible">
            <button nz-button type="button" (click)="close()">关闭</button>
            <button nz-button type="submit" (click)="save(sf.value)" [disabled]="!sf.valid">保存</button>
        </div>
    `,
    styles:[`
        :host ::ng-deep .modify-item > sf-item-wrap > .ant-form-item>.ant-form-item-label>label{
            color:red;
            font-weight: bold;
        }
        :host ::ng-deep .modify-item-red > sf-item-wrap > .ant-form-item>.ant-form-item-label>label{
            color:#4d9ce8;
            font-weight: bold;
        }
        :host ::ng-deep .ant-select-disabled .ant-select-selection{
            background: #fff !important;
        }
        :host ::ng-deep .ant-input-number-disabled{
            overflow: hidden;
        }

        :host ::ng-deep .red> sf-item-wrap > .ant-form-item>.ant-form-item-label>label{
            color:red;
        }

        :host ::ng-deep .yellow > sf-item-wrap > .ant-form-item>.ant-form-item-label>label{
            color:yellow;
        }

        :host ::ng-deep .red > sf-item-wrap >  .ant-form-item .ant-form-item-control .ant-select{
            color:red;
        }
        :host ::ng-deep .red > sf-item-wrap >  .ant-form-item .ant-form-item-control .ant-select{
            color:red;
        }

        :host ::ng-deep  .yellow > sf-item-wrap >  .ant-form-item .ant-form-item-control .ant-select{
            color:yellow;
        }
        :host ::ng-deep  .yellow > sf-item-wrap >  .ant-form-item .ant-form-item-control .ant-input{
            color:yellow;
        }
    `]
})
export class SfComponent implements OnInit {
  schema = {
    properties: {
      email: {
        title: '参数',
        type: 'integer',
        minimum: 0,
        default: 10
      },
      name: {
        type: 'string',
        title: '参数',
        minLength: 3
      },
      status: {
        type: 'string',
        title: '状态',
        enum: [
          { label: '待支付', value: 'WAIT_BUYER_PAY' },
          { label: '已支付', value: 'TRADE_SUCCESS' },
          { label: '交易完成', value: 'TRADE_FINISHED' },
        ],
        default: '',
        ui: {
          widget: 'select'
        },
      },
    },
    ui: {
      // 指定 `label` 和 `control` 在一行中各占栅格数
      spanLabel: 4,
      spanControl: 5
    }
  };

    @Input()
    auditBefore:string;

    @Input()
    auditAfter:string;

    @Input()
    auditFlag:boolean;
    @Input()
    header:any;
    @Input()
    initUri:string;
    @Input()
    formConfig:any;
    @Input()
    saveUri:string;
    @Input()
    formData:any;
    @Input()
    initDataUri:string;
    @Input()
    option:string;
    @Input()
    entity:string;
    @ViewChild('sf',{static:true})
    sf: SFComponent;
    editSchema: any = {properties: {}};
    beforeSaveFunction = "";
    editField: any;
    @Input()
    class:any;
    @Input()
    required:boolean = true;
    @Input()
    buttonVisible:boolean = true;
    @Input()
    auditReadOnly:boolean = true;


    ngOnInit() {
        console.log("=====1111=====");
        console.log(this.initUri);
        console.log(this.formData);
        this.getForm();
    }
    refreshSchema(){
        this.sf.refreshSchema();
    }

    constructor(private modal: NzModalRef, protected http: _HttpClient,private message:NzMessageService) {
    }

    getForm() {
        console.log("==getForm============");
        let initUri = this.checkInitUri()
        if(initUri != ""){
            this.http.get(initUri).subscribe((res: any) => {
                this.formConfig = res;
                console.log(this.formConfig,'表格数据')
                if(res == null){
                    alert("抓取表格配置数据失败");
                    return;
                }
                if(res.initUri != null){
                    this.initDataUri = res.initUri;
                }
                this.getData();
            })
        }
    }

    getData() {
        if (this.initDataUri != null && this.initDataUri != "") {
            if (!this.initDataUri.startsWith("http")) {
                this.initDataUri = environment.gateway_server_url + this.initDataUri;
            }
            while (this.initDataUri.indexOf("{{") > 0 && this.initDataUri.indexOf("}}") > 0) {
                let i = this.initDataUri.indexOf("{{");
                let j = this.initDataUri.indexOf("}}");
                if (j > i) {
                    let key = this.initDataUri.substring(i + 2, j);
                    console.log(key);
                    this.initDataUri = this.initDataUri.replace("{{" + key + "}}", this.formData[key]);
                }
            }
            this.http.get(this.initDataUri).subscribe((res: any) => {
                this.formData = res;
                this.getFormHandle(this.formConfig);
                this.sf.refreshSchema();
            })
        }else {
            this.getFormHandle(this.formConfig);
        }
    }


    getFormHandle(res:any){
        let action = res.saveAction;
        if(action!= null && action[this.option] != null){
            let opAction = action[this.option];
            this.saveUri = opAction["uri"];
            this.beforeSaveFunction = opAction["beforeSaveFunction"];
        }
        if(res.initFunction!=null && res.initFunction!=""){
            let tempRecord = this.formData;
            eval(res.initFunction);
        }
        let properties = {};
        let required = [];
        this.editField = res["editField"];
        let dataSources:Map<string,object> = res["dataSource"]
        for (let object of res["editField"]) {
            let data = object["config"];
            let key = object["key"];
            if(dataSources !=null && dataSources[key]!= null){
                data["enum"] = dataSources[key];
            }
            let requiredString = object["required"];

            this.getDataFormFieldUi(data,key);



            if (data["type"] != null && data["type"] == "object") {
                let properties = data["properties"];
                for (let key1 in properties) {
                    if (properties[key1]["ui"]["action"] != null) {
                        let url = environment.gateway_server_url + properties[key1]["ui"]["action"];
                        let mate = properties[key1]["ui"]["mate"];
                        let param = properties[key1]["ui"]["params"];
                        this.http.get(url,{
                            mate: JSON.stringify(mate),
                            params: param
                        }).subscribe((res: any) => {
                            console.log(res)
                            properties[key1]["enum"] = res
                            this.sf.refreshSchema();
                        });

                    }
                }

            }
            //扩展
            if (data["items"]) {
                let items = data["items"];
                console.log("items----->");
                let properties = items["properties"];
                if (properties) {
                    //遍历key value
                    for (let key1 in properties) {
                        let label = properties[key1];
                        if (label) {
                            let ui = label["ui"];
                            if (ui["asyncData"] != null && ui["mate"] != null) {
                                let uri: string = ui["asyncData"];
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
                            if (ui["displayWith"] != null) {
                                let display = ui["displayWith"];
                                ui["displayWith"] = (node: NzTreeNode) => node[display];
                            }
                            label["ui"] = ui;
                        }
                    }
                }
            }


            properties[key] = data;
            let dataCopy = JSON.parse(JSON.stringify(data));
            if(this.auditFlag == true ) {
                if(this.auditAfter!="" && this.auditAfter!=null){
                    dataCopy["title"] = this.auditAfter+dataCopy["title"];
                }
                properties[key + "_copy"] = dataCopy;
                this.getDataFormFieldUi(dataCopy, key + "_copy");
                if (data['ui'] != null) {
                    let ui = data['ui'];
                    if (ui["asyncData"] != null && ui["mate"] != null) {
                        let dataCopyClass = dataCopy['ui']['class'];
                        for (let key of Object.keys(data['ui'])) {
                            if(key!="class") {
                                dataCopy['ui'][key] = data['ui'][key];
                            }
                        }
                            // dataCopy['ui'] = data['ui'];
                        // dataCopy['ui']['class'] = dataCopyClass;
                    }
                    if(ui["widget"]=="title-widget"){
                        delete properties[key + "_copy"];
                    }
                }

            }else{

            }


            if(data['ui'] != null && this.sf.value!=null){
                let _this = this;
                let ui = data['ui'];
                if(ui['classIIF']!=null) {
                    eval(ui['classIIF']);
                }
            }

            if(this.auditReadOnly == true){
                data['readOnly'] = true;
               dataCopy['readOnly'] = true;
            }




            if (requiredString && this.required == true) {
                required.push(key);
            }

        }



        let ui = res.ui;
        if (ui == null) {
            ui = {
                spanLabel: 2,
                spanControl: 21
            }
        }
        else{
            ui = JSON.parse(ui);
        }

        if(this.auditFlag == true){
            for(let key in this.formData){
                this.formData[key+"_copy"] = this.formData[key+"_copy"];
            }
        }

        this.editSchema = {properties: properties, ui: ui, required: required};
    }


    getDataFormFieldUi(data,key){
        console.log("--------33333");
        if (data["ui"] != null) {
            let ui = data["ui"];
            if(this.class!=null && this.class[key]!=null){
                ui['class'] = this.class[key];
            }

            if (ui["widget"] == "upload") {
                data["enum"] = [{
                    "name": this.formData[ui["fileName"]],
                    "status": "done",
                    "url": environment.file_server_url + this.formData[key],
                    "response": this.formData[key]
                }];
            }

            if (ui["asyncData"] != null && ui["mate"] != null) {
                let uri: string = ui["asyncData"];
                let mate = ui["mate"];
                let param = ui["params"];
                let editAsyncData = ui["editAsyncData"];
                if (!uri.startsWith("http")) {
                    uri = environment.gateway_server_url + uri;
                }
                ui["asyncData"] = () => this.http.get<SFSchemaEnumType[]>(uri, {
                    mate: JSON.stringify(mate),
                    params: param,
                    editData: JSON.stringify(editAsyncData)
                });
            }


            if (ui["asyncData"] && ui['widget'] == 'cascader') {
                let defaultArray = [];
                let relateListLevelFlag = ui['relateListLevelFlag'];
                if (relateListLevelFlag) {
                    defaultArray.push(this.sf.value[ui['relateList'][0]]);
                    defaultArray.push(this.sf.value[ui['relateList'][0]] + "|" + this.sf.value[ui['relateList'][1]]);
                    defaultArray.push(this.sf.value[ui['relateList'][2]]);

                } else {
                    for (let relateKey of ui['relateList']) {
                        defaultArray.push(this.sf.value[relateKey]);
                    }
                }

                console.log(defaultArray);
                data['default'] = defaultArray;
                this.sf.value[key] = defaultArray;
                // data['default'] = ["582f5068c6264a96b2d9000acc549b07", "582f5068c6264a96b2d9000acc549b07|5", "508d430c989e441d8e3fd1437ca0edbc"]
                // this.http.get("http://192.168.43.184:8090/card/card/terminal/manage/getBrandModelModulesCascade").subscribe((res: any) => {
                //   //  data['default'] = ["582f5068c6264a96b2d9000acc549b07", "582f5068c6264a96b2d9000acc549b07|5", "508d430c989e441d8e3fd1437ca0edbc"]
                //     let j = {key:["582f5068c6264a96b2d9000acc549b07", "582f5068c6264a96b2d9000acc549b07|5", "508d430c989e441d8e3fd1437ca0edbc"]};
                //     this.record = j;
                // });
                // });
                let asyncDataUrl =  ui["asyncData"];
                let url = environment.gateway_server_url + asyncDataUrl;
                ui["asyncData"] =()=>this.http.get(url);


            }



            if (ui["action"] != null) {
                ui["action"] = environment.file_server_url + ui["action"];
            }

            if (ui["displayWith"] != null) {
                let display = ui["displayWith"];
                ui["displayWith"] = (node: NzTreeNode) => node[display];
            }


            data["ui"] = ui;
        }else{
            let _ui = {};
            if(this.class!=null && this.class[key]!=null){
                _ui['class'] = this.class[key];
            }
            data["ui"] = _ui;
        }
    }


    checkInitUri(){
        if(this.initUri != null && ""!=this.initUri){
            let url = this.initUri;
            if(url.startsWith("http") || url.startsWith("https")){
                return url;
            }else {
                return environment.gateway_server_url + url;
            }
        }else {
            return "";
        }
    }
    mateRule: any = {};
    save(params: Map<string, any>) {
        if(this.beforeSaveFunction!=null && this.beforeSaveFunction!=""){
            eval(this.beforeSaveFunction);
        }

        let param;
        if(params['saveMethod']!=true){
            param = {data: [params], mateRule: this.mateRule};
            delete params['saveMethod'];
        }else{
            param = params;
        }

        for (let object of this.editField) {
            let data = object["config"];
            let key = object["key"];
            if (data["ui"] != null) {
                let ui = data["ui"];
                if (ui['relateList'] != null && ui['widget'] == 'cascader' && this.sf.value[key] != null) {
                    let index = 0;
                    for (let relateKey of ui['relateList']) {
                        //this.sf.schema.properties[relateKey].setValue(values[index]);
                        let value = this.sf.value[key][index];
                        if (ui['relateListLevelFlag'] && value.split("|").length > 0 && index == 1) {
                            this.sf.value[relateKey] = value.split("|")[1];
                        } else {
                            this.sf.value[relateKey] = value;
                        }

                        index++;
                    }
                    delete this.sf.value[key];
                }
            }
        }

        if (this.saveUri != "" && this.saveUri != null) {
            this.http.put(environment.gateway_server_url+this.saveUri, param).subscribe((res: any) => {
                if(!res){
                    this.message.error("保存失败")
                }else{
                    this.message.success("保存成功")
                    //派发事件通知上级控件
                }

            }, (res: any) => {

            })
        }else{
            let method = "post";
            let saveUrl = environment.common_crud_url + "/" + this.entity;
            if("edit" == this.option){
                method = "put";
                saveUrl = environment.common_crud_url + "/" + this.entity + "/" + this.formData["id"]
            }
            this.http.request(method,saveUrl, param).subscribe((res: any) => {
                if(!res){
                    this.message.error("保存失败")
                }else{
                    this.message.success("保存成功")
                    //派发事件通知上级控件
                }
            }, (res: any) => {

            })
        }
    }

    close() {
        //派发事件通知上级控件
    }
}
