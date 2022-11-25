import {ChangeDetectorRef, Component, Input, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {ControlWidget, SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
import {SfComponent} from "../../components/sf.component";
let TIMEOUT = null;
let TIMEOUT2 = null;
@Component({
    selector: `modify-check-modal`,
    template: `
        <div class="edit_box" drag>
            <div class="topper">
                <div class="title">审批详情</div>
                <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
            </div>
            <div (mousedown)="$event.stopPropagation()">
                <div nz-row class="edit_content">
                    <nz-col nzSpan="24">
                        <my-sf #sf mode="edit" [initUri]="initUri" [auditFlag]="auditFlag" [auditReadOnly]="true"  [buttonVisible]="false"  [class]="classStyle" [required]="required" [formData]="initRecord" button="none">
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
                max-height: 600px;
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
export class ModifyCheckModalTemplate{
    loading = false;
    loading2 = false;
    static readonly KEY = 'modify-check';
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



    constructor(private modal: NzModalRef, private message: NzMessageService,protected http: _HttpClient) {

    }

    ngOnInit() {

        /**
         * 获取表格
         */
        this.getForm();
    }
    getForm(){
        console.log('===11212==');
        this.http.get(environment.runtime_server_url + '/table/edit/' + this.record['entity']).subscribe((res: any) => {
            //拒绝和通过按钮的隐藏显示
            if(this.record.status == 0 && this.showAudit==true){
                this.status = true;
            }else{
                this.status = false;
            }
            this.initUri = environment.runtime_server_url + '/table/edit/' + this.record.entity;
            //res.editField;
            //提交的数据
            let body_str:string = this.record['body_str'];
            if(this.record['option_id']=='other' ){
                let toLowerCaseStr = this.record['object_data'];
                this.initRecord = JSON.parse(toLowerCaseStr)[0];
                this.sf.initUri = this.initUri;
                this.sf.buttonVisible = false;
                this.sf.class= this.classStyle;
                this.sf.required = this.required;
                this.sf.formData = this.initRecord;
                this.auditFlag = false;
                this.sf.ngOnInit();
                return;
            }else if( this.record['option_id']=='add'){
                this.sf.initUri = this.initUri;
                this.sf.buttonVisible = false;
                this.sf.class= this.classStyle;
                this.sf.required = this.required;
                this.sf.formData = JSON.parse(body_str)['data'][0];
                this.auditFlag = false;
                this.sf.ngOnInit();
                return;
            }else{
                this.initRecord = JSON.parse(body_str)['data'][0];
            }

            //格式化date和time
            for (let object of res.editField) {
                res.editField['disabled'] = false;
                let config = object['config'];
                let key = object['key'];
                let ui = config['ui'];
                let value:string = this.initRecord[key];
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



            let toLowerCaseStr = this.record['object_data'];
            //编辑
            if(toLowerCaseStr !=null){
                let original:any = JSON.parse(toLowerCaseStr)[0];
                for(let str in original){
                    this.initRecord[str+"_copy"]= original[str];
                    if(original[str] != this.initRecord[str]){
                        this.classStyle[str] = 'modify-item'
                        this.classStyle[str+"_copy"] = 'modify-item-red'
                    }
                }
            }

            this.sf.initUri = this.initUri;
            this.sf.buttonVisible = false;
            this.sf.class= this.classStyle;
            this.sf.required = this.required;
            this.sf.formData = this.initRecord;
            this.sf.ngOnInit();
            // this.sf.refreshSchema();
            // this.cd.markForCheck();
            // this.cd.detectChanges();
        });
    }



    close() {
        this.modal.destroy();
    }

    auditData(flag){
        if(flag){
            this.loading = true;
            TIMEOUT = setTimeout(() => {
                this.loading = false;
                clearTimeout(TIMEOUT);
            }, 5000);
        }else {
            this.loading2 = true;
            TIMEOUT = setTimeout(() => {
                this.loading2 = false;
                clearTimeout(TIMEOUT);
            }, 5000);
        }
        this.http.put(environment.manage_server_url + '/rest/approve/one/' + this.record['id'] + '?flag=' +flag ).subscribe((res: any) => {
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
