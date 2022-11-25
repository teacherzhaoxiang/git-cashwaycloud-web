import { Component, OnInit, Input, ViewChild, Output, EventEmitter, SimpleChanges, ComponentRef, } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { DelonFormModule, SFSchema } from '@delon/form';
import { HttpClient } from '@angular/common/http'
import { NzModalService } from 'ng-zorro-antd';
import { EditModalComponent } from '../modal/edit-template.components';
import { ActivatedRoute } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AddModalComponent } from '../modal/add-template.components';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { deepCopy } from '@delon/util';
import { FormControl, FormGroup, Validators,FormBuilder, } from '@angular/forms';

@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.component.html',
  styles: [`
  ::ng-deep .ant-divider-horizontal{
    margin:12px 0 18px 0;
  }
  ::ng-deep .ant-select-dropdown-menu::-webkit-scrollbar{
    display:none;
  }
  .container{
    width:100%;
    height:100vh;
  }
  .animation{
    width:100%;
    height:100vh;
    display:flex;
    justify-content: center;
    align-items: center;
  }
  .content{
    width:100%;
  }
  .contentRequired::before{
    content:"*";
    color:#FF0000;
  }
  .search .content{
    padding:0px 20px;
  }
  .sf-edit .content{
    padding:0px 20px;
    margin:15px 0;
  }
  .input-row{
    padding:5px 20px 0 0;
  }
  .switch-row{
    padding:5px 20px 0 0;
    margin:8px 0;
    display:flex;
    justify-content:space-between;
  }
  .select-row {
    margin:10px 0;
    padding-right:20px;
  }
  .input-group-row{
    width:100%;
  }
  .checkbox-row{
    display:flex;
  }
  .widget-add{
    cursor: pointer;
    font-size:10px;
    color:#1890FF;
    margin-top:20px;
  }
  .widget-enum{
    display:flex;
    align-items: center;
    position: relative;
  }
  .widget-delete{
    font-size: 20px;
    color:red;
    position: absolute;
    right: -35px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
  .input-group-row .widget-delete{
    position:static	;
    transform:none;
  }
  .width-control-row .span-width .title{
    margin-right:15px;
  }
  .width-control-row .widget-width{
    margin:10px 0;
  }
  .width-control-row .span-width{
    margin:10px 0;
    display:flex;
  }
  .width-control-row .span-width .label-width{
    margin-right:15px;
  }
  `]
})
export class EditAreaComponent implements OnInit {
  constructor(
    private modalSrv: NzModalService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }
  @Input() from = '';
  @Input() relate = '';
  data:any;
  animation:boolean;
  uri:any;
  nameData = {  //查询区的name获取方式
    type: 'local'
  }
  widgetEnum = [
    { label: '单行文本', value: 'text' },
    { label: '多行文本', value: 'textarea' },
    { label: '单选框', value: 'radio' },
    { label: '多选框', value: 'checkbox' },
    { label: '下拉框', value: 'select' },
    { label: '日期框', value: 'date' },
    { label: '机构树', value: 'org-tree-cashway' }
  ]
  option = [
    { label: 'like', value: 'like' },
    { label: '=', value: '=' },
    { label: 'between', value: 'between' }
  ]
  textarea = {
    autoSize: false
  }
  radio = {
    type: 'A',
    enum: [{ label: '', value: '' }]
  }
  checkbox = {
    type: 'A',
    enum: [{ label: '', value: '' }]
  }
  select = {
    type: 'A',
    enum: [{ label: '', value: '' }]
  }
  date = {
    config:{}
  }
  tree = {
    config:{}
  }
  editPublic = {
    label: [
      { title: 'id', hide: true },
      { title: 'name', hide: false },
      { title: 'formType', hide: false },
      { title: 'columns', hide: false },
      { title: 'initFunction', hide: false },
      { title: 'saveUri', hide: false },
      { title: 'editUri', hide: false },
      { title: 'initUri', hide: false },
      { title: 'addBeforeSaveFunction', hide: false },
      { title: 'editBeforeSaveFunction', hide: false },
      { title: 'saveBeforeUri', hide: false },
    ],
    enum: [{ label: 'id', value: '', disabled: true }]
  }
  tabIndex:number;
  record = {
    config:{
      type:'string',
      ui:{}
    }
  };
  searchRequired = {
    title:false,
  }
  index:any;
  editField:any;
  selected:any;
  searchForm:FormGroup = this.fb.group({ 
    title: new FormControl("title"), 
    key: new FormControl("title"), 
    name:new FormControl("name"), 
    nameType:new FormControl("nameType"),
    firstName:new FormControl("firstName"), 
    secondName:new FormControl("secondName"), 
  }) 
  ngOnInit(): void {
  }
  showAnimation(){
    this.animation = true
    setTimeout(()=>{
      this.animation = false
    },500)
  }
  getData(from,value,i?){
    this.reset()  //重置组件
    this.from = from
    this.data = value
    i>=0?this.index = i:''
    this.judgeFrom(i)
    this.showAnimation()
  }
  judgeFrom(i?) {
    if (this.from == 'search') {
      this.getSelectedFromSearch(i)
    }
    if(this.from == 'sf-edit-public'){
      this.tabIndex = 0
      this.getPublicSfEdit()
    }
    if(this.from == 'sf-edit-relate'){
      this.tabIndex = 1
      this.getSelectedFromSfEdit(i)
    }
    if(this.from == 'sf-edit-new'){
      this.tabIndex = 1
      this.getPublicSfEdit()
    }
  }
  getSelectedFromSearch(i) {  // 查询区字段编辑
    if(i >= 0){
      this.selected = true
      let mateRules = this.data.mateRules.filter((ele,index)=>index == i)
      let searchFields = this.data.searchFields.filter((ele,index)=>index == i)
      console.log(mateRules,searchFields)
      this.record['key'] = mateRules[0].key
      this.record['name'] = mateRules[0].name
      this.record['option'] = mateRules[0].option
      this.record['title'] = searchFields[0].config.title
      this.record['width'] = searchFields[0].config.ui.width
      this.record['maxLength'] = searchFields[0].config.maxLength
      if (!searchFields[0].config.ui.widget && searchFields[0].config.type == 'string') {
        this.record['widget'] = 'text'
      }else{
        this.record['widget'] = searchFields[0].config.ui.widget
        this.getWidgetConfig(searchFields[0].config)
      }
    }
  }
  getWidgetConfig(config){
    console.log(config,this[config.ui.widget])
    if(config.ui.widget == 'select' && config.enum){
      this.select.enum = config.enum
    }
  }
  getPublicSfEdit(){   //操作区sfedit公共编辑
    this.editField = this.data.editField
    for(let key in this.data){
      if(typeof(this.data[key]) == 'string'){
        key == 'id'
        ?this.editPublic.enum[0].value = this.data[key]
        :this.editPublic.enum.push({label:key,value:this.data[key],disabled:true})
      }
      if(key == 'ui'){
        this.editPublic['spanLabel'] = this.data.ui['spanLabel']
        this.editPublic['spanControl'] = this.data.ui['spanControl']
        this.editPublic['span'] = this.data.ui.grid['span']
      }
    }
    this.labelFilter()
  }
  getSelectedFromSfEdit(i){   //操作区sfedit editfield字段编辑
    let editField = this.data.editField.filter((ele,index)=>index == i)
    this.getPublicSfEdit()
    this.tabIndex =1
    this.record['key'] = editField[0].key
    this.record.config['title'] = editField[0].config.title
    this.record.config['maxLength'] = editField[0].config.maxLength
    this.record['required'] = (()=>{
      switch (editField[0].required){
        case "true":return true;break;        
        case "false":return false;break;      
      }
    })()
    this.record['display'] = (()=>{
      switch (editField[0].display){
        case "":return true;break;       
        case "none":return false;break;      
      }
    })()
    this.record['disabled'] = (()=>{
      switch (editField[0].disabled){
        case "V":return false;break;        
        case "true":return true;break;       
      }
    })()
    this.record.config.ui['widget'] = ''
    this.record.config.ui['widget']=(()=>{
      if(editField[0].config.ui&&editField[0].config.ui['widget']){
        return editField[0].config.ui['widget']
      }else if(editField[0].config.type == 'string'){
        return 'text'
      }
    })()
  }
  selectRelate(value,index){
    this.getSelectedFromSfEdit(index)
  }
  editPublicChange() {  //操作区属性label变更回调
    this.labelFilter()
  }
  labelFilter(){  //label过滤
    this.editPublic.label.map(ele=>{
      this.editPublic.enum.some(obj=>ele.title == obj.label)?ele.hide = true:ele.hide = false
    })
  }
  addRow(from) {    //添加行
    if (from == 'sfedit-public') {
      this.editPublic.enum.push({ label: '', value: '', disabled: false })
    }
    if(from == 'search'){
      this[from].enum.push({ label: '', value: '' })
    }
  }
  delRow(from, i) {
    if (from == 'inputGroup') {   //inputGroup里的删除
      if (i == 0) {
        //提示id不可删除
        this.modalSrv.create({
          nzContent: 'id不可删除',
          nzFooter: [
            { label: '关闭', onClick: () => { this.modalSrv.closeAll() } }
          ]
        });
      } else {//删除并重置状态
        this.modalSrv.create({
          nzContent:'确定要删除吗?',
          nzStyle:{
            // position:'absolute',
            // top:'50%',
            // left:'50%',
            // transform:'translate(-50%,-50%)'
          },
          nzOnOk:()=>{
            this[from].enum = this[from].enum.filter((ele, index) => index != i)
            this.labelFilter()
          }
        })
      }
    }else{  //其他组件里的删除
      this.modalSrv.create({
        nzContent:'确定要删除吗?',
        nzStyle:{
          // position:'absolute',
          // top:'50%',
          // left:'50%',
          // transform:'translate(-50%,-50%)'
        },
        nzOnOk:()=>{
          this[from].enum = this[from].enum.filter((ele, index) => index != i)
          this.labelFilter()
        }
      })
    }
  }
  save() {
    if(this.from == 'search'){
      let mateRule= {
        key:this.record['key'],
        name:this.record['name'],
        option:this.record['option']
      }
      let searchField = {
        key:this.record['key'],
        config:{
          title:this.record['title'],
          type:'string',
          maxLength:this.record['maxLength'],
          ui:{
            width:this.record['width']
          }
        }
      }
      if(this.record['widget'] != 'text'){
        this.handlerWidget(this.record['widget'])
      }
      if(this.index >=0){
        this.data.mateRules[this.index] = mateRule
        this.data.searchFields[this.index] = searchField
        console.log(this.data)
      }else{
        let mateRules = this.data.mateRules
        let searchFields = this.data.searchFields
        mateRules.push(mateRule)
        searchFields.push(searchField)
        this.data.mateRules = mateRules
        this.data.searchFields = searchFields
        console.log(this.data)
      }
      this.reset()
    }
    if(this.from == 'sf-edit-public' || this.from == 'sf-edit-relate'){
      let object = {}
      for(let item of this.editPublic.enum){
        object[item.label] = item.value
      }
      let editField = deepCopy(this.record)
      if(editField['key']){ //更改了公共配置和字段配置
        editField['relate'] = editField['key']
        if(editField.config.ui['widget'] == 'text'){
          delete editField.config.ui['widget']
        }
        console.log(editField)
        editField.disabled?'':editField.disabled = "V"
        editField.display?editField.display="":editField.display="none"
        editField.required?editField.required="true":editField.required="false"
        object['editField']=deepCopy(this.data.editField)
        object['editField'][this.index] = editField
      }else{//只更改了公共配置
        object['editField']=deepCopy(this.data.editField)
      }
      if(editField.spanLabel&&editField.spanControl&&editField.span){
        let ui = {
          spanLabel:editField.spanLabel,
          spanControl:editField.spanControl,
          grid:{
            span:editField.span
          }
        }
        object['ui'] = ui
      }
      console.log(object)
    }
    if(this.from == 'sf-edit-new'){
      let object = {}
      for(let item of this.editPublic.enum){
        object[item.label] = item.value
      }
      let editField = deepCopy(this.record)
      if(editField['key']){ //更改了公共配置和字段配置
        editField['relate'] = editField['key']
        if(editField.config.ui['widget'] == 'text'){
          delete editField.config.ui['widget']
        }
        editField.disabled?'':editField.disabled = "V"
        editField.display?editField.display="":editField.display="none"
        editField.required?editField.required="true":editField.required="false"
        object['editField']=this.data.editField
        object['editField'].push(editField)
      }
      if(editField.spanLabel&&editField.spanControl&&editField.span){
        let ui = {
          spanLabel:editField.spanLabel,
          spanControl:editField.spanControl,
          grid:{
            span:editField.span
          }
        }
        object['ui'] = ui
      }
      this.data = object
      console.log(this.data)
    }
  }
  close(){
    this.modalSrv.create({
      nzContent:'确定要关闭吗?',
      nzStyle:{
        // position:'absolute',
        // top:'50%',
        // left:'50%',
        // transform:'translate(-50%,-50%)'
      },
      nzOnOk:()=>{
        this.reset()
        this.from  = undefined
      }
    })
  }
  reset(){
    //重置数值
    this.data={};
    this.index = undefined
    this.from = undefined
    this.nameData = {  //查询区的name获取方式
      type: 'local'
    }
    this.widgetEnum = [
      { label: '单行文本', value: 'text' },
      { label: '多行文本', value: 'textarea' },
      { label: '单选框', value: 'radio' },
      { label: '多选框', value: 'checkbox' },
      { label: '下拉框', value: 'select' },
      { label: '日期框', value: 'date' },
      { label: '机构树', value: 'org-tree-cashway' }
    ]
    this.option = [
      { label: 'like', value: 'like' },
      { label: '=', value: '=' },
      { label: 'between', value: 'between' }
    ]
    this.textarea = {
      autoSize: false
    }
    this.radio = {
      type: 'A',
      enum: [{ label: '', value: '' }]
    }
    this.checkbox = {
      type: 'A',
      enum: [{ label: '', value: '' }]
    }
    this.select = {
      type: 'A',
      enum: [{ label: '', value: '' }]
    }
    this.date = {
      config:{}
    }
    this.tree = {
      config:{}
    }
    this.editPublic = {
      label: [
        { title: 'id', hide: true },
        { title: 'name', hide: false },
        { title: 'formType', hide: false },
        { title: 'columns', hide: false },
        { title: 'initFunction', hide: false },
        { title: 'saveUri', hide: false },
        { title: 'saveBeforeUri', hide: false },
        { title: 'editUri', hide: false },
        { title: 'initUri', hide: false },
        { title: 'addBeforeSaveFunction', hide: false },
        { title: 'editBeforeSaveFunction', hide: false }
      ],
      enum: [{ label: 'id', value: '', disabled: true }]
    }
    this.tabIndex =0;
    this.record = {
      config:{
        type:'string',
        ui:{}
      }
    };  }
  handlerWidget(widget){

  }
  validator(value){
    console.log(value)
  }
}
