import { Component, OnInit } from '@angular/core';
import { ControlWidget } from '@delon/form';

@Component({
    selector: 'sf-video-label',
    template: `
  <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
    <!-- 开始自定义控件区域 -->
      <div >
          <!--<input  [ngModel]="value" (ngModelChange)="change($event)"/>-->
          <video class="video-js vjs-default-skin vjs-big-play-centered" autoplay="autoplay" style="vertical-align: middle;"
                 controls preload="auto" [style.width]="style.width" [style.height]="style.height" [src]="src" loop="loop">
              <!--<source  type='mp4/flv'>-->
          </video>
      </div>
    <!-- 结束自定义控件区域 -->
  </sf-item-wrap>`
})
export class VideoFormItemWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'video';

    // 组件所需要的参数，建议使用 `ngOnInit` 获取
    src:string;
    style:any;
    ngOnInit(): void {
        console.log("PictureLabel");
        console.log(this.value);
        this.src = this.ui.src;
        this.style = this.ui.style;
    }
    ngAfterViewInit():void{
        console.log(this.value)
    }
    // reset 可以更好的解决表单重置过程中所需要的新数据问题
    reset(value: string) {
        console.log(value);
    }

    change(value: string) {
    }
}