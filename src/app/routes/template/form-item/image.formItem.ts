import {ChangeDetectorRef, Component, Injector, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ControlWidget, SFComponent, SFItemComponent} from '@delon/form';
import {environment} from "@env/environment";
import {NzMessageService, NzModalRef, NzProgressComponent} from "ng-zorro-antd";
import {_HttpClient} from "@delon/theme";
import { EventService } from '../../../shared/event/event.service';
@Component({
    selector: 'sf-picture-label',
    template: `
  <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
    <!-- 开始自定义控件区域 -->
      <div style="display:flex;flex-wrap:wrap;">
          <div *ngFor="let item of src" style="margin-right:10px;margin-bottom:10px;display:flex;flex-wrap:wrap;"  >
            <span *ngIf="item.name" style="margin-right:10px;">{{item.name}}:</span>
            <div [style.width]="item.width" [style.height]="item.height" *ngIf="item.src">
                <img  [src]="item.src" style="width:100%;height:100%;" />
            </div>
          </div>
      </div>
    <!-- 结束自定义控件区域 -->
  </sf-item-wrap>`
})
export class ImageFormItemWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'image';
    constructor(private modal: NzModalRef,
                private message: NzMessageService,
                private eventService: EventService,
                private http: _HttpClient,
                cd: ChangeDetectorRef,
                injector: Injector,
                sfItemComp: SFItemComponent,
                sfComp: SFComponent) {
        super(cd,injector,sfItemComp,sfComp)
    }
    // 组件所需要的参数，建议使用 `ngOnInit` 获取
    src:Array<object> = [];
    style:any;
    initUri:string;
    complete:boolean = false;
    ngOnInit(): void {
        console.log("ImageFormItemWidget");
        this.style = this.ui.style;
        console.log(this.style)
        this.initUri = this.schema['initUri']
        console.log('222')

    }
    ngAfterViewInit():void{
        console.log('111')
        this.getData()
    }
    getData():void {
        console.log(this.initUri)
        setTimeout(() => {
            if(this.value!=null){
                console.log(this.value)
                this.src[0] = {
                    src:environment.file_download_server_url+this.value,
                    width:this.style.width,
                    height:this.style.height
                }
                this.detectChanges()
                console.log(this.src)
            }else if (this.schema['initUri'] != null && this.initUri != ""){
                this.http.get(this.initUri).subscribe((res: any) => {
                    res.map((ele,index)=>{
                        let obj = {}
                        for(let key in ele){
                            obj = {
                                width:ele[key]?this.style.width:'50px',
                                height:ele[key]?this.style.height:'50px',
                                name:key,
                                src:ele[key]?environment['file_server_url'] + ele[key]:'assets/screen_shot_underfined.png'
                            }
                        }
                        this.src.push(obj)
                    })
                    console.log(this.src)
                    this.detectChanges()
                })
            }
        }, 0);

    }
    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        console.log('destroy')
    }
}
