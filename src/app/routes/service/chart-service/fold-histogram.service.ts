import { Injectable, Injector, Inject } from '@angular/core';

/**
 * 折线图
 */
@Injectable()
export class FoldHistogramService {
    loaded: any;

    constructor() {
    }

    handleFoldHistogram(module,data) {
        console.log(JSON.stringify(module));
        let chart = new G2.Chart({
            container: module.index,
            forceFit: true,
            height: module.ui.height,
            padding: [30,100,80,80]
        });
        let scaleConfig = {};
        if(module.ui.leftMin){
            scaleConfig[module.ui.leftKey] = {min:module.ui.leftMin};
        }
        if(module.ui.rightMin){
            scaleConfig[module.ui.rightKey] = {min:module.ui.rightMin};
        }
        chart.source(data, scaleConfig);
        chart.legend({
            custom: true,
            allowAllCanceled: true,
            items: [{
                value: module.ui.leftTitle,
                marker: {
                    symbol: 'square',
                    fill: module.ui.leftColor,
                    radius: 5
                }
            }, {
                value: module.ui.rightTitle,
                marker: {
                    symbol: 'hyphen',
                    stroke: module.ui.rightColor,
                    radius: 5,
                    lineWidth: 3
                }
            }],
            onClick: function onClick(ev) {
                var item = ev.item;
                var value = item.value;
                var checked = item.checked;
                var geoms = chart.getAllGeoms();
                for (var i = 0; i < geoms.length; i++) {
                    var geom = geoms[i];
                    if (geom.getYScale().field === value) {
                        if (checked) {
                            geom.show();
                        }
                    } else {
                        geom.hide();
                    }
                }
            }
        });
        chart.axis(module.ui.rightKey, {
            grid: null,
            label: {
                textStyle: {
                    fill: module.ui.rightColor
                }
            }
        });
        chart.interval().position(module.ui.horizontalKey+'*'+module.ui.leftKey).color(module.ui.leftColor);
        chart.line().position(module.ui.horizontalKey+'*'+module.ui.rightKey).color(module.ui.rightColor).size(3).shape('smooth');
        chart.point().position(module.ui.horizontalKey+'*'+module.ui.rightKey).color(module.ui.rightColor).size(3).shape('circle');
        chart.render();
    }
}