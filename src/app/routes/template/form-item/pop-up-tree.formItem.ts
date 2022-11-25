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
import {TreeComponent} from "../../components/tree/tree.component";
import {HttpClient} from "@angular/common/http";
import {EventService} from "@shared/event/event.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'pop-up-tree',
  template: `
      <sf-item-wrap style="width: 100%;" [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
          <tree #tree [readonly]="readonly" [initUri]="params" [parentComponent]="this" [eventId]="this.eventId" [poPoTree]="true" [layer]="ui.layer"
                [orgId]="orgId" [orgPath]="orgPath" [searchValueTemp]="orgValue"></tree>
      </sf-item-wrap>


  `,
  styles:[`

  `]
})
export class PopUpTreeFormItemWidget extends ControlWidget implements OnInit,OnDestroy {
  /* 用于注册小部件 KEY 值 */
  static readonly KEY = 'org-tree-cashway';

  readonly:boolean;
  orgValue:any;
  orgId:string;
  orgPath:string;
  eventId:string;
  @ViewChild('tree', { static: false })
  tree:TreeComponent;
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
    let id:any = this.formProperty["formData"];
    this.orgId = id;
    let randomNum:number = Math.round(Math.random() * 100);
    this.eventId = new Date().getTime()+randomNum+""
    //转换获取机构名字
      console.log("============ngOnInit");
    this.setOrgValue(id);

  }

  setOrgValue(id){
      console.log("============333333");
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

  nzDbEvent(id){
      console.log("============nzDbEvent");
    if(id !=null) {
      this.setValue(id);
    }
  }


  reset(value: any) {
      console.log("============reset");
    // this.selectValue = value;
    // this.value1 = value;
    console.log(value);
    this.setValue(value);
    if(value == null){
      this.orgId = "";
      this.orgValue = "";
      this.orgPath = "";
      this.tree.searchValueTemp = null;
    }
    this.detectChanges();
    this.tree.cd.detectChanges();
  }
  ngAfterViewInit():void{
  }

  ngOnDestroy(){

  }
}
