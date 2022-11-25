import { Component, OnInit, ViewChild, Type } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from "../../../../environments/environment";
import { NzTransferComponent, TransferChange, TransferItem, TransferSelectChange } from 'ng-zorro-antd/transfer';
import { NzModalService } from "ng-zorro-antd";
import { TableAddModalComponent } from "../table-template/add.template";
import { SimpleProgramPreviewModalComponent } from "./simple-program-preview.modal";
import { ActivatedRoute } from "@angular/router";
import { objectKeys } from "codelyzer/util/objectKeys";
import { FormsModule } from '@angular/forms';
import { deepCopy } from '@delon/util';

@Component({
  selector: 'simple-program',
  templateUrl: './simple-program.html',
  styleUrls: ['./simple-program.css']
})
export class SimpleProgramComponent implements OnInit {
  list: TransferItem[] = [];
  originList: TransferItem[] = [];
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  disabled: any;
  loading = false;
  title: string;
  type: string;
  id: string = "";//从主页面传输过来节目id
  url = environment.common_crud_url + "/hall|publish_release_resource";
  initDataUrl = environment.common_crud_url + "/hall|publish_page_manage";//获取已制作节目数据

  file_path = "";//预览时用于拼接url；
  saveData: any = {};//节目数据
  resourceData = [];//已选择资源列表数据
  //用于表头筛选条件
  listOfColumns = {
    filterMultiple: false,
    listOfFilter: [
      { text: '全部', value: '' },
      { text: '语音', value: 'music' },
      { text: '视频', value: 'video' },
      { text: '图片', value: 'image' },
      { text: '文档', value: 'document' }
    ],
    // filterFn: (list: string[], item: any) => list.some(name => item.name.indexOf(name) !== -1)
  };
  //组件变量，用于操作transfer组件
  @ViewChild('transfer', { static: false })
  transfer: NzTransferComponent;
  constructor(private http: _HttpClient, private modalSrv: NzModalService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.title = this.route.snapshot.queryParams['title'];
      this.type = this.route.snapshot.queryParams['type'];
      if (this.type == 'image') {
        this.listOfColumns.listOfFilter = [
          { text: '图片', value: 'image' }
        ]
      }
      this.getData();
    });

  }

  save() {
    //debugger;
    this.resourceData = [];
    this.list.map(item => {
      item.direction =='right'?this.resourceData.push(item):''
    });
    // this.rightKeyList.map(order => {
    //   let item = this.valueMap[order];

    //   this.resourceData.push(item);
    // });
    this.saveData["resource_data"] = this.resourceData;
    let data = {};
    let tmpData = [];
    tmpData.push(this.saveData);
    // //现金设备
    if (this.type == 'image') {
      tmpData.push({ "type": 7 })
    } else {
      tmpData.push({ "type": 6 })
    }
    data["data"] = tmpData;
    data["mateRule"] = {};
    console.log(this.initDataUrl)
    this.http.put(this.initDataUrl+"/"+this.id,data).subscribe(res=>{
      alert("保存成功")
    })
  }



  search(ret: any): void {
    console.log('nzSearchChange', ret);
    // this.getData(ret);
  }
  valueMap = {}
  getData(): void {  //获取数据
    this.loading = true;
    const ret = [];
    let param = {
      "type": ""
    };
    if (this.type != undefined && this.type != null) {
      param.type = this.type;
    }
    //先获取节目数据，再加载资源列表，根据节目数据需要将返回的资源list进行排序和左右移动
    this.http.get(this.initDataUrl + "/" + this.id).subscribe(result => {
      console.log(result, 'result')
      this.saveData = result;
      this.resourceData = JSON.parse(result["resource_data"]);
      let keys = [];
      if (this.resourceData) {
        this.resourceData.map(item => {
          keys.push(item.id);
        })
      }

      let size: number = this.resourceData ? this.resourceData.length : 0;
      this.http.get(this.url, { param: JSON.stringify(param) }).subscribe(res => {
        //debugger;
        console.log(res);
        this.loading = false;
        let i: number = 0;
        let rows = res.rows.filter(ele=>ele.status == '1')
        let tmpList = rows.map(item => {
          let index = keys.indexOf(item.id);
          if (index >= 0) {
            item.order = index;
            item.direction = 'right';
            if (this.resourceData[index].type != "video") {
              if (this.resourceData[index].hasOwnProperty('intervalTime')) {
                item.intervalTime = this.resourceData[index].intervalTime;
              } else {
                // item.intervalTime='13';
              }
            }
            this.valueMap[index] = item;
          } else {
            item.order = i + size;
            this.valueMap[i + size] = item;
            i++;
          }
          if (item.intervalTime == null || item.intervalTime == '') {
            item.intervalTime = 15;
          }
          return item;
        });

        for (let i: number = 0; i < size; i++) {
          this.rightKeyList.push(i);
        }
        this.list = tmpList.sort(this.sortRule)
        this.originList = deepCopy(this.list)
        this.total = res.total;
      });
    })
  }
  searchType: string;
  searchName: string
  filter(searchType: string, searchName: string): void {
    this.searchType = searchType;
    this.searchName = searchName;
    console.log(searchType, searchName)
    // this.list = this.list.map(item => {
    //     if((this.searchType ? item.type.indexOf(searchType) !== -1 : true)&&
    //         (this.searchName ? item.name.indexOf(searchName) !== -1 : true)){
    //         item.filterFlag="false";
    //     }else {
    //         item.filterFlag="true";
    //     }
    //     return item;
    // });
    this.list = this.originList.filter(item => {
      return (this.searchType ? item.type.indexOf(searchType) !== -1 : true) && (this.searchName ? item.name.indexOf(searchName) !== -1 : true);
    });

  }
  dbClickNum: number = 0;
  timer: any;
  trClick(data, key) {
    this.dbClickNum < 2 && this.dbClickNum++
    this.dbClickNum <= 1 ? this.timer = setTimeout(() => {
      if (this.dbClickNum <= 1) {
        //单击事件
        console.log('单击事件')
        console.log(this.list)
      }
      this.dbClickNum = 0
    }, 200) : ''
    if (this.dbClickNum == 2) {
      //双击事件
      console.log('双击事件')
      let list = deepCopy(this.list)
      for (let i = 0; i < this.list.length; i++) {
        if (data.id === list[i].id) {
          console.log(list[i])
          switch (list[i].direction) {
            case 'left': list[i].direction = 'right'; break;
            case 'right': list[i].direction = 'left'; break;
          }
          break
        }
      }
      this.list = list
      console.log(this.list)
      clearTimeout(this.timer)
      this.dbClickNum = 0
    }
  }
  onItemSelect(data) {
    console.log('data', data)
  }

  select(ret: TransferSelectChange): void {
    console.log('nzSelectChange', ret);
  }
  leftSearch(event: any) {
    this.filter(this.searchType, this.searchName);
  }

  rightKeyList = [];
  change(ret: TransferChange): void {
    console.log('nzChange', ret);
    const listKeys = ret.list.map(l => l.key);

    const hasOwnKey = (e: TransferItem) => e.hasOwnProperty('key');
    this.list = this.list.map(e => {
      if (listKeys.includes(e.key) && hasOwnKey(e)) {
        if (ret.to === 'left') {
          delete e.hide;
        } else if (ret.to === 'right') {
          e.hide = false;
        }
      }
      return e;
    });
    this.rightKeyList = [];
    this.list.map(
      e => {
        if (e.direction == 'right') {
          this.rightKeyList.push(e.order);
        }
      }
    )
  }
  onQueryParamsChange(e) {
    this.pageNumber = e;
    this.getData();
  }
  showView(e, item: any) {  //预览
    this.modalSrv.info({
      nzContent: SimpleProgramPreviewModalComponent,
      nzTitle: "预览",
      nzClosable: true,
      nzComponentParams: {
        type: item.type,
        src: item.url
      }
    });
  }
  moveDown(e, data: any) {  //下移
    let index = this.rightKeyList.indexOf(data.order);
    if (index == this.rightKeyList.length - 1) {
      return;
    }
    let dataOrder = data.order;
    let targetOrder = this.rightKeyList[index + 1];
    this.order(dataOrder, targetOrder);
  }

  order(dataOrder: number, targetOrder: number) {
    this.list = this.list.map(item => {
      if (item.order == dataOrder) {
        item.order = targetOrder;
        this.valueMap[targetOrder] = item;
      }
      else if (item.order == targetOrder) {
        item.order = dataOrder;
        this.valueMap[dataOrder] = item;
      }
      return item;
    })
    this.list = this.list.sort(this.sortRule)
    console.log(this.list);
  }

  sortRule(a, b) {
    if (a.order >= b.order) {
      return 1;
    } else {
      return -1;
    }
  }

  moveUp(e, data: any) {  //上移
    let index = this.rightKeyList.indexOf(data.order);
    if (index == 0) {
      return;
    }
    let dataOrder = data.order;
    let targetOrder = this.rightKeyList[index - 1];
    this.order(dataOrder, targetOrder);

  }
  back() {
    window.history.back();
  }
}
