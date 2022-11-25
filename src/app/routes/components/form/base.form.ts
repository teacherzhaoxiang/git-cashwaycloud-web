import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {NzModalRef, NzTreeNode} from "ng-zorro-antd";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";
import {TransferService} from "../../template/step-form-template/transfer.service";

@Component({
  selector: 'base-form',
  templateUrl: './base.form.html',

})
export class BaseFormComponent implements OnInit {

    formColumns:number;
    params:any;

    @Input()
    record1:any = {};
    @Input()
    record2:any = {};

    @Input()
    public entity: string;

    @Input()
    serverData:any;

    @Input()
    transferServiceData:TransferService;

    editSchema1:any = {};
    editSchema2:any = {};
    @ViewChild('sf1',{ static: false })
    sf1:SFComponent;
    @ViewChild('sf2',{ static: false })
    sf2:SFComponent;
    constructor(private modal: NzModalRef,protected http:_HttpClient) {}
    mateRule:any = {};
    save(value1:Map<string,any>,value2:Map<string,any>) {
        let param = {data:[value1,value2],mateRule:this.mateRule};
        this.http.post(environment.common_crud_url+"/"+this.entity,param).subscribe((res:any)=>{
            this.modal.close(true);
            this.close();
        },(res:any)=>{

        })
    }




    /**
     * 填充form表单
     */
    fillDataIntoForm(){

        // if(this.record1 == undefined){
        //     this.record1 = {};
        // }
        //this.transferServiceData.params["record1"]=this.record1;
        //this.transferServiceData.params["record1"]["ss"]="222";
        this.http.get(environment.runtime_server_url+'/table/edit/'+this.entity+"?childrenPath="+this.serverData["childrenPath"]).subscribe((data:any) =>{
            let formType = data["formType"];
            if(formType != 1){
                console.log("退出"+formType)
                return;
            }else{
                console.log("进入"+formType)
            }

            console.log("====fillDataIntoForm=========")
            this.formColumns = data["columns"];
            let properties1 = {};
            let properties2 = {};
            let required1 = [];
            let required2 = [];
            let flag = true;
            for(let object of data["editField"]){
                let data = object["config"];
                let key = object["key"];
                let required = object["required"];
                if(data["ui"]!= null ){
                    let ui = data["ui"];
                    if(ui["asyncData"]!=null && ui["mate"]!=null){
                        let uri:string = ui["asyncData"];
                        let mate = ui["mate"];
                        let param = ui["params"];
                        if(!uri.startsWith("http")){
                            uri = environment.common_crud_url+uri;
                        }
                        ui["asyncData"] = ()=>this.http.get<SFSchemaEnumType[]>(uri,{mate:JSON.stringify(mate),params:param});

                    }
                    if(ui["displayWith"] != null){
                        let display = ui["displayWith"];
                        ui["displayWith"] = (node: NzTreeNode) => node[display];
                    }
                    data["ui"] = ui;
                }

                //单列
                if(this.formColumns ==1){
                    properties1[key] = data;
                    if(required){
                        required1.push(key);
                    }
                }else{
                    //2列
                    if(flag){
                        properties1[key] = data;
                        if(required){
                            required1.push(key);
                        }
                    }else {
                        properties2[key] = data;
                        if(required){
                            required2.push(key);
                        }
                    }
                    flag = !flag;
                }
            }
            if(this.formColumns ==1) {
                this.editSchema1 = {properties: properties1, required: required1};
            }else{
                this.editSchema1 = {properties: properties1, required: required1};
                this.editSchema2 = {properties: properties2,required:required2};
            }

            console.log("=====fillDataIntoForm end");
        });


    }
    close() {
        this.modal.destroy();
    }
    ngOnInit(){
       this.fillDataIntoForm();

    }

    formChange(){
        if(this.sf1 != undefined) {
            this.transferServiceData.tempParams[this.transferServiceData.currentStep]["record1"] = this.sf1.value;
        }
    }
    dd(){

    }
}
