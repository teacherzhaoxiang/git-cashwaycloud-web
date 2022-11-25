import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit, ChangeDetectorRef,
  Component,
  DoCheck, Injector,
  OnChanges, OnDestroy,
  OnInit,
  SimpleChanges, TemplateRef, ViewChild
} from '@angular/core';
import { ControlWidget } from '@delon/form';
import {
  NzCardComponent,
  NzCarouselComponent,
  NzModalService,
  NzTreeComponent,
  NzTreeNode,
  NzTreeSelectComponent
} from "ng-zorro-antd";
import {environment} from "../../../../environments/environment";
import {MultiTreeComponent} from "../../components/tree/treeTest.component";
import {HttpClient} from "@angular/common/http";
import {EventService} from "@shared/event/event.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'multi-pop-up-tree',
  template: `
      <sf-item-wrap style="width: 100%;" [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
          <input-tree #multitree [readonly]="readonly" [initUri]="params" [parentComponent]="this" [eventId]="this.eventId" [poPoTree]="true" [layer]="ui.layer"
          [orgId]="orgId" [orgPath]="orgPath" [searchValueTemp]="orgValue"></input-tree>
      </sf-item-wrap>
  `,
  
  styles:[`

  `]
})
export class PopUpMultiInputTreeFormItemWidget  extends ControlWidget implements OnInit,OnDestroy {
  /* 用于注册小部件 KEY 值 */
  static readonly KEY = 'multi-pop-up-input-tree';
  readonly:boolean;
  orgValue:any;
  orgId:any;
  orgPath:string;
  eventId:string;
  resetValue:string;
  @ViewChild('multitree', { static: true })
  multitree:MultiTreeComponent;
  @ViewChild('modalFooter', { static: false })
  modalFooter: TemplateRef<{}>;
  params: any;
  constructor(private eventService:EventService,private http: HttpClient,private modalSrv: NzModalService,cd: ChangeDetectorRef, injector: Injector) {
    super(cd,injector);
  };
  onChange($event: string): void {
    console.log($event);
    // this.setValue($event);
      console.log("============onChange");
    this.detectChanges()
  }

  ngOnInit(): void {
    if(this.ui.params){
      if (!/^http[s]?:\/\/.*/.test(this.ui.params)) {
        this.params = environment.gateway_server_url + this.ui.params;
      }else {
        this.params = this.ui.params;
      }
    }


    if(this.schema.readOnly != null && this.schema.readOnly!=false) {
      this.readonly = this.schema.readOnly;
    }
    let id = [];
    this.orgId = id;
    let randomNum:number = Math.round(Math.random() * 100);
    this.eventId = new Date().getTime()+randomNum+""
    //转换获取机构名字
      console.log("============ngOnInit");
    this.setOrgValue(id);

  }

  setOrgValue(id){
    // console.log("============333333");
    if(id !=null && id !=""){
      this.http.get(environment.gateway_server_url+"/manage/sys/orgs/"+id).subscribe((res:any)=>{
        if(res.code == 0){
          this.orgValue = res.rows.name;
          this.orgPath = res.rows.orgPathReal;
          this.detectChanges();
        }
      })
    }

  }

  nzDbEvent(id) {
    if(id !=null) {
      this.setValue(id);
    }
  }

  reset(value: any) {
      // console.log("============reset");
    // this.selectValue = value;
    // this.value1 = value;
    // console.log(value);
    this.multitree.resetValue = value
    this.setValue(value);
    if(value == null){
      this.orgId = "";
      this.orgValue = "";
      this.orgPath = "";
      this.multitree.searchValueTemp = null;
    }
    this.detectChanges();
    this.multitree.cd.detectChanges();
  }
  ngAfterViewInit():void{
  }

  ngOnDestroy(){

  }
}
