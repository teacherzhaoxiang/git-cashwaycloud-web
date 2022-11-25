import {Component, Input, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
import {getData} from "@delon/form/src/utils";
import {STColumn, STColumnButton, STComponent, STData} from "@delon/abc";
import {TableDetailDrawerComponent} from "./detail.template";
import {CustomerModalSingleTemplate} from "./customer.modal.single.template";
import {TableEditModalComponent} from "./edit.template";
import {CustomerDrawerTemplate} from "./customer.drawer.template";

/**
 * 上面是表格,下面是输入框
 * 表格现在默认用上级表格
 * 下级输入框自定义
 */
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
                        <st #st [data]="tableData" [columns]="tableColumn" [req]="{params: params}"></st>
                    </nz-col>
                    <nz-col nzSpan="24">
                        <sf #sf mode="edit" [schema]="editSchema1" [formData]="record1" button="none" ></sf>
                    </nz-col>
                </div>
            </div>
            <div class="modal-footer">
                <button nz-button type="button" (click)="close()" class="closeBtn">关闭</button>
                <!-- 只有st沒有sf時不顯示保存按鈕 -->
                <button nz-button type="submit" (click)="save(sf['value'])" hidden="sf" [disabled]="!sf" [ngClass]="sf?'keep':''">保存</button>
            </div>
        </div>
    `,
    styles:[`
        .edit_box{
            background: #FFFFFF;
            width: 800px;
            /*position: fixed !important;*/
            z-index: 999999999999;
            border-radius: 6px;
            /*margin-left: -400px;*/
            /*left: 50%;*/
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
        :host ::ng-deep sf-item{
            width: 100% !important;
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
export class CustomerModalStSfTemplate {
    @Input()
    record: any;
    params:any;
    record1: any;
    editSchema1: any = {properties: {}};
    name: any = "新窗口";
    id: string = "";
    modalId: string = "";
    tableColumn: STColumn[] = [{ title: '编号', index: 'id' }];
    tableData: any;
    keyList1: Array<string> = [];
    initUri = "";
    initTableUrl = "";
    saveUri = "";
    @ViewChild('sf',{ static: false })
    sf: SFComponent;

    constructor(private modal: NzModalRef,
                private http: _HttpClient,
                private message: NzMessageService) {
    }

    mateRule: any = {};

    save(value: Map<string, any>) {
        console.log("=============111");
        console.log(this.sf.value);

        // let value = {};
        // for (let key1 of this.keyList1) {
        //     value[key1] = value1[key1];
        // }
        let param = this.sf.value;
        if (this.saveUri != "") {
            param["id"] = this.record.id;
           // param.data = [value];
            this.http.put(environment.gateway_server_url+this.saveUri, param).subscribe((res: any) => {
                this.modal.close(true);
                this.close();
            }, (res: any) => {

            })
        } else {
            this.http.put(environment.common_crud_url + "/" + this.record.__entity + "/" + this.record.id, param).subscribe((res: any) => {
                this.modal.close(true);
                this.close();
            }, (res: any) => {

            })
        }
    }



    /**
     * 获取表单格式和数据
     */
    getForm() {
        let url = environment.runtime_server_url + '/table/customer/' + this.id + '?option=' + this.modalId;
        console.log(url);
        this.http.get(url).subscribe((res: any) => {
            console.log("this.res  " + JSON.stringify(res));
            this.name = res.name;
            this.initUri = res.initUri;
            this.initTableUrl = res.initTableUrl;
            this.saveUri = res.saveUri;

            let properties1 = {};
            let required1 = [];
            for (let object of res["editField"]) {
                let data = object["config"];
                let key = object["key"];
                let required = object["required"];
                if (data["ui"] != null) {
                    let ui = data["ui"];
                    if (ui["asyncData"] != null && ui["mate"] != null) {
                        let uri: string = ui["asyncData"];
                        let mate = ui["mate"];
                        let param = ui["params"];
                        if (!uri.startsWith("http")) {
                            uri = environment.common_crud_url + uri;
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
                    data["ui"] = ui;
                }
                properties1[key] = data;
                this.keyList1.push(key);
                if (required) {
                    required1.push(key);
                }

            }
            let ui = res.ui;
            if (ui == null) {
                ui = {
                    spanLabel: 8,
                    spanControl: 16
                }
            }else{
                ui = JSON.parse(ui);
            }
            this.editSchema1 = {properties: properties1,ui: ui, required: required1};

            this.getData();
            this.getTableColumn();
        });



    }

    getData(){
        // 预留自定义表单数据
    }

    genButtonClick(_buttonObj : any){
        switch (_buttonObj["type"]) {
            case "del":
                _buttonObj["click"]= (record, modal, comp) => {
                    this.delete(record)
                };
                break;
            case "serviceUrl":
                console.log("serviceUrl");
                let iif = _buttonObj["iif"];
                _buttonObj["iif"] = (item: STData, btn: STColumnButton, column: STColumn) => {
                    let iifCode = true;
                    iifCode = undefined;
                    if (iif != null && iif != undefined) {
                        eval(iif);
                    }
                    return iifCode;
                };
                _buttonObj["click"]= (record, modal, comp) => {

                    let url:string = _buttonObj["serviceUrl"];
                    if (url != null) {
                        if (!url.startsWith("http")) {
                            url = environment.gateway_server_url + url;
                        }
                        let i = url.indexOf("{{innerId}}");
                        if (i!=-1) {
                            url = url.substring(0, i) + this.record['id'] + url.substring(i + 11, url.length);
                        }
                        let j = url.indexOf("{{outId}}");
                        if (j!=-1) {
                            url = url.substring(0, j) + record['id'] + url.substring(j + 9, url.length);
                        }
                        let k = url.indexOf("{{id}}");
                        if (k!=-1) {
                            url = url.substring(0, k) + record['id'] + url.substring(k + 6, url.length);
                        }
                    }


                    console.log(url);

                    let method = _buttonObj["method"];
                    if(method == null){
                        method = 'get';
                    }

                    this.http[method](url).subscribe((res:any)=>{
                        if(true){
                            this.message.success("操作成功")
                            this.getTableData();
                        }
                    })


                };
                break;
            case "more":
                let children = _buttonObj["children"];
                let childrenButton = [];
                for (let _childObj of children ) {
                    childrenButton.push(this.genButtonClick(_childObj)) ;
                }
                _buttonObj["children"] = childrenButton;
                break;
            default:
                break;
        }
        return _buttonObj;
    }


    delete(record){
        // let param : any = {ids:[record.id]};
        // this.http.delete(environment.common_crud_url+"/"+this.id,param).subscribe((res:any)=>{
        //     this.message.info(("数据删除成功"));
        //     this.getData();
        // });
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
            if("none" == _jsonObj["display"]){
                continue;
            }
            if(_jsonObj["buttons"] != null){
                let _buttons:Array<any> = [];
                for (let _buttonObj of _jsonObj["buttons"] ) {
                    if (_buttonObj["modal"] != null)
                        continue;
                    _buttons.push(this.genButtonClick(_buttonObj)) ;
                }
                _jsonObj["buttons"] = _buttons;
            }
            tempColumn.push(_jsonObj);
        }
        this.tableColumn = tempColumn;
        console.log("columns:"+JSON.stringify(this.tableColumn));
    }

    /**
     * 获取table格式和数据
     */
    getTableColumn() {
        // 预留 自定义 tableColumn
        let url;
        if (this.initTableUrl == null) {
            url = environment.runtime_server_url + '/table/init/' + this.id;
        }else {
            url = environment.runtime_server_url + this.initTableUrl;
        }
        console.log("getTableColumn: " + url);
        this.http.get(url).subscribe((res:any) =>{
            this.name = res["name"];
            this.genTableColumns(res["viewFields"]);

            this.getTableData();
        });

    }
    getTableData() {

        // 初始化表格数据
        console.log("this.initUri  " + this.initUri);
        if (this.initUri != null) {
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


            this.http.get(this.initUri).subscribe((res: any) => {
                console.log("res=================="+ JSON.stringify(res));
                this.tableData = res["rows"];
            })
        }
    }

    ngOnInit() {
        console.log(JSON.stringify(this.record));
        this.id = this.record.__entity;
        this.modalId = this.record.__modalId;
        // this.tableColumn = this.record.__columns;
        this.getForm();
    }

    close() {
        this.modal.destroy();
    }
}
