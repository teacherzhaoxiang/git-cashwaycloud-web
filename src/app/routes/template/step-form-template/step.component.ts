import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransferService } from './transfer.service';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {NzModalRef, NzTreeNode} from "ng-zorro-antd";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
    styles:[
        `
           :host ::ng-deep .ant-form{
               max-width: none;
           }
        `
    ]
})
export class StepComponent implements OnInit {

    params:any;


    formColumns:number;
    @Input()
    record1:any = {};
    @Input()
    record2:any = {};

    @Input()
    public entity: string;
    @Input()
    public transferServiceData:TransferService;




    editSchema1:any = {};
    editSchema2:any = {};
    @ViewChild('sf1',{ static: false })
    sf1:SFComponent;
    @ViewChild('sf2',{ static: false })
    sf2:SFComponent;
    mateRule:any = {};

    constructor(private modal: NzModalRef,protected http:_HttpClient,) {}



    /**
     * 填充form表单
     */
    fillDataIntoForm(){

         this.http.get(environment.runtime_server_url+'/table/edit/'+this.transferServiceData.childrens[this.transferServiceData.currentStep]["childrenPath"]).subscribe((data:any) =>{

            console.log("====fillDataIntoForm=========")
            this.formColumns = data["columns"];
            let properties1 = {};
            let properties2 = {};
            let required1 = [];
            let required2 = [];
            let flag = true;
            for(let object of data["editField"]){
                let display = object["display"];
                if(display!=null && display == "none"){
                    continue;
                }
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
                    console.log(ui);
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




    formChange(){
        console.log("=======formChange======");
        if(this.sf1 != undefined && this.transferServiceData != undefined) {
           this.transferServiceData.tempParams[this.transferServiceData.currentStep]["record1"] = this.sf1.value;
        }
    }

    ngOnInit(){
        console.log("=======step");
        this.fillDataIntoForm();
        this.transferServiceData.components[this.transferServiceData.currentStep] = this;
    }
}
