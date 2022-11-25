import { Component, OnInit } from '@angular/core';
import { ControlWidget } from '@delon/form';
@Component({
  selector: 'title-widget',
  template: `
    <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error"
                  [showTitle]="''">
      <!-- 开始自定义控件区域 -->
      <div [ngStyle]="{'width':'100%','font-size':ui['font-size'],'color':ui['color'],'text-align':ui['text-align'],'background':ui['background']}">
        {{schema.title}}
      </div>
      <!-- 结束自定义控件区域 -->
    </sf-item-wrap>
  `,
  styles:[``]
})
export class TitleWidgetComponent extends ControlWidget implements OnInit {

  /* 用于注册小部件 KEY 值 */
  static readonly KEY = 'title-widget';

  // 组件所需要的参数，建议使用 `ngOnInit` 获取
  config: any;
  loadingTip: string;

  ngOnInit(): void {
    this.loadingTip = this.ui.loadingTip || '加载中……';
    this.config = this.ui.config || {};
  }

  // reset 可以更好的解决表单重置过程中所需要的新数据问题
  reset(value: string) {

  }

  change(value: string) {
    if (this.ui.change) this.ui.change(value);
    this.setValue(value);
  }

}
