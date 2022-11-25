import { Component, ElementRef, Input, NgModule, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFSchemaEnumType } from "@delon/form";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { environment } from "@env/environment";
import { _HttpClient } from "@delon/theme";
import { of } from "rxjs";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import testText from './testStr'

declare var $: any
@Component({
    selector: 'electronic-water',
    templateUrl: './electronic-water.component.html',
    styles: [
        `
            /*:host ::ng-deep #_sf-9{*/
            /*padding-right: 100px;*/
            /*width:100px;*/

            /*}*/
            :host ::ng-deep .ant-calendar-picker-input{
                margin-right: 100px
            }
            :host ::ng-deep .ant-form-item label{
                margin-left: 25px
            }
            :host ::ng-deep .ant-form-inline .ant-form-item{
                margin-right: 40px
            }
            :host ::ng-deep .ant-form-item-control input[type=text]{
                width:100px;
            }

            :host ::ng-deep sf-date{
                margin-left: 100px;
            }
            .logContainer{
            //min-height: 500px;
                padding-top: 3px;
                width:calc(100% - 10px);
            //height: calc(100% - 50px);
                border-width: 1px;
                border-color: #83bcea;
                border-style: outset;
            }
            :host ::ng-deep .ant-form{
                display: flex;
            }
            .form_top{
                margin-top: 3px;
                padding-top: 3px;
                display: flex;
                justify-content: flex-end;
                padding-bottom: 10px;
                padding-right: 10px
            }
        `
    ]
})
export class ElectronicWaterComponent implements OnInit {

    @Input()
    record: any = {

    };
    buttons: string[];
    testText: string = '';
    //
    searchSchema: any = {
        properties: {
            name: { type: "string", title: "关键字" },
        }
    };
    searchSchema1: any = {
        properties: {
            termNo: {
                type: "string", title: "设备", ui: {
                    widget: "terminal-check",
                    dataUrl: environment['selectTerminalUrl'],
                    resultParam: "termNo",
                    showModel: "tag"
                }
            },
            logDate: {
                title: "日期",
                type: 'string',
                format: 'YYYY-MM-DD',
                ui: {
                    widget: 'date',
                    mode:'day',
                    width: 300,
                    end: 'end',
                },
            },
            // end: {
            //     type: 'string',
            //     format: 'date',
            // },
        },
        ui: {
            grid: {
                span: 8
            }
        }
    };

    @ViewChild('sf', { static: false })
    sf: SFComponent;
    @ViewChild('sf1', { static: false })
    sf1: SFComponent;
    @ViewChild('scrollMe', { static: true }) private myScrollContainer: ElementRef;
    // isVisible = false;
    safeHtml: SafeHtml = '';
    position: number = 0;
    index: number = 0;
    historyArray: any[] = [{ position: this.position, index: this.index }];
    searching: boolean = false;
    perms: string[] = [];
    constructor(private sanitizer: DomSanitizer, private http: _HttpClient, private message: NzMessageService, private el: ElementRef) { }
    textText = testText.testText
    ngOnInit() {
        let permString = localStorage.getItem("perms");
        this.perms = permString.split(",");

        this.myScrollContainer.nativeElement.style.height = window.innerHeight - 290 + 'px'; //动态设置myScrollContainer盒子的高度
        this.http.get('assets/dynamicTest/electronic-water.json').subscribe((res: any) => {
            // this.buttons = res.buttons;
            // this.genSearchSchema(res.searchField);
        });
    }

    checkPerms(key: string) {
        if (this.perms.indexOf(key) >= 0) {
            return true;
        } else {
            return false;
        }
    }
    getLog() {
        if (this.sf1.value.termNo == null || this.sf1.value.logDate == null) {
            if (this.sf1.value.termNo == null && this.sf1.value.logDate != null) {
                this.message.error("请选择一台设备");
                return;
            }
            if (this.sf1.value.termNo != null && this.sf1.value.logDate == null) {
                this.message.error("请选择日期");
                return;
            }
            this.message.error("设备和日期均为必填项");
            return;
        }
        console.log("getLog", JSON.stringify(this.sf1.value.termNo) + "|" + this.sf1.value.termNo.length);
        // if(this.sf1.value.logDate != this.sf1.value.end){
        //     this.message.error("查询电子流水只能选择单天！");
        //     return;
        // }
        if ((this.sf1.value.termNo.length) > 1) {
            this.message.error("只能选择一个设备");
        }

        let params: {} = { param: JSON.stringify(this.sf1.value) };


        let url = environment.gateway_server_url + "/cis/log/file";
        if (environment['electronicWaterFlag'] != null) {
            url = environment.gateway_server_url + environment['electronicWaterFlag'];
        }

        this.http.get(url, params).subscribe((res: any) => {
            console.log(res);
            if (res["retCode"] == 0) {
                this.testText = res["msg"].toString();
                console.log(this.testText);
                let value = this.sanitizer.bypassSecurityTrustHtml(this.testText);
                this.safeHtml = value != null ? value : '';
            } else {
                this.message.error(res["msg"]);
                //alert(res["msg"]);
            }

        });
    }
    formChange() {
        this.searching = true;
        setTimeout(() => {

            this.position = 0;
            this.index = 0;
            this.historyArray = [];
            if (this.sf.value.name == null) return;
            const Reg = new RegExp(this.sf.value.name, 'g');
            if (this.testText) {
                const res = this.testText.replace(Reg, `<span style="color: red;">${this.sf.value.name}</span>`);
                let value = this.sanitizer.bypassSecurityTrustHtml(res);
                this.safeHtml = value != null ? value : '';
                this.searching = false;
            }
        }, 2000)
    }


    nextStep() {
        console.log("nextStep");

        if (this.searching == true) return;
        this.setPositionAndScrollTop(1);

    }

    reset() {
        this.sf.reset();
        let value = this.sanitizer.bypassSecurityTrustHtml(this.testText);
        this.safeHtml = value != null ? value : '';
    }

    frontStep() {
        console.log("frontStep");
        if (this.searching == true) return;

        if (this.position == 0 || this.position == 1) {
            return;
        } else {
            this.setPositionAndScrollTop(2);
        }

    }


    kk: number = 10;
    setPositionAndScrollTop(direction: number) {
        console.log("===" + this.kk);
        this.kk = this.kk + 100;
        $('#scrollDiv').scrollTop = this.kk;
        console.log("==end=" + this.kk);
        this.myScrollContainer.nativeElement.focus();
        let s = getSelection();
        let range = s.getRangeAt(0)
        // 获取光标对象的范围界定对象，一般就是textNode对象
        let textNode = this.myScrollContainer.nativeElement;
        range.setStart(textNode, 0)
        // // 光标开始和光标结束重叠
        range.collapse(true)
        // // 清除选定对象的所有光标对象
        s.removeAllRanges()
        // // 插入新的光标对象
        s.addRange(range)

        let nodes: any[] = s.anchorNode["children"];
        if (nodes == null || nodes.length == 0) {
            return;
        }
        let nodesTemp: any[] = [];
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            if (node.localName == "span") {
                nodesTemp.push(node);
            }
        }
        if (direction == 1) {

            let value = this.sf.value.name;
            if (nodes.length > this.position) {
                this.position = this.position + 1;
                if (this.index == 0) {
                    this.index = this.testText.indexOf(value, 0);
                } else {
                    this.index = this.testText.indexOf(value, this.index + 1);
                }
                let history = { position: this.position, index: this.index };
                this.historyArray.push(history)
            }
        } else {
            this.historyArray.pop();
            this.position = this.position - 1;
            this.index = this.historyArray[this.position - 1]["index"];
        }


        // let aNodes = s.anchorNode["children"]
        // for(let i=0;i<aNodes.length;i++){
        //     aNodes[i].style ="color: red;"
        // }
        // s.anchorNode["children"][this.position-1].style ="color:red;background-color:blue;"


        for (let i = 0; i < nodesTemp.length; i++) {
            nodesTemp[i].style.color = 'red';
            nodesTemp[i].style.backgroundColor = '';
        }
        nodesTemp[this.position - 1].style.color = 'red';
        nodesTemp[this.position - 1].style.backgroundColor = 'blue';


        let scrollHeight = this.myScrollContainer.nativeElement.scrollHeight;
        let height = this.testText.length / scrollHeight;
        let scrollTop = this.index / height;
        scrollTop = scrollTop - 100;
        if (scrollTop < 0) {
            scrollTop = 0;
        }
        if (scrollTop > scrollHeight) {
            scrollTop = scrollHeight;
        }

        // if (document.documentElement.scrollTop){
        //     this.myScrollContainer.nativeElement.scrollTop = scrollTop;
        // }else{
        //     this.myScrollContainer.nativeElement.
        // }
        // if (document.body.scrollTop){
        //     document.body.scrollTop=0 ;
        // }

        //$("#scrollDiv").scrollTop(scrollTop);
        // console.log(navigator.userAgent);
        // if ($.browser.webkit){
        //     alert(3333);
        //     this.myScrollContainer.nativeElement.scrollTop = scrollTop;

        this.myScrollContainer.nativeElement.scrollTop = nodesTemp[this.position - 1].offsetTop - 280; //跟踪搜索内容给定scrollTop的高度
        // }

    }

    searchReset() {
        this.searchSchema1 = {
            properties: {
                termNo: {
                    type: "string", title: "设备", ui: {
                        widget: "terminal-check",
                        resultParam: "termNo",
                        showModel: "tag",
                        grid: {
                            span: 8,
                        }
                    }
                },
                logDate: {
                    title: "日期",
                    type: 'string',
                    format: 'date',
                    ui: { widget: 'date', end: 'end', grid: { span: 12 } },
                },
                end: {
                    type: 'string',
                    format: 'date',
                    ui: {
                        grid: { span: 12 }
                    }
                },
            },
            ui: {
                grid: {
                    span: 5
                },
            }
        };
        this.sf1.reset();
    }



    download() {
        if (this.sf1.value.termNo == null || this.sf1.value.logDate == null) {
            if (this.sf1.value.termNo == null && this.sf1.value.logDate != null) {
                this.message.error("请选择一台设备");
                return;
            }
            if (this.sf1.value.termNo != null && this.sf1.value.logDate == null) {
                this.message.error("请选择日期");
                return;
            }
            this.message.error("设备和日期均为必填项");
            return;
        }
        console.log("getLog", JSON.stringify(this.sf1.value.termNo) + "|" + this.sf1.value.termNo.length);

        if ((this.sf1.value.termNo.length) > 1) {
            this.message.error("只能选择一个设备");
        }
        let eleLink = document.createElement('a');
        // eleLink.download = this.buttons[i]['url'];
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        let logDate = this.sf1.value.logDate;
        const date = new Date();
        let year = date.getFullYear();
        let m = date.getMonth()+1;
        m<10?'0'+m:m;
        let day = date.getDate();
        day<10?'0'+day:m;
        let toDay = year+"-"+m+"-"+day;
        if(toDay==logDate){
            this.message.error("当天日志不支持下载！");
            return;
        }

        let filename = "elecLog/"+logDate+"/"+ logDate+"_"+this.sf1.value.termNo + ".gz";
        eleLink.href = encodeURI(environment.gateway_server_url + "/file/file/download?filename=" + filename);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    }

    getArrayIndex(array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return i;
            }
        }
        return -1;
    }

    // showModal(): void {
    //     this.isVisible = true;
    //
    // }
    // handleOk(): void {
    //     console.log('Button ok clicked!');
    //     this.download();
    //     //this.isVisible = false;
    // }
    //
    // handleCancel(): void {
    //     console.log('Button cancel clicked!');
    //     this.isVisible = false;
    // }
    genSearchSchema(searchField: any) {

        let properties = this.searchSchema.properties;
        for (let field of searchField) {
            let data = field["config"];
            let key = field["key"];
            if (data["ui"] != null) {
                let ui = data["ui"];
                console.log("kkkkk");
                if (ui["asyncData"] != null) {
                    let uri: string = ui["asyncData"];
                    let mate = ui["mate"];
                    let param = ui["params"];
                    // if(!uri.startsWith("http")){
                    //     uri = environment.common_crud_url+uri;
                    // }
                    ui["asyncData"] = () => this.http.get<SFSchemaEnumType[]>("http://192.168.10.188:8220/rest/common/monitor_terminal_type/selects?mate=%7B%22name%22:%22label%22,%22id%22:%22value%22%7D&params=");
                    //   ui["enum"] = ()=>{
                    //       return new Promise(resolve => {
                    //           setTimeout(() => resolve([
                    //                   { title: 'Child Node', key: `${(new Date()).getTime()}-0` },
                    //                   { title: 'Child Node', key: `${(new Date()).getTime()}-1` } ]),
                    //               1000);
                    //       });
                    //   }
                    //   ui["asyncData"] = ()=>{return
                    //       of([
                    //                  { title: '待支付', key: 'WAIT_BUYER_PAY' },
                    //                  { title: '已支付', key: 'TRADE_SUCCESS' },
                    //                  { title: '交易完成', key: 'TRADE_FINISHED' },
                    //              ])};
                    // ui["asyncData"]=()=>this.http.get(
                    //     of([
                    //            { title: '待支付', key: 'WAIT_BUYER_PAY' },
                    //            { title: '已支付', key: 'TRADE_SUCCESS' },
                    //            { title: '交易完成', key: 'TRADE_FINISHED' },
                    //        ])
                    // );

                }



                // if(ui["widget"] == 'slider' && ui['formatter'] !=null){
                //     ui['formatter'] = (value)=>{return value;};
                // }
                data["ui"] = ui;
            }
            properties[key] = data;
        }
        this.searchSchema = { properties: properties };
        console.log(this.searchSchema)
    }

}
