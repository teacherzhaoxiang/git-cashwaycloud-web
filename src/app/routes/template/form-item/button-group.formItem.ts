import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {ControlWidget, SFComponent, SFItemComponent} from "@delon/form";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";
import {ModuleResetComponent} from "../../components/module-reset/module.reset";
import {NzModalRef, NzModalService} from "ng-zorro-antd";
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
    selector: 'button-group-formItem',
    template: `
        <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
            <div *ngFor="let option of options;" style="width: 24px;height: 24px;border-radius: 12px;list-style:none;float: left;margin-left: 4px;margin-right:4px">
                <img src="{{ option.src }}" style="width: 100%;height: 100%" title="{{option.title}}" (click)="remoteControllerClick(option)">
            </div>
        </sf-item-wrap>
    `,
    styles  : []
})
export class ButtonGroupFormItemWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'button-group';
    options:any[] = [];
    confirmModal: NzModalRef;
    constructor(
      private http: _HttpClient,
      cd: ChangeDetectorRef,
      injector: Injector,
      sfItemComp: SFItemComponent ,
      sfComp: SFComponent,
      private modalService: NzModalService,
      private message: NzMessageService
    ) {
        super(cd,injector,sfItemComp,sfComp);
    };
    ngOnInit(): void {
        this.options = this.ui.options;
    }

    reset(value:any){

    }

    remoteControllerClick(option:any): void {
        if(option.type == 'confirm') {
            this.confirmModal = this.modalService.confirm({
                nzTitle: option.title,
                nzContent: "是否确认对设备："+this.sfComp.formData["term_no"]+"发起远程指令：" + option.title,
                nzOnOk: () => {
                    this.sendRemote(option,"");
                }
            });
        }else if(option.type == 'modal'){
            const modal = this.modalService.create({
                nzTitle: '选择模块',
                nzContent: ModuleResetComponent,
                nzWidth:400,
                nzClosable:false,
                nzFooter:null,
            });
            modal.afterClose.subscribe((result:any)=>{
                this.sendRemote(option,result["module"]);
            })

        }
    }

    sendRemote(option:any,addData:any){
        console.log("发起远程指令")
        console.log(addData)
        let sendBody = {};
        let currDate = new Date();
        sendBody["name"] = option.title+"-"+this.sfComp.formData["term_no"]+"-"+Date.now();
        sendBody["type"] = "2";
        sendBody["distributionType"] = "1";
        sendBody["distributionId"] = this.sfComp.formData["term_no"];
        sendBody["commandCode"] = option.id;
        sendBody["addData"] = addData;
        sendBody["create_time"] = currDate;
        this.http.put(environment.gateway_server_url+"/cis/busi/monitorCommandTask/execute",{data:[sendBody],mateRules:{}}).subscribe((res:any)=>{

          this.message.success(option.title + ":" +res.msg);
        })

    }
}
