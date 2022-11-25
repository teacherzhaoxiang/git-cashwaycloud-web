import { Component, OnInit } from '@angular/core';
import { ControlWidget } from '@delon/form';

@Component({
    selector: 'sf-picture-label',
    template: `
  <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
    <!-- 开始自定义控件区域 -->
      <div title="{{title}}">
          <!--<input  [ngModel]="value" (ngModelChange)="change($event)"/>-->
          <img src="{{src}}" style="width: 32px;height: 32px;margin-right: 32px;margin-left: 32px" [style.background-color]="color"/>
          <label>{{label}}</label>
      </div>
    <!-- 结束自定义控件区域 -->
  </sf-item-wrap>`
})
export class PictureLabelWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'picture-label';

    // 组件所需要的参数，建议使用 `ngOnInit` 获取
    config: any;
    loadingTip: string;
    style:any;
    src:string;
    label:string;
    color:any;
    title:any;
    detailKey:string;
    ngOnInit(): void {
        this.loadingTip = this.ui.loadingTip || '加载中……';
        this.config = this.ui.config || {};
        this.style = this.ui.style || {};
        // this.src = this.ui.src;
        this.detailKey = this.ui.detailKey;
    }
    ngAfterViewInit():void{
    }
    // reset 可以更好的解决表单重置过程中所需要的新数据问题
    reset(value: string) {
        this.src = this.config.src;
        this.title = this.sfComp.formData[this.detailKey];
        let enums = this.config.enum;
        if( enums[this.value]){
            this.color = enums[this.value].color;
            this.label = enums[this.value].text
        }else{
            this.color = "gray";
            this.label = "未知"
        }
    }

    change(value: string) {

    }
}
