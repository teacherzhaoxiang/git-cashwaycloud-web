import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
import {_HttpClient} from "@delon/theme";

@Component({
    selector: 'module-reset-item',
    template: `
        <sf #sf mode="edit" [schema]="schema" button="none">
        </sf>
        <div class="modal-footer">
            <button nz-button type="button" (click)="close()">关闭</button>
            <button nz-button type="submit" (click)="save()" [disabled]="!sf.valid">保存</button>
        </div>
  `
})
export class ModuleResetComponent implements OnInit {
    @ViewChild('sf',{ static: false })
    sf:SFComponent;
    schema: any = {
        properties: {
            module: {type: "string",title: "模块",
                enum:[
                    {
                        "label": "机芯",
                        "value": "01"
                    },
                    {
                        "label": "读卡器",
                        "value": "02"
                    },
                    {
                        "label": "密码键盘",
                        "value": "03"
                    },
                    {
                        "label": "凭条打印机",
                        "value": "04"
                    },
                    {
                        "label": "流水打印机",
                        "value": "05"
                    }
                ],
                ui: {
                    widget: 'select',
                }},
            }
    }
    ngOnInit(): void {

    }

    close() {
        this.modal.close();
    }

    save(){
        this.modal.close(this.sf.value);
    }
    constructor(private modal: NzModalRef, ){}
}
