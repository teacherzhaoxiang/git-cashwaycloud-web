import {Component, Input, ViewChild, OnDestroy, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {CascaderOption, NzMessageService, NzModalRef, NzTreeNode, NzUploadComponent} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {CascaderWidget, SFComponent, SFSchema, SFSchemaEnumType, SFTimeWidgetSchema} from '@delon/form';
import {environment} from '@env/environment';
import {EventService} from "@shared/event/event.service";
import {map} from "rxjs/operators";
import { AngularSplitModule } from 'angular-split';
import {WidgetService} from "../../service/widget.service";
import {BehaviorSubject} from "rxjs";
import {Subscription} from "rxjs";
import { __await } from "tslib";

let TIMEOUT = null;
@Component({
    selector: `cashway-edit-form`,
    template: `        
        <nz-col >
            <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none">
            </sf>
        </nz-col>
        `,
    styles:[`        
        .modal-content{
            padding: 16px;
            max-height: 600px;
            overflow-y: scroll;
        }
    `]
})
export class EditFormComponent implements OnDestroy, AfterViewInit{
    loading = false;
    @Output('out') out = new EventEmitter();
    @Input()
    record: any;//初始化绑定数据
    @Input() list_item;
    editSchema: any = {properties: {
        /*newVersionId: {
          type: 'string',
          title: '版本号',
          ui: {
            errors: {
              'required': ''
            },
            showRequired:true
          }
        }*/
      }
    };//页面组件绑定配置
    @Input()
    componentInitUri:any;//页面初始化url
    @Input()
    id = '';//页面id，唯一标识，用以从后台请求配置数据

    @ViewChild('sf', { static: false })
    sf: SFComponent;
    @Input()
    editField: any;//后端配置的数据，需要将格式转换为editSchema格式才能使用
    @Input()
    saveConfig:Map<string,any>;//触发保存时相关配置
    @Input()
    initUri = '';//页面初始化url
    @Input()
    saveBefore:Map<string,any>;//保存前处理配置
    @Input()
    initFunction:any;
    fieldDisabled:boolean=false;//页面是否可编辑标识
    version = '';
    softType = '';
    uploadKey = '';
    saveUri = '';
    versionService:any = new Subscription();
    optionService:any = new Subscription();
    constructor(protected http: _HttpClient, private message: NzMessageService,private eventService: EventService, private service:WidgetService) {
    }

    mateRule: any = {};

    save(config:any={}) {
      debugger
      if(!this.saveUri) return;
      if(!this.sf.valid){
        this.loading = false;
        this.service.sendOption(false);
        this.message.error('数据校验失败');
        return;
      }
      if(JSON.stringify(config)!='{}'){
          this.saveConfig = config;
      };
        let params:any  = this.sf.value;
        //自定义保存前处理脚本
        if (this.saveBefore != null && this.saveBefore.get("func") != null) {
            eval(this.saveBefore.get("func"));
        }
        if (this.saveBefore != null && this.saveBefore.get("url") != null) {
            this.http.get(environment.gateway_server_url +this.saveBefore.get("url")+"?param="+JSON.stringify(params)).subscribe(
                (res:any)=>{
                    if (!res) {
                        this.message.error('预检查请求失败');
                        this.eventService.emitByType("auditSubmitOk",false);
                        this.out.emit(false);
                    }else if(res.code!=null && res.code!=0){
                        this.message.error(res.msg?res.msg:'保存失败');
                        this.eventService.emitByType("auditSubmitOk",false);
                        this.out.emit(false);
                    }else {
                        this.saveFunc(params);
                    }
                },error=>{},()=>{
                    this.out.emit(false);
                }
            )
        }else{
            this.saveFunc(params);
        }

    }

    saveFunc(params: Map<string, any>){
        let param={};
        if (params['saveMethod'] != true) {
            param = {data: [params], mateRule: this.mateRule};
            delete params['saveMethod'];
        } else {
            param = params;
        }
      let url;
      let method;
      let body={};
        if(this.record){
          url = environment.common_crud_url + '/' + this.id + '/' + this.record['id'];
          method = "put";
        }
        if (this.saveConfig != null) {
            console.log(this.saveConfig)
            url = this.service.handleUrl(environment.atmcManageUrl+this.saveConfig['url'],{'version':this.version,'softType':this.service.tab_menu.value['softType']});
            method = this.saveConfig["method"]?this.saveConfig["method"]:"put";
            body = this.sf.value;
            for(let key in body){
              if(key==this.uploadKey){
                if(!body[key]['path']){
                  this.message.error('请选择文件上传！');
                  this.service.sendOption(false);
                  this.loading = false;
                  return;
                }
                body[key] = body[key]['path'];
              }
            }
            if(this.saveConfig['body']){
                let temp = this.saveConfig['body'];
                for (let key in temp) {
                    if(params[temp[key]]){
                        body[key] = params[temp[key]];
                    }else if(this.list_item.item[temp[key]]) {
                        body[key] = this.list_item.item[temp[key]];
                    }else {
                      body[key] = '';
                    }
                };
            }
        }
        if(!url)return;

        this.http.request(method,url,{body:body}).subscribe((res: any) => {
            this.loading = false;
            this.service.sendOption(false);
            if (!res) {
                this.message.error('保存失败');
                this.eventService.emitByType("auditSubmitOk",false);
                this.out.emit(false);
            }else if(res.code!=null && res.code!=0){
                this.message.error(res.msg||'保存失败');
                this.eventService.emitByType("auditSubmitOk",false);
                this.out.emit(false);
            }else{
              this.service.sendPublishDisable(1);
                this.message.success('保存成功');
                //this.eventService.emitByType("auditSubmitOk",true);
                this.out.emit(true);
                this.sf.reset();
                this.getData();
            }

        }, (res: any) => {
           this.out.emit(false);
        });
    }
    urlFormat(uri:string){
        if (!uri.startsWith("http") && !uri.startsWith("https")) {
            uri = environment.gateway_server_url + uri;
        }
        while (uri.indexOf("{{") > 0 && uri.indexOf("}}") > 0) {
            let i = uri.indexOf("{{");
            let j = uri.indexOf("}}");
            if (j > i) {
                let key = uri.substring(i + 2, j);
                if(this.record&&this.record[key]){
                  uri = uri.replace("{{" + key + "}}", this.record[key]);
                }else {
                  uri = uri.replace("{{" + key + "}}", this.list_item.item[key]);
                }
                continue;
            }
        }
        return uri;
    }
    dataSource:any;
    getForm() {
        let componentUri = this.componentInitUri;
        if(componentUri == null || componentUri == ""){
            componentUri = environment.runtime_server_url + '/init/form/' + this.list_item.id;
        }else {
            componentUri = this.urlFormat(componentUri);
        }
        this.http.get(componentUri).subscribe((res: any) => {
            if(res.type=='checkBoxSelect'|| res.readOnly){
              let url = '';
              if(this.list_item['item']){
                url = this.service.handleUrl(res['initUri'],this.list_item['item']);
              }else {
                url = res['initUri'];
              }
              this.http.get(environment.atmcManageUrl+url).subscribe(res1=>{
                this.record = res1;
                if(res1&&res1.code==0){
                  this.dataSource = res1.msg;
                }
                this.getFormHandle(res);
              });
              return;
            }
            if(res['initUri']){
              this.versionService = this.service.list_version.subscribe(data=>{
                if(data&&JSON.stringify(data)!='{}'&&data['version']!=null&&data['version']!=this.version){
                  this.version = data['version'];
                  this.softType = data['softType'];
                  if(res['initUri']){
                    this.initUri = environment.atmcManageUrl+this.service.handleUrl(res['initUri'],{...data,softType:this.service.tab_menu.value['softType']});
                  }
                  let url;
                  // this.getFormHandle(res);
                  if (this.initUri != null && this.initUri != '') {
                    url = this.urlFormat(this.initUri);
                  }else {
                    if(this.id){
                      url = environment.common_crud_url + '/' + this.id + '/' + this.record['id'];
                    }
                  }
                  this.initUri = url;
                  this.http.get(url).subscribe((res1: any) => {
                    if(res1&&JSON.stringify(res1)!='{}'){
                      this.record = res1;
                      this.service.sendPublishDisable(1);
                    }else {
                      this.record = {};
                      this.service.sendPublishDisable(0);
                    }

                    this.getFormHandle(res);
                  });
                }
              })
            }else {
              this.getFormHandle(res);
            }


        });
    }
    getData() {
      this.http.get(this.initUri).subscribe((res1: any) => {
        this.record = res1;

      });
    }
    getFormHandle(res: any) {   //处理获取的表单配置数据
        if(res.saveConfig != null){
            this.saveConfig = res.saveConfig;
        }
        if(res.saveBefore != null){
            this.saveBefore = res.saveBefore;
        }
        if(res.initFunction != null){
            this.initFunction = res.initFunction;
        }
        if (this.initFunction != null && this.initFunction != '') {
            const tempRecord = this.record;
            eval(res.initFunction);
        }
        const properties = {};
        const required = [];
        this.editField = res['editField'];
        let dataSources = res['dataSource']||{};
        for (let object of res['editField']) {
            let data = object['config'];
            let key = object['key'];
            if (dataSources && dataSources[key] != null) {
                data['enum'] = dataSources[key];
            }
            let requiredString = object['required'];
            if(this.fieldDisabled){
                if(data['type'] === "array"){
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
                let ui = data['ui'];
                if (ui['widget'] == 'upload') {
                  this.uploadKey = key;
                    let fileName = this.record&&this.record[ui['fileName']]?this.record[ui['fileName']]:'';
                    data['enum'] = [{
                        'name': fileName,
                        'status': 'done',
                        'url': this.record? environment.atmcManageUrl + this.record[key]:'',
                        'response': this.record? this.record[key]:''
                    }];
                }
                if (ui['widget'] == 'checkBoxSelect'||ui['widget'] == 'checkBox') {
                  data['dataSource'] = this.dataSource;
                  if(ui['readOnly']){
                    data['versionMsg'] = this.list_item['item'];
                  }
                }
                if (ui['asyncData'] != null && ui['mate'] != null) {
                    let uri: string = ui['asyncData'];
                    let mate = ui['mate'];
                    let param = ui['params'];
                    let editAsyncData = ui['editAsyncData'];
                    if (!uri.startsWith('http')) {
                        uri = environment.atmcManageUrl + uri;
                    }
                    ui['asyncData'] = () => this.http.get<SFSchemaEnumType[]>(uri, {
                        mate: JSON.stringify(mate),
                        params: param,
                        editData: JSON.stringify(editAsyncData)
                    });
                }


                if (ui['asyncData'] && ui['widget'] == 'cascader') {
                    let defaultArray = [];
                    let relateListLevelFlag = ui['relateListLevelFlag'];
                    if (relateListLevelFlag) {
                        defaultArray.push(this.sf.value[ui['relateList'][0]]);
                        defaultArray.push(this.sf.value[ui['relateList'][0]] + '|' + this.sf.value[ui['relateList'][1]]);
                        defaultArray.push(this.sf.value[ui['relateList'][2]]);

                    } else {
                        for (const relateKey of ui['relateList']) {
                            defaultArray.push(this.sf.value[relateKey]);
                        }
                    }

                    console.log(defaultArray);
                    data['default'] = defaultArray;
                    this.sf.value[key] = defaultArray;
                    let asyncDataUrl =  ui['asyncData'];
                    let url = environment.atmcManageUrl + asyncDataUrl;
                    ui['asyncData'] = () => this.http.get(url);
                }



                if (ui['action'] != null && ui['action'].indexOf('http://')==-1) {
                    ui['action'] = environment.file_server_url + ui['action'];
                }

                if (ui['displayWith'] != null) {
                    let display = ui['displayWith'];
                    ui['displayWith'] = (node: NzTreeNode) => node[display];
                }

                if (ui['validator'] != null ) {
                    let validatorUrl = ui['validator'];
                    let validatorErrorText = ui['validatorErrorText'];
                    ui['validator'] = (value: any) => this.http.get(environment.gateway_server_url + validatorUrl + `${value}`).pipe(
                        map(res => res ? [{keyword: 'required', message: validatorErrorText}] : [])
                    )
                }

                data['ui'] = ui;
            }
            if (data['type'] != null && data['type'] == 'object') {
                let properties = data['properties'];
                for (const key1 in properties) {
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

            console.log('items----->');
            // 扩展
            if (data['items']) {
                let items = data['items'];
                console.log('items----->');
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
                                    uri = environment.atmcManageUrl + uri;
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
            properties[key] = data;
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
            if (typeof ui == "string"){
                ui = JSON.parse(ui);
            }
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
        // properties['begin_time'] = {
        //     type: 'number',
        //     ui: { widget: 'time' } as SFTimeWidgetSchema,
        // };
        this.editSchema = {properties: properties, ui: ui, required: required};
          if(res.saveConfig || res.saveUri){
            this.saveUri = res.saveUri || res.saveConfig['url'];
            this.optionService = this.service.option.subscribe(op=>{
              if(op=='keep'&&!this.loading){
                this.loading = true;
                console.log(this.sf.value)
                this.save(res.saveConfig);
              }
            });
          }else {this.saveUri = ''};

    }
    ngAfterViewInit() {

    }
    ngOnInit() {
      this.saveUri = '';
      this.getForm();
    }
  ngOnDestroy() {
    this.versionService.unsubscribe();
    if(this.saveUri){
      this.optionService.unsubscribe();
    }
  }
}
