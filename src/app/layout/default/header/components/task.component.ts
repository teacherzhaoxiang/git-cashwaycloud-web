import {Component, OnDestroy, Inject, Optional, OnInit, ViewChild} from '@angular/core';
import {NzModalService} from "ng-zorro-antd";
import {_HttpClient, TitleService} from '@delon/theme';
import {environment} from "../../../../../environments/environment";
@Component({
  selector: 'header-task',
  template: `
  <div>
    <nz-dropdown nzTrigger="click" nzPlacement="bottomRight" (nzVisibleChange)="change()" [nzVisible]="dropdownVisible">
      <div class="alain-default__nav-item" nz-dropdown>
        <nz-badge [nzDot]="true" *ngIf="flag">
          <i class="anticon anticon-bell"></i>
        </nz-badge>
          通知
      </div>
      <div nz-menu class="wd-lg" >
        <nz-card nzTitle="通知" [nzLoading]="loading" nzBordered="false" class="ant-card__body-nopadding" >
          <ng-template #extra><i class="anticon anticon-plus"></i></ng-template>
            <div *ngFor="let item of pageDetail;let i = index"  nz-row [nzType]="'flex'" [nzJustify]="'center'" [nzAlign]="'middle'" class="py-xs bg-grey-lighter-h point" style="width: 350px;">
                <div nz-col [nzSpan]="22" (click)="showModal(i)" style="border-bottom:1px solid #DEDEDE;padding-bottom:6px">
                    <div>标题</div>
                    <div style="text-align:right;font-weight:700">{{item.title}}</div>
                </div>
            </div>
          <div nz-row>
            <div nz-col [nzSpan]="24" class="pt-md text-center text-grey point" style="padding-bottom: 8px">
              <div style="display:flex;  justify-content: center;">
                <nz-pagination [(nzPageIndex)]="pageIndex" [(nzPageSize)]="pageSize" [(nzTotal)]="items.length" nzSimple (nzPageIndexChange)="pageIndexChange()"></nz-pagination> 
              </div>
            </div>
          </div>
        </nz-card>
      </div>
    </nz-dropdown>
  </div>
  `,
})
export class HeaderTaskComponent {
  @ViewChild('tips',{static:true}) tips:any;
 
  constructor(private http: _HttpClient,
              private modalSrv: NzModalService) { }
  dropdownVisible = false;
  pageIndex = 1;
  pageSize = 6; //每页多少条
  pageDetail = [];
  loading = true;
  items = [];
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    setTimeout(()=>{
      this.getFlag()
    },200)
  }
  flag = false
  getFlag(){
    let flag = sessionStorage.getItem('showBadge')
    console.log(flag)
    if(flag == 'true'){this.flag = true}
    if(flag == 'false'){this.flag = false}
  }
  pageIndexChange() {
    this.pageDetail = []
    this.items.forEach((ele,index)=>{
      if(index >= (this.pageIndex - 1) * this.pageSize && this.pageDetail.length  < this.pageSize){
        console.log(this.pageDetail)
        this.pageDetail.push({
          title:ele.annunciate_name,
          content:ele.annunciate_content
        })
      }
    })
  }
  change() {
    this.dropdownVisible = !this.dropdownVisible
    this.flag = false
    let param = {
    }
    let params ={param:JSON.stringify(param)}
    setTimeout(() => (this.loading = false), 500);
    let t = new Date
      this.http.get(environment.common_crud_url+'/system|annunciate_manage',params).subscribe((res: any) => {
        // console.log(res)
        this.items = res.rows
        this.pageDetail = []
        this.items.forEach((ele,index)=>{
          if(index >= (this.pageIndex -1) * this.pageSize && this.pageDetail.length  < this.pageSize ){
            // console.log(index)
            this.pageDetail.push({
              title:ele.annunciate_name,
              content:ele.annunciate_content
            })
          }
        })
      })
    
  }
  showTips(){
    this.tips.nativeElement.style.visibility = 'visible';
    setTimeout(()=>{
        this.tips.nativeElement.style.visibility = 'hidden';
    },3000)
  }
  showModal(i){
    this.modalSrv.confirm({
      nzTitle     : this.items[i + ((this.pageIndex - 1)*this.pageSize)].annunciate_name,
      nzContent   : this.items[i + ((this.pageIndex - 1)*this.pageSize)].annunciate_content,
      nzClosable  : true,
      nzOkText    : '确定',
      nzOkType    : 'confirm',
      nzIconType  : null,
      nzCancelText: null
  });
  }
  
}
export class NzDemoPaginationSimpleComponent {}