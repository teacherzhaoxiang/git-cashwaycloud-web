import { Injectable, Injector, Inject } from '@angular/core';

/**
 * 折线图
 */
@Injectable()
export class FoldService {
    loaded: any;

    constructor() {
    }

    handleFold(module,data) {
        let ds = new DataSet();
        let dv = ds.createView().source(data);
// fold 方式完成了行列转换，如果不想使用 DataSet 直接手工转换数据即可
        dv.transform({
            type: 'fold',
            fields: ['Tokyo', 'London'], // 展开字段集
            key: 'city', // key字段
            value: 'temperature' // value字段
        });
        let chart = new G2.Chart({
            container: module.index,
            forceFit: true,
            height: module.ui.height
        });
        chart.source(dv, {
            month: {
                range: [0, 1]
            }
        });
        chart.tooltip({
            crosshairs: {
                type: 'line'
            }
        });
        chart.axis('temperature', {
            label: {
                formatter: function formatter(val) {
                    return val + '°C';
                }
            }
        });
        chart.line().position('month*temperature').color('city').shape('smooth');
        chart.point().position('month*temperature').color('city').size(4).shape('circle').style({
            stroke: '#fff',
            lineWidth: 1
        });
        chart.render();
    }
}