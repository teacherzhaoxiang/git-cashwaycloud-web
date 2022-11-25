import {Component, Input, ViewChild} from '@angular/core';
import {CascaderOption, NzMessageService, NzModalRef, NzTreeNode, NzUploadComponent} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {CascaderWidget, SFComponent, SFSchema, SFSchemaEnumType, SFTimeWidgetSchema} from '@delon/form';
import {environment} from '@env/environment';
import {EventService} from "@shared/event/event.service";
import {map} from "rxjs/operators";
import { AngularSplitModule } from 'angular-split';
import { SfComponent } from '../../components/sf.component';
import SparkMD5 from 'spark-md5';
import { UploadFile } from 'ng-zorro-antd/upload';

let TIMEOUT = null;
@Component({
    selector: `app-table-edit-modal`,
    template: `
        <div drag class="edit_box">
            <div class="modal-header box_header">
                <div class="modal-title">{{modalTitle}}</div>
                <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
            </div>
            <div (mousedown)="$event.stopPropagation()">
                <div nz-row class="modal-content">
                    <nz-col nzSpan="24">
                        <sf #sf mode="edit" [schema]="editSchema" [formData]="record" (formChange)="checkData($event)" button="none">
                        </sf>
                    </nz-col>
                </div>
            </div>
            <div class="modal-footer">
                <button nz-button type="button" (click)="close()" class="closeBtn">关闭</button>
                <button *ngIf="!fieldDisabled" [nzLoading]="loading" nz-button type="submit" (click)="save1(sf['value'])" [disabled]="!sf.valid" [ngClass]="sf.valid?'keep':''">保存</button>
            </div>
        </div>
        `,
    styles:[`        
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
        .modal-footer{
            margin: 0;
        }
        .modal-content{
            padding: 16px;
            max-height: 600px;
            overflow-y: scroll;
        }
        .closer{
            cursor: pointer;
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
export class TableEditModalComponent {
    loading = false;
    @Input()
    record: any;
    editSchema: any = {properties: {}};
    id = '';
    @ViewChild('sf', { static: false })
    sf: SFComponent;
    @ViewChild('nu', { static: false })
    nu: NzUploadComponent;
    editField: any;
    editUri = '';
    initUri = '';
    editBeforeSaveFunction = '';
    saveBeforeUri="";
    fieldDisabled:boolean=false;
    modalTitle:string="编辑";
    unionReturnData :any;  //合并成功返回的数据
    formChange:any={}
    throttleTimer = null

    constructor(private modal: NzModalRef, protected http: _HttpClient, private message: NzMessageService,private eventService: EventService) {
    }

    mateRule: any = {};
    formChangeCb($event){
        for(let key in this.formChange){
            let flag = (this.formChange[key]['value'] != $event[key])
            if(this.formChange[key]['value']==''){
                this.orgIdChange(key,this.formChange[key]['sendTo'],flag)
                this.formChange[key]['value'] =$event[key]
                console.log('给对应字段赋了值','触发事件')
            }else if(flag){
                this.orgIdChange(key,this.formChange[key]['sendTo'],flag)
                this.formChange[key]['value'] =$event[key]
                console.log('对应字段发生变更','触发事件')
            }else if(!flag){
                console.log('对应字段未变更','不触发事件')
            }
        }
    }
    orgIdChange(key,sendToArr,flag){
        if(flag){
            for(let index in sendToArr){
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
                uri = uri.replace(`{{${key}}}`,this.sf.value[key],)
                // console.log("参数1111111111111111111111111",params);
                this.http.get(uri,{mate: JSON.stringify(mate),params: param,editData: JSON.stringify(editAsyncData)}).subscribe(res=>{
                    console.log(res,'事件触发回调拿到的值')
                    const status = this.sf.getProperty(`/${relate}`)
                    status.schema.enum = res
                    console.log(status.schema.readOnly)
                    // status.schema.readOnly = false
                    let flag = 0;
                    if(status.ui.widget=="checkbox"){
                        for(let i=0;i<res.length;i++){
                            for (let j = 0; j < this.record[relate].length; j++) {
                                if(res[i].value == this.record[relate][j]){
                                    flag =1;
                                    break;
                                }
                            }
                            if(res[i].value == this.record[relate]){
                                flag =1;
                            }
                        }
                    }else{
                        for(let i=0;i<res.length;i++){
                            if(res[i].value == this.record[relate]){
                                flag =1;
                            }
                        }
                    }
                    if(flag == 1){
                        status.widget.reset(this.record[relate])
                        this.sf.setValue(`/${relate}`,this.record[relate])
                    }else{
                        status.widget.reset(res[0].value)
                        this.sf.setValue(`/${relate}`,res[0].value)
                    }

                })
            }
        }
    }
    save1(params: any) {
        console.log('edit保存',params);

        this.loading = true;

        if(this.unionReturnData != null){
            console.log(this.unionReturnData)
            params.fileName = this.unionReturnData['fileName'];
            params.md5 = this.unionReturnData['md5'];
            params.file_name = this.unionReturnData['file_name'];
            params.path = this.unionReturnData['path'];
        }
        TIMEOUT = setTimeout(() => {
            this.loading = false;
            clearTimeout(TIMEOUT);
        }, 5000);
        if (this.editBeforeSaveFunction != null && this.editBeforeSaveFunction != '') {
            eval(this.editBeforeSaveFunction);
        }


        // if (typeof this.sf.value.begin_time === 'object') {
        //     this.sf.value.begin_time = this.getDateString(this.sf.value.begin_time);
        // }
        // if (typeof this.sf.value.end_time === 'object') {
        //     this.sf.value.end_time = this.getDateString(this.sf.value.end_time);
        // }
        if (this.saveBeforeUri != null && this.saveBeforeUri != '') {
            this.http.get(environment.gateway_server_url +this.saveBeforeUri+"?param="+JSON.stringify(params)).subscribe(
                (res:any)=>{
                    if (!res) {
                        this.message.error('预检查请求失败');
                    }else if(res.code!=null && res.code!=0){
                        // this.message.error(res.msg?res.msg:'保存失败');
                    }else {
                        this.saveFunc(params);
                    }
                },error=>{},()=>{
                    this.loading = false;
                    clearTimeout(TIMEOUT);
                }
            )
        }else{
            this.saveFunc(params);
        }

    }

    getDateString(date){
        let hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
        let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
        let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds();
        return hours  + ':' + minutes + ':' + seconds;
    }
    saveFunc(params){
        let param;
        let httpMethod = "put";
        if (params['saveMethod'] != true) {
            param = {data: [params], mateRule: this.mateRule};
            delete params['saveMethod'];
            httpMethod = 'put';
        } else {
            httpMethod = 'post';
            param = params;
        }

        for (const object of this.editField) {
            const data = object['config'];
            const key = object['key'];
            if (data['ui'] != null) {
                const ui = data['ui'];
                if (ui['relateList'] != null && ui['widget'] == 'cascader' && this.sf.value[key] != null) {
                    let index = 0;
                    for (const relateKey of ui['relateList']) {
                        // this.sf.schema.properties[relateKey].setValue(values[index]);
                        const value = this.sf.value[key][index];
                        if (ui['relateListLevelFlag'] && value.split('|').length > 0 && index == 1) {
                            this.sf.value[relateKey] = value.split('|')[1];
                        } else {
                            this.sf.value[relateKey] = value;
                        }
                        index++;
                    }
                    delete this.sf.value[key];
                }
            }
        }
        //这里是点击保存
            if (this.editUri != null && this.editUri != "") {
                console.log(this.editUri,'editUri')
                if (!this.editUri.startsWith("http")) {
                    this.editUri = environment.gateway_server_url + this.editUri;
                }
                while (this.editUri.indexOf("{{") > 0 && this.editUri.indexOf("}}") > 0) {
                    let i = this.editUri.indexOf("{{");
                    let j = this.editUri.indexOf("}}");
                    if (j > i) {
                        let key = this.editUri.substring(i + 2, j);
                        console.log(key,'key');
                        this.editUri = this.editUri.replace("{{" + key + "}}", this.record[key]);
                    }
                    console.log(this.editUri,'置换后的uri')
                }
                let url = this.editUri;
                param['data']['0']['url'] = {
                    fileName:this.record.file_name,
                    file_name:this.record.file_name,
                    md5:this.record.id,
                    path:this.record.file_path
                }
                console.log('保存后',this.record)
                console.log(param,url,'保存参数')
                console.log(this.unionReturnData,'上传返回data')
                if(this.unionReturnData!=null){
                    param['data']['0']['url']={...this.unionReturnData}
                }
                this.http[httpMethod](url, param).subscribe((res: any) => {
                    if (!res) {
                        this.message.error('保存失败');
                    }else if(res.code!=null && res.code!=0){
                        // this.message.error(res.msg?res.msg:'保存失败');
                    }else{
                        this.message.success('保存成功');
                        this.modal.close(true);
                        this.close();
                    }
                }, (res: any) => {
                },(err:any)=>{
                });
            } else {
            this.http.put(environment.common_crud_url + '/' + this.id + '/' + this.record['id'], param).subscribe((res: any) => {
                console.log(res,'222222');
                //弹窗保存成功
                this.message.success('保存成功');
                this.modal.close(true);
                this.close();
            }, (res: any) => {
            });
        }
        this.eventService.subscribe(this.closeModal,this);
    }
    closeModal(_event,_this){
        if(_event == "auditSubmitOk"){
            _this.modal.close(true);
            _this.close();
        }
    }

    keyList1: Array<string> = [];
    keyList2: Array<string> = [];

    getForm() {
        this.http.get(environment.runtime_server_url + '/table/edit/' + this.id).subscribe((res: any) => {
            console.log(res,'这是外面的res')
            this.initUri = res.initUri;
            let url;
            if (this.initUri != null && this.initUri != '') {
                url = environment.gateway_server_url + this.initUri + '/' + this.record['id'];
            } else {
                url = environment.common_crud_url + '/' + this.id + '/' + this.record['id'];
            }
            this.http.get(url).subscribe((res1: any) => {
                console.log(res1,'res1')
                // let begin = '2019/12/04 ' + res1.begin_time;
                // let end = '2019/12/04 ' + res1.end_time;
                // res1['begin_time'] = new Date(begin);
                // res1['end_time'] = new Date(end);
                this.record = res1;
                this.getFormHandle(res);
                console.log(res1,'这是里面的res')
                console.log(this.sf,'旧')
            });
        });
    }
    getFormHandle(res: any) {
        this.editUri = res.editUri;
        this.editBeforeSaveFunction = res.editBeforeSaveFunction;
        this.saveBeforeUri = res.saveBeforeUri;
        if (res.initFunction != null && res.initFunction != '') {
            const tempRecord = this.record;
            eval(res.initFunction);
        }
        const properties = {};
        const required = [];
        this.editField = res['editField'];
        const dataSources: Map<string, object> = res['dataSource'];
        for (const object of res['editField']) {
            const data = object['config'];
            const key = object['key'];

            console.log(object['config'])
            if( object['display']!= null && object['display'].indexOf('edit') > 0){
                const display = JSON.parse(object['display'])
                data['ui'] == null?data['ui'] = { hidden:!display['edit'] }:data['ui']['hidden'] = !display['edit'];
            }
            if (dataSources != null && dataSources[key] != null) {
                data['enum'] = dataSources[key];
            }
            let requiredString = object['required'];
            if(this.fieldDisabled){
                if(data['type'] === "array"){
                   // console.log(data['items']['properties']['number']['readOnly']);
                    for(let i in data['items']['properties']){
                        data['items']['properties']['number']['readOnly']=true;
                        data['items']['properties']['screenResolution']['readOnly']=true;
                        data['items']['properties']['startPoint']['readOnly']=true;
                    }
                }
                data['readOnly'] = true;
                requiredString = false;
            }
            if(object['disabled']!=null && (object['disabled']=="E"|| object['disabled']=="EV")){
                data['readOnly'] = true;
                requiredString = false;
            }
            if (data['ui'] != null) {
                const ui = data['ui'];
                if (ui['widget'] == 'upload') {
                    data['enum'] = [{
                        'name': this.record[ui['fileName']],
                        'status': 'done',
                        'url': environment.file_server_url + this.record[key],
                        'response': this.record[key]
                    }];
                    if(data['enum'].length>0){
                        requiredString = false;
                    }
                    ui['customRequest'] = (item=>{
                        this.handleFile(item, ui['action']);
                      })
                      ui['beforeUpload']= (file: UploadFile, fileList: UploadFile[]) =>{
                        const reg:RegExp =/[!@#$%^&*]/im;
                        if(reg.test(file['name'])){
                            this.message.error('文件名不能含有特殊符号')
                            return false
                        }
                        let total = parseInt(sessionStorage.getItem("total"))
                        if(total < ui['totalFile']){
                          sessionStorage.setItem("total",String(total+1));
                        }
                      }
                      ui['remove']=(file: UploadFile) =>{
                        let total = parseInt(sessionStorage.getItem("total"));
                        if(total != 0){
                          sessionStorage.setItem("total",String(total-1));
                        }
                        return true;
                      }
                }
                // console.log(this.record,'这是this.record')
                // console.log(data['enum'],'这是enum')
                if (ui['asyncData'] != null && ui['mate'] != null&&ui['receiveFromRelate']==null) {
                    let uri: string = ui['asyncData'];
                    const mate = ui['mate'];
                    const param = ui['params'];
                    const editAsyncData = ui['editAsyncData'];
                    if (!uri.startsWith('http')) {
                        uri = environment.gateway_server_url + uri;

                        while (uri.indexOf("{{") > 0 && uri.indexOf("}}") > 0) {
                            let i = uri.indexOf("{{");
                            let j = uri.indexOf("}}");
                            if (j > i) {
                                let key = uri.substring(i + 2, j);
                                uri = uri.replace("{{" + key + "}}", this.record[key]);
                            }
                        }
                    }
                    ui['asyncData'] = () => this.http.get<SFSchemaEnumType[]>(uri, {
                        mate: JSON.stringify(mate),
                        params: param,
                        editData: JSON.stringify(editAsyncData)
                    });
                }
                if(ui['asyncData'] != null && ui['mate'] != null&&ui['receiveFromRelate']!=null){
                    let url = environment.gateway_server_url + ui['asyncData']
                    let mate = ui['mate'];
                    let param = ui['params'];
                    let editAsyncData = ui['editAsyncData'];
                    // data['readOnly'] = true
                    data['enum'] =[
                        {label:'',value:''}
                    ]
                }
                if(ui['sendToRelate']!=null){
                    this.formChange[key] = {sendTo:ui['sendToRelate'],value:''}
                }

                if (ui['asyncData'] && ui['widget'] == 'cascader') {
                    console.log('2222===========================');
                    const defaultArray = [];
                    const relateListLevelFlag = ui['relateListLevelFlag'];
                    if (relateListLevelFlag) {
                        defaultArray.push(this.sf.value[ui['relateList'][0]]);
                        defaultArray.push(this.sf.value[ui['relateList'][0]] + '|' + this.sf.value[ui['relateList'][1]]);
                        defaultArray.push(this.sf.value[ui['relateList'][2]]);

                    } else {
                        for (const relateKey of ui['relateList']) {
                            defaultArray.push(this.sf.value[relateKey]);
                        }
                    }

                    console.log(defaultArray,'351');
                    data['default'] = defaultArray;
                    this.sf.value[key] = defaultArray;
                    // data['default'] = ["582f5068c6264a96b2d9000acc549b07", "582f5068c6264a96b2d9000acc549b07|5", "508d430c989e441d8e3fd1437ca0edbc"]
                    // this.http.get("http://192.168.43.184:8090/card/card/terminal/manage/getBrandModelModulesCascade").subscribe((res: any) => {
                      //  data['default'] = ["582f5068c6264a96b2d9000acc549b07", "582f5068c6264a96b2d9000acc549b07|5", "508d430c989e441d8e3fd1437ca0edbc"]
                    //     let j = {key:["582f5068c6264a96b2d9000acc549b07", "582f5068c6264a96b2d9000acc549b07|5", "508d430c989e441d8e3fd1437ca0edbc"]};
                    //     this.record = j;
                    // });
                    // });
                    const asyncDataUrl =  ui['asyncData'];
                    const url = environment.gateway_server_url + asyncDataUrl;
                    ui['asyncData'] = () => this.http.get(url);


                }



                if (ui['action'] != null) {
                    ui['action'] = environment.file_server_url + ui['action'];
                }

                if (ui['displayWith'] != null) {
                    const display = ui['displayWith'];
                    ui['displayWith'] = (node: NzTreeNode) => node[display];
                }

                if (ui['validator'] != null ) {
                    let validatorUrl = ui['validator'];
                    let validatorErrorText = ui['validatorErrorText'];
                    ui['validator'] = (value: any) => this.http.get(environment.gateway_server_url + validatorUrl + `${value}`).pipe(
                        map(res => res ? [{keyword: 'required', message: validatorErrorText}] : [])
                    )
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
                const properties = data['properties'];
                for (const key1 in properties) {
                    if (properties[key1]['ui']['action'] != null) {
                        const url = environment.gateway_server_url + properties[key1]['ui']['action'];
                        const mate = properties[key1]['ui']['mate'];
                        const param = properties[key1]['ui']['params'];
                        this.http.get(url, {
                            mate: JSON.stringify(mate),
                            params: param
                        }).subscribe((res: any) => {
                            console.log(res,'381');
                            properties[key1]['enum'] = res;
                            this.sf.refreshSchema();
                        });

                    }
                }

            }

            console.log('items-----1>');
            // console.log(data,'这是data')
            // 扩展
            if (data['items']) {
                const items = data['items'];
                console.log('items-----2>');
                const properties = items['properties'];
                if (properties) {
                    // 遍历key value
                    for (const key1 in properties) {
                        const label = properties[key1];
                        if (label) {
                            const ui = label['ui'];
                            if (ui['asyncData'] != null && ui['mate'] != null) {
                                let uri: string = ui['asyncData'];
                                const mate = ui['mate'];
                                const param = ui['params'];
                                if (!uri.startsWith('http')) {
                                    uri = environment.gateway_server_url + uri;
                                }
                                ui['asyncData'] = () => this.http.get<SFSchemaEnumType[]>(uri, {
                                    mate: JSON.stringify(mate),
                                    params: param
                                });
                            }
                            if (ui['displayWith'] != null) {
                                const display = ui['displayWith'];
                                ui['displayWith'] = (node: NzTreeNode) => node[display];
                            }
                            label['ui'] = ui;
                        }
                    }


                }
            }
            properties[key] = data;
            // console.log(properties,'这是propertires')
            if (requiredString) {
                required.push(key);
            }

        }
        let ui = res.ui;
        if (ui == null) {
            ui = {
                spanLabel: 4,
                spanControl: 18
            };
        } else {
            ui = JSON.parse(ui);
        }

        for (let parseKey in properties) {
            if (properties[parseKey]["type"] != undefined && properties[parseKey]["type"] == "object") {
                for (let j in properties[parseKey]["properties"]) {

                    let recordElement = null;
                    try{
                        recordElement = JSON.parse(this.record[parseKey]);
                    }catch (e) {

                    }
                    if (recordElement != null && recordElement != undefined && recordElement != "") {
                        properties[parseKey]["properties"][j]["default"] = recordElement[j];
                    }
                }
            }
        }
        // properties['datePicker'] = {
        //     title:'日期',
        //     type:'string',
        //     ui:{
        //         widget:'MultiDatePicker'
        //     }
        // }
        this.editSchema = {properties: properties, ui: ui, required: required};
        this.checkData()
        console.log(this.editSchema);
    }
    xjnxUrl = environment.file_server_url.replace('/file','')
    uploadTime = 0;  // 当前进行时上传的次数
    fileLength = 0;  // 文件可分段数，上传总次数
    handleFile(item,action) {  //  文件分段处理
      let file = item.file;
      let timeStamp = new Date().getTime();
      let userName = JSON.parse(localStorage.getItem("user")).userName;   // 当前时间戳+用户名 作为整个文件的md5
      let urlParams = action.split('?')[1];
      let urlParamArr = urlParams.split('&');
      let filePath = '';  // 文件存放目录
       /*获取filePath start*/
      for(let i=0;i<urlParamArr.length;i++){
        let paramItem = urlParamArr[i].split('=');
        let key = paramItem[0];
        if(key == 'typeName'){
          filePath = paramItem[1];
        }
      }
      /*获取filePath end*/
      let fileSize = file['size'];  //获取上传文件大小
      let block = 1*1024*1024;  // 文件分段大小
      let len = fileSize/block; // 可分段数
      this.fileLength = len;
      console.log('block 1M为',block);
      for(let i=0;i<len;i++){
        let size = 0;  // 实际上传的分段大小
        let endPos = 0;  // 分段起始位置
        if(fileSize>=block*(i+1)){
          size = block;
          endPos = block * (i + 1);
        }else {
          size = fileSize - block*i;
          endPos = fileSize;
        }

        let percent = endPos / fileSize * 100;
        let pos = block*i;
        var fd = new FormData();
        let cutFile = file.slice(pos,endPos);
        fd.append('file',cutFile);
        let params = {
          tmpPath: timeStamp+userName,
          size: size,
          pos: pos,
          md5: ''
        };
        this.postFile(fd, params, item, cutFile, filePath);
      }
    }
    postFile(fd,params,item,cutFile,filePath){   // 文件分段上传
       // 获取apk的md5
      // debugger
       var fileReader = new FileReader(); //用于读取文件，即把文件内容读入内存。它的参数是File对象或Blob对象
       var spark = new SparkMD5(); // 创建md5对象（基于SparkMD5）
       fileReader.readAsBinaryString(cutFile); // 读取文件,返回文件的原始的二进制内容;cutFile为对应上传的文件
       // 文件读取完毕之后的处理
       fileReader.onload = (e) => {  //e.target.result就是文件的内容
         //获取文件的md5
         spark.appendBinary(e.target['result']);
         const md5 = spark.end(); //识别文件的唯一标识
         params.md5 = md5;
        //  environment.gateway_server_url
         this.http.post(this.xjnxUrl+'/upload/break', fd ,params).subscribe((res: any) => {
           ++this.uploadTime;
          //  console.log('上传时间',this.uploadTime);
          //  console.log('文件长度',this.fileLength);
          item.onProgress({ percent: this.uploadTime / this.fileLength * 100 });
           if(this.uploadTime >= this.fileLength){
             this.union({ tmpPath: params.tmpPath, fileName: item.file.name, filePath: filePath }, item);
           }
         }, (res: any) => {
            this.message.error('上传失败');
           console.log('上传失败');
         },() => {
         });
       };


    }
    union(params,item) {  // 分段上传文件合并
      this.http.post(this.xjnxUrl + '/upload/union', {}, params).subscribe((res: any) => {
        this.unionReturnData = res;
        console.log('成功union的数据',res)
        //  成功结束进度条
        console.log("成功返回的path",res.path)
        console.log(this.sf.value)
        item.onSuccess(res.path);
        // this.sf.setValue("/url",res.path)
          console.log(this.sf.value)
          console.log(this.nu)
        this.uploadTime = 0
        this.fileLength = 0
      }, (res: any) => {},() => {});
    }
    checkData($event?){
        $event?this.formChangeCb($event):(this.formChangeCb(this.record),console.log('没有参数'))
        console.log(this.editSchema,$event)
}
    close() {
        this.modal.destroy(false);
    }
    ngOnInit() {
        console.log(this.record,'ngOninit')
        this.id = this.record.__entity;
        this.fieldDisabled = this.record.__disabled;
        if(this.record.__modalTitle!=null){
            this.modalTitle = this.record.__modalTitle;
        }
        this.getForm();
    }

}
