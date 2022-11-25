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
import {EventService} from "@shared/event/event.service";
import {_HttpClient} from "@delon/theme";
import {UserService} from "../service/user.service";
import {WidgetService} from "../service/widget.service";
import {Subscription} from "rxjs";
import { environment } from "@env/environment";

@Component({
    selector: 'menu-tree',
    template: `
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
  `,
    styles: [
        `
      nz-input-group {
        margin-bottom: 12px;
      }
    `
    ]
})
export class MenuTreeComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output('out') out = new EventEmitter();
  @Output('handleSelect') handleSelect = new EventEmitter();
    @Input() list_item;
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
    versionService:Subscription;  //订阅版本号
    optionService:Subscription;   //订阅按钮操作变化
    version = ''; //版本号
    config = {}; //initUri:初始化数据请求地址   dataUri:获取公共菜单数据接口   saveUri:保存数据接口
    readonly = false;
    showCheckable = false;
    constructor(protected http: _HttpClient,private service: WidgetService, private msgSirvice:NzMessageService) {
    }
        ngOnInit() {
          let config = this.list_item['config'];
          this.readonly = config['readOnly'] || false;
          this.showCheckable = config['showCheckable'];
          this.config = config;
          this.getNodeList();  //获取菜单数据
          if(this.list_item['item']&&config['initUri']){
            this.getSelect(this.list_item['item']);
          }else {
            this.versionService = this.service.list_version.subscribe(data=>{   //监听版本号改变
              if(data&&JSON.stringify(data)!='{}'&&data['version']!=this.version) {
                this.version = data['version'];
                if(config['initUri']){
                  this.getSelect(data);
                }
              }
            });
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
        }else {
          this.handleSelect.emit({});
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
        this.http.post(environment.atmcManageUrl + this.config['saveUri'],{version:this.version,menuList:this.nodeKeyList}).subscribe(res=>{
            this.service.sendOption(false);
            if(res.code==0){
                this.msgSirvice.success('保存成功！');
            }else {
                this.msgSirvice.error(res.msg || '保存失败！');
            }
            console.log(res);
        });
    }
    ngOnDestroy() {
      this.out.emit(false);
      if(!this.readonly){
        this.versionService.unsubscribe();
        this.optionService.unsubscribe();
      }
    }
}
