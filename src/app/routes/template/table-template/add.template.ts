import { UploadFile } from 'ng-zorro-antd/upload';
import { Component, Input, ViewChild } from '@angular/core';
import { CascaderOption, NzMessageService, NzModalRef, NzTreeNode } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CascaderWidget, SFComponent, SFDateWidgetSchema, SFSchema, SFSchemaEnum, SFSchemaEnumType, WidgetFactory } from '@delon/form';
import { environment } from '@env/environment';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { EventService } from "@shared/event/event.service";
import { map, window } from "rxjs/operators";
import SparkMD5 from 'spark-md5';
import { __await } from "tslib";
import { useAnimation } from '@angular/animations';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { deepCopy } from '@delon/util';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { url } from 'inspector';
import { MenuService } from '@delon/theme';
import { promise } from 'protractor';
import { async } from '@angular/core/testing';
// interface Data {
//     addBeforeSaveFunctionResult: boolean;
//     type: string;
//     md5: string;
//     name: string;
//     url: string;
//     thumbnail_url: string;
// };
let TIMEOUT = null;
@Component({
    selector: `app-table-edit-modal`,
    template: `
        <div class="edit_box" drag>
            <div class="topper">
                <div class="title">新增</div>
                <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
            </div>
            <div (mousedown)="$event.stopPropagation()">
                <div nz-row class="edit_content">
                    <nz-col nzSpan="24">
                        <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none" style="width: 100%;" (formChange)="formChangeCb($event)">
                        </sf>
                    </nz-col>
                </div>
            </div>
            <div class="modal-footer">
                <button nz-button type="button" (click)="close()" class="closeBtn">关闭</button>
                <button nz-button type="submit" [nzLoading]="loading" (click)="save1(sf['value'])" [disabled]="!customValid||!sf.valid" [ngClass]="{'keep':customValid&&sf.valid}">保存</button>
            </div>
        </div>
    `,
    styles: [`
        .edit_box{
            background: #FFFFFF;
            width: 800px;
            /*position: fixed !important;*/
            z-index: 999999999999;
            border-radius: 6px;
            /*margin-left: -400px;*/
            /*left: 50%;*/
        }
        .edit_box .topper{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            font-size: 16px;
            border-bottom: 1px solid #ececec;
        }
        .edit_box .topper .closer{
            cursor: pointer;
        }
        .edit_box .edit_content{
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

export class TableAddModalComponent {
    isUpload = false;
    loading = false;
    record: any = {};
    @Input()
    entity: string;
    editSchema: any = { properties: {} };
    @ViewChild('sf', { static: false })
    sf: SFComponent;
    addValueToMap = {};
    editField: any;
    saveUri = '';
    unionReturnData: any;
    addBeforeSaveFunction = '';
    saveBeforeUri = '';
    multiple: boolean = false;
    fileNumber = 0;
    constructor(
        private modal: NzModalRef,
        protected http: _HttpClient,
        private message: NzMessageService,
        private eventService: EventService,
        private route: ActivatedRoute,
        private MenuService: MenuService
    ) { }
    mateRule: any = {};
    formChange: any = {}
    throttleTimer = null
    customValid: boolean = true
    test() {
        console.log(this.sf.value)

    }
    formChangeCb($event) {
        for (let key in this.formChange) {
            let flag = (this.formChange[key]['value'] != $event[key])
            if (this.formChange[key]['value'] == '') {
                this.orgIdChange(key, this.formChange[key]['sendTo'], flag)
                this.formChange[key]['value'] = $event[key]
                // console.log('给对应字段赋了值','触发事件')
            } else if (flag) {
                this.orgIdChange(key, this.formChange[key]['sendTo'], flag)
                this.formChange[key]['value'] = $event[key]
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
                if (!uri.startsWith('http')) {
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
    addFileServerUrl(object) {
        for (let key in object) {
            if (typeof (object[key]) == 'string' && object[key].indexOf('/download?') == 0) {
                object[key] = environment.file_server_url + object[key]
            }
        }
        return object
    }
    save1(params: any) {
        console.log(params,this.sf.value)
        this.loading = true
        // if (params.org_select) {
            // params.org_select = { orgSelect: params.org_select }
        // }
        if (params.team_id) {
            params.team_id = { teamId: params.team_id }
        }
        if (this.unionReturnData != null) {
            params.fileName = this.unionReturnData['fileName'];
            params.md5 = this.unionReturnData['md5'];
            params.file_name = this.unionReturnData['file_name'];
            params.path = this.unionReturnData['path'];
            params.thumbnailUrl = this.unionReturnData['thumbnailUrl'];
        }
        for (let key in this.addValueToMap) {
            if (this.sf.value[key] != null) {
                this.sf.value[this.addValueToMap[key]] = this.sf.value[key];
            }
        }
        for (let object of this.editField) {
            let data = object['config'];
            let key = object['key'];
            if (data['ui'] != null) {
                let ui = data['ui'];
                if (ui['relateList'] != null && ui['widget'] == 'cascader' && this.sf.value[key] != null) {
                    let index = 0;
                    for (let relateKey of ui['relateList']) {
                        let value = this.sf.value[key][index];
                        if (ui['relateListLevelFlag'] && value.split('|').length > 0 && index == 1) {
                            this.sf.value[relateKey] = value.split('|')[1];
                        } else {
                            console.log(this.sf.value[relateKey])
                            this.sf.value[relateKey] = value;
                        }
                        index++;
                    }
                    delete this.sf.value[key];
                }
            }
        }
        // 数据保存之前处理，或者校验
        params.addBeforeSaveFunctionResult = true;
        //debugger;
        if (this.addBeforeSaveFunction != null && this.addBeforeSaveFunction != '') {
            if (this.multiple == false) {
                eval(this.addBeforeSaveFunction);
            }

            if (params.addBeforeSaveFunctionResult == false) {
                this.loading = false;
                clearTimeout(TIMEOUT);
                return;
            }
        }
        if (this.saveBeforeUri != null && this.saveBeforeUri != '') {
            params = this.addFileServerUrl(params)
            this.http.post(environment.gateway_server_url + this.saveBeforeUri + "?param=" + JSON.stringify(params)).subscribe(
                (res: any) => {
                    if (!res) {
                        this.message.error('预检查请求失败');
                    } else if (res.code != null && res.code != 0) {
                        // this.message.error(res.msg ? res.msg : '保存失败');
                    } else {
                        this.uploadSaveFunc(params);
                    }
                }, error => { }, () => {
                    this.loading = false;
                    clearTimeout(TIMEOUT);
                }
            )
        } else if (this.multiple) {
            this.fileNumber = params.url.length
            const data = new Array()
            let value = deepCopy(this.sf.value)
            value.url && delete value.url
            for (let i = 0; i < params.url.length; i++) {
                data[i] = {
                    ...value,
                    ...params.url[i],
                    addBeforeSaveFunctionResult: params.addBeforeSaveFunctionResult,
                    type: this.sf.value.type,
                    thumbnail_url: params.url[i].thumbnailUrl,
                }
                data[i] = this.addFileServerUrl(data[i])
            }
            console.log(params, data)
            this.uploadSaveFunc(data);
        } else {
            console.log(params)
            params = this.addFileServerUrl(params)
            this.uploadSaveFunc(params);
        }

    }
    uploadSaveFunc(params) {
        let param;
        let httpMethod = '';
        if (this.multiple) {  //多文件上传
            console.log(params, '多文件上传')
            httpMethod = 'put'
            param = { data: [...params], mateRule: this.mateRule };
        }
        if (!this.multiple && params['saveMethod'] != true) {   //单文件上传且params['saveMethod'] != true 即put请求
            httpMethod = 'put'
            params = [params]
            console.log(params, 'saveMethod为false')
            param = { data: [...params], mateRule: this.mateRule };
        }
        if (!this.multiple && params['saveMethod'] === true) { //单文件上传且params['saveMethod'] === true即post请求
            console.log(params, 'saveMethod为true')
            httpMethod = 'post';
            param = { data: [params], mateRule: this.mateRule };
        }
        console.log(param)
        if (this.saveUri != null && this.saveUri != '') {
            if (this.saveUri != null && this.saveUri != "") {
                if (!this.saveUri.startsWith("http")) {
                    this.saveUri = environment.gateway_server_url + this.saveUri;
                }
                while (this.saveUri.indexOf("{{") > 0 && this.saveUri.indexOf("}}") > 0) {
                    let i = this.saveUri.indexOf("{{");
                    let j = this.saveUri.indexOf("}}");
                    if (j > i) {
                        let key = this.saveUri.substring(i + 2, j);
                        this.saveUri = this.saveUri.replace("{{" + key + "}}", params[key]);
                    }
                }
            }
            let url = this.saveUri;
            console.log(param)
            this.http[httpMethod](url, param).subscribe((res: any) => {
                console.log(param)
                //resolve时
                if (!res) {
                    this.message.error('保存失败');
                    this.loading = false;
                } else if (res.code != null && res.code != 0) {
                    // this.message.error(res.msg ? res.msg : '保存失败');
                    this.loading = false;
                } else {
                    this.message.success('保存成功');
                    this.modal.close(true);
                    this.loading = false;
                    this.close();
                }
            }, (res: any) => {

            }, () => {
                this.loading = false;
            });
        } else {
            this.http.post(environment.common_crud_url + '/' + this.entity, param).subscribe((res: any) => {
                //弹窗保存成功
                this.message.success('保存成功');
                this.modal.close(true);
                this.loading = false;
                this.close();
            }, (res: any) => {

            }, () => {
                this.loading = false;
            });
        }
        this.eventService.subscribe(this.closeModal, this);
    }

    closeModal(_event, _this) {
        if (_event == "auditSubmitOk") {
            _this.modal.close(true);
            _this.close();
        }
    }
    getForm() {
        this.http.get(environment.runtime_server_url + '/table/edit/' + this.entity).subscribe((res: any) => {
            if (res) {
                this.saveUri = res.saveUri;
                this.addBeforeSaveFunction = res.addBeforeSaveFunction;
                this.saveBeforeUri = res.saveBeforeUri;
                this.handleDataSource(res.dataSource);
                this.handleEditSchema(res, res.ui);
            }
        });
    }
    handleDataSource(dataSource: any) {
        // this.record.begin_time = new Date();
        // this.record.end_time = new Date();
    }
    handleEditSchema(res: any, ui: any) {
        //  debugger;
        sessionStorage.setItem("total", "0");
        let properties = {};
        let required = [];
        let dataSources = res.dataSource;
        console.log(res, '这是res')
        this.editField = res.editField;
        for (let object of this.editField) {
            let data = object['config'];
            let key = object['key'];
            if (dataSources != null && dataSources[key] != null) {
                data['enum'] = dataSources[key];
            }
            let addValueToKey = object['addValueTo'];
            if (addValueToKey != null) {
                this.addValueToMap[key] = addValueToKey;
            }
            let requiredString = object['required'];
            let ui = data['ui'];
            //这是根据ui渲染modal组件的地方
            if(object['display']!= null && object['display'].indexOf('add') > 0){
                const display = JSON.parse(object['display'])
                data['ui'] == null?data['ui'] = { hidden:!display['add'] }:data['ui']['hidden'] = !display['add'];
            }
            if (ui != null) {
                // if(key == "type_id"){
                //     ui['changeTarget'] ={
                //         key:'brand_id',
                //         widget:'checkbox',
                //         asyncUrl:'/engine/rest/common/monitor_terminal_brand/selects',

                //     }
                // }
                // if(key == 'brand_id'){
                //     // console.log(ui.asyncData)
                //     ui.widget = 'checkbox'
                //     // delete ui.asyncData
                //     // data.enum = []
                //     // data.description = '暂无数据'
                // }
                if (ui['asyncData'] != null && ui['mate'] != null && ui['receiveFromRelate'] == null) {
                    let uri: string = ui['asyncData'];
                    let mate = ui['mate'];
                    let param = ui['params'];
                    let editAsyncData = ui['editAsyncData'];
                    if (!uri.startsWith('http')) {
                        uri = environment.gateway_server_url + uri;
                    }
                    ui['asyncData'] = () => this.http.get<SFSchemaEnumType[]>(uri, {
                        mate: JSON.stringify(mate),
                        params: param,
                        editData: JSON.stringify(editAsyncData)
                    })
                }
                if (ui['asyncData'] != null && ui['mate'] != null && ui['receiveFromRelate'] != null) {
                    let url = environment.gateway_server_url + ui['asyncData']
                    let mate = ui['mate'];
                    let param = ui['params'];
                    let editAsyncData = ui['editAsyncData'];
                    data['readOnly'] = true
                    data['enum'] = [
                        { label: '', value: '' }
                    ]
                }
                if (ui['sendToRelate'] != null) {
                    this.formChange[key] = { sendTo: ui['sendToRelate'], value: '' }
                }
                if (ui['asyncData'] != null && ui['mate'] == null && ui['widget'] == 'select') {
                    let url = environment.gateway_server_url + ui['asyncData']
                    ui['asyncData'] = () => this.http.get(url);
                }
                if (ui['multiple'] != null && ui['multiple'] != "") {
                    this.multiple = ui['multiple'];
                    this.sf.refreshSchema()
                }
                if (ui['widget'] == 'upload') {
                    this.customValid = false
                    ui['customRequest'] = (item => {
                        //如果不是多文件上传则清空上传文件
                        ui['multiple'] ? '' : this.sf.setValue(`/${object.key}`, new Array())
                        interface UploadFile {
                            fileSize: Number,
                            resolution?: String
                        }
                        let info: UploadFile = {
                            fileSize: Number((item.file.size / 1024 / 1024).toFixed(2))
                        }
                        if (item.file.type.indexOf('image') > -1) {     //是图片
                            let file = new FileReader()
                            file.onload = (e) => {
                                let result: any = e['target']['result'];
                                let img = document.createElement('img')
                                img['src'] = result
                                img.onload = (e) => {
                                    info.resolution = img.width + "*" + img.height
                                    this.handleFile(item, ui['action'], info);
                                };
                            }
                            file.readAsDataURL(item.file)
                        } else {  //不是图片
                            console.log('不是图片', info, { ...info })
                            this.handleFile(item, ui['action'], info);
                        }
                    })
                    ui['beforeUpload'] = (file: UploadFile, fileList: UploadFile[]) => {
                        const reg:RegExp =/[!@#$%^&*]/im;
                        if(reg.test(file['name'])){
                            this.message.error('文件名不能含有特殊符号')
                            return false
                        }
                        let total = parseInt(sessionStorage.getItem("total"))
                        if (total < ui['totalFile']) {
                            sessionStorage.setItem("total", String(total + 1));
                        }
                    }
                    ui['remove'] = (file: UploadFile) => {
                        let total = parseInt(sessionStorage.getItem("total"));
                        if (total != 0) {
                            sessionStorage.setItem("total", String(total - 1));
                        }
                        if (this.multiple) {
                            let urlArr = deepCopy(this.sf.value[object.key]).filter(ele => ele.fileName != file.name)
                            this.sf.value[object.key] = urlArr
                            this.record[object.key] = urlArr
                            console.log(this.sf.value[object.key])
                        } else {
                            this.sf.setValue(`/${object.key}`, new Array())
                        }
                        this.sf.value[object.key].length == 0 ? this.customValid = false : this.customValid = true
                        return true;
                    }
                }
                if (ui['asyncData'] && ui['widget'] == 'cascader') {
                    let asyncDataUrl = ui['asyncData'];
                    let url = environment.gateway_server_url + asyncDataUrl;
                    ui['asyncData'] = () => this.http.get(url);
                }
                if (ui['action'] != null) {
                    ui['action'] = this.xjnxUrl + ui['action'];
                }
                if (ui['displayWith'] != null) {
                    let display = ui['displayWith'];
                    ui['displayWith'] = (node: NzTreeNode) => node[display];
                }
                if (ui['validator'] != null) {
                    let validatorUrl = ui['validator'];
                    let validatorErrorText = ui['validatorErrorText'];
                    ui['validator'] = (value: any) => this.http.get(environment.gateway_server_url + validatorUrl + `${value}`).pipe(
                        map(res => res ? [{ keyword: 'required', message: validatorErrorText }] : [])
                    )
                }
                if (ui['cleanField'] != null) {     //变更时清理关联的字段
                    console.log(data['enum'].length)
                    ui['change'] = (value) => {
                        console.log('change')
                        let editSchema = deepCopy(this.editSchema)
                        let record = { ...deepCopy(this.sf.value), type: value }
                        //检测清理的组件是否为上传
                        for (let item of ui['cleanField']) {
                            if (editSchema.properties[item].ui.widget == 'upload') {
                                let accept: string = ''
                                switch (value) {
                                    case 'image': accept = 'image/*'; break;
                                    case 'video': accept = 'video/*'; break;
                                    case 'music': accept = 'audio/*'; break;
                                    case 'document': accept = 'document/*'; break;
                                }
                                editSchema.properties.url.ui.accept = accept
                            }
                            record[item] ? delete record[item] : ''
                        }
                        this.editSchema = editSchema
                        this.record = { ...record }
                        this.sf.validator()
                    }

                }
                if (ui['changeTarget'] != null) {
                    ui['change'] = (value) => {
                        let widget = this.sf.getProperty(`/${ui['changeTarget']['key']}`)
                        let asyncUrl = `${environment.gateway_server_url}${ui['changeTarget']['asyncUrl']}`
                        let mate = widget.ui['mate'];
                        let param = widget.ui['params'];
                        let editAsyncData = widget.ui['editAsyncData'];
                        while (asyncUrl.indexOf("{{") > 0 && asyncUrl.indexOf("}}") > 0) {
                            let i = asyncUrl.indexOf("{{");
                            let j = asyncUrl.indexOf("}}");
                            if (j > i) {
                                let key = asyncUrl.substring(i + 2, j);
                                asyncUrl = asyncUrl.replace("{{" + key + "}}", value);
                            }
                        }
                        if(widget.ui.asyncData != null){
                            widget.ui.asyncData = () => this.http.get(asyncUrl, {
                                mate: JSON.stringify(mate),
                                params: param,
                                editData: JSON.stringify(editAsyncData)
                            })
                        }else if(widget.schema.enum != null){
                            this.http.get(asyncUrl, {
                                mate: JSON.stringify(mate),
                                params: param,
                                editData: JSON.stringify(editAsyncData)
                            }).subscribe((res: any) => {
                                widget.schema.enum = [...res]
                            });
                        }
                        widget.resetValue(null, false);
                        widget.widget.showError = false
                        console.log(this.sf.value)
                    }

                }
                data['ui'] = ui;
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
                            properties[key1]['enum'] = res;
                            this.sf.refreshSchema();
                        });
                    }
                }

            }
            // 扩展
            if (data['items']) {
                let items = data['items'];
                let properties = items['properties'];
                if (properties) {
                    // 遍历key value
                    for (let key1 in properties) {
                        let label = properties[key1];
                        if (label) {
                            let ui = label['ui'];
                            if (ui['asyncData'] != null && ui['mate'] != null) {
                                let uri: string = ui['asyncData'];
                                let mate = ui['mate'];
                                let param = ui['params'];
                                if (!uri.startsWith('http')) {
                                    uri = environment.gateway_server_url + uri;
                                }
                                ui['asyncData'] = () => this.http.get<SFSchemaEnumType[]>(uri, {
                                    mate: JSON.stringify(mate),
                                    params: param
                                });
                            }
                            if (ui['displayWith'] != null) {
                                let display = ui['displayWith'];
                                ui['displayWith'] = (node: NzTreeNode) => node[display];
                            }
                            label['ui'] = ui;
                        }
                    }
                }
            }
            // if(this.entity == 'base|monitor_terminal_model' && key=='screen_list'){  //特殊处理设备型号的screen_list
            //   properties['screenIdList'].type = 'array'
            //   requiredString = true
            //   data.items.required = []
            //   for(let key in data.items.properties){
            //     data.items.required.push(key)
            //   }
            // }

            properties[key] = data;
            if (requiredString) {
                required.push(key)
            }
        }
        if (ui == null) {
            ui = {
                spanLabel: 4,
                spanControl: 18
            };
        } else {
            ui = JSON.parse(ui);
        }

        if (properties['active_time'] && properties['active_time']['disableDate']) {
            properties['active_time']['ui']['disabledDate'] = function (current: Date) {
                var time: any;
                eval(properties['active_time']['disableDate']);
                if (time > 0) return true;
            }
        }
        console.log(properties)
        this.editSchema = { properties: properties, ui: ui, required: required };

    }
    xjnxUrl = environment.file_server_url.replace('/file', '')
    uploadList = {} //放置文件上传次数、可分段数的对象
    handleFile(item, action, info) {  //  文件分段处理
        let file = item.file;
        let timeStamp = new Date().getTime();
        let userName = JSON.parse(localStorage.getItem("user")).userName;   // 当前时间戳+用户名 作为整个文件的md5
        let urlParams = action.split('?')[1];
        let urlParamArr = urlParams.split('&');
        let filePath = '';  // 文件存放目录
        /*获取filePath start*/
        for (let i = 0; i < urlParamArr.length; i++) {
            let paramItem = urlParamArr[i].split('=');
            let key = paramItem[0];
            if (key == 'typeName') {
                filePath = paramItem[1];
            }
        }
        /*获取filePath end*/
        let fileSize = file['size'];  //获取上传文件大小
        let block = 1 * 1024 * 1024;  // 文件分段大小
        let len = fileSize / block; // 可分段数
        this.uploadList[file.uid] = {
            fileLength: len,
            uploadTime: 0
        }
        console.log('block 1M为', block);
        for (let i = 0; i < len; i++) {
            let size = 0;  // 实际上传的分段大小
            let endPos = 0;  // 分段起始位置
            if (fileSize >= block * (i + 1)) {
                size = block;
                endPos = block * (i + 1);
            } else {
                size = fileSize - block * i;
                endPos = fileSize;
            }

            let percent = endPos / fileSize * 100;
            let pos = block * i;
            var fd = new FormData();
            let cutFile = file.slice(pos, endPos);
            fd.append('file', cutFile);
            let params = {
                tmpPath: timeStamp + userName,
                size: size,
                pos: pos,
                md5: ''
            };
            this.postFile(fd, params, item, cutFile, filePath, info);
        }
    }
    postFile(fd, params, item, cutFile, filePath, info) {   // 文件分段上传
        // 获取apk的md5
        // debugger
        let uid = item.file.uid     //文件uid
        var fileReader = new FileReader(); //用于读取文件，即把文件内容读入内存。它的参数是File对象或Blob对象
        var spark = new SparkMD5() // 创建md5对象（基于SparkMD5）
        fileReader.readAsBinaryString(cutFile); // 读取文件,返回文件的原始的二进制内容;cutFile为对应上传的文件
        // 文件读取完毕之后的处理
        fileReader.onload = (e) => {  //e.target.result就是文件的内容
            //获取文件的md5
            spark.appendBinary(e.target['result']);
            const md5 = spark.end(); //识别文件的唯一标识
            params.md5 = md5;
            this.http.post(this.xjnxUrl + '/upload/break', fd, params).subscribe((res: any) => {
                console.log(this.uploadList[uid].uploadTime, this.uploadList[uid].fileLength, item.file.name)
                item.onProgress({ percent: this.uploadList[uid].uploadTime++ / this.uploadList[uid].fileLength * 100 });
                if (this.uploadList[uid].uploadTime >= this.uploadList[uid].fileLength) {
                    this.union({ tmpPath: params.tmpPath, fileName: item.file.name, filePath: filePath }, item, info);
                }
            }, (res: any) => {
                delete this.uploadList[item.file.uid]
                this.message.error('上传失败');
                console.log('上传失败');
            }, () => {
            });
        };
    }
    union(params, item, info) {  // 分段上传文件合并
        this.http.post(this.xjnxUrl + '/upload/union', {}, params).subscribe((res: any) => {
            let relate = ''
            for (let key in this.editSchema.properties) {
                let item = this.editSchema.properties[key]
                item.ui && item.ui.widget && item.ui.widget == 'upload' ? relate = key : ''
            }
            this.unionReturnData = res;
            res = { ...res, ...info }
            console.log('成功union的数据', res)
            this.multiple ? '' : res = [res];
            delete this.uploadList[item.file.uid]
            item.onSuccess(res);
            this.sf.value[relate].length > 0 ? this.customValid = true : this.customValid = false;
        }, (res: any) => { }, () => { });
    }
    close() {
        console.log(this.sf.value);
        sessionStorage.setItem("total", "0");
        this.modal.destroy(false);
    }
    ngOnInit() {
        this.getForm();
    }
    showRequired(text) {   //强制显示星号
        this.route.queryParams.subscribe(queryParams => {
            console.log(queryParams, this.entity)
        })
        if (this.entity == 'base|monitor_terminal_model') {
            let flag = true
            let i = setInterval(() => {
                let dom = document.querySelectorAll('.ant-form-item-label')
                for (let key in dom) {
                    if (dom[key].innerHTML && dom[key].innerHTML.indexOf(text) != -1) {
                        dom[key].classList.add('ant-form-item-required')
                        clearInterval(i)
                        flag = false
                    }
                }
            }, 100)
            setTimeout(() => {
                flag ? clearInterval(i) : ''
            }, 1000)
        }
    }
    ngAfterViewInit() {
        this.showRequired('屏幕')
    }
}
