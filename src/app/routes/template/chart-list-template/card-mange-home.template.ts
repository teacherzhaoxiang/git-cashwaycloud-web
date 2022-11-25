import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {$} from 'protractor';
import {PieService} from '../../service/chart-service/pie.service';
import {PolarService} from '../../service/chart-service/polar.service';
import {FoldService} from '../../service/chart-service/fold.service';
import {FoldHistogramService} from '../../service/chart-service/fold-histogram.service';
import {ThetaListService} from '../../service/chart-service/theta-list.service';
import {BarGroupService} from '../../service/chart-service/bar-group.service';
import {environment} from '@env/environment';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {UtilsService} from "../../../utils.Service";
import {UserService} from "../../service/user.service";

@Component({
    selector: 'card-manage-home-template',
    templateUrl: './card-mange-home.template.html',
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
            :host ::ng-deep ::-webkit-scrollbar{display:none;}
            :host ::ng-deep html,body{overflow:hidden;height:100%;margin:0;}
        `]
})
export class CardMangeHomeTemplateComponent implements OnInit {
    modules: any = [{size: 1}];
    modulesThetaList: any = [{size: 1}];
    loading = false;
    record: any;

    @ViewChild('sf',{ static: false })
    sf:SFComponent;
    searchSchema:any = {
        properties:{
            orgId: {
                type: "string", title: "机构", maxLength: 36,
                ui: {
                    widget: 'tree-select',
                    width:300,
                    change:(ngModel:any)=>{
                        if(this.sf!=null && this.sf.value !=null && this.sf.value.orgId !=undefined) {
                            console.log("=======this.sf.value.orgId==="+ngModel);
                        this.getChartSet(ngModel);
                    }
                    },
                    asyncData: () => {
                        let dd = this.http.get<SFSchemaEnumType[]>(environment.manage_server_url+"/sys/orgTree")
                        return dd;
                    }
                }
            }

        }
    };


    constructor(private http: _HttpClient,
                private pieService: PieService,
                private polarService: PolarService,
                private foldService: FoldService,
                public utilsService: UtilsService,
                private foldHistogramService: FoldHistogramService,
                private thetaListService: ThetaListService,
                private barGroupService: BarGroupService,
                private userService:UserService) {
    }


    // searchData(){
    //     console.log("=====searchData==============");
    //
    // }



    getChartSet(orgId) {
        this.http.get('assets/dynamicTest/card-mange-chart-field.json').subscribe((res: any) => {
            this.loading = true;
            if (JSON.stringify(this.modules) == JSON.stringify(res.resource)) {
                this.handleFlag = true;
            } else {
                this.handleFlag = false;
            }
            this.modules = res.resource;
            console.log("getChartSet orgId: ", this.record);
            this.handleChart(orgId);
        });

    }

    chartData: any;


    handleChart(orgId) {
        this.http.get(environment.gateway_server_url + '/cardmanage/card/terminal/manage/findStatusByorgId?orgId='+orgId).subscribe((res: any) => {

            if(res['termStatusTotal'] == null || res['termStatusTotal'] == 0){
                document.getElementById("have-terminal").style.display = "none";
                document.getElementById("no-terminal").style.display = "block";
                return;
            }
        document.getElementById("have-terminal").style.display = "block";
        document.getElementById("no-terminal").style.display = "none";
            this.chartData = res;
            for (const module of this.modules) {
                    let div = document.getElementById(module.index);
                    if(div !=  null){
                        div.innerHTML = "";
                    }

                    switch (module.type) {
                        case 'pie':
                            this.pieService.handlePie(module, this.chartData[module.index], this.chartData[module.index + 'Total']);
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
    }



    ngOnInit() {
        this.record = {"orgId":this.userService.user.orgId};
        console.log("orgId: ", this.record);
        this.getChartSet(this.userService.user.orgId)
        //this.getChartSet();
    }

    handleFlag = false;

    // ngAfterViewInit(){
    //     setTimeout(this.init(), 5000);
    // }
    //
    // init(){
    //    this.record = {"orgId":this.userService.user.orgId};
    //    console.log("=====init======="+this.userService.user.orgId);
    //   //  this.handleChart(this.userService.user.orgId)
    // }
}
