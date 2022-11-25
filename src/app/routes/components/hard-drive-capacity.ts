import {ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {ControlWidget, SFComponent, SFItemComponent} from '@delon/form';
import {NzProgressComponent} from "ng-zorro-antd";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";

@Component({
    selector: 'sf-tabs',
    template: `
  <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
    <!-- 开始自定义控件区域 -->
      <ng-container *ngFor="let item of datas">
          <div>
              <span>{{item.driverName}}：{{item.formatValue}}</span> <span style="float: right">{{item.nzPercent}}%</span>
              <nz-progress  [nzPercent]="item.nzPercent"  [nzStrokeWidth]="nzStrokeWidth" [nzShowInfo]="false" [nzStrokeColor]="item.nzStrokeColor" [(nzType)]="nzType" ></nz-progress>
          </div>
      </ng-container>
          <!-- 结束自定义控件区域 -->
  </sf-item-wrap>`,
    styles  : [
        // `
        //     :host ::ng-deep .ant-progress-text {
        //     display: block;
        //         margin-top: 2px;
        // }
        // `
    ]
})
export class HardDriveCapacityComponent extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'hard-drive-capacity';

    nzPercent:number;
    formatValue:string;
    nzType:string;
    nzStrokeColor:string;
    nzStrokeWidth:number;
    @ViewChild('nzp', { static: true })
    nzp:NzProgressComponent;
    datas:any=[];

    constructor(private http: _HttpClient,cd: ChangeDetectorRef, injector: Injector,sfItemComp: SFItemComponent , sfComp: SFComponent ) {
        super(cd,injector,sfItemComp,sfComp);
    };

    ngOnInit(): void {
        
        this.nzType = "line";
        let that:any = this;
        console.log(this.sfItemComp.formProperty.formData,'哈哈')
        this.http.get(environment.gateway_server_url + this.ui.initUri + this.sfItemComp.formProperty.formData).subscribe((res: any) => {
            console.log(res,'这是res')
            this.datas = res;
            
            this.detectChanges();
        });

        // let source = [
        //     {"nzPercent":"50","nzStrokeColor":"red","formatValue":"已用10G,可用100G","diskNum":"C盘"},
        //     {"nzPercent":"80","nzStrokeColor":"green","formatValue":"已用10G,可用100G","diskNum":"D盘"},
        //     {"nzPercent":"100","nzStrokeColor":"blue","formatValue":"已用10G,可用100G","diskNum":"E盘"},
        //     ];
        // this.datas = source;
        // let datas:any[] = sourceData.toString().split("|");
        // this.schema.title = datas[0];
        // this.formatValue = datas[1];
        // this.nzPercent = datas[2];

        this.detectChanges();
        // setTimeout(()=>{
        //     this.nzPercent = 70;
        //     this.nzType = "line";
        //     this.formatValue = "已用10G,可用100G";
        //      this.detectChanges();
        // },3000)

    }


    ngAfterViewInit():void {
        console.log(this.value)
    }
    // reset 可以更好的解决表单重置过程中所需要的新数据问题
    reset(value: string) {
        console.log("===111==")
    }


}
