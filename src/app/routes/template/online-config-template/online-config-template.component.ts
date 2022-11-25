import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
  selector: 'online-config-template',
  templateUrl: './online-config-template.component.html',
  styleUrls: ['./online-config-template.component.css']
})
export class OnlineConfigTemplateComponent implements OnInit {
  treeSize = 34;
  tableSize = 66;
  searchValue = '';
  isVisible = false;
  isConfirmLoading = false;
  treeTitle:any;
  resize:any;
  modelTitle = '';
  selectedIndex = 0;
    searchValueTemp:any;
    pageTitle:any;
  tabs = [
    {type:'sf'},
    {type:'options'},
    {type:'st'}
  ]
  @ViewChild('sf',{static:false}) sf;

  schema = {
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      type: { type: 'string', enum: [ 'table-template', 'tree-table-template', 'tab-template' ], default: 'mobile' }
    }
  };
  allSchema = {
    sf: {
      id: { type: 'string' },
      name: { type: 'string' },
      type: { type: 'string', enum: [ 'table-template', 'tree-table-template', 'tab-template' ], default: 'mobile' }
    },
    options: {
      option: {
        type: 'string',
        title: '状态',
        enum: [
          { label: '待支付', value: 'WAIT_BUYER_PAY', otherData: 1 },
          { label: '已支付', value: 'TRADE_SUCCESS' },
          { label: '交易完成', value: 'TRADE_FINISHED' },
        ],
        ui: {
          widget: 'select',
          change: (value, orgData) => console.log(value, orgData),
        }
      }
    },
    tree: {

    },
    st: {

    }
  }
  optionSchema = {
    properties: {
      type: { type: 'string', enum: [ 'table-template', 'tree-table-template', 'tab-template' ], default: 'mobile' }
    }
  };
  params = {
  }
  actItem = {};  //选中配置
  data = [
    {name:'aaa',type:'table-template',id:'12345'},
    {name:'bbb',type:'tree-table-template',id:'12341231235'},
    {name:'ccc',type:'tab-template',id:'12123345'},
    {name:'ddd',type:'table-template',id:'122343345'},
    {name:'eee',type:'table-template',id:'656745234'},
    {name:'fff',type:'table-template',id:'123787645'},
    {name:'ggg',type:'table-template',id:'123423455'}
  ];
  modalSchema = {
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      type: { type: 'string', enum: [ 'table-template', 'tree-table-template', 'tab-template' ], default: 'mobile' }
    }
  };
  modalParams = {};


  constructor() { }

  ngOnInit() {

  }
  searchData() {

  }
  add() {   // 新增
    this.modelTitle = '新增';
    this.isVisible = true;
  }
  edit(item,e) {   //编辑
    e.stopPropagation();
    this.modelTitle = '编辑';
    this.isVisible = true;
    this.params = item;
  }
  delete(item,e) {  //删除
    e.stopPropagation();
  }
  selectItem(item) {  //配置菜单选择事件
    if(item.type=='tree-table-template'){
      this.tabs = [
        {type:'tree'},
        {type:'sf'},
        {type:'options'},
        {type:'st'}
      ];
    }else {
      this.tabs = [
        {type:'sf'},
        {type:'options'},
        {type:'st'}
      ];
    }
    this.selectedIndex = this.selectedIndex-1;
    this.actItem = item;
  }
  getData() {

  }
  handleOk(): void {  // 新增保存
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 3000);
  }

  handleCancel(): void {  // 新增取消
    this.isVisible = false;
  }

  nzEvent(event){
    console.log(event);
  }
  selectChange(e){
    console.log(this.sf.refreshSchema());
    let tab = this.tabs[e.index].type;
    this.schema.properties = this.allSchema[tab];

  }

}
