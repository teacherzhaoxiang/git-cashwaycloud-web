import {Component, Input, ViewChild} from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent} from "@delon/form";
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: `image-message-detail-modal`,
    template: `
        <div class="edit_box" drag style="background: #ffffff">
            <div class="topper">
                <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
            </div>
            <div class="edit_content">
                <img style="width: 500px;height:500px;" [src]=imageSrc *ngIf="fileType == 'image'">    
                <iframe [src]=imageSrc *ngIf="fileType == 'office'"  width='100%' height='800px' frameborder='1'></iframe>
            </div>
        </div>
    `,
    styles:[
        `    .edit_box{
            background: #FFFFFF;
            height:800px;
            width: 800px;
            /*position: fixed !important;*/
            z-index: 999999999999;
            border-radius: 6px;
            /*margin-left: -400px;*/
            /*left: 50%;*/
        }
        .edit_box .topper{
            display: flex;
            justify-content: flex-end;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            font-size: 16px;
            border-bottom: 1px solid #ececec;
        }
        .edit_box .topper .closer{
            margin-right: 10px;
            font-size: 24px;
            cursor: pointer;
        }
        .edit_box .edit_content{
            padding: 20px 40px;
            max-height: 600px;
            overflow-y: scroll;
            display: flex;
            justify-content: center;
        }
            :host ::ng-deep .modal-footer .ant-btn-default[type='button']{
                border: 1px solid #1890ff;
                color: #1890ff
            }
            :host ::ng-deep .modal-footer .ant-btn-default[type='submit']{
                background:  #1890ff;
                color: #fff;
            }
            :host ::ng-deep .modal-footer .ant-btn-default[type='submit'] span{
                color: #fff;
            }
            :host ::ng-deep .modal-footer .ant-btn:disabled{
                color: rgba(0, 0, 0, 0.25) !important;
                background-color: #f5f5f5;
                border: 1px solid #d9d9d9 !important;
            }
            :host ::ng-deep .table .ng-star-inserted{
                text-align: center;
            }
            :host ::ng-deep .ng-star-inserted a{
                white-space: nowrap
            }
            :host ::ng-deep .ant-modal-close{
                display: none !important;
            }
            ant-upload-list-item-info{
                display:none;
            }
            :host ::ng-deep .ng-star-inserted img[src*='download']{
                display: inline-block !important;
            }
            :host ::ng-deep .ng-star-inserted img{
                display: none;
            }
            .ant-card {
                height: 100%;
                background: #eef9fe;
            }

            :host ::ng-deep .ng-star-inserted img[src*='download']{
                display: inline-block !important;
            }
            :host ::ng-deep .ng-star-inserted img{
                display: none;
            }
        `
    ]
})
export class ImageMessageModalComponent {
    @Input()
    imageSrc:any;
    @Input()
    record:any;
    flag : boolean = true;

    @ViewChild('sf',{ static: false })
    sf:SFComponent;
    constructor(private modal: NzModalRef,protected http:_HttpClient,private modalService: NzModalService,private sanitizer: DomSanitizer) {}


    close() {
        this.modal.destroy();
    }

    fileType:string
    judgeFileType(){
        let arr = this.imageSrc.split('.')
        if(arr[arr.length-1] == 'docx' || 'doc'){
            console.log(arr[arr.length -1])
            this.fileType = 'office'
            console.log('https://view.officeapps.live.com/op/view.aspx?src=' + this.imageSrc,'链接')
            this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl('https://view.officeapps.live.com/op/view.aspx?src=' + this.imageSrc)
            console.log(this.fileType)
        }else{
            this.fileType == 'image'
        }
    }
    ngOnInit(){
        console.log(this.record,this.imageSrc,'参数')
        this.judgeFileType()
        // setInterval(()=>{
        //     if (this.flag){
        //         this.modal.destroy();
        //     }
        //
        // },1000);
    }
}
