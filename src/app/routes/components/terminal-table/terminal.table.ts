import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
import {_HttpClient} from "@delon/theme";
@Component({
    selector: 'terminal-check-transfer-item',
    template: `
        <div id="editor" class="edit_box" drag>
            <div class="modal-header box_header"  style="margin: 0">
                <div class="modal-title">编辑</div>
                <!--<div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>-->
            </div>
            <div (mousedown)="$event.stopPropagation()">
                <div nz-row class="modal-content">
                    <nz-col nzSpan="24">
                        <sf style="position: relative;margin-bottom: 10px;" #sf mode="search" [schema]="searchSchema" [button]="null"  [formData]="params" (formSubmit)="getData()" (formReset)="getData()">
                        </sf>
                        <nz-transfer
                        [nzDataSource]="list"
                        [nzListStyle]="{ 'width.%': 46}"
                        [nzTitles]="['未选中', '已选择设备']"
                        (nzSelectChange)="select($event)"
                        (nzChange)="change($event)"
                        >
                        </nz-transfer>
                    </nz-col>
                </div>
            </div>
            <div class="modal-footer">
                <button nz-button type="button" (click)="close()" class="closeBtn">关闭</button>
                <button nz-button nzType="primary" type="submit" (click)="save()" [disabled]="!sf.valid" [ngClass]="sf.valid?'keep':''">保存</button>
            </div>
        </div>
  `,
    styles:[`
        :host ::ng-deep .ant-form-item-control-wrapper{
            width:100px
        }
        .edit_box{
            background: #FFFFFF;
            width: 800px;
            z-index: 999999999999;
            border-radius: 6px;
        }
        .edit_box  .closer{
            cursor: pointer;
        }
        .edit_box .modal-content{
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
        .modal-footer .keep{
            background: #1890ff;
            color: #FFFFFF;
        }
        .closeBtn{
            border: 1px solid #1890ff;color: #1890ff
        }
        :host ::ng-deep .ant-transfer-list-body-customize-wrapper{
            height: 300px;
            overflow-y: scroll;
        }
    `]

})
export class TerminalCheckTransferCustomItemComponent implements OnInit {
    @Input()
        dataType:any = "string";
    @Input()
        resultParam:any = "id";
    @Input()
    singleCheck:boolean = false;
    @Input()
    dataUrl:string;
    @Input()
    typeType:string;
    @Input()
    @Output()
        selectedList:any[] = [];

    selectedIdList:any[] = [];
    //查询条件绑定参数
    params: any = {};
    @ViewChild('sf',{ static: true })
    sf:SFComponent;
    mate = {
        id: "value",
        name: "label"
    };
    param = "";
    searchSchema: any = {
        properties: {
            termNo: {type: "string",title: "设备编号",ui:{
                    spanLabelFixed:80,
                    grid:{span:8}
                }
            },
            org: {
                type: 'string',
                title: '机构',
                default: '',
                ui: {
                    widget: 'org-tree-cashway',
                    spanLabelFixed:80,
                    grid:{span:16}
                },
            },
            type: {type: "string",title: "类型",ui: {
                    widget: 'select',
                    spanLabelFixed:80,
                    grid:{span:8},
                    asyncData:()=>this.http.get(environment.gateway_server_url+"/engine/rest/common/monitor_terminal_type/selects",{mate:JSON.stringify(this.mate),params:this.param+`${this.typeId?'type='+this.typeId:''}`})
                }},
            model: {type: "string",title: "型号",ui: {
                    widget: 'select',
                    spanLabelFixed:80,
                    grid:{span:8},
                    asyncData:()=>this.http.get(environment.gateway_server_url+"/engine/rest/common/monitor_terminal_model/selects",{mate:JSON.stringify(this.mate),params:this.param})
                }},
            brand: {type: "string",title: "厂商",ui: {
                    widget: 'select',
                    grid:{span:8},
                    spanLabelFixed:80,
                    asyncData:()=>this.http.get(environment.gateway_server_url+"/engine/rest/common/monitor_terminal_brand/selects",{mate:JSON.stringify(this.mate),params:this.param})
                }},
            terminalInstallType: {type: "string",title: "布放方式",enum:[
                    {
                        "label": "大堂",
                        "value": 0
                    },
                    {
                        "label": "穿墙",
                        "value": 1
                    },
                    {
                        "label": "其他",
                        "value": 2
                    }
                ],
                ui: {
                    widget: 'select',
                    spanLabelFixed:80,
                    grid:{span:8},
                    hidden:environment['termTeamSelectConditions']=='jlnx'?false:true
                }},
            maintanance: {type: "string",title: "维护商",ui: {
                    widget: 'select',
                    spanLabelFixed:80,
                    grid:{span:8},
                    hidden:environment['termTeamSelectConditions']=='luzhou'?false:true,
                    asyncData:()=>this.http.get(environment.gateway_server_url+"/engine/rest/common/monitor_terminal_maintanance/selects",{mate:JSON.stringify(this.mate),params:this.param})
                }},
            isOutBank: {type: "string",title: "布放模式",enum:[
                    {
                        "label": "离行",
                        "value": 1
                    },
                    {
                        "label": "在行",
                        "value": 0
                    }
                ],
                ui: {
                    widget: 'select',
                    spanLabelFixed:80,
                    grid:{span:8},
                    hidden:environment['termTeamSelectConditions']=='jlnx'?false:true
                }},
            options:{
                type: "string",title: "操作",ui:{
                    widget: 'button-widget',
                    spanLabelFixed:30,
                    grid:{span:8},
                },buttons:[
                    {title:'搜索',search:()=>{
                        this.sf.formSubmit;
                        console.log(this.sf.formSubmit)
                            //this.getData();
                        }
                    },
                    {title:'重置',reset:()=>{
                            this.sf.reset(true);
                        }
                    }
                ]
            }
        },
        ui:{
            grid:{span:8},
        }
    }
    list: any[] = [];
    selectedInit:any[];
    tempList:any[] = [];
    typeId:any ; 
    ngOnInit(): void {
        this.selectedInit = JSON.parse(JSON.stringify(this.selectedList));
        this.getData(() => {
            this.putSelectedData();
        });
        try{
            this.typeId = this['dataUrl'].split('in')[this['dataUrl'].split('in').length -1 ].replace(/\D/g,'')
        }catch{}
    }

    close() {
        this.modal.close(this.selectedInit);
    }
    save(){
        if(this.selectedList.length>500){
            alert("设备数量不能大于500台");
            return;
        }
        if(this.singleCheck && this.selectedList.length != 1){
            alert("请选择一台设备！")
        }else {
            if(this.modal['nzKeyboard']){
                if(this.selectedList.length>1){
                    alert("只能选择一台设备下载！")
                }else {
                    this.modal.close(this.selectedList);
                }
            }else {
                this.modal.close(this.selectedList);
            }
        }
    }
    putSelectedData(){
        let key = "id";
        if(this.dataType == "string"){
            key = this.resultParam;
            this.selectedIdList = JSON.parse(JSON.stringify(this.selectedList));
        }else {
            this.selectedList.forEach((item,index)=>{
                this.selectedIdList.push(item[key]);
            })
        }
        this.list.forEach((item,index)=>{
            if (this.selectedIdList.indexOf(item[key]) >= 0){
                this.tempList.push(item);
                this.list[index].direction = 'right';
            }
        })
    }
    getData(callback=null){
        console.log("---------------------------999999999",this);
        let sendParams:any = {params:JSON.stringify(this.sf.value?this.sf.value:{})}
        if(this.typeType!=null) {
            let temp = JSON.parse(sendParams.params);
            temp['typeType'] = this.typeType;
            sendParams.params = JSON.stringify(temp);
        }
        let url = "";
        if(this.dataUrl == null || this.dataUrl == undefined){
            url = "/cis/busi/monitorTerminalManage";
        }else{
            url = this.dataUrl.split("?")[0];
            if(this.dataUrl.split("?").length==2){
                let params = this.dataUrl.split("?")[1];
                let paramsValue = params.substr(7,params.length);
                let json = JSON.parse(paramsValue);
                let temp = JSON.parse(sendParams.params);
                temp['customParameters'] = json['customParameters'];
                sendParams.params = JSON.stringify(temp);
            }
        }
        this.http.get(environment.gateway_server_url+url,sendParams).subscribe((res:any)=>{
            if(this.tempList.length>0){
                res = res.concat(this.tempList);
                var array = [];
                for (var i = 0; i < res.length; i++) {
                    if (array .indexOf(res[i]) === -1) {
                        array .push(res[i]);
                    }
                }
                this.list = array;
            } else {
                this.list = res;
            }
            if(callback && typeof callback === "function"){
                callback();
            }
        })
    }
    select(ret: {}): void {
        console.log('nzSelectChange', ret);
    }

    change(ret: {}): void {
        let changeList = ret["list"];
        let direction = ret["to"];
        if(direction == 'right'){
            this.tempList = this.tempList.concat(changeList);
            if(this.dataType == "string"){
                let key = this.resultParam;
                changeList.forEach((item,index)=>{
                    this.selectedList.push(item[key]);
                })
            }else {
                changeList.forEach((item,index)=>{
                    this.selectedIdList.push(item["id"])
                    this.selectedList.push(item);
                })
            }
        }else {
            if(this.dataType == "string"){
                let key = this.resultParam;
                changeList.forEach((item,index)=>{
                    let inx = this.selectedList.indexOf(item[key]);
                    this.selectedList.splice(inx,1);
                })
            }else {
                changeList.forEach((item,index)=>{
                    let inx = this.selectedIdList.indexOf(item["id"]);
                    this.selectedIdList.splice(inx,1);
                    this.selectedList.splice(inx,1);
                })
            }
        }
    }

    constructor(private http: _HttpClient,private modal: NzModalRef, ){}
    convertItems(items) {
        return items.filter(i => !i.hide);
    }
}
