import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  EventEmitter,
  Output
} from "@angular/core";
import { NzTreeComponent} from 'ng-zorro-antd/tree';
import {NzMessageService, NzTreeNode} from "ng-zorro-antd";
import {_HttpClient} from "@delon/theme";
import {WidgetService} from "../../service/widget.service";
import {Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";
import {NzModalRef} from "ng-zorro-antd";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'mTree',
    template: `
        <div class="edit_box" drag>
            <div class="topper">
                <div class="title">菜单管理</div>
                <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
            </div>
            <div (mousedown)="$event.stopPropagation()">
                <div nz-row class="edit_content">
                    <nz-col nzSpan="24">
                        <nz-input-group [nzSuffix]="suffixIcon">
                            <input type="text" nz-input placeholder="Search" [(ngModel)]="searchValue" />
                        </nz-input-group>
                        <ng-template #suffixIcon>
                            <i nz-icon nzType="search"></i>
                        </ng-template>
                        <nz-tree
                                #nt
                                [nzCheckable]="showCheckable"
                                [nzMultiple]="showCheckable"
                                [nzShowLine]="showCheckable"
                                [nzData]="nodes"
                                [nzCheckedKeys]="defaultCheckedKeys"
                                (nzClick)="nzEvent($event)"
                                (nzExpandChange)="nzEvent($event)"
                                [nzSearchValue]="searchValue"
                                (nzCheckBoxChange)="nzEvent($event)"
                        >
                        </nz-tree>
                    </nz-col>
                </div>
            </div>
            <div class="modal-footer">
                <button nz-button type="button" (click)="close()" class="closeBtn">关闭</button>
                <button nz-button type="submit" [nzLoading]="loading" (click)="save()">保存</button>
            </div>
        </div>
  `,
    styles: [
        `
            .edit_box{
                background: #FFFFFF;
                width: 800px;
                /*position: fixed !important;*/
                z-index: 999999999999;
                border-radius: 6px;
                /*margin-left: -400px;*/
                /*left: 50%;*/
            }
            .edit_box .topper{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                color: rgba(0, 0, 0, 0.85);
                font-weight: 500;
                font-size: 16px;
                border-bottom: 1px solid #ececec;
            }
            .edit_box .topper .closer{
                cursor: pointer;
            }
            .edit_box .edit_content{
                padding: 20px 40px;
                max-height: 600px;
                overflow-y: scroll;
            }
            .modal-footer{
                margin: 0;
                padding: 20px 24px;
            }
            :host ::ng-deep sf-item{
                width: 100% !important;
            }
            .modal-footer .keep{
                background: #1890ff;
                color: #FFFFFF;
            }
            .closeBtn{
                border: 1px solid #1890ff;color: #1890ff
            }
      nz-input-group {
        margin-bottom: 12px;
      }
    `
    ]
})
export class MenuTreeTemplateComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output('out') out = new EventEmitter();
  @Output('handleSelect') handleSelect = new EventEmitter();
  @Input() record;
  loading = false;
  list_item:object = {};
    //默认选中的值
    defaultCheckedKeys = [];
    // defaultSelectedKeys = ['0-0-0'];
    // defaultExpandedKeys = ['0-0', '0-0-0', '0-0-1'];
    @ViewChild('nt', { static: true })
    nt: NzTreeComponent;
    searchValue = '';

    /*//初始化所有数据的uri
    @Input()
    initUri;*/
    //初始化选中数据的uri
    /*@Input()
    selectUri;*/
   //树的全部数据
    nodes = [
        // {
        //     title: '0-0',
        //     key: '0-0',
        //     expanded: true,
        //     children: [
        //         {
        //             title: '0-0-0',
        //             key: '0-0-0',
        //             children: [
        //                 { title: '0-0-0-0', key: '0-0-0-0', isLeaf: true },
        //                 { title: '0-0-0-1', key: '0-0-0-1', isLeaf: true },
        //                 { title: '0-0-0-2', key: '0-0-0-2', isLeaf: true }
        //             ]
        //         },
        //         {
        //             title: '0-0-1',
        //             key: '0-0-1',
        //             children: [
        //                 { title: '0-0-1-0', key: '0-0-1-0', isLeaf: true },
        //                 { title: '0-0-1-1', key: '0-0-1-1', isLeaf: true },
        //                 { title: '0-0-1-2', key: '0-0-1-2', isLeaf: true }
        //             ]
        //         },
        //         {
        //             title: '0-0-2',
        //             key: '0-0-2',
        //             isLeaf: true
        //         }
        //     ]
        // },
        // {
        //     title: '0-1',
        //     key: '0-1',
        //     children: [
        //         { title: '0-1-0-0', key: '0-1-0-0', isLeaf: true },
        //         { title: '0-1-0-1', key: '0-1-0-1', isLeaf: true },
        //         { title: '0-1-0-2', key: '0-1-0-2', isLeaf: true }
        //     ]
        // },
        // {
        //     title: '0-2',
        //     key: '0-2',
        //     isLeaf: true
        // }
    ];
    optionService:Subscription;   //订阅按钮操作变化
    version = ''; //版本号
    config = {}; //initUri:初始化数据请求地址   dataUri:获取公共菜单数据接口   saveUri:保存数据接口
    readonly = false;
    showCheckable = false;
    constructor(protected http: _HttpClient,private service: WidgetService, private msgSirvice:NzMessageService,private modal: NzModalRef, private actRoute:ActivatedRoute) {
    }
        ngOnInit() {
          let config = this.record['config'];
          this.readonly = config['readOnly'] || false;
          this.showCheckable = config['showCheckable'];
          this.config = config;
          this.getNodeList();  //获取菜单数据
          if(this.record&&config['initUri']){
            this.getSelect(this.record);
          }
          this.optionService = this.service.option.subscribe(res => {
            if(res=='keep'){
              this.save();
            }
          });

    }
    ngAfterViewInit() {

    }
    getNodeList() {
      this.http.get(environment.atmcManageUrl + this.config['dataUri']).subscribe((res: any) => {
        if(this.readonly){
          res = this.handleMenuList(res);
        }
        let temp = [res];
        this.dataChange(temp);
        this.nodes = temp;
        //
        // this.http.get(environment.manage_server_url + '/sys/roles/' + this.record.id).subscribe((res: any) => {
        //     this.selectNode.length = 0;
        //     this.selectNode = res['rows'].menuIdList;
        //     this.nzDefaultCheckedKeys = res['rows'].menuIdList;
        // });
      });
    }
    handleMenuList(res) {
      let children = res['children'];
      for(let i=0;i<children.length;i++){
        children[i]['disableCheckbox'] = true;
        if(children[i]['children']){
          this.handleMenuList(children[i]);
        }
      }
      res['disableCheckbox'] = true;
      return res;
    }
    getSelect(params) {
        let url = this.service.handleUrl(this.config['initUri'],params);
        this.http.get(environment.atmcManageUrl + url).subscribe(res => {
            this.defaultCheckedKeys = res;
        });
    }
    dataChange(data){
        for(let i=0;i<data.length;i++){
            data[i].key = data[i].id;
            data[i].title = data[i].name;
            if(data[i].children!=null && data[i].children.length>0){
                this.dataChange(data[i].children);
            }else{
                data[i].isLeaf = 'true';
            }
        }
    }

    checkNodeList:NzTreeNode[]=[];
    nodeKeyList:string[] = [];
    seletedNode:any[] = [];
    nzEvent(event): void {
      if(this.nt.getSelectedNodeList().length>0 && this.nt.getSelectedNodeList()!=this.seletedNode){
        this.seletedNode = this.nt.getSelectedNodeList();
        if(this.seletedNode[0]['origin']['leafFlag']=='1'){
          this.handleSelect.emit(this.seletedNode[0]['origin']);
        }

      }
        this.checkNodeList =[];
        this.nodeKeyList = [];
        let nodeList:NzTreeNode[] = this.nt.getCheckedNodeList();
        this.getCheckNodeList(nodeList);
        for(let i=0;i<this.checkNodeList.length;i++){
            this.nodeKeyList.push(this.checkNodeList[i].key)
        }
    }

    getCheckNodeList(nodeList:NzTreeNode[]):void{
        for(let i=0;i<nodeList.length;i++){
            let node:NzTreeNode = nodeList[i];
            if(node.isLeaf){
                this.checkNodeList.push(node);
            }else{
                this.getCheckNodeList(node.getChildren());
            }
        }
    }
    save() {
      this.loading = true;
        this.http.post(environment.atmcManageUrl + this.config['saveUri'],{version:this.record.id,menuList:this.nodeKeyList}).subscribe(res=>{
            this.service.sendOption(false);
            this.loading = false
            if(res.code==0){
                this.msgSirvice.success('保存成功！');
                this.modal.destroy();
            }else {
                this.msgSirvice.error(res.msg || '保存失败！');
            }
            console.log(res);
        });
    }
  close() {
    this.modal.destroy();
  }
    ngOnDestroy() {
      this.out.emit(false);
      if(!this.readonly){
        this.optionService.unsubscribe();
      }
    }
}
