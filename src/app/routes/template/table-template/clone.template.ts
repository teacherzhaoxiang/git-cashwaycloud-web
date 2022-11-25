import {Component, Input, ViewChild} from '@angular/core';
import {NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
@Component({
    selector: `app-table-clone-modal`,
    template: `
        <div class="modal-header">
            <div class="modal-title">复制</div>
        </div>
        <div nz-row>
            <nz-col nzSpan="24" >
                <sf #sf  mode="edit" [schema]="editSchema" [formData]="record" button="none">
                </sf>
            </nz-col>
        </div>

        <div class="modal-footer" >
            <button nz-button type="button" (click)="close()">关闭</button>
            <button nz-button type="submit" (click)="save1(sf.value)" [disabled]="!sf.valid">保存</button>
        </div>`,
})
export class TableCloneModalComponent {

    @Input()
    record: any;
    editSchema: any = {properties: {}};
    id: string = "";
    @ViewChild('sf',{ static: false })
    sf: SFComponent;


    constructor(private modal: NzModalRef, protected http: _HttpClient) {
    }

    mateRule: any = {};


    save1(value1: Map<string, any>) {
        console.log("edit.template.ts save");
        let param = {data:[value1],mateRule:this.mateRule};
        console.log(param);
        this.http.post(environment.common_crud_url + "/" + this.id, param).subscribe((res: any) => {
            this.modal.close(true);
            this.close();
        }, (res: any) => {

        })
    }

    keyList1: Array<string> = [];
    keyList2: Array<string> = [];

    getForm() {

        this.http.get(environment.runtime_server_url + '/table/edit/' + this.id).subscribe((res: any) => {

            let properties = {};
            let required = [];
            for (let object of res["editField"]) {
                let data = object["config"];
                let key = object["key"];
                let requiredString = object["required"];
                if (data["ui"] != null) {
                    let ui = data["ui"];

                    if(ui["widget"] == "upload"){
                        data["enum"] = [{"name":this.record[ui["fileName"]],"status":"done","url":this.record[key],"response":this.record[key]}];
                    }

                    if (ui["asyncData"] != null && ui["mate"] != null) {
                        let uri: string = ui["asyncData"];
                        let mate = ui["mate"];
                        let param = ui["params"];
                        if (!uri.startsWith("http")) {
                            uri = environment.common_crud_url + uri;
                        }
                        ui["asyncData"] = () => this.http.get<SFSchemaEnumType[]>(uri, {
                            mate: JSON.stringify(mate),
                            params: param
                        });

                    }

                    if(ui["action"] != null){
                        ui["action"] = environment.file_server_url+ui["action"];
                    }

                    if (ui["displayWith"] != null) {
                        let display = ui["displayWith"];
                        ui["displayWith"] = (node: NzTreeNode) => node[display];
                    }



                    data["ui"] = ui;
                }


                if(data["type"] != null && data["type"] == "object"){
                    let properties = data["properties"];
                    for(let key1 in properties){
                        console.log(key1);
                        console.log(properties[key1]);
                        if(properties[key1]["ui"]["action"]!=null){
                            this.http.get(environment.hall_manager_server_url+properties[key1]["ui"]["action"]).subscribe((res:any) =>{
                                console.log(res)
                                properties[key1]["enum"] =res
                                this.sf.refreshSchema();
                            });

                        }
                    }

                }

                console.log("items----->");
                //扩展
                if (data["items"]) {
                    let items = data["items"];
                    console.log("items----->");
                    let properties = items["properties"];
                    if (properties) {
                        //遍历key value
                        for (let key1 in properties){
                            let label=properties[key1];
                            if (label){
                                let ui = label["ui"];
                                if (ui["asyncData"] != null && ui["mate"] != null) {
                                    let uri: string = ui["asyncData"];
                                    let mate = ui["mate"];
                                    let param = ui["params"];
                                    if (!uri.startsWith("http")) {
                                        uri = environment.common_crud_url + uri;
                                    }
                                    ui["asyncData"] = () => this.http.get<SFSchemaEnumType[]>(uri, {
                                        mate: JSON.stringify(mate),
                                        params: param
                                    });
                                }
                                if (ui["displayWith"] != null) {
                                    let display = ui["displayWith"];
                                    ui["displayWith"] = (node: NzTreeNode) => node[display];
                                }
                                label["ui"] = ui;
                            }
                        }


                    }
                }


                properties[key] = data;
                if (requiredString) {
                    required.push(key);
                }

            }
            let ui = JSON.parse(res.ui);
            if(ui == null){
                ui = {
                    spanLabel:2,
                    spanControl:21
                }
            }
            this.editSchema = {properties:properties,ui:ui,required:required};
        })
    }


    close() {
        this.modal.destroy();
    }



    ngOnInit() {
        console.log(JSON.stringify(this.record));
        this.id = this.record.__entity
        this.http.get(environment.common_crud_url + "/" + this.id + "/" + this.record["id"]).subscribe((res: any) => {

            if (res.modules_detail){
                console.log(res.modules_detail);
                if (!res.modules_detail.startsWith('[')){
                    res.modules_detail=JSON.parse('['+res.modules_detail+']');
                }else{
                    res.modules_detail=JSON.parse(res.modules_detail);
                }
            }

            if(res["type"] != null && res[res["type"]] != undefined){

                res[res["type"]] = JSON.parse(res[res["type"]]);

                if(res["type"] == "image"){
                    delete res["video"];
                    delete res["carousel"];
                }
                if(res["type"] == "video"){
                    delete res["image"];
                    delete res["carousel"];
                }
                if(res["type"] == "carousel"){
                    delete res["video"];
                    delete res["image"];
                }

            }

            delete res["id"];
            console.log(this.modal);
            console.log("==========1");
            console.log(res);
            let obj = {};
            for(let key in this.record.__columns){
                obj[this.record.__columns[key]]=res[this.record.__columns[key]];
            }
            this.record = obj;
            this.getForm();
        })
    }

}
