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
import {
    NzCardComponent,
    NzCarouselComponent,
    NzFormatEmitEvent, NzMessageService, NzModalRef,
    NzTreeComponent,
    NzTreeNode,
    NzTreeSelectComponent
} from "ng-zorro-antd";
import {environment} from "@env/environment";
import {_HttpClient} from "@delon/theme";

@Component({
    selector: 'multiple-select',
    template: `
        <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
            <nz-select (ngModelChange)="ngModelChange($event)" style="width: 100%" [(ngModel)]="tagValue" [nzSize]="size" nzMode="tags">
                <nz-option *ngFor="let option of listOfOption" [nzLabel]="option.label" [nzValue]="option.value"></nz-option>
            </nz-select>
        </sf-item-wrap>
        
        
        `
})
export class MultipleSelectFormItemWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'multiple-select';

    size = "default";
    listOfOption:any[];
    tagValue:any[];

    constructor(protected http:_HttpClient,cd: ChangeDetectorRef, injector: Injector) {
        super(cd,injector);
    };

    dataUri;
    selectDataUri;


    ngModelChange(event):void{
        console.log(event);
        let key = this.formProperty.path.substring(1);
        this.formProperty.parent.properties[key].setValue(event);
        this.detectChanges();
    }
    ngOnInit(): void {

        this.dataUri = environment.gateway_server_url+this.ui.dataUri;

        let id = this.formProperty.parent.formData["id"];
        console.log(id);
        if(id == null){
            this.selectDataUri = environment.gateway_server_url+this.ui.selectDataUri;
        }else{
            this.selectDataUri = environment.gateway_server_url+this.ui.selectDataUri+"?id="+id;
        }

        console.log(this.selectDataUri);

            //先查菜单树
        this.http.get(this.dataUri).subscribe((res:any)=>{
            this.listOfOption = res;
            //再查这个角色已有的菜单
            this.http.get(this.selectDataUri).subscribe((res:any)=>{
                console.log(res);
                if(res !=null){
                    this.tagValue = res;
                    let key = this.formProperty.path.substring(1);
                    this.formProperty.parent.properties[key].setValue(res);
                    this.detectChanges();
                }

            });
        })
    }


    reset(value: any) {
        //this.detectChanges();
    }


}
