import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NzFormatEmitEvent, NzListComponent, NzMessageService, NzModalService} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {ActivatedRoute, Params} from "@angular/router";
import {SFComponent, SFSchema, SFSchemaEnumType,} from "@delon/form";
import {environment} from "@env/environment";
import {TimeInterval} from "rxjs";
import {STColumn} from "@delon/abc";
import {MonitorShowDetailModalComponent} from "./card-list.detail";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'monitor-show',
    templateUrl: './monitor.show.html',
    styles: [
        `
            ::ng-deep .ant-avatar {
                margin-right: 3px;
                margin-left: 3px;
            }
            ::ng-deep .ant-card-body {
                padding: 8px;
                zoom: 1;
                background-color: #050f59;
                border-style: groove;
                border-width: 1px;
            }

            ::ng-deep .my-card-active > div{
                border-style: inset;
                opacity: 0.7;
            }
            
            ::ng-deep .ant-card-actions > li {
                float: left;
                text-align: center;
                margin: 6px 0;
                color: rgba(0, 0, 0, 0.45);
            }

            ::ng-deep .ant-form-item-label label{
                color: white;
            }

            ::ng-deep .ant-btn-primary{
                background-color: #04148b;
                border-color: #04148b;
            }
            ::ng-deep .ant-pagination-item{
                background-color: #04148b;
                border-color:#04148b ;
                
            }
            
            ::ng-deep .ant-pagination-item a{
                color: white;
            }
            
            ::ng-deep .sv__item > div{
                color: white;
            }
            
            ::ng-deep .sv__container {
                padding-top: 20px;
                padding-bottom: 20px;
                border-bottom-style: groove;
                border-bottom-width: 1px;
            }
            
            ::ng-deep .ant-pagination-prev a{
                background-color: #04148b !important;
                border-color:#04148b !important;
                color: white;
            }
            
            ::ng-deep .ant-pagination-next .ant-pagination-item-link{
                background-color: #04148b !important;
                border-color:#04148b !important;
                color: white;
            }
            ::ng-deep .ant-select-selection__rendered{
                background-color: #04148b !important;
                border-color:#04148b !important;
                color: white;
            }

            ::ng-deep .ant-form-item-control{
                color: white;
            }
            ::ng-deep .ant-select-selection{
                background-color: #04148b !important;
                border-color:#04148b !important;
            }

            ::ng-deep .ant-form-item{
                margin-bottom: 12px;
            }
            ::ng-deep .ant-radio-button-wrapper{
                background-color: #04148b !important;
                border-color:#04148b !important;
                color: white;
            }

            ::ng-deep .ant-radio-button-wrapper:not(:first-child)::before{
                background-color:#04148b;
            }
    `,
    ],
    encapsulation: ViewEncapsulation.Emulated,
})
export class MonitorShowComponent implements OnInit {
    @ViewChild('sf',{ static: false })
    sf: SFComponent;
    @ViewChild('listView',{ static: false })
    listView:NzListComponent;
    list: any[] = [null];
    checked:boolean = true;
    loading = false;
    id:string = "";
    total:40;
    page:any = {index:1,size:50};
    interval:number = 60;

    defaultCheckedKeys = [];
    defaultSelectedKeys = [];
    defaultExpandedKeys = [];
    searchValue:any;
    treeId:string;
    //????????????????????????
    params: any = {};
    name:string= "????????????"
    constructor(public msg: NzMessageService,private route: ActivatedRoute,private modalSrv: NzModalService,private el: ElementRef,private datePipe: DatePipe,) {}


    config:any ={
            "term_status":{
                src:"/assets/images/show-status1.png",
                enum:{"0": {"text": "??????", "color": "#02fd0e"}, "1": {"text": "??????", "color": "#0018fe"}, "2": {"text": "????????????", "color": "#fd9c04"}, "3": {"text": "P???????????????", "color": "#ff0000"}, "5": {"text": "V???????????????", "color": "#cacaca"}}
            },
            "modules_status":{
                src:"/assets/images/show-status2.png",
                enum:{"0": {"text": "??????", "color": "#02fd0e"}, "1": {"text": "??????", "color": "#ff0000"}, "5": {"text": "??????", "color": "#cacaca"}}
            },
            "resource_status":{
                src:"/assets/images/show-status3.png",
                enum:{"0": {"text": "??????", "color": "#02fd0e"}, "3": {"text": "??????","color": "#fffc00"}, "5": {"text": "??????","color": "#cacaca"}}
            },
            "communication_status":{
                src:"/assets/images/show-status4.png",
                enum:{"0": {"text": "??????","color": "#02fd0e"}, "1": {"text": "??????","color": "#ff0000"}}
            }
        }

    modules:any = [
        {
            id:"term_status",
            src:"/assets/images/show-status1.png",
            enum:this.config["term_status"]["enum"]
        },
        {
            id:"modules_status",
            src:"/assets/images/show-status2.png",
            enum:this.config["modules_status"]["enum"]
        },
        {
            id:"resource_status",
            src:"/assets/images/show-status3.png",
            enum:this.config["resource_status"]["enum"]
        },
        {
            id:"communication_status",
            src:"/assets/images/show-status4.png",
            enum:this.config["communication_status"]["enum"]
        }
    ]

    searchSchema: any = {
        properties: {
            name: {type: "string",title: "????????????",maxLength: 50,ui: {width: 250}},
            org_id:{type: "string",title: "????????????",maxLength: 20,
                ui: {width: 250,widget: "select",enum:[]}},
            type_id:{type: "string",title: "????????????",maxLength: 20,ui: {width: 250,widget: "select",enum:[]}},
            brand_id:{type: "string",title: "????????????",maxLength: 20,ui: {width: 250,widget: "select",enum:[] }}
        }
    }

    searchSchema1: any = {
        properties: {
            name: {type: "string",title: "????????????",maxLength: 50,ui: {width: 250}},
            type_id:{type: "string",title: "????????????",maxLength: 20,ui: {width: 250,widget: "select",enum:[]}},
            brand_id:{type: "string",title: "????????????",maxLength: 20,ui: {width: 250,widget: "select",enum:[] }}
        }
    }

    currentId:string = "";
    modal = null;
    moduleStringList = ["??????","?????????","????????????","???????????????","?????????","??????????????????","???????????????","???????????????"];
    address = ["???????????????????????????348???","???????????????????????????22???","??????????????????????????????322???","??????????????????????????????432???","???????????????????????????112???","??????????????????????????????539???","???????????????????????????2???"];

    getData(){
        let datas = new Array();
        let types = [{"name":"ATM","id":"8b4d40bfb6eb4a1aa28d76738557a9b0","icon":"/assets/images/show-atm.png","full_name":"???????????????"},
            {"name":"CRS","id":"439eeac7cbbf4943acb4ab970da29aae","icon":"/assets/images/show-crs2.png","full_name":"??????????????????"},
            {"name":"TCR","id":"fa836de9505a41daa20b35a767d73e12","icon":"/assets/images/show-tcr.png","full_name":"???????????????????????????"},
            {"name":"VTM","id":"ef0f2d85d7004f3f9b5a8730200f7837","icon":"/assets/images/show-vtm.png","full_name":"?????????????????????"}]
        for(let i=0;i<40;i++){
            let data = new Map<string,any>();
            let id = i + "";
            if(id.length == 1){
                id = "0" + id;
            }
            data["id"] = "AB0000" + id;
            data["index"] = i;
            data["orgName"] = "???????????????";
            data["term_id"] = data["id"];
            data["term_no"] = data["id"];
            let typeNum = Math.floor(Math.random()*4);
            let type = types[typeNum];
            data["type_name"] = type.name;
            data["full_name"] = type.full_name;
            data["icon"] = type.icon;
            data = this.handleStatus(data,i);
            datas.push(data);
        }
        this.list = datas;
    }

    handleStatus(data,i){
        let termStatesNum = Math.floor(Math.random()*5);
        if(termStatesNum ==4 ){
            termStatesNum = 0;
        }
        data["term_status"] =""+termStatesNum;
        let modulesStatesNum = Math.floor(Math.random()*5);
        if(modulesStatesNum ==4 || modulesStatesNum ==2 || modulesStatesNum ==3 ){
            modulesStatesNum = 0;
        }
        data["modules_status"] =""+modulesStatesNum;
        let resourcesStatesNum = Math.floor(Math.random()*5);
        if(resourcesStatesNum ==4 || resourcesStatesNum ==2 || resourcesStatesNum ==1 ){
            resourcesStatesNum = 0;
        }
        data["resource_status"] =""+resourcesStatesNum;
        if(modulesStatesNum == 0){
            data["modules_error_info"] ="";
        }else {
            let modulesErrorNum = Math.floor(Math.random()*8);
            data["modules_error_info"] =this.moduleStringList[modulesErrorNum];
        }

        data["communication_status"] =""+Math.floor(Math.random()*2);

        data["address"] =this.address[Math.floor(Math.random()*7)];
        data["status_time"] =this.datePipe.transform(new Date(),'yyyy-MM-dd HH:mm:ss');
        data["process_time"] =this.datePipe.transform(new Date(),'yyyy-MM-dd HH:mm:ss');
        data["swallow_card_count"] =modulesStatesNum;
        data["ROWNO"] =i;
        return data;
    }



    timeout:any;
    changeInterval(){
        // let times = Number(this.interval)
        // if(this.timeout !=null){
        //     clearInterval(this.timeout)
        // }
        // if(times>0){
        //     this.timeout = setInterval(()=>{
        //         this.getData();
        //     },times*1000);
        // }
    }

    treeSize:number = 20;
    tableSize:number = 80;
    resize(type: string, e: {gutterNum: number, sizes: Array<number>}) {

        if(type === 'gutterClick') {
            this.gutterClick(e);
        }
        else if(type === 'dragEnd') {
            this.treeSize = e.sizes[0];
            this.tableSize = e.sizes[1];
        }
    }

    gutterClick(e: {gutterNum: number, sizes: Array<number>}) {
        if(e.gutterNum === 1) {
            if (this.treeSize > 0) {
                this.tableSize += this.treeSize;
                this.treeSize = 0;
            }
            else {
                this.treeSize = 20;
                this.tableSize = 80;
            }
        }
    }
    nodes = [{"key":"0","title":"??????","expanded":true,"children":
                [{"key":"1","title":"?????????","expanded":false,"children":
                        [{"key":"3c8cc52606f94c67b3bd428354acc416","title":"???????????????","expanded":false,"children":null,"disabled":true,"isLeaf":true},
                            {"key":"54b64c4f54b340a081a80908730ff5e6","title":"??????????????????","expanded":false,"children":null,"disabled":true,"isLeaf":true}],
                    "disabled":true,"isLeaf":false},
                    {"key":"2","title":"?????????","expanded":false,"children":
                            [{"key":"3","title":"?????????","expanded":false,"children":
                                    [{"key":"6c23c97c530747ff90d705ba714208d6","title":"???????????????","expanded":false,"children":
                                            [{"key":"b8c05502924f41a09a9650cb7f4e17e9","title":"???????????????","expanded":false,"children":null,"disabled":false,"isLeaf":true}],"disabled":false,"isLeaf":false},
                                        {"key":"bc06ce821b4a43aeacb4b55a6c13e95f","title":"???????????????","expanded":false,"children":
                                                [{"key":"241f9b2d836743c39877aa63a597c2d3","title":"???????????????","expanded":false,"children":null,"disabled":false,"isLeaf":true}],"disabled":false,"isLeaf":false}],"disabled":false,"isLeaf":false},
                                {"key":"4","title":"?????????","expanded":false,"children":
                                        [{"key":"027f52558125483d88a0a40c6604b763","title":"?????????","expanded":false,"children":null,"disabled":false,"isLeaf":true},
                                            {"key":"552070786c714f3da9b51e900773a44a","title":"?????????","expanded":false,"children":null,"disabled":false,"isLeaf":true}],"disabled":false,"isLeaf":false}],"disabled":false,"isLeaf":false}],"disabled":true,"isLeaf":false}];
    homeNodeKey:any = "";

    getLeftTreeDate(){
        if(this.nodes != null && this.nodes.length == 1){
            this.homeNodeKey = this.nodes[0].key;
        }
    }

    nzEvent(event: NzFormatEmitEvent): void {
        if(!event.node.isDisabled){
            this.treeId = event.node.key;
            this.getData();
        }
    }

    checkNodeType(node){
        if(this.homeNodeKey == node.key){
            return "home";
        }else{
            if(node.isLeaf){
                return "leaf";
            }else {
                if(node.isExpanded){
                    return "open"
                }else {
                    return "close"
                }
            }
        }
    }
    //??????????????????
    columns: STColumn[] = [
        {
            "index": "id",
            "title": "id",
        },
        {
            "index": "orgName",
            "title": "????????????"
        },
        {
            "index": "term_no",
            "type": "link",
            "title": "????????????",
        },
        {
            "index": "type_name",
            "title": "????????????"
        },
        {
            "index": "icon",
            "title": "??????",
            "type": "img",
            "width": "35px"
        },
        {
            "index": "term_status",
            "title": "????????????",
            "type": "tag",
            "tag": {
                "0": {
                    "text": "??????",
                    "color": "green"
                },
                "1": {
                    "text": "??????",
                    "color": "blue"
                },
                "2": {
                    "text": "????????????",
                    "color": "yellow"
                },
                "3": {
                    "text": "P???????????????",
                    "color": "gray"
                },
                "5": {
                    "text": "V???????????????",
                    "color": "gray"
                }
            }
        },
        {
            "index": "modules_status",
            "title": "????????????",
            "type": "tag",
            "tag": {
                "0": {
                    "text": "??????",
                    "color": "green"
                },
                "1": {
                    "text": "??????",
                    "color": "red"
                },
                "8": {
                    "text": "??????",
                    "color": "red"
                },
                "5": {
                    "text": "??????",
                    "color": "gray"
                }
            }
        },
        {
            "index": "resource_status",
            "title": "????????????",
            "type": "tag",
            "tag": {
                "0": {
                    "text": "??????",
                    "color": "green"
                },
                "3": {
                    "text": "????????????",
                    "color": "pink"
                },
                "5": {
                    "text": "??????",
                    "color": "gray"
                }
            }
        },
        {
            "index": "communication_status",
            "title": "????????????",
            "type": "tag",
            "tag": {
                "0": {
                    "text": "??????",
                    "color": "green"
                },
                "1": {
                    "text": "??????",
                    "color": "red"
                }
            }
        },
        {
            "index": "address",
            "title": "????????????",
            "display":"none"
        },
        {
            "index": "status_time",
            "title": "????????????",
        },
        {
            "index": "process_time",
            "title": "????????????",
        },
        {
            "index": "swallow_card_count",
            "type":"link",
            "title": "?????????",
        },
        {
            "title": "??????",
            "buttons": [
                {
                    "text": "????????????",
                    "type": "modal",
                },
                {
                    "text": "????????????",
                    "type": "modal",
                },
                {
                    "text": "????????????",
                    "type": "modal",
                },
                {
                    "text": "??????",
                    "type": "drawer",
                }
            ]
        }
    ]

    index = 0
    detailData = new Map();
    ngOnInit() {

        this.getData();
        this.getLeftTreeDate();
        this.timeout = setInterval(()=>{
            this.list.forEach((data,index)=>{
                data = this.handleStatus(data,index);
            })
        },40*5*1000);

        setInterval(()=>this.updateForm(),5*1000)
    }

    updateForm(){
        this.detailData = JSON.parse(JSON.stringify(this.list[this.index]));
        if(this.index+1 == 40){
            this.index = 0;
        }else {
            this.index++;
        }
    }
    options:any = [
        {
            title:"????????????",
            id:"000011",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-shutdown.png"
        },
        {
            title:"????????????",
            id:"000012",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-restart.png"
        },
        {
            title:"????????????",
            id:"000002",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-pause.png"
        },
        {
            title:"????????????",
            id:"000001",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-recover.png"
        },
        {
            title:"????????????",
            id:"000021",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-director.png"
        },
        {
            title:"??????",
            id:"000022",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-screenshot.png"
        },
        {
            title:"????????????",
            id:"000023",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-process.png"
        },
        {
            title:"????????????",
            id:"000024",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-port.png"
        },
        {
            title:"OS??????",
            id:"000025",
            type:'confirm',
            src:"/assets/tmp/img/remote-controller/remoteController-getOS.png"
        },
        {
            title:"????????????",
            id:"000031",
            type:'modal',
            src:"/assets/tmp/img/remote-controller/remoteController-getFile.png"
        },
    ]

    editSchema = {
        properties:{
            term_no: { type: 'number',title:"????????????", ui: { widget: 'label-tag',tagKey:"full_name" } },
            orgName: { type: 'number',title:"????????????", ui: { widget: 'text' } },
            address: { type: 'number',title:"????????????", ui: { widget: 'text' } },
            line1:{ type: 'string',title:"", ui: { widget: 'line',spanControl:24 } },
            term_status: {type: 'string',title: '????????????',ui: {widget: 'picture-label',
                    config:this.config.term_status,detailKey:"terminalStatusMsg"}},
            modules_status: {type: 'string',title: '????????????',ui: {widget: 'picture-label',
                    config:this.config.modules_status,detailKey:"modules_error_info"}},
            resource_status: {type: 'string',title: '????????????',ui: {widget: 'picture-label',
                    config:this.config.resource_status,detailKey:"cashBoxStatusMsg"}},
            communication_status: {type: 'string',title: '????????????',ui: {widget: 'picture-label',
                    config:this.config.communication_status,detailKey:"communicationStatusMsg"}},
            line2:{ type: 'string',title:"", ui: { widget: 'line',spanControl:24 } },
            status_time: { type: 'number',title:"????????????", ui: { widget: 'text' } },
            process_time: { type: 'number',title:"????????????", ui: { widget: 'text' } },
            // addCashTime: { type: 'number',title:"????????????", ui: { widget: 'text' } },
            swallow_card_count: { type: 'number',title:"????????????", ui: { widget: 'text' } },
            line3:{ type: 'string',title:"", ui: { widget: 'line',spanControl:24 } },
        },
        ui:{
            spanLabel:7,
            spanControl:17
        }
    };

}
