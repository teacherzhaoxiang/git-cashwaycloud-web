import {Component, Input, ViewChild} from '@angular/core';
import {NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
@Component({
    selector: `app-customer-page-add-modal`,
    template: `
        <sf #sf mode="edit" [schema]="editSchema" [formData]="record" (formSubmit)="save()"></sf>`,
})
export class CustomerPageAddModalComponent {
    @Input()
    record:any = {};
    type1:any;
    editSchema:any = {
        properties:{
            name:{type:"string",title:"名称"},
            left:{type:"integer",title:"起点横坐标"},
            top:{type:"integer",title:"起点纵坐标"},
            width:{type:"integer",title:"宽"},
            height:{type:"integer",title:"高"},

            resourceType:{type:"string",title:"样式类型",enum:[
                    { label: '图片', value: 'image' },
                    { label: '走马灯', value: 'carousel' },
                    { label: '视频', value: 'video' },],ui: {widget: 'select',change:(value)=>{
                       this.sf.value.resourceType = value;
                       this.record= this.sf.value;
                       this.sf.refreshSchema();
                    }
                }
            },

            resourceName: {
                type: "string", title: "样式名称",
                // enum:[{label:"11",value:"7d6b2fcf945540508e0095a14e84c0c6"}],
                ui: {
                    widget: 'select',

                    asyncData: () => this.http.get<SFSchemaEnumType[]>(
                        environment.gateway_server_url + "/hall/busi/publish/style/getByType?type=" + this.sf.value.resourceType)
                }
            }

        }
    };

    @ViewChild('sf',{ static: false })
    sf:SFComponent;
    constructor(private modal: NzModalRef,protected http:_HttpClient) {}

    save() {

        if(this.record.namespace == null){
            this.sf.value.namespace = new Date().getTime();
        }

        this.modal.close(this.sf.value);
        this.close();
    }
    close() {
        this.modal.destroy();
    }
    ngOnInit(){
        console.log(JSON.stringify(this.record));
    }


}
