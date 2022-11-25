import { Component, OnInit } from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {environment} from "@env/environment";
@Component({
    selector: 'trade_monitor',
    template: `
        <!--交易数据查询详情控件-->
        <div class="tables" *ngFor="let key of objectKeys(schema.editField)" nz-col nzSpan="6" style="background: #aaaaaa">
            <div class="row title" nz-row>
                <div *ngFor="let item of schema.editField[key]" class="item" nz-col [nzSpan]="'8'">{{item['text']}}</div>
            </div>
            <div class="row" *ngFor="let row of objectKeys(dataList[key]?dataList[key]:{})" nz-row>
                <div nz-col [nzSpan]="'8'" *ngFor="let item of schema['editField'][key],index as i">{{dataList[key][row][item['key']]}}</div>
            </div>
            <ng-template ngIf="lackRow[key]">
                <div class="row" *ngFor="let index of lackRow[key]" nz-row>
                    <div  *ngFor="let item of schema.editField[key]" nz-col [nzSpan]="'8'">{{item.key=='title'?'-':0 }}</div>
                </div>
            </ng-template>
            <div class="noData" *ngIf="objectKeys(dataList).length<1">暂无数据</div>
        </div>
    `,
    styles: [`
        .tables {
            text-align: center;
            border: 1px solid #ececec;
            margin-bottom: 24px;
            cursor: default;
        }

        .tables .row:nth-of-type(odd) {
            background: #fdf8e5;
        }

        .tables .row:nth-of-type(even) {
            background: #fff;
        }
        .tables .title .item{
            background: #d4e4f1;
            font-weight: bold;
        }
        .tables .row .hidden{
            visibility: hidden !important;
        }
        .noData{
            background: #fff;
            padding: 10px 0;
            color: #aaaaaa;
        }
    `]
})
export class TradeMonitorComponent implements OnInit {
    objectKeys = Object.keys;
    schema = {
        editField:{ //渲染表格头数据
            withdraw:[{text:'交易名称',key:'title'},{text:'笔数',key:'num'},{text:'金额',key:'amt'}],
            query:[{text:'交易名称',key:'title'},{text:'笔数',key:'num'},{text:'金额',key:'amt'}],
            transfer:[{text:'交易名称',key:'title'},{text:'笔数',key:'num'},{text:'金额',key:'amt'}],
            deposit:[{text:'交易名称',key:'title'},{text:'笔数',key:'num'},{text:'金额',key:'amt'}]
        },
        properties:{ //渲染表格列对应的数据类型
            withdraw:{title:'取款'},
            query:{title:'查询'},
            transfer:{title:'转账'},
            deposit:{title:'存款'},
            own:{title:'本行'},
            other:{title:'他行'},
            reverse:{title:'冲正'},
            total:{title:'全部'}
        }
    };
    dataList:any = {};
    constructor(private http:_HttpClient) {

    }
    rows = 0;//记录行数最多的一个表格的行数
    lackRow = {};//行数补差
    ngOnInit() {
        this.getTables();

    }
    getTables(){
        let url = environment.gateway_server_url+'/cis/busi/report/trade/statisticalDetail';
        this.http.get(url).subscribe((res:any) =>{
            this.dataList = res;
            for(let i in this.schema.editField){
                let len = 0;
                if(this.dataList[i]){
                    len = this.objectKeys(this.dataList[i]).length;
                }
                this.lackRow[i] = {len:len};
                this.rows = len>this.rows?len:this.rows;
            }
            for(let i in this.lackRow){
                let lack = this.rows-this.lackRow[i]['len'];
                lack = lack>0?lack:0;
                this.lackRow[i] = new Array(lack);
            }
            let newD = {};
            for(let key in this.dataList){
                for(let child_key in this.dataList[key]){
                    if(!!this.schema.properties[child_key]){
                        this.dataList[key][child_key].title = this.schema.properties[child_key].title;
                    }
                }
                //排序数据
                let arrData = this.dataList[key];
                newD[key] = {};
                let keysSorted = Object.keys(arrData).sort(function(a,b){
                    return arrData[a].index-arrData[b].index;
                });
                for(let i=0;i<keysSorted.length;i++){
                    newD[key][keysSorted[i]] = this.dataList[key][keysSorted[i]];
                }
            }
            this.dataList = newD;
        })
    }
}
