import { Component, OnInit } from '@angular/core';
import { ControlWidget } from '@delon/form';

@Component({
    selector: 'sf-line',
    template: `
  <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]=false>
    <!-- 开始自定义控件区域 -->
      <hr>
    <!-- 结束自定义控件区域 -->
  </sf-item-wrap>`
})
export class LineFormItemWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'line';

    // 组件所需要的参数，建议使用 `ngOnInit` 获取
    ngOnInit(): void {
    }
    ngAfterViewInit():void{
    }
    // reset 可以更好的解决表单重置过程中所需要的新数据问题
    reset(value: string) {
    }

    change(value: string) {
    }
}