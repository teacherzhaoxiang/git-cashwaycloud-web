import {  Component, ElementRef, NgModule, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { filter, map, tap } from 'rxjs/operators';
import { Button } from 'selenium-webdriver';
import { Widget } from '@delon/form';
import { ActivatedRoute } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ControlWidget } from '@delon/form';
@Component({
    selector: 'multi-date-picker',
    template: `
    <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
        <input id="inputRef" #inputRef nz-input readOnly type="text" style="width:100%" [value]="value" (ngModelChange)="inputChange($event)" (focus)="inputFocus($event)" (blur)="inputBlur($event)"/>
        <nz-date-picker 
            [nzDateRender]="tplRender"
            [nzRenderExtraFooter]="footerRender"
            nzShowToday="false"
            [(ngModel)]="date" 
            (ngModelChange)="onChange($event)" 
            [nzOpen]="dateOpen"
            [nzFormat]="dateFormat"
            [ngStyle]="{'transform':translate}"
        ></nz-date-picker>
        <ng-template #tplRender let-current>
            <div class="ant-calendar-date" [class.active]="judgeClass(current)">
                {{ current.getDate() }}
            </div>
        </ng-template>
        <ng-template #footerRender >
            <div class="footerRender">
                <button nz-button nzType="default" [nzSize]="small" (click)="handlerDatePicker('cancel')">取消</button>
                <button nz-button nzType="primary" [nzSize]="small" (click)="handlerDatePicker('complete')">完成</button>
            </div>
        </ng-template>
    </sf-item-wrap>
    
  `,
    styles: [
        `
          .active {
            border: 1px solid #1890ff;
            background-color:#1890FF;
            color:white;
          }
          .footerRender{
              display:flex;
              justify-content: space-around;
              padding:5px 0;
          }
          ::ng-deep .ant-input-group-addon{
              display:none;
          }
          ::ng-deep .ant-calendar-picker-input{
            display:none;
          }
          ::ng-deep .ant-calendar-picker{
              width:0px;
          }
          ::ng-deep .ant-calendar-input-wrap{
            display:none;
          }
          ::ng-deep .ant-calendar-picker-icon{
              display:none;
          }
          ::ng-deep .ant-calendar-picker-container{

          }

        `
      ]
})

export class MultiDatePicker extends ControlWidget implements OnInit{
    static readonly KEY = 'MultiDatePicker';
    @ViewChild('inputRef',{static:false}) inputRef: ElementRef;
    dateValue: string 
    dateArr :Array<string> = []
    date:any;
    dateOpen:boolean=false;
    dateFormat = 'yyyy/MM/dd';
    translate:string;
    ngOnInit(): void {
        
    }
    inputFocus($event){
        this.dateOpen = true;
        console.log(this.value)
        this.value&&this.value.length? this.dateArr = this.value.split('/') : ''
        //更改时间框位置
        this.translate = `translate(-${this.inputRef['nativeElement'].offsetWidth}px,15px)`
    }
    inputBlur($event){
    }
    inputChange($event){
        console.log($event)
    }
    onChange($event){
        let date = this.formatDate($event)
        console.log(date)
        this.dateArr.indexOf(date) == -1?
        this.dateArr.push(date):
        this.dateArr = this.dateArr.filter((ele,index)=>index != this.dateArr.indexOf(date));
        //排序
        this.dateArr.sort(function(a, b){return new Date(a).getTime() - new Date(b).getTime()});
        this.dateValue = this.dateArr.join('/');
        this.setValue(this.dateValue)
    }
    formatDate(date){  
        var y = date.getFullYear();  
        var m = date.getMonth() + 1;  
        m = m < 10 ? '0' + m : m;  
        var d = date.getDate();  
        d = d < 10 ? ('0' + d) : d;  
        return y + '-' + m + '-' + d;  
    }; 
    judgeClass(current){
        return this.dateArr.some(ele=>new Date(this.formatDate(current)).getTime() == new Date(ele).getTime())
    }
    handlerDatePicker(type){
        this.dateOpen = false
    }
}
