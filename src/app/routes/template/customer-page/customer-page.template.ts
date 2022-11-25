import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Input,
    NgZone,
    OnInit,
    ViewChild
} from '@angular/core';
import {TableAddModalComponent} from "../table-template/add.template";
import {_HttpClient} from "@delon/theme";
import {NzListComponent, NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {CustomerPageAddModalComponent} from "./customer-page.add";
import {SFComponent} from "@delon/form";
import {ObserveOnSubscriber} from "rxjs/internal/operators/observeOn";
import {environment} from "@env/environment";

@Component({
    selector: 'app-customer-page-template',
    templateUrl: './customer-page.template.html',
    styles:[
            `
            ::ng-deep .ant-card-body{
                padding: 0;
            }

            ::ng-deep .ant-form-item{
                margin-bottom: 0;
            }
            ::ng-deep .ant-list-item{
                padding: 0;
            }
            ::ng-deep .ant-card{
                margin-bottom: 0;
            }
            ::ng-deep .ant-card-bordered{
                border-top-width: 0;
                border-bottom-width: 0;
                border-left-width: 0;
                border-right-width: 0;

            }
        `]
})
export class CustomerPageTemplateComponent implements OnInit {

    @Input()
    id:any;
    backRouter:string;
    dataJson:any;

    schema:any = {}
    data:any = [];

    constructor(private http: _HttpClient,private message: NzMessageService,private route: ActivatedRoute,private modalSrv: NzModalService,private zone: NgZone,private router:Router,private activatedRoute: ActivatedRoute,private changeDetectorRefs:ChangeDetectorRef) {
    }

    add(record){

         let modal;
        if(record == null){
            modal = this.modalSrv.create({
                nzTitle: '新增',
                nzContent: CustomerPageAddModalComponent,
                nzComponentParams: {
                    //"resour" entity:this.id,
        },
            nzFooter:null,
        });
        }else {
            modal = this.modalSrv.create({
                nzTitle: '编辑',
                nzContent: CustomerPageAddModalComponent,
                nzComponentParams: {
                    "record": record
                },
                nzFooter: null,
            });
        }

        modal.afterClose.subscribe((modal:any)=>{
            if(modal.namespace == null){
                return;
            }

            let key:string = modal.namespace;

            this.deleteItem(key);

            let resourceName = modal.resourceName;
            this.http.get(environment.common_crud_url+"/publish_style_manage/"+resourceName).subscribe((res:any)=> {
              if(res.type == "image" || res.type=="video"){

                  let releaseResource = res["resource_list"];
                  this.http.get(environment.common_crud_url+"/publish_release_resource/"+releaseResource).subscribe((res:any)=> {
                      let src = res.url;

                      let arrayUrl:any[]=[];
                      let arrayMd5:any[]=[];
                      console.log(res);
                      for(let i=0;i<res.length;i++){
                          arrayUrl.push(environment.gateway_server_url+"/file/file"+src);
                          arrayMd5.push(res.md5);
                      }

                      let _schema = JSON.parse(JSON.stringify(this.schema));
                      let properties:any = {};
                      properties[key] = {type:'string',title:'',name:modal.name,ui:{style:{width:modal.width+'px',height:modal.height+'px'},widget:modal.resourceType,spanControl:24,src:environment.gateway_server_url+"/file/file"+src,resourceName:resourceName,md5:res.md5,arrayUrl:arrayUrl,arrayMd5:arrayMd5}}
                      _schema[key] = {properties:properties,key:key};
                      let _data = JSON.parse(JSON.stringify(this.data));
                      let tmp = {key:key,style:{left:modal.left+'px',top:modal.top+'px',width:modal.width+'px',height: modal.height+'px'}}
                      _data.push(tmp);
                      console.log(JSON.stringify(_schema));
                      console.log(JSON.stringify(_data));
                      let json = {
                          "schema":_schema,
                          "data":_data
                      };
                      this.dataJson = json;

                      this.schema = _schema;
                      this.data = _data;
                  })
              }else{
                  let releaseResourceIds = res["resource_list"]
                  this.http.get(environment.common_crud_url+"/publish_release_resource/ids/"+releaseResourceIds).subscribe((res:any)=> {

                      let arrayUrl:any[]=[];
                      let arrayMd5:any[]=[];
                      console.log(res);
                      for(let i=0;i<res.length;i++){
                          arrayUrl.push(environment.gateway_server_url+"/file/file"+res[i]["URL"]);
                          arrayMd5.push(res[i]["MD5"]);
                      }
                      let _schema = JSON.parse(JSON.stringify(this.schema));
                      let properties:any = {};
                      properties[key] = {type:'string',title:'',name:modal.name,ui:{style:{width:modal.width+'px',height:modal.height+'px'},widget:modal.resourceType,spanControl:24,arrayUrl:arrayUrl,resourceName:resourceName,arrayMd5:arrayMd5}}
                      _schema[key] = {properties:properties};
                      let _data = JSON.parse(JSON.stringify(this.data));
                      let tmp = {key:key,style:{left:modal.left+'px',top:modal.top+'px',width:modal.width+'px',height: modal.height+'px'}}
                      _data.push(tmp);

                      let json = {
                          "schema":_schema,
                          "data":_data
                      };
                      this.dataJson = json;

                      this.schema = _schema;
                      this.data = _data;
                  });
              }
            })



            // this.zone.run(()=>{
            //     setTimeout(() =>{
            //
            //         this.tick();
            //     },1000)
            // });
        })
    }
    save(){
        console.log(JSON.stringify(this.dataJson));
        let data = JSON.stringify(this.dataJson);
        if(data == null || data ==""){
            this.message.warning("页面模板数据为空！");
            return;
        }
        this.http.post(environment.runtime_server_url+"/customer-page/"+this.id,data).subscribe((res:any)=> {
            console.log(res);
            if(res.code == "0"){
                this.router.navigateByUrl(this.backRouter);
            }
        })

    }

    currentKey = ""
    mouseEnter(event,item){
        this.currentKey = item.key+"";
    }


    editItem(key){
        let record ={};
        for(let i=0;i<this.data.length;i++){
            if(key == this.data[i]["key"]){
                console.log(this.data[i]);
                console.log(this.schema);
                let style = this.data[i]["style"];
                record["top"] = style["top"].substring(0,style["top"].length-2);
                record["left"] = style["left"].substring(0,style["left"].length-2);
                record["width"] = style["width"].substring(0,style["width"].length-2);
                record["height"] = style["height"].substring(0,style["height"].length-2);
                record["namespace"] = this.data[i]["key"];
                let key = record["namespace"];
                record["name"] = this.schema[key]["properties"][key]["name"];
                record["resourceName"] = this.schema[key]["properties"][key]["ui"]["resourceName"];
                record["resourceType"] = this.schema[key]["properties"][key]["ui"]["widget"];
                break;
            }
        }
        console.log("========111");
        console.log(JSON.stringify(record));
        this.add(record);
    }

    deleteItem(recordKey){
        let tempData:any[] = [];
        for(let i=0;i<this.data.length;i++){
            if(recordKey != this.data[i]["key"]){
                tempData.push(this.data[i]);
            }
        }

        let tempSchema:any = {};
        for(let key in this.schema){
            if(recordKey != key){
                tempSchema[key] = this.schema[key];
            }
        }

        this.data = tempData;
        this.schema = tempSchema;
        console.log(this.data);
        console.log(this.schema);

        let json = {
            "schema":this.schema,
            "data":this.data
        };
        this.dataJson = json;
    }


    mouseLeave(item){
        this.currentKey = "";
    }
    ngOnInit() {

        this.id = this.activatedRoute.snapshot.queryParams['id'];
        if(this.id != null) {
            this.backRouter = this.activatedRoute.snapshot.queryParams['backRouter'];
            this.http.get(environment.runtime_server_url + "/customer-page/init/" + this.id).subscribe((res: any) => {
                    if(res !=null){
                        this.schema = res.schema;
                        this.data = res.data;
                    }
            })
        }
    }


    show(item){
        if(this.currentKey == item.key+""){
            return true;
        }else{
            return false;
        }
    }

}
