import {_HttpClient} from '@delon/theme';
import {ActivatedRoute} from "@angular/router";
import { EventService } from './../../../shared/event/event.service';
import {Component, Input, ViewChild,OnInit} from '@angular/core';
import {NzMessageService, NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "../../../../environments/environment";


let TIMEOUT = null;
@Component({
    selector: 'inner-edit-page',
    templateUrl: './inner-edit-page.html',
    styleUrls: ['./inner-edit-page.css']
})
export class InnerEditPageComponent implements OnInit {

  title:string;
  type:string;
  id:string = "";//从主页面传输过来节目id
    loading = false;
    @Input()
    record: any;
    editSchema: any = {properties: {}};
    @ViewChild('sf',{ static: false })
    sf: SFComponent;
    name: any = "新窗口";
    entityName: string = "";  //实体名
    modalId: string = "";  // 自定义json的文件名称
    initUri = "";           //数据初始化的uri
    saveUri = "";
    ids = "";
    addBeforeSaveFunction = '';
    initFunction = '';
    saveButtonHidden = "inline";
    buttons:any[];
    modalObject:Object;

    constructor( private message: NzMessageService,protected http: _HttpClient,private eventService: EventService, private route: ActivatedRoute) {

    }

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      this.id = params.id;
      this.record = JSON.parse(sessionStorage.getItem("innerEditPage_"+this.id));
        this.entityName = this.route.snapshot.queryParams['entityName'];
      this.title = this.route.snapshot.queryParams['title'];
        this.modalId = this.route.snapshot.queryParams['option'];
        this.getForm();
    });

  }


  back(){
    window.history.back();
  }




    mateRule: any = {};

    save(params: any) {
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
                if (!this.saveUri.startsWith("http")) {
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
            if(res == true){
                this.message.success("保存成功")
            }
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

            this.name = res.name;
            this.initUri = res.initUri;
            this.saveUri = res.saveUri;
            this.addBeforeSaveFunction = res.addBeforeSaveFunction;
            this.initFunction = res.initFunction;
            if(this.initFunction !=null && this.initFunction != ''){
                eval(this.initFunction);
            }
            this.getData();
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
                    if (ui["asyncData"] != null && ui["mate"] != null) {
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
                    if (ui['action'] != null) {
                        ui['action'] = environment.file_server_url + ui['action'];
                    }
                    if (ui["displayWith"] != null) {
                        let display = ui["displayWith"];
                        ui["displayWith"] = (node: NzTreeNode) => node[display];
                    }
                    if(this.sf.value!=null){
                        let _this = this;
                        console.log("121212121212");
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
            this.editSchema = {properties: properties, ui: ui, required: required};
        })
    }

    close() {
        console.log();
    }

    getData() {
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
            this.http.get(this.initUri).subscribe((res: any) => {
                this.record = res;
                if(this.initFunction !=null && this.initFunction != ''){
                    eval(this.initFunction);
                    this.sf.refreshSchema();
                }
            })
        }else{

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

}
