import {Component, Input, ViewChild} from '@angular/core';
import {NzDrawerRef, NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
@Component({
  selector: `app-customer-modal`,
    template: `
        <sf #sf [schema]="detailSchema" [formData]="record" button="none" >
        </sf>`,
})
export class CustomerDrawerTemplate {
    @Input()
    record:any;
    id:string = "";
    modalId:string = "";
    detailSchema:any = {
        properties: {
            id: {
                type: "string",
                title: "id",
                maxLength: 32
            }}
    };
    @ViewChild('sf',{ static: false })
    sf:SFComponent;
    constructor(private ref: NzDrawerRef,protected http:_HttpClient) {}

    save(value:any) {
        console.log(JSON.stringify(value));
        this.ref.close(`new time: ${+new Date()}`);
        this.close();
    }

    genForm(){
        let url = environment.runtime_server_url+'/table/customer/'+this.id+'?option='+this.modalId;
        this.http.get(url).subscribe((res:any) =>{

            let properties = {};
            for(let object of res["editField"]){
                let data = object["config"];
                let key = object["key"]
                data["readOnly"] = true;
                if(data["ui"]!= null ){
                    let ui = data["ui"];
                    if(ui["widget"] == "upload"){
                        data["enum"] = [{"name":this.record[ui["fileName"]],"status":"done","url":this.record[key],"response":{"uid":1}}];
                    }
                    if(ui["asyncData"]!=null){
                        let uri:string = ui["asyncData"];
                        let mate = ui["mate"];
                        let param = ui["params"];
                        if(!uri.startsWith("http")){
                            uri = environment.common_crud_url+uri;
                        }
                        ui["asyncData"] = ()=>this.http.get<SFSchemaEnumType[]>(uri,{mate:JSON.stringify(mate),params:param});

                    }
                    data["ui"] = ui;
                }
                properties[key] = data;
            }
            this.detailSchema = {properties:properties,ui:{
                    spanLabel:7,
                    spanControl:17
                }};
        })
    }
    close() {
        this.ref.close();
    }
    ngOnInit(){
        console.log(JSON.stringify(this.record));
        this.id = this.record.__entity;
        this.modalId = this.record.__modalId;
        // this.http.get(environment.common_crud_url+"/"+this.id+"/"+this.record["__id"]).subscribe((res:any)=>{
        //     this.record = res;
            this.genForm();
        // })
    }
}
