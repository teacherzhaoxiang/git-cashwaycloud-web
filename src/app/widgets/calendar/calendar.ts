import { Component, OnInit } from '@angular/core';
import { ControlWidget } from '@delon/form';
@Component({
  selector: 'calendar',
  template: `
    <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error"
                  [showTitle]="''">
      <!-- 开始自定义控件区域 -->
        <nz-row>
            <nz-col>
                <label>{{schema.title}}<span style="display: inline-block;padding: 0 7px">:</span></label>
            </nz-col>
            <nz-col>
                <nz-range-picker
                        [nzFormat]="ui['displayFormat']"
                        [nzShowTime]="ui['nzShowTime']"
                        [nzPlaceHolder]="ui['nzPlaceHolder']"
                        [nzRanges]="ui['nzRanges']"
                        [nzDisabledTime]="ui['nzDisabledTime']"
                        [(ngModel)]="dateTime"
                        (nzOnOk)="confirmTime($event)"
                        (nzOnCalendarChange)="changeCalendar($event)"
                ></nz-range-picker>
            </nz-col>
        </nz-row>
      <!-- 结束自定义控件区域 -->
    </sf-item-wrap>
  `,
  styles:[``]
})
export class Calendar extends ControlWidget implements OnInit {

  /* 用于注册小部件 KEY 值 */
  static readonly KEY = 'calendar';

  // 组件所需要的参数，建议使用 `ngOnInit` 获取
  config: any;
  dateTime: any = '';
  showNum = 0;
  dateArr = [];
  ieBrowser = false;
  defaultStartTime = '';
  defaultEndTime = '';
  ngOnInit(): void {
    console.log(this.ui);
    this.config = this.ui.config || {};
    this.defaultStartTime = this.ui.defaultStartTime?this.ui.defaultStartTime:'00:00:00';
    this.defaultEndTime = this.ui.defaultEndTime?this.ui.defaultEndTime:'23:59:59';
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE || isEdge || isIE11) {
      this.ieBrowser = true;
    }else{
      this.ieBrowser = false;
    }
  }

  changeCalendar(e){
    if(e.length==2){
      const date1 = new Date(e[0]);
      const date2 = new Date(e[1]);
      let dataStr1,dataStr2;
      if(this.ieBrowser){
        dataStr1 = date1.getFullYear()+'/'+(date1.getMonth()+1)+'/'+date1.getDate();
        dataStr2 = date2.getFullYear()+'/'+(date2.getMonth()+1)+'/'+date2.getDate();
      }else {
        dataStr1 = date1.getFullYear()+'-'+(date1.getMonth()+1)+'-'+date1.getDate();
        dataStr2 = date2.getFullYear()+'-'+(date2.getMonth()+1)+'-'+date2.getDate();
      }
      this.dateTime=[new Date(dataStr1+' '+this.defaultStartTime),new Date(dataStr2+' '+this.defaultEndTime)];
      this.dateArr = [dataStr1,dataStr2];
    }
  }
  confirmTime(e){  //触发确定事件
    console.log(this.dateTime);
    let time1 = this.formatDate(this.dateTime[0]);
    let time2 = this.formatDate(this.dateTime[1]);
    this.setValue([this.dateArr[0]+' '+time1,this.dateArr[1]+' '+time2]);
  }
  formatDate(dateStr){  //格式化时间
    const date = new Date(dateStr);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    let timeStr = (hours>9?hours:'0'+hours)+':'+(minutes>9?minutes:'0'+minutes)+':'+(seconds>9?seconds:'0'+seconds);
    return timeStr;
  }
  // reset 可以更好的解决表单重置过程中所需要的新数据问题
  reset(value: string) {

  }
}
