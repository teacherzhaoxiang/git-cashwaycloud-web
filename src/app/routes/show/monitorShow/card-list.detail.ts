import {Component, Input, ViewChild} from '@angular/core';
import {NzModalRef, NzModalService, NzTreeNode} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
import Timer = NodeJS.Timer;
import {TerminalCheckTransferCustomItemComponent} from "../../components/terminal-table/terminal.table";
import {ModuleResetComponent} from "../../components/module-reset/module.reset";
@Component({
    selector: `app-monitor-detail-modal`,
    template: `
        <div (mouseenter) = "mouseEnter()" (mousemove) = "mouseEnter()" (mouseover)="mouseEnter()" (mouseleave)="mouseLeave()">
            <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none" ></sf>
            <div style="height: 30px; margin-left: -12px;margin-right: -12px">
                <div *ngFor="let option of options;" style="width: 24px;height: 24px;border-radius: 12px;list-style:none;float: left;margin-left: 4px;margin-right:4px">
                    <img src="{{ option.src }}" style="width: 100%;height: 100%" title="{{option.title}}" (click)="remoteControllerClick(option)">
                </div>
            </div>
            
        </div>
    `,
    styles:[
        `
            ::ng-deep .ant-modal-body {
                padding: 8px;
                background-color: #050f59;
                border-style: groove;
                border-color: white;
            }
           ::ng-deep .ant-form-item{
                margin-bottom: 0;
            }
            
        `
    ]
})
export class MonitorShowDetailModalComponent {
    @Input()
    record:any;
    @Input()
    config:any;
    flag : boolean = false;
    editSchema:SFSchema;

    options:any = [
        {
            title:"设备关机",
            id:"000011",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-shutdown.png"
        },
        {
            title:"设备重启",
            id:"000012",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-restart.png"
        },
        {
            title:"暂停服务",
            id:"000002",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-pause.png"
        },
        {
            title:"恢复服务",
            id:"000001",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-recover.png"
        },
        {
            title:"实时状态",
            id:"000021",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-director.png"
        },
        {
            title:"截屏",
            id:"000022",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-screenshot.png"
        },
        {
            title:"进程信息",
            id:"000023",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-process.png"
        },
        {
            title:"端口信息",
            id:"000024",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-port.png"
        },
        {
            title:"OS信息",
            id:"000025",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-getOS.png"
        },
        {
            title:"模块复位",
            id:"000031",
            type:'modal',
            src:"/assets/tmp/img/remote-controller/remoteController-getFile.png"
        },
        // {
        //     title:"单元结构",
        //     id:"000041",
        //     src:"/assets/tmp/img/remote-controller/remoteController-director.png"
        // },
        // {
        //     title:"操作记录",
        //     id:"000042",
        //     src:"/assets/tmp/img/remote-controller/remoteController-director.png"
        // },
        // {
        //     title:"升级记录",
        //     id:"000043",
        //     src:"/assets/tmp/img/remote-controller/remoteController-director.png"
        // },
    ]

    @ViewChild('sf',{ static: false })
    sf:SFComponent;
    constructor(private modal: NzModalRef,protected http:_HttpClient,private modalService: NzModalService) {}

    save(value:any) {

    }
    confirmModal: NzModalRef; // For testing by now

    remoteControllerClick(option:any): void {
        if(option.type == 'confirm') {
            this.confirmModal = this.modalService.confirm({
                nzTitle: option.title,
                nzContent: "是否确认对设备："+this.record["term_no"]+"发起远程指令：" + option.title,
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
        sendBody["name"] = option.title+"-"+this.record["term_no"]+"-"+Date.now();
        sendBody["type"] = "2";
        sendBody["distributionType"] = "1";
        sendBody["distributionId"] = this.record["term_no"];
        sendBody["commandCode"] = option.id;
        sendBody["addData"] = addData;
        sendBody["create_time"] = currDate;

        this.http.put(environment.gateway_server_url+"/cis/busi/monitorCommandTask/execute",{data:[sendBody],mateRules:{}}).subscribe((res:any)=>{
            alert(option.title + ":" +res.msg)
        })

    }
    close() {
        this.modal.destroy();
    }

    mouseEnter(){
        this.flag = false;
    }

    mouseLeave(){
        this.modal.destroy();
    }
    ngOnInit(){
        this.editSchema = {
            properties:{
                term_no: { type: 'number',title:"终端编号", ui: { widget: 'label-tag',tagKey:"full_name" } },
                orgName: { type: 'number',title:"所属部门", ui: { widget: 'text' } },
                address: { type: 'number',title:"安装地点", ui: { widget: 'text' } },
                line1:{ type: 'string',title:"", ui: { widget: 'line',spanControl:24 } },
                term_status: {type: 'string',title: '设备状态',ui: {widget: 'picture-label',
                        config:this.config.term_status,detailKey:"terminalStatusMsg"}},
                modules_status: {type: 'string',title: '模块状态',ui: {widget: 'picture-label',
                        config:this.config.modules_status,detailKey:"modules_error_info"}},
                resource_status: {type: 'string',title: '资源状态',ui: {widget: 'picture-label',
                        config:this.config.resource_status,detailKey:"cashBoxStatusMsg"}},
                communication_status: {type: 'string',title: '通讯状态',ui: {widget: 'picture-label',
                        config:this.config.communication_status,detailKey:"communicationStatusMsg"}},
                line2:{ type: 'string',title:"", ui: { widget: 'line',spanControl:24 } },
                status_time: { type: 'number',title:"状态时间", ui: { widget: 'text' } },
                process_time: { type: 'number',title:"处理时间", ui: { widget: 'text' } },
                // addCashTime: { type: 'number',title:"加钞时间", ui: { widget: 'text' } },
                swallow_card_count: { type: 'number',title:"吞卡数量", ui: { widget: 'text' } },
                line3:{ type: 'string',title:"", ui: { widget: 'line',spanControl:24 } },
            },
            ui:{
                spanLabel:7,
                spanControl:17
            }
        };
        setInterval(()=>{
            if (this.flag){
                this.modal.destroy();
            }

        },1000);
    }
}
