import { Injectable } from "@angular/core";

@Injectable()
export class CirclePieService {

    constructor() {
    }

    handlePie(module,data) {
        // data = data.data.concat(data.other);
        data = data.data;
        //console.log(data,"============================");
        var chart = new G2.Chart({
            container: module.index,
            forceFit: true,
            height: module.ui.height,
        });
        chart.source(data, {
            value1: {
                formatter: function formatter(val) {
                    val = (val * 100).toFixed(1) + '%';
                    return val;
                }
            }
        });
        chart.coord('theta');
        chart.tooltip({
            showTitle: false
        });
        chart.intervalStack().position('value1').color('type1').label('value1', {
            offset: -40,
            // autoRotate: false,
            textStyle: {
                textAlign: 'center',
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)'
            }
        }).tooltip('type1*value1', function(item, percent) {
            percent = percent * 100 + '%';
            return {
                name: item,
                value: percent
            };
        }).style({
            lineWidth: 1,
            stroke: '#fff'
        });
        chart.render();
    }
}
