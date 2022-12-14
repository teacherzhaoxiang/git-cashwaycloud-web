import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {_HttpClient} from "@delon/theme";
import {UtilsService} from "../../../utils.Service";
import {PieShowService} from "../../service/chart-service/pie-show.service";
import {FoldHistogramShowService} from "../../service/chart-service/fold-histogram-show.service";
import {BarGroupShowService} from "../../service/chart-service/bar-group-show.service";

@Component({
    selector: 'home-show',
    templateUrl: './home.show.html',
    styles: [
        `
            .tradeLabel{
                float: left;
                font-size: 25px;
                color: white;
                margin-top: 15px;
                padding-left: 5px;
            }
            .tradeLabel2{
                width: 40px;
                float: left;
                font-size: 25px;
                color: white;
                margin-top: 15px;
                margin-right: 20px;
            }
            .chart-div{
                border: 1px inset #4169E1;
            }
            .title-div{
                height: 40px;
                padding-bottom: 50px;
            }
            .title-span{
                font-size: 30px;
                color: white;
                /*font-family: cursive;*/
                padding-left: 10px;
            }
            .sub-title-span{
                font-size: 20px;
                color: white;
                /*font-family: cursive;*/
                padding-left: 90px;
            }
            .sub-title-span2{
                font-size: 20px;
                color: white;
                /*font-family: cursive;*/
                padding-left: 75px;
            }
     :host ::ng-deep .g2-guide-html {
        width: 50px;
        height: 40px;
        vertical-align: middle;
        text-align: center;
        line-height: 0.2;
    }

    :host ::ng-deep .g2-guide-html .title {
        font-size: 16px;
        color: #8c8c8c;
        font-weight: 300;
    }

    :host ::ng-deep .g2-guide-html .value {
        font-size: 20px;
        color: #000;
        font-weight: bold;
        padding-top: 10px;
    }
     :host ::ng-deep ::-webkit-scrollbar{display:none;}
     :host ::ng-deep html,body{overflow:hidden;height:100%;margin:0;}
            
     
  `]
})
export class HomeShowComponent implements OnInit{
    modules: any = [{size: 1}];
    ngOnInit(): void {
        console.log("show-home");
        this.http.get('assets/dynamicTest/showField.json').subscribe((res: any) => {
            this.modules = res;
            this.setCharts();
        });
        this.changeInterval();
    }
    tradeTotal:number = 0;
    timeout:any;
    nums:string[] = new Array();
    changeInterval(){
        if(this.timeout !=null){
            clearInterval(this.timeout)
        }
        this.timeout = setInterval(()=>{
            let randomNum:number = Math.round(Math.random() * 100);
            this.tradeTotal = this.tradeTotal +randomNum;
            this.setNums(this.tradeTotal);
            this.getRandomData();
        },10000);
        this.setNums(this.tradeTotal);
    }

    refreshFlag = false;
    getRandomData(){
        let tmpData = JSON.parse(JSON.stringify(this.chartData));
        let total = 500;
        let termOutLine :number = Math.round(Math.random() * 50);
        let termMaintanance :number = Math.round(Math.random() * 50);
        let termPause :number = Math.round(Math.random() * 50);
        let termStatus:any[] = new Array();
        let j1 = {};
        j1["type"] =  '??????';
        j1["nzPercent"] = total - termMaintanance - termOutLine - termPause -60;
        termStatus.push(j1);
        let j2 = {};
        j2["type"] =  '????????????';
        j2["nzPercent"] = termPause+20;
        termStatus.push(j2);
        let j3 = {};
        j3["type"] =  '????????????';
        j3["nzPercent"] = termMaintanance+20;
        termStatus.push(j3);
        let j4 = {};
        j4["type"] =  '??????';
        j4["nzPercent"] = termOutLine+20;
        termStatus.push(j4);
        tmpData.termStatus = termStatus;

        let termModuleError :number = Math.round(Math.random() * 50);
        let moduleStatus:any[] = new Array();
        let m1 = {};
        m1["type"] =  '??????';
        m1["nzPercent"] = total - termModuleError - termOutLine-40;
        moduleStatus.push(m1);
        let m2 = {};
        m2["type"] =  '??????';
        m2["nzPercent"] = termModuleError+20;
        moduleStatus.push(m2);
        let m3 = {};
        m3["type"] =  '??????';
        m3["nzPercent"] = termOutLine+20;
        moduleStatus.push(m3);
        tmpData.moduleStatus = moduleStatus;

        let termResourceWarn :number = Math.round(Math.random() * 50);
        let cashBoxStatus:any[] = new Array();
        let c1 = {};
        c1["type"] =  '??????';
        c1["nzPercent"] = total - termResourceWarn - termOutLine-40;
        cashBoxStatus.push(c1);
        let c2 = {};
        c2["type"] =  '??????';
        c2["nzPercent"] = termResourceWarn+20;
        cashBoxStatus.push(c2);
        let c3 = {};
        c3["type"] =  '??????';
        c3["nzPercent"] = termOutLine+20;
        cashBoxStatus.push(c3);
        tmpData.cashBoxStatus = cashBoxStatus;

        let communicationStatus:any[] = new Array();
        let cc1 = {};
        cc1["type"] =  '??????';
        cc1["nzPercent"] = total - termOutLine-20;
        communicationStatus.push(cc1);
        let cc2 = {};
        cc2["type"] =  '??????';
        cc2["nzPercent"] = termOutLine+20;
        communicationStatus.push(cc2);
        tmpData.communicationStatus = communicationStatus;

        this.chartData = tmpData;

        if(this.refreshFlag){
            this.setCharts();
        }
        this.refreshFlag = !this.refreshFlag;
    }
    constructor(private http: _HttpClient,
                private pieService: PieShowService,
                public utilsService: UtilsService,
                private foldHistogramService: FoldHistogramShowService,
                private barGroupService: BarGroupShowService,) {
    }

    setNums(tradeTotal:number){
        let numStr:string = tradeTotal.toString();
        while (numStr.length < 6){
            numStr = "0"+numStr;
        }
        this.nums = numStr.split("");
    }
    chartData: any = {
        openTrend: [{model: '??????1', errorTimeTotal: 178, errorTimes: 0.3},
            {model: '??????2', errorTimeTotal: 232, errorTimes: 0.43}, {
                model: '??????3',errorTimeTotal: 247,errorTimes: 0.35},
            {model: '??????4', errorTimeTotal: 219, errorTimes: 0.41},
            {model: '??????5', errorTimeTotal: 229, errorTimes: 0.49},
            {model: '??????6', errorTimeTotal: 269, errorTimes: 0.51}],
        termStatus: [{type: '??????', percent: 329}, {type: '????????????', percent: 78}, {type: '????????????', percent: 55}, {type: '??????', percent: 38}],
        moduleStatus: [{type: '??????', percent: 329}, {type: '??????', percent: 78},  {type: '??????', percent: 38}],
        cashBoxStatus: [{type: '??????', percent: 422}, {type: '??????', percent: 78},{type: '??????', percent: 78}],
        communicationStatus: [{type: '??????', percent: 329}, {type: '??????', percent: 78}],
        termType: [ {type: 'CRS', percent: 272},{type: 'ATM', percent: 112}, {type: 'VTM', percent: 56}, {type: 'STM', percent: 60}],
        termInstall: [{type: '??????', percent: 171}, {type: '??????', percent: 329}],
        termArea: [{type: '?????????', percent: 140},{type: '??????', percent: 56}, {type: '??????', percent: 69},{type: '??????', percent: 47},{type: '??????/??????', percent: 86},{type: '?????????', percent: 102}],
    };

    chartMap:any = {};
    setCharts(){
        for(let k in this.chartMap){
            this.chartMap[k].destroy();
        }
        this.chartMap["trans"] = this.barGroupService.handleBarGroup(this.modules.trans, null);
        this.chartMap["openTrend"] = this.foldHistogramService.handleFoldHistogram(this.modules.openTrend,this.chartData.openTrend);
        this.chartMap["termStatus"] = this.pieService.handlePie(this.modules.termStatus,this.chartData.termStatus)
        this.chartMap["moduleStatus"] =this.pieService.handlePie(this.modules.moduleStatus,this.chartData.moduleStatus)
        this.chartMap["cashBoxStatus"] =this.pieService.handlePie(this.modules.cashBoxStatus,this.chartData.cashBoxStatus)
        this.chartMap["communicationStatus"] =this.pieService.handlePie(this.modules.communicationStatus,this.chartData.communicationStatus)
        this.chartMap["termType"] =this.pieService.handlePie(this.modules.termType,this.chartData.termType)
        this.chartMap["termInstall"] =this.pieService.handlePie(this.modules.termInstall,this.chartData.termInstall)
        this.chartMap["termArea"] =this.pieService.handlePie(this.modules.termArea,this.chartData.termArea)
    }

}
