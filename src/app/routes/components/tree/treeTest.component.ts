import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { NzFormatEmitEvent, NzMessageService, NzModalRef, NzTreeComponent, NzTreeNode } from "ng-zorro-antd";
import { _HttpClient } from "@delon/theme";
import { environment } from "@env/environment";
import { STComponent } from "@delon/abc";
import { SFComponent } from "@delon/form";
import { UserService } from "../../service/user.service";
import { EventService } from "@shared/event/event.service";

@Component({
  selector: 'multi-tree',
  template: `
      <nz-input-group [nzSuffix]="suffixIcon" style="padding-top:4px;padding-bottom:5px;width:100%;height:100px;position:relative;">
          <textarea [value]="searchValueTemp" (blur)="onBlurHandle()" readonly [disabled]="showLoading" (focus)="onBlurFocusHandle()" nz-input (keyup.enter)=searchData()></textarea>
          <div class="loading" [class.closeLoading]="!showLoading">
            <i nz-icon nzType="loading" nzTheme="outline"></i>
          </div>
      </nz-input-group>
      <ng-template #suffixIcon>
          <i nz-icon class="anticon anticon-search ng-star-inserted" *ngIf="poPoTree==false" (click)="searchData()"></i>
      </ng-template>
      <div [class.overFlowFlag]="this.flowFlag==true">
          <nz-tree #nt
                   [nzData]="nodes"
                   (mouseenter)="onBlurTreeFocusHandle()"
                   (mouseleave)="onBlurTreeHandle()"
                   nzCheckable
                   nzMultiple
                   nzAsyncData
                   nzShowIcon="true"
                   [class.showLoading]="this.showLoading==true"
                   [class.boxHidden]="this.nzTreeShow==false && poPoTree == true"
                   [class.box]="this.nzTreeShow==true && poPoTree == true"
                   [nzCheckedKeys]="defaultCheckedKeys"
                   [nzExpandedKeys]="defaultExpandedKeys"
                   [nzSelectedKeys]="defaultSelectedKeys"
                   (nzClick)="nzEvent($event)"
                   (nzExpandChange)="nzEvent($event)"
                   (nzCheckBoxChange)="nzEvent($event)">
              <ng-template #nzTreeTemplate let-node>
                <span class="custom-node">
                  <span [class.active]="treeId===node.key">
                    <img *ngIf="checkNodeType(node) == 'home'" style="width: 20px;height: 20px;margin-bottom: 2px;margin-right: 2px;" src="./assets/tree-icon/tree-home.png">
                    <img [ngStyle]="{'background-color':treeId === node.key ? '#1890ff' : '#000000' }" *ngIf="checkNodeType(node) == 'leaf'" style="width: 16px;height: 16px;margin-bottom: 2px;margin-right: 2px;" src="./assets/tree-icon/tree-leaf.png">
                    <img [ngStyle]="{'background-color':treeId === node.key ? '#1890ff' : '#000000' }" *ngIf="checkNodeType(node) == 'open'" style="width: 16px;height: 16px;margin-bottom: 2px;margin-right: 2px" src="./assets/tree-icon/tree-open.png">
                    <img [ngStyle]="{'background-color':treeId === node.key ? '#1890ff' : '#000000' }" *ngIf="checkNodeType(node) == 'close'" style="width: 16px;height: 16px;margin-bottom: 2px;margin-right: 2px" src="./assets/tree-icon/tree-close.png">
                    <span [class.serachMatch]="this.searchMatchKey.includes(node.key)">{{node.title}}</span>
                  </span>
                </span>
              </ng-template>
          </nz-tree>
      </div>
  `,
  styles: [`
      .loading{
        position:absolute ;
        top:0;
        display:flex;
        align-items:center;
        justify-content:center;
        width:100%;
        height:100%;
        z-index:9999999999;
        text-align:center;
        font-size:28px;
      }
      .closeLoading{
        display:none;
      }
      .loading{
        position:absolute ;
        z-index:9999999999;
        text-align:center;
        width:100%;
        font-size:28px;
      }
      .showLoading{
        opacity:1;
      }
      .box{
          position: absolute;
          top: 36px;
          left: 0;
          padding: 0 10px;
          background: #fff;
          z-index: 99999;
          width: 100%;
          padding: 5px 12px;
          display: block;
          width: 100%;
          border-radius: 4px;
          font-size: 14px;
          height: 300px;
          box-shadow: 0 3px 6px 2px #ececec;
          display: block;
          overflow-y: scroll;
          overflow-x: hidden;
          padding-right: 17px;
      }
      .boxHidden{
          display: none;
      }
      .active {
          color: #1890ff;
      }
      .serachMatch {
          color: red;
      }
 
      .imageActive{
          background-color: #1890ff;
      }
 
      .overFlowFlag{
          height: 300px;
 
      }
      .custom-node {
          cursor: pointer;
          line-height: 24px;
          margin-left: 4px;
          display: inline-block;
          margin: 0 -1000px;
          padding: 0 1000px;
 
      }
      :host ::ng-deep ul li span span{
          display: flex;
      }
      :host ::ng-deep ul li span span span{
          display: block;
          white-space: normal;
          word-wrap:break-word;
          max-width: 251px;
      }
      :host ::ng-deep .active{
          pointer-events: none;
      }
  `]
})
export class MultiTreeComponent implements OnInit, OnChanges {
  constructor(
    private eventService: EventService,
    private message: NzMessageService,
    protected http: _HttpClient,
    protected userService: UserService,
    public cd: ChangeDetectorRef
  ) { }
  @Input() initUri;
  @Input() readonly: boolean;
  @Input() parentComponent: any;  //父控件对象
  @Input() poPoTree: boolean;
  @Input() searchValueTemp: any = ' ';
  @Input() flowFlag: boolean = false;
  @Input() orgId: string;
  @Input() orgPath: string;
  @Input() eventId: string = "";
  @Input() layer: number;
  @ViewChild('nt', { static: true }) nt: NzTreeComponent;
  textFlag: boolean = false;
  treeFlag: boolean = false;
  nzTreeShow: boolean = false;
  searchValue: any;
  treeId: string;
  defaultCheckedKeys = [];
  defaultSelectedKeys = []; //默认选中的
  defaultExpandedKeys = [];  //默认打开的树节点
  nodes = [];
  homeNodeKey: any = "";
  resetValue: any;
  clickType = environment.clickType;  //控制所属机构单击或双击选中，0：单击，1：双击
  timeOut: any; //单击事件的定时器
  clickTime: number = 0;  //记录点击几点的次数。用于判断一定事件内是单击还是双击事件
  num: any = 0;//第几个
  orgNameList: Array<string> = []
  showLoading: boolean = true;
  //匹配到的key
  searchMatchKey: any[] = [];
  origin: any;
  treeListData: any = {};
  treeMapData: any = [];
  treeDadaFlagMap: any = {};
  ngOnInit() {
    this.searchValueTemp = ''
  }
  onBlurHandle() {
    this.textFlag = false;
    this.getNzTreeShow();
  }

  onBlurFocusHandle() {
    this.textFlag = true;
    this.getNzTreeShow();
    // this.searchData();
  }

  onBlurTreeHandle() {
    console.log("4444" + this.treeFlag);

    this.treeFlag = false;
    this.getNzTreeShow();
  }

  onBlurTreeFocusHandle() {
    console.log("5555" + this.treeFlag);

    this.treeFlag = true;
    this.getNzTreeShow();
  }

  getNzTreeShow() {
    if (this.treeFlag || this.textFlag) {
      this.nzTreeShow = true;
    } else {
      this.nzTreeShow = false;
    }
  }
  searchData() {
    let data: any = JSON.parse(JSON.stringify(this.origin));
    // console.log("=========111")
    if (this.searchValueTemp == null || this.searchValueTemp.trim() == "") {
      // console.log("=========22")
      this.initData(data);
      if (this.parentComponent != null) {  //如果有父控件刷新父控件并重新渲染
        this.parentComponent.detectChanges();
      }
      // console.log("=========33")
      return;
    }
    for (let key in this.treeDadaFlagMap) {
      this.treeDadaFlagMap[key] = false;
    }
    //根据匹配到的数据和orgpath，设置Flag数据
    this.searchKeyMatchHandle(data[0]);
    //查找遍历数据
    this.searchKeyDataMatchHandle(data[0], data, 0);
    this.nodes = data;
    // console.log("=========444")

  }

  searchKeyMatchHandle(node: any) {
    console.log('search')
    //寻找打开的key数据
    if (node.title.indexOf(this.searchValueTemp) >= 0 || node.code.indexOf(this.searchValueTemp) >= 0) {
      let orgPath = node.orgPath;
      let orgPathKeyArray: string[] = orgPath.split(".");
      for (let i = 0; i < orgPathKeyArray.length; i++) {
        this.treeDadaFlagMap[orgPathKeyArray[i]] = true;
      }

    }

    //往下遍历
    if (node.children != null && node.children.length > 0) {
      for (let index in node.children) {
        let newData = node.children[index];
        this.searchKeyMatchHandle(newData);
      }
    }
  }

  searchKeyDataMatchHandle(node: any, nodeArray: any[], position): any {
    if (this.treeDadaFlagMap[node.key] == false) {
      node = null;
      nodeArray.splice(position, 1);
      position = position - 1;
      return position;
    }

    //往下遍历
    if (node.children != null && node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        let newData = node.children[i];
        i = this.searchKeyDataMatchHandle(newData, node.children, i);
      }
      if (node.children != null && node.children.length > 0) {
        node.expanded = true;
      } else {
        node.expanded = false;
      }
    }
    return position;
  }

  ngOnChanges() {
    if (!!this.initUri) {
      console.log(this.initUri)
      this.getDate(this.initUri);
    } else if (this.initUri === undefined) {
      let url = environment.manage_server_url + "/sys/orgs/tree?show=1&orgId=" + this.userService.getUser().orgId;
      this.getDate(url);
    }
  }
  // 获取树的每层级数据(左边)
  getDate(url) {
    this.http.get(url).subscribe((res: any) => {
      this.showLoading = false
      if (this.layer != null) {
        this.filterLayerData(res[0])
        this.origin = res;
      } else {
        this.origin = res;
      }
      if (this.resetValue) {
        this.searchValueTemp = ''
        this.deepGen(this.origin)
        this.searchValueTemp = this.orgNameList.join(',')
      }
      this.initData(res);

    })

  }

  //过滤级别数据
  filterLayerData(node: any) {
    if (node.layer == this.layer) {
      if (node.children != null && node.children.length > 0) {
        let tempNode = node.children[0];
        if (tempNode.layer != this.layer) {
          node.children = null;
          node.isLeaf = true;
          return;
        }
      } else {
        node.children = null;
        node.isLeaf = true;
        return;
      }
    }

    //往下遍历
    if (node.children != null && node.children.length > 0) {
      for (let index in node.children) {
        let newData = node.children[index];
        this.filterLayerData(newData);
      }
    }
  }

  initData(res) {
    if (this.orgId != null && this.orgId != "" && this.orgPath != null && this.orgPath != "") {
      let expandKeys: string[] = [];
      this.defaultSelectedKeys = [this.orgId];
      this.treeId = this.orgId;

      let orgPathArray: string[] = this.orgPath.split(".");
      orgPathArray.pop();
      expandKeys = orgPathArray;
      this.defaultExpandedKeys = expandKeys;
      let expandkeysReverse: string[] = this.defaultExpandedKeys.reverse();
      let resTemp2: any = JSON.parse(JSON.stringify(res));
      this.intTreeData(expandkeysReverse, resTemp2);
      this.nodes = resTemp2;
    } else {
      //默认打开第二级别
      let resTemp: any = JSON.parse(JSON.stringify(res));
      let initData = resTemp[0];
      if (initData.children != null && initData.children.length > 0) {
        for (let index in initData.children) {
          initData.children[index].children = null;
        }
      }
      let initDataTemp: any = JSON.parse(JSON.stringify(initData));
      this.nodes = [initDataTemp];
    }


    //转换数据 key children 形式
    let resTemp1: any = JSON.parse(JSON.stringify(res));
    this.getTreeListData(resTemp1[0]);
    //清理孙元素,避免树结构一次性加载太多数据
    // this.clearGrandsonListData();
    if (this.nodes != null && this.nodes.length == 1) {
      this.homeNodeKey = this.nodes[0].key;
    }
    if (this.parentComponent != null) {
      this.parentComponent.detectChanges();
    }
    console.log(this.nodes)
  }
  deepGen(nodes) {
    const org_idList = this.resetValue.split(',')
    nodes.forEach(ele => {
      org_idList.forEach(item => {
        if (item == ele.key) {
          ele.checked = true
          this.orgNameList.push(ele.title)
        }
      })
      if (ele.children.length > 0) {
        this.deepGen(ele.children)
      }
    })
  }
  intTreeData(expandkeysReverse: string[], resTemp: any) {
    for (let i = 0; i < resTemp.length; i++) {
      let flag: boolean = false;
      for (let j = 0; j < expandkeysReverse.length; j++) {
        if (resTemp[i].key == expandkeysReverse[j]) {
          flag = true;
          break;
        }
      }
      if (flag == false) {
        resTemp[i].children = null;
      } else {
        if (resTemp[i].children != null && resTemp[i].children.length > 0) {
          this.intTreeData(expandkeysReverse, resTemp[i].children);
        }
      }
    }
  }
  getTreeListData(data) {
    let listData = data.children;
    let node: any = {};
    node.key = data.key;
    node.title = data.title;
    node.orgPath = data.orgPath;
    if (data.layer != null && data.layer != "") {
      node.layer = data.layer;
    }
    if (data.code != null && data.code != "") {
      node.code = data.code;
    }

    this.treeMapData.push(node);
    this.treeListData[data.key] = listData;
    this.treeDadaFlagMap[data.key] = false;
    // console.log('xue',data.children);

    //往下遍历
    if (data.children != null && data.children.length > 0) {
      for (let index in data.children) {
        let newData = data.children[index];
        this.getTreeListData(newData);
      }
    }
  }
  checkNodeType(node) {
    if (this.homeNodeKey == node.key) {
      return "home";
    } else {
      if (node.isLeaf) {
        return "leaf";
      } else {
        if (node.isExpanded) {
          return "open"
        } else {
          return "close"
        }
      }
    }
  }

  nzEvent(event: NzFormatEmitEvent): void {
    let checkNode = this.nt.getCheckedNodeList(); //树checkBox被点击选中的原生方法
    let treeListDataTemp: any = JSON.parse(JSON.stringify(this.treeListData));
    if (event.node.origin.netCode || environment['hall-config']) {
      this.treeId = event.node.key;
      let keyName: string = this.eventId;
      if (keyName == null || keyName == "") {
        keyName = 'treeEvent';
      }
      this.eventService.emit({ key: keyName, value: this.treeId });
      this.searchMatchKey = this.searchMatchKey.filter(function (item) {
        return item != event.node.key
      });
    }
    //
    if (event.eventName === 'expand') {
      const node = event.node;
      if (node.isExpanded == true) {
        node.addChildren(treeListDataTemp[node.key])
      } else {
        node.clearChildren();
      }
    }
    else if (event.eventName == "click") {
      const node = event.node;
      if (node.isExpanded == true) {
        if (treeListDataTemp[node.key] != null && treeListDataTemp[node.key].length > 0) {
          node.clearChildren();
          node.isExpanded = false;
          // for(let i=0;i<this.defaultExpandedKeys.length;i++){
          //     if(this.defaultExpandedKeys[i] == node.key){
          //         this.defaultExpandedKeys.splice(i,1);
          //         break;
          //     }
          // }
        }
      } else {
        if (treeListDataTemp[node.key] != null && treeListDataTemp[node.key].length > 0) {
          node.addChildren(treeListDataTemp[node.key]);
          node.isExpanded = true;
          // this.defaultExpandedKeys.push(node.key);
        }
      }
      // if(this.parentComponent !=null){
      //     this.parentComponent.detectChanges();
      // }
    }
    else if (event.eventName == 'check') {
      console.log(event)
      let searchValueTemp = []
      let keyList = []
      event.checkedKeys.map(ele=>{
        searchValueTemp.push(ele['_title'])
        keyList.push(ele['key'])
      })
      this.searchValueTemp = searchValueTemp.join(',');
      this.parentComponent.nzDbEvent(keyList.join(','));
    }
    // clearInterval(this.timeOut);   //执行完单击事件清除定时器
  }


}