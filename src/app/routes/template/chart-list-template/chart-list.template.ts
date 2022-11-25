import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {$} from 'protractor';
import {PieService} from '../../service/chart-service/pie.service';
import {CirclePieService} from '../../service/chart-service/circle-pie.service';
import {PolarService} from '../../service/chart-service/polar.service';
import {FoldService} from '../../service/chart-service/fold.service';
import {FoldHistogramService} from '../../service/chart-service/fold-histogram.service';
import {ThetaListService} from '../../service/chart-service/theta-list.service';
import {BarGroupService} from '../../service/chart-service/bar-group.service';
import {environment} from '../../../../environments/environment';
import {SFComponent, SFSchema, SFSchemaEnumType} from '@delon/form';
import {UtilsService} from '../../../utils.Service';
import {UserService} from '../../service/user.service';
import {NzModalService} from "ng-zorro-antd";
@Component({
    selector: 'app-home-template',
    templateUrl: './chart-list.template.html',
    styles: [
            `
            :host ::ng-deep .g2-guide-html {
                width: 100px;
                height: 80px;
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

            :host ::ng-deep ::-webkit-scrollbar {
                display: none;
            }

            :host ::ng-deep html, body {
                overflow: hidden;
                height: 100%;
                margin: 0;
            }
        `]
})
export class HomeTemplateComponent implements OnInit, AfterViewChecked {
    modules: any = [{size: 1}];
    modulesThetaList: any = [{size: 1}];
    loading = false;

    @ViewChild('sf', {static: false})
    sf: SFComponent;
    searchSchema: any = {
        properties: {
            orgId: {
                type: 'string', title: '机构', maxLength: 36,
                ui: {
                    widget: 'select',
                    width: 300,
                    asyncData: () => {
                        let dd = this.http.get<SFSchemaEnumType[]>(environment.manage_server_url + '/sys/orgs/list?perms=sys:user');
                        return dd;
                    }
                }
            }

        }
    };

    constructor(private http: _HttpClient,
                private pieService: PieService,
                private circlePieService: CirclePieService,
                private polarService: PolarService,
                private foldService: FoldService,
                public utilsService: UtilsService,
                private userService: UserService,
                private foldHistogramService: FoldHistogramService,
                private thetaListService: ThetaListService,
                private barGroupService: BarGroupService,
                private modalSrv: NzModalService) {
    }


    searchData() {
        if (this.sf != null && this.sf.value != null && this.sf.value.orgId != undefined) {
            this.getChartSet(this.sf.value.orgId);
            this.handleChart(this.sf.value.orgId);
        }
    }


    getChartSet(orgId) {
        this.http.get('assets/dynamicTest/chartField.json').subscribe((res: any) => {
            console.log("-------")
            this.loading = true;
            if (JSON.stringify(this.modules) == JSON.stringify(res.resource)) {
                this.handleFlag = true;
            } else {
                this.handleFlag = false;
            }
            this.modules = res.resource;
            // this.handleChart();
        });

        this.http.get(environment.gateway_server_url + '/cis/busi/monitorTerminalManage/getTerminalPercent?sysOrg=' + orgId).subscribe((data: any) => {
            this.modulesThetaList = data;
        });

    }

    chartData: any = {
        openTrend: [
            {time: '00', opens: 99.1, trans: 3045}, {time: '01', opens: 98.6, trans: 3123}, {
                time: '02',
                opens: 98.7,
                trans: 3342
            }, {time: '03', opens: 99.7, trans: 3234},
            {time: '04', opens: 99.6, trans: 3568}, {time: '05', opens: 95.6, trans: 3695}, {
                time: '06',
                opens: 96.8,
                trans: 5572
            }, {time: '07', opens: 99.5, trans: 6758},
            {time: '08', opens: 97.8, trans: 24508}, {time: '09', opens: 98.6, trans: 27890}, {
                time: '10',
                opens: 96.5,
                trans: 45670
            }, {time: '11', opens: 97.8, trans: 46578},
            {time: '12', opens: 97.6, trans: 54376}, {time: '13', opens: 98.6, trans: 54326}, {
                time: '14',
                opens: 99.5,
                trans: 43565
            }, {time: '15', opens: 99.7, trans: 44548},
            {time: '16', opens: 98.6, trans: 45675}, {time: '17', opens: 97.2, trans: 54536}, {
                time: '18',
                opens: 96.4,
                trans: 58643
            }, {time: '19', opens: 97.9, trans: 45643},
            {time: '20', opens: 96.3, trans: 24654}, {time: '21', opens: 95.7, trans: 13568}, {
                time: '22',
                opens: 95.8,
                trans: 7859
            }, {time: '23', opens: 99.7, trans: 4353}
        ],
        opens: [0.998],
        termStatus: [{type: '正常', percent: 329}, {type: '故障', percent: 78}, {type: '警告', percent: 55}, {
            type: '未知',
            percent: 38
        }],
        termStatusTotal: 500, moduleStatusTotal: 500, communicationStatusTotal: 500, cashBoxStatusTotal: 500,
        moduleStatus: [{type: '正常', percent: 329}, {type: '故障', percent: 78}, {type: '警告', percent: 55}, {
            type: '未知',
            percent: 38
        }],
        communicationStatus: [{type: '正常', percent: 422}, {type: '故障', percent: 78}],
        cashBoxStatus: [{type: '正常', percent: 329}, {type: '故障', percent: 78}, {type: '警告', percent: 55}, {
            type: '未知',
            percent: 38
        }],
        trans: [
            {class1: '交易笔数', country: '其它', type: '1', value1: 34325},
            {class1: '交易笔数', country: '代缴费', type: '1', value1: 15875},
            {class1: '交易笔数', country: '转账', type: '1', value1: 4564},
            {class1: '交易笔数', country: '存款', type: '1', value1: 7568},
            {class1: '交易笔数', country: '取款', type: '1', value1: 13023},
            {class1: '交易金额（万元）', country: '其它', type: '2', value1: 0},
            {class1: '交易金额（万元）', country: '代缴费', type: '2', value1: 1232.18},
            {class1: '交易金额（万元）', country: '转账', type: '2', value1: 2311.34},
            {class1: '交易金额（万元）', country: '存款', type: '2', value1: 1651.27},
            {class1: '交易金额（万元）', country: '取款', type: '2', value1: 2345.12}
            // {class: '交易并发（笔/秒）', country: '其它', type: '3', value1: 112.4},
            // {class: '交易并发（笔/秒）', country: '代缴费', type: '3', value1: 213.1},
            // {class: '交易并发（笔/秒）', country: '转账', type: '3', value1: 112.66},
            // {class: '交易并发（笔/秒）', country: '存款', type: '3', value1: 214.24},
            // {class: '交易并发（笔/秒）', country: '取款', type: '3', value1: 324.12},
        ]
    };
    handleChart(orgId) {
       // this.http.get(environment.gateway_server_url + '/cis/busi/terminal/stat/' + orgId).subscribe((res: any) => {
          //  this.chartData = res;
            this.http.get(environment.gateway_server_url + '/cis/busi/TermBootRate/' + orgId).subscribe((data: any) => {
                this.chartData.openTrend = data;
                this.chartData.opens = [0.998];
                // 遍历的是chartField的数据
                for (const module of this.modules) {
                    switch (module.type) {
                        case 'pie':
                            this.pieService.handlePie(module, this.chartData[module.index], this.chartData[module.index + 'Total']);
                            break;
                        case 'circle_pie':
                            this.circlePieService.handlePie(module, this.modulesThetaList);
                            break;
                        case 'polar':
                            this.polarService.handlePolar(module, this.chartData[module.index]);
                            break;
                        case 'fold':
                            this.foldService.handleFold(module, this.chartData[module.index]);
                            break;
                        case 'foldHistogram':
                            this.foldHistogramService.handleFoldHistogram(module, this.chartData[module.index]);
                            break;
                        case 'thetaList':
                            this.thetaListService.handleThetaList(module, this.modulesThetaList);
                            break;
                        case 'barGroup':
                            this.barGroupService.handleBarGroup(module, this.chartData[module.index]);
                            break;
                        default:
                            break;
                    }

                }

            });
      //  });

    }
    canDisabled = true;
    isVisible = false;
    okButton = '5'
    handleOk(): void {
        this.isVisible = false;
      }
    newMessage={
        title:'',
        content:''
    }
    ngOnInit() {
        this.getChartSet(this.userService.getUser().orgId);
        this.http.get(environment.gateway_server_url + '/cis/busi/AnnunciateManage/lastAnnunciateData').subscribe((data: any) => {
            //实际跑的时候要删掉||true
            console.log(Boolean(data.msg),'这是data')
            if(data.msg){
                if( data.msg.annunciateName && data.msg.annunciateContent ){
                    sessionStorage.setItem('showBadge','true')
                    this.newMessage.title = data.msg.annunciateName
                    this.newMessage.content = data.msg.annunciateContent
                    this.isVisible = true
                    let s = setInterval(()=>{
                        this.okButton = String(Number(this.okButton) -1)
                        if(this.okButton == '1'){
                            clearInterval(s)
                        }
                    },1000)
                    setTimeout(()=>{
                        this.okButton = "确定"
                        this.canDisabled = false
                    },5000)
                }else{
                    sessionStorage.setItem('showBadge','false')
                }
            }else{
                sessionStorage.setItem('showBadge','false')
            }
        });

    }

    handleFlag = false;

    ngAfterViewChecked() {

        if (this.loading && !this.handleFlag) {
            this.handleFlag = true;
            // let orgId = '';
            // if(this.sf.value.orgId == null){
            //     orgId = '3';
            // }
            setTimeout(() => this.handleChart(this.userService.getUser().orgId), 1000);
        }
    }
}
