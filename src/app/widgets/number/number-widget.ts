import { Component, OnInit } from "@angular/core";
import { ControlWidget } from "@delon/form";
import {NgZone} from "@angular/core";

let TIMEOUT = null;

@Component({
    selector: "number-widget",
    template: `
        <sf-item-wrap  nz-col nzSpan="24" style="display: inherit;justify-content: space-between;" [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="ui.error" [showTitle]="schema.title">
            <!-- 开始自定义控件区域 -->
            <nz-input-number
            [(ngModel)]="demoValue"
            [nzMin]="schema.minimum"
            [nzMax]="schema.maximum"
            [nzStep]="schema.multipleOf"
            (ngModelChange)="change($event,schema.multipleOf)"
            ></nz-input-number>
            <!-- 结束自定义控件区域 -->
        </sf-item-wrap>
    `,
    styles: [`
        .error{
            color: red;
        }
    `]
})
export class NumberWidgetComponent extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = "number-widget";

    // 组件所需要的参数，建议使用 `ngOnInit` 获取
    demoValue:number;
    showError = false;
    ngOnInit(): void {

    }
    change(value: string,multipleOf) {
        if (this.ui.change) this.ui.change(value);
        if(value!=''){
            if((parseFloat(value) % multipleOf*1)==0){
                this.setValue(value);
            }else {
                this.setValue(0);
            }
        }else {
            this.setValue(0);
        }


    }

    // reset 可以更好的解决表单重置过程中所需要的新数据问题
    reset(value: string) {

    }

}
