import { Injectable, Injector, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {environment} from "./../../../../environments/environment"
import {ActivatedRoute,Params} from '@angular/router';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
/**
 * 折线图
 */
@Injectable()
export class BarGroupService {
    loaded: any;

    constructor(private http: _HttpClient,private message: NzMessageService,private route: ActivatedRoute,private modalSrv: NzModalService) {}


    handleBarGroup(module, data) {

// data = [
//             {class: '交易笔数', country: '其它', type: '1', value1: 34325},
//             {class: '交易笔数', country: '代缴费', type: '1', value1: 15875},
//             {class: '交易笔数', country: '转账', type: '1', value1: 4564},
//             {class: '交易笔数', country: '存款', type: '1', value1: 7568},
//             {class: '交易笔数', country: '取款', type: '1', value1: 13023},
//             {class: '交易金额（万元）', country: '其它', type: '2', value1: 0},
//             {class: '交易金额（万元）', country: '代缴费', type: '2', value1: 1232.18},
//             {class: '交易金额（万元）', country: '转账', type: '2', value1: 2311.34},
//             {class: '交易金额（万元）', country: '存款', type: '2', value1: 1651.27},
//             {class: '交易金额（万元）', country: '取款', type: '2', value1: 2345.12},
//             {class: '交易并发（笔/秒）', country: '其它', type: '3', value1: 112.4},
//             {class: '交易并发（笔/秒）', country: '代缴费', type: '3', value1: 213.1},
//             {class: '交易并发（笔/秒）', country: '转账', type: '3', value1: 112.66},
//             {class: '交易并发（笔/秒）', country: '存款', type: '3', value1: 214.24},
//             {class: '交易并发（笔/秒）', country: '取款', type: '3', value1: 324.12},
//         ];
//             this.http.get(environment.hall_server_url + "/logrt/trade/000001").subscribe((res:any)=>{
                  //data = res;
                let chart = new G2.Chart({
                    container: module.index,
                    forceFit: true,
                    height: module.ui.height,
                    padding: [20, 20, 20, 70]
                });
                chart.source(data);
                chart.coord().transpose();
                chart.legend(false);
                chart.facet('rect', {
                    fields: ['class1'],
                    colTitle: {
                        offsetY: -15,
                        style: {
                            fontSize: 14,
                            textAlign: 'center',
                            fontWeight: 300,
                            fill: '#8d8d8d'
                        }
                    },
                    eachView: function eachView(view, facet) {
                        console.log(JSON.stringify(facet));
                        if (facet.colIndex === 0) {
                            view.axis(module.ui.key, {
                                label: {
                                    textStyle: {
                                        fill: '#8d8d8d',
                                        fontSize: 12
                                    }
                                },
                                tickLine: {
                                    alignWithLabel: false,
                                    length: 0
                                },
                                line: {
                                    lineWidth: 0
                                }
                            });

                            view.axis(module.ui.value, false);
                        } else {
                            view.axis(false);
                        }
                        let color = module.ui.colors[facet.colIndex];
                        view.intervalStack().position(module.ui.key+'*'+module.ui.value).color(color).opacity(1).size(20).label(module.ui.value+'*'+module.ui.type, function (value, type) {
                            console.log(type)
                            let offset = value < module.ui.threshold[type] ? 10 : -4;
                            let fill = value < module.ui.threshold[type] ? '#525253' : '#ffffff';
                            let textAlign = value < module.ui.threshold[type] ? 'start' : 'end';
                            return {
                                offset: offset,
                                textStyle: {
                                    fill: "#27261a",
                                    fontSize: 12,
                                    textAlign: textAlign,
                                    fontWeight: 300,
                                    shadowBlur: 2,
                                    shadowColor: 'rgba(0, 0, 0, .45)'
                                }
                            };
                        });
                    }
                });
                chart.render();
            // });




    }
}
