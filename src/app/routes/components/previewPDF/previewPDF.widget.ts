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
    OnDestroy,
    Inject
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
import {DomSanitizer} from '@angular/platform-browser';
import {HttpHeaders} from '@angular/common/http';
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {resolve} from 'url';
import {timer} from "rxjs";

@Component({
    selector: 'preview-pdf',
    template: `
        <nz-card>
            <div style="display:flex;" class="modal">
                <iframe style="width:200%;" frameborder="false" class="preview"></iframe>
            </div>
        </nz-card>
    `, styles: [
        `
            .modal {
                width: 100%;
                height: 500px;
                background-color: white;
            }
        `
    ]

})
export class PreviewPdfWidget extends ControlWidget implements OnInit, OnDestroy {

    static readonly KEY = 'previewPDF';

    constructor(
        private message: NzMessageService,
        private http: _HttpClient,
        private zone: NgZone,
        cd: ChangeDetectorRef,
        injector: Injector,
        sfItemComp: SFItemComponent,
        sfComp: SFComponent,
        private sanitizer: DomSanitizer,
        @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService
    ) {
        super(cd, injector, sfItemComp, sfComp);
    };

    pdfUrl: any;
    timer: any;

    closeModal(_event, _this) {

    }

    ngOnDestroy() {
        clearInterval(this.timer)
    }


    addHeader(url: string) {
        console.log(url)
        // let url = this.ui.pdfUrl
        // let token = this.tokenService.get().token
        // var xhr = new XMLHttpRequest();
        // xhr.open('GET', url);
        // xhr.onreadystatechange = handler;
        // xhr.responseType = 'blob';
        // xhr.setRequestHeader('token', token);
        // xhr.send();
        // console.error(456789)
        this.http.get(url, {},{
            responseType: 'blob'
        }).subscribe((data:any) => {
            const blobData = new Blob([data], {type: 'application/pdf;'})
            var data_url = URL.createObjectURL(blobData);
            let iframe = document.querySelector('.preview')
            iframe['src'] = data_url;
        })

    }

    ngOnInit() {
        // let url ='https://www.gjtool.cn/pdfh5/git.pdf'
        this.timer = setInterval(() => {
            if (this.value) {
                clearInterval(this.timer)
                // let iframe = document.querySelector('.preview')
                // iframe.src = this.value
                // let iframe = document.querySelector('.preview')
                // iframe['src'] = "http://127.0.0.1:8090/cis/busi/voucher_para_manage/getPdf?url=" + this.value
                this.addHeader(environment.gateway_server_url+"/hall/busi/publish/resource/preview?url=" + this.value);
            }
        }, 200)
    }

}
