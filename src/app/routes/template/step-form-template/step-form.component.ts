import {Component, AfterViewInit, ViewEncapsulation, Input, OnInit} from '@angular/core';
import { TransferService } from './transfer.service';
import {environment} from "@env/environment";
import {_HttpClient} from "@delon/theme";
import {UtilsService} from "../../../utils.Service";
import {EventService} from "@shared/event/event.service";
import {StepComponent} from "./step.component";
import {NzModalRef} from "ng-zorro-antd";

@Component({
  selector: 'app-step-form',
  templateUrl: './step-form.component.html',
  styleUrls: ['./step-form.component.less'],
  providers: [TransferService],
})
export class StepFormComponent implements OnInit {

    @Input()
    entity:string;
  constructor(private modal: NzModalRef,private eventService:EventService,public item: TransferService,protected http:_HttpClient) {}



    ngOnInit() {
        this.eventService.subscribe(this.setSearchTableValue,this);
      if(this.item.currentStep == 0){
          this.getServerData();
      }
  }

  setSearchTableValue(_event,_this){
      console.log("22222")
      if(_event.eventType == EventService.formValueSetType){
          _this.item.tempParams[_this.item.currentStep]["record1"][_event.paramName]= _event.value;

      }
  }
    /**
     * 获取服务器返回来的数据
     */
    getServerData(){
        this.http.get(environment.runtime_server_url+'/table/edit/'+this.entity).subscribe((res:any) =>{
            console.log("=====获取完数据"+res["formType"]);
            if(res["formType"] != 2){
                return;
            }
            console.log("=====获取完数据1111111");
            this.item = res["distributionFromStep"];
            this.item.currentStep = 0;



            this.item.components = [];
            this.item.params = new Array(this.item.childrens.length);
            this.item.tempParams = new Array(this.item.childrens.length);

            for(let i=0;i<this.item.childrens.length;i++){
                this.item.params[i] = {};
                this.item.tempParams[i] = {};
            }


            for(let i=0;i<this.item.childrens.length;i++){
                this.item.params[i]["record1"] = {};
                this.item.tempParams[i]["record1"] = {};
            }


            // this.item.params["record1"] ={} ;
            // this.item.params['tableData']={};
            // this.item.tempParams = {};
            // this.item.tempParams["record1"] ={} ;
            // this.item.tempParams['tableData']={};

            this.item.entity = this.entity;
            console.log("=====获取完数据222222");
           // this.fillDataIntoPopUpBox();


        });
    }


    // /**
    //  * 填充弹出框
    //  */
    // fillDataIntoPopUpBox(){
    //     switch (this.item.steps) {
    //         case 1:
    //             this.fillDataIntoForm(this.item.childrens[this.item.currentStep]);
    //             break;
    //     }
    // }

    prev() {

        console.log("111111");
        if(this.item.currentStep>0) {

            let flag:boolean = this.validate();
            if(!flag){
                return;
            }

            --this.item.currentStep;
            let tempParamsStr = JSON.parse(JSON.stringify(this.item.tempParams));
            this.item.params = tempParamsStr;

        }
    }
    next() {
        console.log("2221111");

        let flag:boolean = this.validate();
        if(!flag){
            return;
        }
        // if(stepComponent.sf2! = null && !stepComponent.sf2.valid){
        //     return;
        // }

        ++this.item.currentStep;
        let tempParamsStr = JSON.parse(JSON.stringify(this.item.tempParams));
        this.item.params = tempParamsStr;

    }

    save(){
        console.log(this.item.tempParams)
        let param = {data:[this.item.tempParams]};
        this.http.post(environment.common_crud_url+"/"+this.entity,param).subscribe((res:any)=>{
            this.modal.close(true);
            this.modal.destroy();
        },(res:any)=>{

        })
        console.log();
    }


    validate(){
        let stepComponent:StepComponent = this.item.components[this.item.currentStep];
        let required:any[] = stepComponent.sf1.schema.required;
        let flag:boolean = true;
        for(let i=0;i<required.length;i++){
            let itemValue =this.item.tempParams[this.item.currentStep]["record1"][required[i]];
            if(itemValue == undefined || itemValue == "" ){
                flag = false;
                break;
            }
        }

        if(!flag){
            return flag;
        }

        if(stepComponent.sf2! = null){
            let stepComponent:StepComponent = this.item.components[this.item.currentStep];
            let required:any[] = stepComponent.sf1.schema.required;
            let flag:boolean = true;
            for(let i=0;i<required.length;i++){
                let itemValue =this.item.tempParams[this.item.currentStep]["record2"][required[i]];
                if(itemValue == undefined || itemValue == "" ){
                    flag = false;
                    break;
                }
            }
        }
        return flag;
    }

}
