import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit, ChangeDetectorRef,
    Component,
    DoCheck, Injector,
    OnChanges,
    OnInit,
    SimpleChanges, ViewChild
} from '@angular/core';
import { ControlWidget } from '@delon/form';
import {NzCardComponent, NzCarouselComponent, NzTreeNode, NzTreeSelectComponent} from "ng-zorro-antd";
import {environment} from "@env/environment";
import {_HttpClient} from "@delon/theme";

@Component({
    selector: 'nz-demo-carousel-autoplay',
    template: `
        <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
            <nz-tree-select
                    [nzNodes]="nodes"
                    [nzDisabled]="readOnly"
                    [nzDropdownStyle]="{ 'max-height': '300px' }"
                    nzShowSearch
                    nzPlaceHolder=""
                    [(ngModel)]="value1"
                    [nzAllowClear]="false"
                    (ngModelChange)="onChange($event)">
            </nz-tree-select>
        </sf-item-wrap>
        
        
        `
})
export class TreeSelectCashwayFormItemWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'org-tree-cashway-old';
    selectValue: string;
    nodes:any[] = [];
    value1:string;
    readOnly:boolean = false;
    constructor(protected http:_HttpClient,cd: ChangeDetectorRef, injector: Injector) {
        super(cd,injector);
    };
    onChange($event: string): void {
        console.log($event);
        this.setValue($event);
        this.detectChanges()
    }

    ngOnInit(): void {
        this.readOnly = this.schema.readOnly;
        this.http.get(environment.gateway_server_url+"/manage/sys/orgTree").subscribe((res:any)=>{
            this.nodes = res;
            this.value1 = this.selectValue;
            this.detectChanges();
        })
    }


    reset(value: any) {
        this.selectValue = value;
        this.value1 = value;
        this.detectChanges();
    }
    ngAfterViewInit():void{

    }

}
