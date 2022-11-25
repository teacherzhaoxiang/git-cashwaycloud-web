import { Component, OnInit } from "@angular/core";
import { ControlWidget } from "@delon/form";

let TIMEOUT = null;

@Component({
    selector: "button-widget",
    template: `
        <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error"
                      [showTitle]="''">
            <!-- 开始自定义控件区域 -->
            <div style="display: flex;justify-content: flex-end;padding-top: 8px;">
                <button nz-button nzType="primary"
                        (click)="changeLoad(schema['buttons'][0]['search'])">{{schema['buttons'][0]['title']}}
                </button>
                <button nz-button nzType="default" (click)="schema['buttons'][1]['reset']()">
                    {{schema['buttons'][1]['title']}}
                </button>
            </div>
            <!-- 结束自定义控件区域 -->
        </sf-item-wrap>
    `,
    styles: [``]
})
export class ButtonWidgetComponent extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = "button-widget";

    // 组件所需要的参数，建议使用 `ngOnInit` 获取
    config: any;
    loadingTip: string;
    loading = false;

    ngOnInit(): void {
        this.loadingTip = this.ui.loadingTip || "加载中……";
        this.config = this.ui.config || {};
    }

    // reset 可以更好的解决表单重置过程中所需要的新数据问题
    reset(value: string) {

    }

    change(value: string) {
        if (this.ui.change) this.ui.change(value);
        this.setValue(value);
    }

    changeLoad(method) {
        this.loading = true;
        console.log(this.loading);
        TIMEOUT = setTimeout(() => {
            this.loading = false;
            clearTimeout(TIMEOUT);
            console.log(this.loading);
        }, 2000);
        method();
    }
}
