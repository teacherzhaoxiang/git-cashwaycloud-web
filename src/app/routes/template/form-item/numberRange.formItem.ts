import { Component, OnInit } from '@angular/core';
import { ControlWidget } from '@delon/form';

@Component({
    selector: 'sf-number-range',
    template: `
  <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
    <!-- 开始自定义控件区域 -->
      <div class="ant-input-number-input-wrap" >
          <input class="ant-input-number" [ngModel]="min" (change)="changeMin($event)" onkeyup = "value=value.replace(/[^\\d\.]/g,'')" />
          <span>~</span>
          <input class="ant-input-number" [ngModel]="max" (change)="changeMax()" onkeyup = "value = value.replace(/[^\\d\.]/g,'') == 0 ? 999999999 : value "/>
      </div>
    <!-- 结束自定义控件区域 -->
  </sf-item-wrap>`
})
export class NumberRangeFormItemWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'number_range';

    // 组件所需要的参数，建议使用 `ngOnInit` 获取
    min:number;
    max:number;
    ngOnInit(): void {
        this.setValue([0,100])
        console.log("PictureLabel");
        console.log(this.value);
    }
    ngAfterViewInit():void{
        console.log(this.value);
        if(this.value!= null ){
            this.min = this.value[0]?0:this.value[0];
            this.max = this.value[1]?100:this.value[1];
        }

    }
    // reset 可以更好的解决表单重置过程中所需要的新数据问题
    reset(value: string) {
    }

    changeMin(event:Event){
        this.min = Number(event.target["value"]);
        let newValue = [this.min,this.max];
        console.log(this.min);
        console.log(this.max);
        this.setValue(newValue);
        console.log(this.value)
    }
    changeMax(){
        this.max = Number(event.target["value"]);
        let newValue = [this.min,this.max];
        console.log(this.min);
        console.log(this.max);
        this.setValue(newValue);
        console.log(this.value)
    }
}