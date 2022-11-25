import {ChangeDetectorRef, Component, Input, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {ControlWidget, SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
import {SfComponent} from "../../components/sf.component";
let TIMEOUT = null;
let TIMEOUT2 = null;
@Component({
    selector: `audit-modal`,
    template: `
        <div class="edit_box" drag>
            <div class="topper">
                <div class="title">审批详情</div>
                <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
            </div>
            <div (mousedown)="$event.stopPropagation()">
                <div nz-row class="edit_content">
                    <nz-col nzSpan="24">
                        <my-sf #sf mode="edit" [initUri]="initUri" [auditBefore]="auditBefore" [auditAfter]="auditAfter" [auditFlag]="auditFlag" [auditReadOnly]="true"  [buttonVisible]="false"  [class]="classStyle" [required]="required" [formData]="initRecord" button="none">
                        </my-sf>
                    </nz-col>
                </div>
            </div>
            <div class="modal-footer">
                <button nz-button type="button"  (click)="close()" class="closeBtn">关闭</button>
                <button nz-button [nzLoading]="loading" type="submit" *ngIf="status==true" (click)="auditData(true)" style="color: #FFFFFF;background: #1890ff" >通过</button>
                <button nz-button [nzLoading]="loading2" type="submit" *ngIf="status==true" (click)="auditData(false)" style="color: red;border: 1px solid red;" >拒绝</button>
            </div>
        </div>
    `,
    styles:[
        `
            :host ::ng-deep  .ant-table table{
                table-layout: fixed;
                width: 100%;
                text-align: left;
                border-radius: 4px 4px 0 0;
                border-collapse: separate;
                border-spacing: 0;
            }
            :host ::ng-deep input:disabled{
                background: #fff;
            }

            :host ::ng-deep .ng-star-inserted{
                margin-bottom: 2px;
            }
            :host ::ng-deep .ant-form-item{
                margin-bottom: 2px;
            }
            
            .edit_box{
                background: #FFFFFF;
                width: 800px;
                /*position: fixed !important;*/
                z-index: 999999999999;
                border-radius: 6px;
                /*margin-left: -400px;*/
                /*left: 50%;*/
            }
            .edit_box .topper{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                color: rgba(0, 0, 0, 0.85);
                font-weight: 500;
                font-size: 16px;
                border-bottom: 1px solid #ececec;
            }
            .edit_box .topper .closer{
                cursor: pointer;
            }
            .edit_box .edit_content{
                padding: 20px 40px;
                max-height: 400px;
                overflow-y: scroll;
            }
            .modal-footer{
                margin: 0;
                padding: 20px 24px;
            }
            :host ::ng-deep sf-item{
                width: 100% !important;
            }
            .closeBtn{
                border: 1px solid #1890ff;color: #1890ff
            }
`]
})
export class AuditModalTemplate{
    loading = false;
    loading2 = false;
    static readonly KEY = 'audit';
    @Input()
    record: any;

    status:boolean;
    initRecord:any;

    auditFlag:boolean=true;

    @Input()
    initUri:string;
    @ViewChild('sf',{ static: false })
    sf: SfComponent;
    classStyle:any=[];
    required:boolean=false;

    @Input()
    showAudit:boolean=true;

    @Input()
    auditBefore="";
    @Input()
    auditAfter="";
    @Input()
    agreeUrl="";
    @Input()
    noAgreeUrl="";

    id = '';
    targetTableName="";
    newrecord = {};
    targetKey ="";
    constructor(private modal: NzModalRef, private message: NzMessageService,protected http: _HttpClient) {

    }

    ngOnInit() {
        console.log("-----------232323");
        console.log(this.record);
        //debugger;
        // this.entityName = this.record.__entity;
        // this.modalId = this.record.__modalId;
        // this.id = this.record.id;
        // this.modalObject = this.record.__modal;
        // this.buttons = this.modalObject['buttons']
        // /**
        //  * 获取表格
        //  */
        this.id = this.record['entity'];
        this.targetTableName = this.record['targetTableName'];
        this.targetKey = this.record['targetKey'];
        this.getForm();
    }


    getForm() {

        this.http.get(environment.runtime_server_url + '/table/edit/' + this.id).subscribe((res: any) => {
            this.initUri = res.initUri;
            let url;
            if (this.initUri != null && this.initUri != '') {
                url = environment.gateway_server_url + this.initUri + '/' + this.record['id'];
            } else {
                url = environment.common_crud_url + '/' + this.id + '/' + this.record['id'];
            }
            this.http.get(url).subscribe((res1: any) => {
                this.record = res1;
                let oldDataStr = this.record['old_record'];
                let oldData = JSON.parse(oldDataStr);
                for(let key in oldData){
                    let newKey = key.replace(/([A-Z])/g,"_$1").toLowerCase();
                    this.newrecord[newKey] = oldData[key];
                }
                delete this.record['old_record'];
                this.getFormHandle(res);
            });
        });
    }

    getFormHandle(res){
        //拒绝和通过按钮的隐藏显示
        if(this.record.status == 0 && this.showAudit==true){
            this.status = true;
        }else{
            this.status = false;
        }
        this.initUri = environment.runtime_server_url + '/table/edit/' + this.id;
        this.initRecord = this.record ;



        for(let str in this.newrecord){
            this.initRecord[str+"_copy"]= this.record[str];
            this.initRecord[str]= this.newrecord[str];
            if(this.initRecord[str] != this.initRecord[str+"_copy"]){
                this.classStyle[str] = 'modify-item-red'
                this.classStyle[str+"_copy"] = 'modify-item'
            }
        }
        //格式化date和time
        for (let object of res.editField) {
            res.editField['disabled'] = false;
            let config = object['config'];
            let key = object['key'];
            let ui = config['ui'];
            let value:string = this.record[key];
            if(ui!=null && ui['widget']=="date"){
                if(value.indexOf("/")>0){
                    value = value.replace("/","-").replace("/","-");
                }
            }
            if(ui!=null && ui['widget']=="time"){
                if(value.indexOf("/")>0){
                    value = value.split(" ")[1];
                }
            }
            this.initRecord[key] = value;
        }


        this.sf.initUri = this.initUri;
        this.sf.buttonVisible = false;
        this.sf.class= this.classStyle;
        this.sf.required = this.required;
        this.sf.formData = this.initRecord;
        this.sf.ngOnInit();
    }



    close() {
        this.modal.destroy();
    }

    auditData(flag){
        let url = "";

        if(flag){
            url = this.agreeUrl;
            this.loading = true;
            TIMEOUT = setTimeout(() => {
                this.loading = false;
                clearTimeout(TIMEOUT);
            }, 5000);
        }else {
            url = this.noAgreeUrl;
            this.loading2 = true;
            TIMEOUT = setTimeout(() => {
                this.loading2 = false;
                clearTimeout(TIMEOUT);
            }, 5000);
        }

        url = url.replace("{{id}}",this.record['id_copy']);
        this.http.put(environment.gateway_server_url + url ).subscribe((res: any) => {
            this.modal.close(true);
            this.close();
        }, (res: any) => {

        },()=>{
            if(flag){
                this.loading = false;
                clearTimeout(TIMEOUT);
            }else {
                this.loading2 = false;
                clearTimeout(TIMEOUT);
            }
        });
    }

}
