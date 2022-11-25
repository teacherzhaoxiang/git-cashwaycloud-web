import {Component, OnInit} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {environment} from "@env/environment";
@Component({
    selector: 'equipment-monitor',
    template: `        
        <nz-card style="height: 100%;">
            <nz-table class="monitor"  [nzData]="dataList"  nzShowPagination="false">
                <thead>
                <tr>
                    <th *ngFor="let i of objectKeys(config.viewFields)" [nzAlign]="config.viewFields[i]['nzAlign']">{{config.viewFields[i]['title']}}</th>
                </tr>
                </thead>
                <tbody>  
                <tr *ngFor="let data of dataList; index as i">
                    <td *ngFor="let i of objectKeys(config.viewFields)" [nzAlign]="config.viewFields[i]['nzAlign']">
                        <div *ngIf="config.viewFields[i]['term_status']==null" class="item" [ngStyle]="{'background':config.viewFields[i]['backgroundColor']}">{{ data[i]?data[i]:0 }}</div>
                        <a *ngIf="config.viewFields[i]['term_status']!=null" class="item" [routerLink]="['/template/tab/cis|monitor_term_view/tree-table-template','cis|monitor_term_view']" [queryParams]="{org_id:data['id'],term_status:config.viewFields[i]['term_status']}" [ngStyle]="{'background':config.viewFields[i]['backgroundColor']}">{{ data[i]?data[i]:0 }}</a>
                    </td>
                    <!--<td>{{ data.name }}</td>-->
                    <!--<td nzAlign="center">{{ data.normal?data.normal:0 }}</td>-->
                    <!--<td nzAlign="center">{{ data.stop?data.stop:0 }}</td>-->
                    <!--<td nzAlign="center">{{ data.maintanance?data.maintanance:0 }}</td>-->
                    <!--<td nzAlign="center">{{ data.warn?data.warn:0 }}</td>-->
                    <!--<td nzAlign="center">{{ data.offline?data.offline:0 }}</td>-->
                    <!--<td nzAlign="center">{{ data.online?data.online:0 }}</td>-->
                    <!--<td nzAlign="center">{{ data.total?data.total:0 }}</td>-->
                    <!--<td nzAlign="center">{{ data.stopRate?data.stopRate:0 }}</td>-->
                </tr>
                </tbody>
            </nz-table>
            <!--<a class="item" [routerLink]="['/template/tab/monitor_term_view/tree-table-template','monitor_term_view']" [queryParams]="{id:3}" >agudasbd</a>-->
        </nz-card>
        

    `,
    styles:[`    
        :host ::ng-deep .ant-table-thead > tr > th{
            background: linear-gradient(180deg, gainsboro,transparent);
            border-right: 1px solid #e8e8e8 !important;
        }
        :host ::ng-deep .ant-table-bordered .ant-table-thead > tr > th{
            border-right: 1px solid #e8e8e8 !important;
        }
        /*:host ::ng-deep .ant-table,:host ::ng-deep .ant-table-thead{*/
            /*line-height: 0.5;*/
        /*}*/
        .ant-table-tbody > tr > td{
            background: #FFFFFF;
        }
        :host ::ng-deep .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
            padding: 4px 8px;
        }
        :host ::ng-deep .ant-card-body{
            height: 100%;
        }
        :host ::ng-deep .monitor tbody .item{
            display: block;
            color: rgba(0, 0, 0, 0.85);
        }
    `]
})
export class EquipmentMonitorComponent implements OnInit {
    objectKeys = Object.keys;
    config = {
        ui:{},
        viewFields:{
            name:{title:'',nzAlign:''},
            normal:{title:'正常',nzAlign:'center',backgroundColor:'lightgreen',term_status:0},
            stop:{title:'暂停',nzAlign:'center',backgroundColor:'red',term_status:1},
            maintanance:{title:'维护',nzAlign:'center',backgroundColor:'orange',term_status:2},
            warn:{title:'预警',nzAlign:'center',backgroundColor:'yellow',term_status:4},
            offline:{title:'断网',nzAlign:'center',backgroundColor:'gray',term_status:3},
            online:{title:'在线台数',nzAlign:'center',backgroundColor:''},
            total:{title:'总台数',nzAlign:'center',backgroundColor:''},
            stopRate:{title:'故障率',nzAlign:'center',backgroundColor:''}
        }
    }
    dataList = [];
    constructor(private http: _HttpClient) {}

    ngOnInit(): void {
        this.getDataList();
    }
    getDataList(){
        let url = environment.gateway_server_url+'/cis/busi/report/status/org/statisticalDetail';
        this.http.get(url).subscribe((res:any) =>{
            debugger
            console.log(res)
            this.dataList = res;
        })
    }
}
