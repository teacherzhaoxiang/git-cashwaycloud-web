import { Injectable, Injector, Inject } from '@angular/core';

/**
 * 折线图
 */
@Injectable()
export class ThetaListService {
    loaded: any;

    constructor() {

    }

    handleThetaList(module,data) {
        console.log(data);
        var other = data.other;
        data = data.data;
        console.log("aaaaaaaaaaaaa"+JSON.stringify(data));
        console.log("aaaaaaaaaaaaa"+JSON.stringify(other));

        var otherRatio = data[data.length-1].value1; // Other 的占比
        var otherOffsetAngle = otherRatio * Math.PI; // other 占的角度的一半

        //var otherRatio1 = data[data.length-1]; // Other 的占比
        //var otherOffsetAngle1 = otherRatio1 / 100 * Math.PI;
        //console.log("cccccccccc1 "+ JSON.stringify(otherRatio1));

//        data = [{
//            type1: 'ATM',
//            value1: 0.1683
//        },{
//            type1: 'CRS',
//            value1: 0.3713
//        },{
//            type1: 'TCR',
//            value1: 0.11
//        },{
//            type1: 'VTM',
//            value1: 0.111
//        },{
//            type1: 'STM',
//            value1: 0.1856
//        }, {
//            type1: '其他',
//            value1: 0.0538
//        }];
//        var other = [{
//            type1: '自助发卡机',
//            value1: 0.0177
//        }, {
//            type1: '银医通',
//            value1: 0.0144
//        }, {
//            type1: '助农终端',
//            value1: 0.0112
//        }, {
//            type1: '外汇兑换机',
//            value1: 0.0105
//        }];
        var chart = new G2.Chart({
            container: module.index,
            forceFit: true,
            height: module.ui.height,
            padding: [0, 30, 0, 0]
        });
        chart.legend(false);



        var view1 = chart.view({
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: 0.5,
                y: 1
            }
        });

        /*var data = [{
         item: '事例一',
         count: 40,
         nzPercent: 0.4
         }, {
         item: '事例二',
         count: 21,
         nzPercent: 0.21
         }, {
         item: '事例三',
         count: 17,
         nzPercent: 0.17
         }, {
         item: '事例四',
         count: 13,
         nzPercent: 0.13
         }, {
         item: '事例五',
         count: 9,
         nzPercent: 0.09
         }];*/

        view1.source(data, {
            percent: {
                formatter: function formatter(val) {
                    val = val * 100 + '%';
                    return val;
                }
            }
        });
        view1.coord('theta', {
            radius: 0.7,
            startAngle: 0 + otherOffsetAngle,
            endAngle: Math.PI * 2 + otherOffsetAngle
        });

        view1.intervalStack().position('value1').color('type1').label('value1', {
            formatter: function formatter(val, item) {
                let d = item.point;
                let label = val+'';
                if(module.ui.dataType == 'percent'){
                    label = parseFloat(val*100+"").toFixed(2) + "%";
                }
                view1.tooltip('d[module.ui.key]*label', function() {
                    return {
                        name: d[module.ui.key],
                        value: label
                    };
                })
                return d[module.ui.key] + ': ' + label;
            }
        }).style({
            lineWidth: 1,
            stroke: '#fff'
        });
        view1.render();



        /*view1.coord('theta', {
         radius: 0.7,
         startAngle: 0 + otherOffsetAngle,
         endAngle: Math.PI * 2 + otherOffsetAngle
         });
         view1.source(data);
         view1.intervalStack().position(module.ui.value).color(module.ui.key, module.ui.pieColors).opacity(1).label(module.ui.value, function() {
         return {
         offset: -10,
         useHtml: true,
         htmlTemplate: function htmlTemplate(text, item) {
         let d = item.point;
         let label = text+'';
         if(module.ui.dataType == 'nzPercent'){
         label = parseFloat(text*100+"").toFixed(2) + "%";
         }
         return '<span class="g2-label-item">' + d[module.ui.key] + '<br/>' + label + '</span>';
         }
         };
         });*/

        var view2 = chart.view({
            start: {
                x: 0.5,
                y: 0.1
            },
            end: {
                x: 1,
                y: 0.9
            }
        });
        view2.axis(false);
        view2.source(other, {
            value: {
                nice: false
            }
        });
        view2.intervalStack().position('1*'+module.ui.value).color(module.ui.key, module.ui.listColors).label(module.ui.value, {
            position: 'right',
            offsetX: 5,
            offsetY: 10,
            formatter: function formatter(text, item) {
                var d = item.point;
                let label = text;
                if(module.ui.dataType == 'percent'){
                    label = parseFloat(text*100+"").toFixed(2) + "%";
                }
                return d[module.ui.key] + ' ' + label;
            }
        });
        chart.render();

        /* 误差修正,但还是有 */
        if (!(other.length == 4 || other.length == 8)) {
            view2.get('coord').end.y = view2.get('coord').end.y *2;
        }

        drawLinkArea();
        chart.on('afterpaint', function() {
            drawLinkArea();
        });

        /*---------绘制连接区间-----------*/
        function drawLinkArea() {
            var canvas = chart.get('canvas');
            var container = chart.get('backPlot');
            var view1_coord = view1.get('coord');
            var center = view1_coord.center;
            var radius = view1_coord.radius;
            var interval_geom = chart.getAllGeoms()[1];
            var interval_container = interval_geom.get('shapeContainer');
            var interval_bbox = interval_container.getBBox();
            var view2_coord = view2.get('coord');
            //area points
            var pie_start1 = {
                x: center.x + Math.cos(Math.PI * 2 - otherOffsetAngle) * radius,
                y: center.y + Math.sin(Math.PI * 2 - otherOffsetAngle) * radius
            };
            var pie_start2 = {
                x: center.x + Math.cos(otherOffsetAngle) * radius,
                y: center.y + Math.sin(otherOffsetAngle) * radius
            };
            var interval_end1 = {
                x: interval_bbox.minX,
                y: view2_coord.end.y
            };
            var interval_end2 = {
                x: interval_bbox.minX,
                y: view2_coord.start.y
            };
            var path = [['M', pie_start1.x, pie_start1.y], ['L', pie_start2.x, pie_start2.y], ['L', interval_end2.x, interval_end2.y], ['L', interval_end1.x, interval_end1.y], ['Z']];
            container.addShape('path', {
                attrs: {
                    path: path,
                    fill: '#e9f4fe'
                }
            });
            canvas.draw();
        }

    }
}