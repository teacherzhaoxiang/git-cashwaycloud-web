import { Component, OnInit } from '@angular/core';
import { ControlWidget } from '@delon/form';

@Component({
    selector: 'sf-text-tag',
    template: `
  <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
    <!-- 开始自定义控件区域 -->
      <div >
          <!--<input  [ngModel]="value" (ngModelChange)="change($event)"/>-->
          <label>{{label}}</label>
          <nz-tag [nzColor]="'blue'" style="padding-left: 10px;">{{tag}}</nz-tag>
      </div>
    <!-- 结束自定义控件区域 -->
  </sf-item-wrap>`
})
export class TextTagFormItemWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'label-tag';

    // 组件所需要的参数，建议使用 `ngOnInit` 获取
    tag:string;
    color:any;
    label:string;
    tagKey:string;
    ngOnInit(): void {
        this.tagKey = this.ui.tagKey;
    }
    ngAfterViewInit():void{
    }
    // reset 可以更好的解决表单重置过程中所需要的新数据问题
    reset(value: string) {
        this.label = value;
        if(this.sfComp.formData[this.tagKey] && this.sfComp.formData[this.tagKey] != "")
            this.tag = this.sfComp.formData[this.tagKey]
        else
            this.tag = "-"
    }

    change(value: string) {
    }
}
