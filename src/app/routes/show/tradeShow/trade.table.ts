import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {STChange, STColumn, STComponent, STData, STPage} from '@delon/abc';
import {SFComponent, SFSchema, SFSchemaEnum, SFSchemaEnumType} from '@delon/form';
import {ActivatedRoute,Params} from '@angular/router';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {from} from "rxjs";
import {environment} from "./../../../../environments/environment"
import {UserService} from "../../service/user.service";
@Component({
  selector: 'app-role',
  templateUrl: './table.template.html',
    styles:[
        `
            ::ng-deep .ant-table-tbody > tr:nth-child(4n+1)  {
                background-color:#020f6d;
                color: white;
                font-size: 20px;
            }
            ::ng-deep .ant-table-tbody > tr:hover > td  {
                 background-color:#020f6d !important;
                 color: white !important;
                 font-size: 20px !important;
             }
            ::ng-deep .ant-table-tbody > tr:nth-child(4n+3)  {
                background-color: #041383;
                color: white;
                font-size: 20px;
            }
            ::ng-deep .ant-table-tbody > tr > td{
                padding: 10px;
            }
            ::ng-deep tr.ant-table-expanded-row{
                background-color: #37418d;
            }
            ::ng-deep .ant-table-thead > tr > th {
                background-color: #04148b;
                color: white;
                font-size: 28px;
                font-weight: bold;
            }
            ::ng-deep .ant-card-body{
                background-color: #050f59;

            }
            
            ::ng-deep .ant-btn-primary{
                background-color: #04148b;
                border-color: #04148b;
            }
            
            ::ng-deep .ant-form-item-label label{
                color: white;
                font-size: 20px;
            }
        `
    ]
})
export class TradeTableComponent implements OnInit {
  //????????????????????????
  params: any = {};
  //???????????????????????????
  data : any = [];
  data2 : any = [];
  pageTitle:string = "????????????";
  @ViewChild('sf',{ static: false })
  sf: SFComponent;
  searchSchema: any = {
    properties: {
        orgId: {type: "string",title: "????????????",maxLength: 100,
                    enum: [
                        { label: '??????', value: 'WAIT_BUYER_PAY' },
                        { label: '?????????', value: 'TRADE_SUCCESS' },
                        { label: '?????????', value: 'TRADE_FINISHED' },
                    ],
                    ui: {
                        widget: 'select',
                        width: 300
                    }
                },
        transType: {type: "string",title: "????????????",maxLength: 100,
            enum: [
                { label: '??????', value: 'WAIT_BUYER_PAY' },
                { label: '??????', value: 'TRADE_SUCCESS' },
                { label: '??????', value: 'TRADE_FINISHED' },
            ],
            ui: {
                widget: 'select',
                width: 300
            }
        },
        paccNo: {type: "string",title: "????????????",maxLength: 100},
        transTime: {
            type: 'string',
            title: "????????????",
            ui: { widget: 'date', mode: 'range',width: 300 },
        },
    }
  }
  //????????????
  total = 0;
  //????????????
  page : STPage = {
      show:false,
    front:false,
    showQuickJumper:true,
    total:true,
    showSize:true
  }
    pageNumber:number = 1;
    pageSize : number = 15;
    selections : STData[] = [];
    //?????????
//????????????????????????????????????
    tableChange(e : STChange){
        if(e.type == 'pi' || e.type == 'ps'){
            this.pageNumber = e.pi;
            this.pageSize = e.ps;
            this.getData();
        }

        if(e.checkbox != undefined){
            this.selections = e.checkbox;
        }
    }

  constructor(private http: _HttpClient,private message: NzMessageService,private route: ActivatedRoute,private modalSrv: NzModalService,public userService:UserService) {}

  //??????????????????
  columns: STColumn[] = [
      { title: '????????????', index: 'orgName' },
      { title: '????????????', index: 'termNo'},
      { title: '????????????', index: 'termTrace'},
      { title: 'P?????????', index: 'idxTrace'},
      { title: '????????????', index: 'TradeType',
          "type": "tag",
          "tag": {
              "0": {
                  "text": "??????",
                  "color": "#fdd102"
              },
              "1": {
                  "text": "??????",
                  "color": "#ff8a00"
              },
              "2": {
                  "text": "??????",
                  "color": "#95cef4"
              },
              "3": {
                  "text": "??????",
                  "color": "#ab0111"
              },
              "4": {
                  "text": "?????????",
                  "color": "#059839"
              },
          }},
      { title: '??????', index: 'paccNo'},
      { title: '????????????', index: 'tranAmt' },
      { title: '????????????', index: 'termTime' },
      { title: '?????????', index: 'respCode' },
      // { title: '????????????', index: 'resCodeDesc' }
  ];

    columns2: STColumn[] = [
        { title: '????????????', index: 'termNo'},
        { title: '????????????', index: 'termTrace'},
        { title: 'P?????????', index: 'idxTrace'},
        { title: '????????????', index: 'TradeType'},
        { title: '????????????', index: 'termTime' },
        { title: '????????????', index: 'blackCode' },
        { title: '???????????????', index: 'blackCodeReason' }
    ];
    getData(){

    }

  ngOnInit() {
      console.log("role")
      this.setDatas();
      this.changeInterval()
  }
    orgNames = [{"name":"?????????","id":"0001"},{"name":"?????????","id":"0002"},{"name":"?????????","id":"0003"},{"name":"?????????","id":"0004"}];
    tradeTypes = ["0","1","2","3","4"]
    timeout:any;
    // i = 0;
    changeInterval(){
        if(this.timeout !=null){
            clearInterval(this.timeout)
        }
        this.timeout = setInterval(()=>{
            // this.i++;
            // if(this.i>2){
            //     return;
            // }
            this.setDatas();
        },5000);
    }

    linesTotal:number = 16;
    setDatas(){
        let data:Array<any> = new Array<any>();
        let data2:Array<any> = JSON.parse(JSON.stringify(this.data2));
        this.setRandomData(data,data2);
        this.data = data;
        this.data2 = data2;
    }

    crownTotal:number = 1945
    setRandomData(datas:any[],datas2:any[]){
        for (let i=0;i<this.linesTotal;){
            let data = this.setTranData();
            if((data.TradeType === "0" || data.TradeType === "1")){
                if(i+2 >= this.linesTotal){
                    data.TradeType = '3';
                    i= i+1;
                }else {
                    data["expand"] =true;
                    let randomNum:number = Math.round(Math.random() * 6)+9;
                    let randomBegin:number = Math.round(Math.random() * (this.crownTotal-randomNum-1))+1;
                    let images = [];
                    for (let i=0;i<randomNum;i++){
                        let image = '/assets/tmp/crown/'+(randomBegin+i)+".jpg";
                        images.push(image);
                    }
                    data["images"] = images;
                    let codeData = {
                        termNo:data.termNo,
                        termTrace:data.termTrace,
                        idxTrace:data.idxTrace,
                        TradeType:data.TradeType,
                        termTime:data.termTime,
                        blackCode:Math.random().toString(16).substr(-6)+"00",
                        blackCodeReason:"***"
                    }
                    datas2.push(codeData);
                    i = i+3;
                }

            }else {
                i= i+1;
            }
            datas.push(data);
        }

    }

    setTranData(){
        let randomNum:number = Math.round(Math.random() * 3);
        let randomTermNo:number = Math.round(Math.random() * 99999999);
        let randomTermTrace:number = Math.round(Math.random() * 999999);
        let randomIdxTrace:number = Math.round(Math.random() * 99999);
        let randomTradeType:number = Math.round(Math.random() * 4);
        let randomPaccNo:number = Math.round(Math.random() * 9999999999);
        let randomTradeAmt:number = Math.round(Math.random() * 30);
        let randomRespCode:number = Math.round(Math.random() * 99);
        let data = {orgName:this.orgNames[randomNum]["name"],
            termNo:this.setNums(randomTermNo,8),
            termTrace:this.setNums(randomTermTrace,6),
            idxTrace:this.setNums(randomIdxTrace,5),
            TradeType:this.tradeTypes[randomTradeType],
            paccNo:"621700"+this.setNums(randomPaccNo,10),
            tranAmt:randomTradeType==0||randomTradeType==1||randomTradeType==4?randomTradeAmt*100:0,
            termTime:new Date().toLocaleString(),
            respCode:this.setNums(0,2),
            // resCodeDesc:"***"
        };
        return data;
    }
    setNums(num:number,len:number){
        let numStr:string = num.toString();
        while (numStr.length < len){
            numStr = "0"+numStr;
        }
        return numStr
    }
}
