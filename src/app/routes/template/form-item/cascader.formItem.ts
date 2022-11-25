import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NzCascaderComponent} from "ng-zorro-antd";
import {ControlWidget, SFComponent} from "@delon/form";
import {deepCopy} from "@delon/util";
import {_HttpClient} from "@delon/theme";

const tagsFromServer = [ 'Movie', 'Books', 'Music', 'Sports' ];

@Component({
    selector: 'my-cascader-formItem',
    preserveWhitespaces:false,
    template: `
        <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
            <div>
                
                <nz-cascader
                        nzChangeOnSelect
                        [nzOptions]="nzOptions"
                        [ngModel]="values">
                </nz-cascader>
            </div>
            
            
        </sf-item-wrap>
    `,
    styles  : [
        `
        .ant-cascader-picker {
            width: 300px;
        }
        `
    ]
})
export class CascaderFormItemWidget extends ControlWidget implements OnInit,AfterViewInit{
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'my-cascader';
   // nzOptions = [];

    nzOptions = [{
        value: '广东省',
        label: 'Zhejiang',
        children: [{
            value: '广州市',
            label: 'Hangzhou',
            children: [{
                value: '天河区',
                label: 'West Lake',
                isLeaf: true
            }]
        }, {
            value: 'ningbo',
            label: 'Ningbo',
            isLeaf: true
        }]
    }, {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [{
            value: 'nanjing',
            label: 'Nanjing',
            children: [{
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
                isLeaf: true
            }]
        }]
    }];

    public values: any[] = ['zhejiang', 'hangzhou', 'xihu'];
    relateList = [];
    ngOnInit(): void {
       // this.nzOptions = this.schema.enum || [];
        //this.relateList = this.ui.relateList|| [];
        // this.detectChanges();
    }

    reset(value:any){
        // this.detectChanges();
    }

    public onChanges(values: any): void {
        console.log(values, this.values);
        // let index:number = 0;
        // if(this.relateList.length >0){
        //     for (let relateKey of this.relateList){
        //         this.formProperty.parent.properties[relateKey].setValue(this.values[index]);
        //         index++;
        //     }
        // }
        // this.detectChanges();
    }

    ngAfterViewInit(): void{
        // this.detectChanges();
    }
}