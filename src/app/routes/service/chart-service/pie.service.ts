import { Injectable, Injector, Inject } from '@angular/core';

/**
 * 环图
 */
@Injectable()
export class PieService {
    loaded:any;
    constructor(

    ) {
    }
    handlePie(module,data,sum){
        let ds = new DataSet();
        let dv = ds.createView().source(data);

        let chart = new G2.Chart({
            container: module.index,
            forceFit: true,
            height: module.ui.height,
            padding: 'auto'
        });
        chart.source(dv);
        chart.tooltip(false);
        chart.coord('theta', {
            radius: module.ui.radius,
            innerRadius: module.ui.innerRadius
        });
        chart.filter('percent',val =>{
            return val > 0;
        });
        chart.intervalStack().position('percent').color('type', module.ui.colors).label('percent', {
            // offset: -18,
            textStyle: {
                fill: 'black',
                fontSize: 20,
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)'
            },
            rotate: 0,
            autoRotate: false,
            formatter: function formatter(text, item) {
                if(module.ui.dataType == "percent")
                    return (parseFloat(text) * 100).toFixed(2) + '%';
                else return text;
            }
        }).style({
            lineWidth: 1,
            stroke: '#fff'
        });

        // chart.guide().html({
        //     position: ['50%', '55%'],
        //     html: '<div id=""'+module.index+'" class="g2-guide-html"><p class="title" style="font-size: 1rem;">'+module.ui.title+'</p><p class="value">'+sum+'</p></div>'
        // });
        chart.tooltip({
            showTitle: false,
            itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        });
        chart.render();
    }

}
