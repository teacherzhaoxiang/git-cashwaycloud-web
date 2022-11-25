import { ChangeDetectorRef, Component, Injector, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ControlWidget, SFComponent, SFItemComponent, SFRadioWidgetSchema, SFSchema } from '@delon/form';
import { environment } from "@env/environment";
import { NzMessageService, NzModalRef, NzProgressComponent } from "ng-zorro-antd";
import { _HttpClient } from "@delon/theme";
import { EventService } from '../../../shared/event/event.service';
import { Schema } from 'inspector';
import { UserService } from "../../../routes/service/user.service";

@Component({
  selector: 'sf-org-select',
  template: `
    <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
      <!-- 开始自定义控件区域 -->
      <div class="container">
        <div class="org">
            <div class="orgContent">
              <nz-radio-group [(ngModel)]="orgType" (ngModelChange)="orgTypeChange($event)">
                <label nz-radio-button *ngFor="let item of orgTypeList" [nzValue]="item.value">{{item.label}}</label>
              </nz-radio-group>
            </div>
        </div>
        <div class="org" *ngIf="orgType >1">
          <div class="orgSelectContent" *ngIf="orgType <4">
            <nz-select
              class="orgSelect"
              nzMode="tags"
              [(ngModel)]="selectedOrg"
              (ngModelChange)="selectedOrgChange($event)"
              [nzTokenSeparators]="[',']"
              [nzMaxTagCount]="maxTag"
              [nzMaxTagPlaceholder]="tagPlaceHolder"
            >
              <nz-option *ngFor="let option of orgList" [nzLabel]="option.label" [nzValue]="option.value"></nz-option>
            </nz-select>
            <ng-template #tagPlaceHolder let-selectedList>...</ng-template>
          </div>
          <div class="orgSelectContent" *ngIf="orgType ==4">
            <sf #sf [schema]="schema1" [button]="'none'" style="width:100%;" (formChange)="formChange($event)"></sf>
          </div>
        </div>
      </div>
      <!-- 结束自定义控件区域 -->
    </sf-item-wrap>`,
  styles: [`
            .container{
                display:flex
            }
            .org{
              display:flex;
              margin-right:10px;
              font-size:14px;
              color:rgba(0, 0, 0, 0.85);
              position:relative;
            }
            .orgName::after {
              content: ':';
              position: relative;
              top: -0.5px;
              margin: 0 8px 0 2px;
            }
            .orgSelect{
              position:absolute;
              width:400px;
              top:50%;
              transform:translateY(-50%);
            }
            .orgSelectContent{
              width:400px;
            }
            .orgSelectName::after {
              content: '';
              width:400px;
            }
    `],
})
export class OrgSelectWidget extends ControlWidget implements OnInit {
  /* 用于注册小部件 KEY 值 */
  static readonly KEY = 'org-select';
  constructor(
    private message: NzMessageService,
    private eventService: EventService,
    private http: _HttpClient,
    private user: UserService,
    cd: ChangeDetectorRef,
    injector: Injector,
    sfItemComp: SFItemComponent,
    sfComp: SFComponent) {
    super(cd, injector, sfItemComp, sfComp)
  }
  // 组件所需要的参数，建议使用 `ngOnInit` 获取
  @ViewChild('sf', { static: false }) sf: SFComponent;
  src: Array<object> = [];
  style: any;
  initUri: string;
  complete: boolean = false;
  readonly: boolean = false;
  orgLayer:number //user所属等级
  ui = {}
  orgType: number;  //选择的机构类型

  orgTypeList:Array<any> = [
    { label:'区联社', value:1 },
    { label:'地州', value:2 },
    { label:'行社', value:3 },
    { label:'网点', value:4 }
  ]
  schema1: SFSchema = {
    properties: {
      wangdian: {
        type: 'string',
        title: '',
        ui:{
          mate:{
            id:'value',
            name:'label'
          },
          params:"",
          widget:"multi-pop-up-input-tree",
          width:400        
        }
      }
    }
  };
  orgList = [];
  selectedOrg:any
  params = ''
  maxTag:number = 0;
  ngOnInit(): void {
    this.orgLayer = this.user['user']['orgLayer']
    // this.orgLayer = 3
    this.orgTypeList = this.orgTypeList.filter(ele=>ele.value >= this.orgLayer)
  }
  ngAfterViewInit(): void {

  }
  ngAfterViewChecked(){
    
  }
  orgTypeChange(orgType) {
    if(orgType ==4){
      setTimeout(() => {
        this.sf.reset()
      }, 200);
      return
    }
    switch(orgType){
      case 1:this.setValue(JSON.stringify({type:1,value:8000000}));break;
      case 2:this.maxTag = 3,this.setValue(JSON.stringify({type:2,value:""}));break;
      case 3:this.maxTag = 1,this.setValue(JSON.stringify({type:3,value:""}));break;
    }
    this.http.get(`${environment['manage_server_url']}/sys/orgs/orgTree/layer?orgLayer=${orgType}`).subscribe(res => {
      this.orgList = res.map(ele=>{
        return{ label:ele.name, value:ele.id }
      })
    })
    this.selectedOrg = []
  }
  selectedOrgChange(value){
    this.setValue(JSON.stringify({type:this.orgType,value:value.join(',')}))
  }
  formChange(value){
    this.setValue(JSON.stringify({type:this.orgType,value:value['wangdian']}))
  }
}
