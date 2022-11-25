import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as echarts from 'echarts';

@Component({
    selector: 'app-map',
    template: `
        <div style="height: 430px"  echarts [options]="regionOptions"></div>
    `
})
export class AppMapComponent implements OnInit {
    regionOptions;

    constructor(
        private http: HttpClient
    ) { }

    ngOnInit() {
        //  china.json 的路径需要正确填写
        this.http.get('assets/map/chinaMap.json')
            .subscribe(geoJson => {
                echarts.registerMap('China', geoJson);
                this.regionOptions = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}：{c}'
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            dataView: { readOnly: false },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    visualMap: {
                        min: 90,
                        max: 100,
                        text: ['High', 'Low'],
                        realtime: false,
                        calculable: true,
                        inRange: {
                            color: ['#ADCDEF', '#2171C1']
                        }
                    },
                    series: [
                        {
                            type: 'map',
                            mapType: 'China',  //  与注册时的名字保持统一   echarts.registerMap('China', geoJson);
                            itemStyle: {
                                normal: {
                                    areaColor: '#AAD5FF',
                                    borderColor: 'white',
                                    label: { show: true, color: 'white'},

                                },
                                emphasis: {
                                    areaColor: '#A5DABB',
                                    label: { show: true, color: '#ffa102',formatter: '{b}：{c}',fontSize:20,fontWeight:'bold'},
                                }
                            },
                            zoom: 1.2,
                            geoCoord:{'Islands':[113.95, 52.26]},
                            data: [
                                { name: '北京', value: 99.1,selected:true },
                                { name: '天津', value: 98.5},
                                { name: '重庆', value: 98.6},
                                { name: '上海', value: 98.7 },
                                { name: '湖南', value: 98.8 },
                                { name: '广东', value: 98.9 },
                                { name: '福建', value: 98.9 },
                                { name: '江西', value: 99.1 },
                                { name: '四川', value: 99.1 },
                                { name: '广西', value: 99.2 },
                                { name: '新疆', value: 98.7 },
                                { name: '西藏', value: 98.8 },
                                { name: '青海', value: 99.1 },
                                { name: '甘肃', value: 99.0 },
                                { name: '宁夏', value: 99.1 },
                                { name: '内蒙古', value: 99.1 },
                                { name: '海南', value: 98.5 },
                                { name: '山西', value: 99.1 },
                                { name: '陕西', value: 99.1 },
                                { name: '云南', value: 98.6 },
                                { name: '贵州', value: 99.0 },
                                { name: '湖北', value: 99.0 },
                                { name: '浙江', value: 99.1 },
                                { name: '安徽', value: 99.2 },
                                { name: '河南', value: 98.8 },
                                { name: '山东', value: 98.8 },
                                { name: '江苏', value: 99.2 },
                                { name: '河北', value: 99.1 },
                                { name: '辽宁', value: 99.0 },
                                { name: '吉林', value: 98.5 },
                                { name: '黑龙江', value: 98.6 },
                                { name: '台湾', value: 98.6 }]
                        }
                    ]
                };
            });
        this.changeInterval();
    };

    changeInterval(){
        console.log("change selected")
        setInterval(()=>{
            let op = JSON.parse(JSON.stringify(this.regionOptions));
            let data:Array<any> = op.series[0].data;
            let length = data.length;
            let changeFlag = false;
            let aa = data.forEach((item,index)=>{
                if(item.selected && !changeFlag){
                    item.selected = false;
                    let next = (index + 1)%length;
                    data[next].selected = true;
                    changeFlag = true;
                }
            })
            op.series[0].data = data;
            this.regionOptions = JSON.parse(JSON.stringify(op));
        },3000);
    }
}
