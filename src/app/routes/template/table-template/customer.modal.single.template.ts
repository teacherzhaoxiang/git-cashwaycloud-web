import {Component, Input, ViewChild} from '@angular/core';
import {NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
@Component({
  selector: `app-customer-modal`,
  template: `
    <div class="modal-header">
      <div class="modal-title">{{name}}</div>
    </div>
    <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none" >

    </sf>
    <div class="modal-footer">
        <button nz-button type="button" (click)="close()">关闭</button>
<!--        <button nz-button type="submit" (click)="save(sf.value)" [disabled]="!sf.valid" >保存</button>-->
    </div>`,
})
export class CustomerModalSingleTemplate {
  @Input()
  record:any;
  editSchema:any = {properties:{}};
  @ViewChild('sf',{ static: false })
  sf:SFComponent;
  name:any = "新窗口";
  id:string = "";
  modalId : string = "";
  constructor(private modal: NzModalRef,protected http:_HttpClient) {}
    mateRule:any = {};
    save(value) {
        let param = {data:value,mateRule:this.mateRule};
        this.http.put(environment.common_crud_url+"/"+this.record.__entity+"/"+this.record.id,param).subscribe((res:any)=>{
            this.modal.close(true);
            this.close();
        },(res:any)=>{

        })
    }

  getForm() {
    let url = environment.runtime_server_url+'/table/customer/'+this.id+'?option='+this.modalId;
    console.log(url)
    this.http.get(url).subscribe((res:any) =>{
      this.name = res.name;
        let properties = {};
        let required = [];
        for(let object of res["editField"]){
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
            properties[key] = data;
            if(required){
                required.push(key);
            }

        }
        this.editSchema = {properties:properties,required:required};
  })
}
  close() {
    this.modal.destroy();
  }
  ngOnInit(){
    console.log(JSON.stringify(this.record));
    this.id = this.record.__entity;
    this.modalId = this.record.__modalId
    //   this.record = {
    //       cx:[{cxType:"0",cxState:"0",cxCount:"220","cxCurrency":"012","cxDeno":"100"},{cxType:"0",cxState:"0",cxCount:"220","cxCurrency":"012","cxDeno":"100"},{cxType:"0",cxState:"0",cxCount:"220","cxCurrency":"012","cxDeno":"100"},{cxType:"0",cxState:"0",cxCount:"220","cxCurrency":"012","cxDeno":"100"},{cxType:"0",cxState:"0",cxCount:"220","cxCurrency":"012","cxDeno":"100"},{cxType:"0",cxState:"0",cxCount:"220","cxCurrency":"012","cxDeno":"100"},{cxType:"0",cxState:"0",cxCount:"220","cxCurrency":"012","cxDeno":"100"},{cxType:"0",cxState:"0",cxCount:"220","cxCurrency":"012","cxDeno":"100"}],
    //       cardBox:[{cashBoxState:"0",cashBoxCount:"221"},{cashBoxState:"0",cashBoxCount:"221"},{cashBoxState:"0",cashBoxCount:"221"}],
    //       UKeyBox:[{UKeyBoxState:"0",UKeyBoxCount:"221"},{UKeyBoxState:"0",UKeyBoxCount:"221"}]
    // };

      this.getForm();
  }
}
