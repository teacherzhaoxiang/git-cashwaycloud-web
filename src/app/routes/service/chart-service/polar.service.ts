import { Injectable, Injector, Inject } from '@angular/core';

/**
 * 仪表盘
 */
@Injectable()
export class PolarService {
    loaded: any;
    constructor(

    ) {
    }
    handlePolar(module, data) {
        console.log('polar');
        const min: number = module.ui.min;
        const max: number = module.ui.max;
        const length: number = module.ui.colors.length;
        const per: number = (module.ui.max - module.ui.min) / length;
        const Shape = G2.Shape;
// 自定义Shape 部分
        Shape.registerShape('point', 'pointer', {
            drawShape: function drawShape(cfg, group) {
                const center = this.parsePoint({ // 获取极坐标系下画布中心点
                    x: 0,
                    y: 0
                });
                // 绘制指针
                group.addShape('line', {
                    attrs: {
                        x1: center.x,
                        y1: center.y,
                        x2: cfg.x,
                        y2: cfg.y,
                        stroke: cfg.color,
                        lineWidth: 5,
                        lineCap: 'round'
                    }
                });
                return group.addShape('circle', {
                    attrs: {
                        x: center.x,
                        y: center.y,
                        r: 9.75,
                        stroke: cfg.color,
                        lineWidth: 4.5,
                        fill: '#fff'
                    }
                });
            }
        });

        const chart = new G2.Chart({
            container: module.index,
            forceFit: true,
            height: module.ui.height,
            padding: [0, 0, 30, 0],
            animate: false
        });
        chart.source(data);

        chart.coord('polar', {
            startAngle: -9 / 8 * Math.PI,
            endAngle: 1 / 8 * Math.PI,
            radius: 0.75
        });
        chart.scale('value', {
            min: module.ui.min,
            max: module.ui.max,
            tickInterval: 1,
            nice: false
        });

        chart.axis('1', false);
        chart.axis('value', {
            zIndex: 2,
            line: null,
            label: {
                offset: -20,
                textStyle: {
                    fontSize: 18,
                    fill: '#CBCBCB',
                    textAlign: 'center',
                    textBaseline: 'middle'
                }
            },
            tickLine: {
                length: -24,
                stroke: '#fff',
                strokeOpacity: 1
            },
            grid: null
        });
        chart.legend(false);
        chart.point().position('value*1').shape('pointer').color('value', function (val) {
            const index: number = parseInt((val - min) / per + '');
            return module.ui.colors[index];
        }).active(false);

        draw(data);

        function draw(data) {

            const val: number = data[0];
            const index: number = parseInt((val - min) / per + '');
            const lineWidth = 25;
            chart.guide().clear();
            // 绘制仪表盘背景
            chart.guide().arc({
                top: false,
                start: [min, 0.92],
                end: [max, 0.92],
                style: { // 底灰色
                    stroke: '#CBCBCB',
                    lineWidth: lineWidth
                }
            });

            for (let i = 0; i < length; i++) {
                if (val > min + per * (i + 1)) {
                    chart.guide().arc({
                        start: [min + per * i, 0.92],
                        end: [min + per * (i + 1), 0.92],
                        style: {
                            stroke: module.ui.colors[i],
                            lineWidth: lineWidth
                        }
                    });
                } else {
                    chart.guide().arc({
                        start: [min + per * i, 0.92],
                        end: [val, 0.92],
                        style: {
                            stroke: module.ui.colors[i],
                            lineWidth: lineWidth
                        }
                    });
                    break;
                }
            }

            let value: string = val + '';
            if (module.ui.showType == 'percent') {
                // value = (parseFloat(val) * 100).toFixed(2) + '%';
                value = (val * 100).toFixed(2) + '%';
            }

            // 绘制指标数字
            chart.guide().html({
                position: ['50%', '95%'],
                html: '<div style="width: 300px;text-align: center;">' + '<p style="font-size: 20px; color: #545454;margin: 0;">' + module.ui.title + '</p>' + '<p style="font-size: 36px;color: #545454;margin: 0;">' + value + '</p>' + '</div>'
            });
            chart.changeData(data);
        }
    }
}
