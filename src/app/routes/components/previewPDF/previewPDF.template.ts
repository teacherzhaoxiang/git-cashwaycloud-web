import {
    ChangeDetectorRef,
    Component,
    DoCheck,
    EventEmitter, Injector,
    Input,
    NgZone,
    OnInit,
    Output,
    ViewChild,
    OnDestroy
} from '@angular/core';
import {ControlWidget, SFComponent, SFItemComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {NzMessageService, NzModalRef, NzModalService, NzTreeNode} from "ng-zorro-antd";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";
import {TransferService} from "../../template/step-form-template/transfer.service";
import {STChange, STColumn, STColumnButton, STComponent, STData, STPage} from "@delon/abc";
import {ActivatedRoute, Params} from "@angular/router";
import {TableAddModalComponent} from "../../template/table-template/add.template";
import {TableEditModalComponent} from "../../template/table-template/edit.template";
import {TableDetailDrawerComponent} from "../../template/table-template/detail.template";
import {UtilsService} from "../../../utils.Service";
import {EventService} from "@shared/event/event.service";
import {TableCloneModalComponent} from "../../template/table-template/clone.template";
import {CustomerModalTemplate} from "../../template/table-template/customer.modal.template";
import {CustomerModalSingleTemplate} from "../../template/table-template/customer.modal.single.template";
import {CustomerModalStSfTemplate} from "../../template/table-template/customer.modal.st.sftemplate";
import {CustomerDrawerTemplate} from "../../template/table-template/customer.drawer.template";
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'preview-pdf',
    template: `
    <nz-card>
      <iframe style="width:100%;" [src]="pdfUrl"></iframe>
    </nz-card>
  `,styles:[
        `
           :host ::ng-deep .ant-select, .ant-cascader-picker{
               width:120px;
           }
        `
    ]

})
export class PreviewPdfComponent extends ControlWidget implements OnInit,OnDestroy{

    static readonly KEY = 'previewPDF';
    constructor(private message: NzMessageService,private http: _HttpClient,private zone:NgZone,cd: ChangeDetectorRef, injector: Injector,sfItemComp: SFItemComponent , sfComp: SFComponent , private sanitizer: DomSanitizer ) {
        super(cd,injector,sfItemComp,sfComp);
    };
    pdfUrl:any;
    closeModal(_event,_this){

    }
    ngOnDestroy(){

    }

    ngOnInit() {
        console.log(this)
        // let url = 'https://www.gjtool.cn/pdfh5/git.pdf'
        let url = this.ui.previewUrl
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
    }

}
