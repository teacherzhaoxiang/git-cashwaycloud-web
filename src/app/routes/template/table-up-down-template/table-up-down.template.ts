import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {STChange, STChangeRowClick, STColumn, STComponent, STData, STPage} from '@delon/abc';
import {SFComponent, SFSchema, SFSchemaEnum, SFSchemaEnumType} from '@delon/form';
import {ActivatedRoute,Params} from '@angular/router';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {from} from "rxjs";
import {environment} from "./../../../../environments/environment"
import {UserAddModalComponent} from "../../system/user/user.add";
import {getData} from "@delon/form/src/utils";
import {StepFormComponent} from "../step-form-template/step-form.component";
@Component({
    selector: 'app-table-template',
    templateUrl: './table-up-dwon.template.html',
})
export class TableUpDownTemplateComponent implements OnInit {
    //查询条件绑定参数
    paramsUp: any = {};
    paramsDown: any = {};
    pageTitle:any ="";
    //表格中数据绑定参数
    dataUp : any;
    dataDown : any;
    //对象id，唯一标识一个页面
    id = "";
    name = "";
    @ViewChild('stUp',{ static: false })
    stUp: STComponent;

    @ViewChild('stDwon',{ static: false })
    stDwon: STComponent;

    @ViewChild('sfUp',{ static: false })
    sfUp: SFComponent;

    @ViewChild('sfDown',{ static: false })
    sfDown: SFComponent;

    newPerms:any = "";
    deletePerms:any = "";

    rowDataUp:any;

    tableUpDownUnionKey:string="";

    searchSchemaUp: any = {
        properties: {
        }
    };

    searchSchemaDown: any = {
        properties: {
        }
    };
    //数据总数
    totalUp = 0;
    totalDown = 0;
    //分页参数
    pageUp : STPage = {
        front:false,
        showQuickJumper:true,
        total:true,
        showSize:true
    };

    pageDown : STPage = {
        front:false,
        showQuickJumper:true,
        total:true,
        showSize:true
    }

    pageNumberUp:number = 1;
    pageSizeUp : number = 10;
    selectionsUp : STData[] = [];
    //当前页
//绑定分页参数改变想要事件
    tableChangeUp(e : STChange){
        if(e.type == 'pi' || e.type == 'ps'){
            this.pageNumberUp = e.pi;
            this.pageSizeUp = e.ps;
            this.getDataUp();
        }


        if(e.type == 'click'){
            this.rowDataUp = e.click.item;
            this.getDataDown(this.rowDataUp);
        }

        this.selectionsUp = e.checkbox;

    }

    //绑定分页参数改变想要事件
    tableChangeDown(e : STChange){
        if(e.type == 'pi' || e.type == 'ps'){
            this.pageNumberUp = e.pi;
            this.pageSizeUp = e.ps;
            this.getDataUp();
        }

        this.selectionsUp = e.checkbox;

    }

    constructor(private http: _HttpClient,private message: NzMessageService,private route: ActivatedRoute,private modalSrv: NzModalService) {}

    //表格绑定参数
    columnsUp:  STColumn[] = [{ title: '编号', index: 'id' }];
    columnsDown: STColumn[] = [{ title: '编号', index: 'id' }];
    getColumnsUp(){
        let url = environment.runtime_server_url+'/table'+'/init/'+this.id;
        console.log(url)
        this.http.get(url).subscribe((res:any) =>{
            this.name = res["name"];

            this.genSearchSchemaUp(res["searchFields"]);

            this.genTableColumnsUp(res["viewFields"]);

            this.getDataUp();
        });
    }
    getColumnsDown(){
        let url = environment.runtime_server_url+'/table'+'/init/'+this.id+"_down";
        console.log(url)
        this.http.get(url).subscribe((res:any) =>{
            // this.name = res["name"];
            //
            console.log("00303030303030303039393939393");
             this.genSearchSchemaDown(res["searchFields"]);
             this.tableUpDownUnionKey = res["tableUpDownUnionKey"];
            //
            this.genTableColumnsDown(res["viewFields"]);
            //
            // this.getDataUp();
        });
    }

    add(){
        const modal = this.modalSrv.create({
            nzTitle: '新增',
            nzContent: StepFormComponent,
            nzWidth:1000,
            nzComponentParams: {
                entity:this.id,
            },
            nzFooter:null,
        });
        modal.afterClose.subscribe(()=>{
            this.getDataUp();
        })
    }

    edit(record, modal){
        if(modal){
            this.getDataUp();
        }
    };

    detail(record, modal){
        if(modal["result"]){
            this.stUp.reload();
        }
    };

    delete(record){
        let param : any = {ids:[record.id]}
        this.http.delete(environment.common_crud_url+"/"+this.id,param).subscribe((res:any)=>{
            this.message.info(("数据删除成功"));
            this.getDataUp();
        });
    }



    deletes(): void {
        this.modalSrv.confirm({
            nzTitle     : '确定删除?',
            nzContent   : '<b style="color: red;"></b>',
            nzOkText    : '是',
            nzOkType    : 'danger',
            nzOnOk      : ()=>{this.showDeleteConfirm()},
            nzCancelText: '否',
            nzOnCancel  : () => console.log('Cancel')
        });
    }

    showDeleteConfirm() {
        let selectedIds : Array<string> = [];
        for (let selection of this.selectionsUp){
            selectedIds.push(selection["id"]);
        }
        let param:any = {ids:selectedIds};
        this.http.delete(environment.common_crud_url+"/"+this.id,param).subscribe((res:any)=>{
            this.message.info(("数据删除成功"));
            this.getDataUp();
        });
    }

    genSearchSchemaUp(searchField:any){
        let properties = {};
        for(let field of searchField){
            let data = field["config"];
            let key = field["key"];
            if(data["ui"]!= null ){
                let ui = data["ui"];
                if(ui["asyncData"]!=null){
                    let uri = ui["asyncData"];
                    ui["asyncData"] = ()=>this.http.get<SFSchemaEnumType[]>(uri);
                    data["ui"] = ui;
                }
            }
            properties[key] = data;
        }
        this.searchSchemaUp = {properties:properties};
    }


    genSearchSchemaDown(searchField:any){
        let properties = {};
        for(let field of searchField){
            let data = field["config"];
            let key = field["key"];
            if(data["ui"]!= null ){
                let ui = data["ui"];
                if(ui["asyncData"]!=null){
                    let uri = ui["asyncData"];
                    ui["asyncData"] = ()=>this.http.get<SFSchemaEnumType[]>(uri);
                    data["ui"] = ui;
                }
            }
            properties[key] = data;
        }
        this.searchSchemaDown = {properties:properties};
    }

    genTableColumnsUp(tableColumns:any){
        let tempColumn:STColumn[] = [];
        console.log(JSON.stringify(tableColumns));
        //遍历后端配置页面设计数据包
        for(let _jsonObj of tableColumns){

            if(_jsonObj["index"] == "id"){
                continue;
            }

            //获取动态操作列内容，将详情查阅，编辑，删除三个操作提取转换
            if(_jsonObj["index"] == null && _jsonObj["buttons"] == null){
                continue;
            }
            if(_jsonObj["buttons"] != null){
                let _buttons:Array<any> = [];
                for (let _buttonObj of _jsonObj["buttons"] ) {
                    _buttons.push(this.genButtonClick(_buttonObj)) ;
                }
                _jsonObj["buttons"] = _buttons;
            }
            tempColumn.push(_jsonObj);
        }
        this.columnsUp = tempColumn;
    }

    genTableColumnsDown(tableColumns:any){
        let tempColumn:STColumn[] = [];
        console.log(JSON.stringify(tableColumns));
        //遍历后端配置页面设计数据包
        for(let _jsonObj of tableColumns){

            if(_jsonObj["index"] == "id"){
                continue;
            }

            //获取动态操作列内容，将详情查阅，编辑，删除三个操作提取转换
            if(_jsonObj["index"] == null && _jsonObj["buttons"] == null){
                continue;
            }
            if(_jsonObj["buttons"] != null){
                let _buttons:Array<any> = [];
                for (let _buttonObj of _jsonObj["buttons"] ) {
                    _buttons.push(this.genButtonClick(_buttonObj)) ;
                }
                _jsonObj["buttons"] = _buttons;
            }
            tempColumn.push(_jsonObj);
        }
        this.columnsDown = tempColumn;
    }

    refreshUp(){
        this.getDataUp();
    }
    refreshDown(){
        this.getDataDown(this.rowDataUp);
    }
    getDataUp(){

        this.sfDown.reset();
        this.dataDown = [];
        console.log("===========1");
        let params = this.sfUp.value;
        params["pageSize"] = this.pageSizeUp;
        params["pageNumber"] = this.pageNumberUp;
        let sendParams:any = {param:JSON.stringify(params)}
        console.log("===========22"+this.id);
        this.http.get(environment.common_crud_url+"/"+this.id,sendParams).subscribe((res:any)=>{
            this.dataUp = res["rows"];
            this.totalUp = res["total"]
        })
    }

    getDataDown(item){

        console.log(this.sfDown);

        let params = this.sfDown.value;
        params["pageSize"] = this.pageSizeUp;
        params["pageNumber"] = this.pageNumberUp;
        if(item!=null) {
            params[this.tableUpDownUnionKey] = item.id;
        }
        let sendParams:any = {param:JSON.stringify(params)}
        console.log(params);
        this.http.get(environment.common_crud_url+"/"+this.id+"_down",sendParams).subscribe((res:any)=>{
            this.dataDown = res["rows"];
            this.totalDown = res["total"]
        })
    }

    genButtonClick(_buttonObj : any){
        switch (_buttonObj["type"]) {
            case "modal":
                if("TableEditModalComponent" == _buttonObj["modal"]["component"]){
                    let _modal = _buttonObj["modal"];
                   // _modal["component"] = TableEditModalComponent;
                    _modal["params"] = (recode:any)=>{
                        recode["__entity"] = this.id;
                        recode["__title"] = this.name;
                    }
                    _buttonObj["modal"] = _modal;
                    _buttonObj["click"] = (record, modal) => {
                        console.log("======"+modal);
                        if(modal){
                            this.stUp.reload();
                        }
                    }
                }
                break;
            case "drawer":
                if("TableDetailDrawerComponent" == _buttonObj["drawer"]["component"]){
                    let _drawer = _buttonObj["drawer"];
                   // _drawer["component"] = TableDetailDrawerComponent;

                    _drawer["params"] = (recode:any)=>{
                        recode["__entity"] = this.id;
                    }
                    _buttonObj["drawer"] = _drawer;
                    _buttonObj["click"] = (record, modal) => {
                        // this.st.reload();
                    }
                };
                break;
            case "del":
                _buttonObj["click"]= (record, modal, comp) => {
                    this.delete(record)
                };
                break;
            case "serviceUrl":
                console.log("serviceUrl");
                _buttonObj["click"]= (record, modal, comp) => {
                    this.http.get(environment.hall_server_url+"/"+_buttonObj["serviceUrl"]+record.id).subscribe((res:any)=>{
                        this.dataUp = res["rows"];
                        this.totalUp = res["total"]
                    })
                };
                break;

            case "more":
                let children = _buttonObj["children"]
                let childrenButton = [];
                for (let _childObj of children ) {
                    childrenButton.push(this.genButtonClick(_childObj)) ;
                }
                _buttonObj["children"] = childrenButton;
                break;
            default:
                break;
        }
        return _buttonObj;
    }
    ngOnInit() {
        this.route.params
            .subscribe((params: Params) => {
                this.id = params['id'];
                console.log(this.id);
                console.log('传值');
                console.log(params)
                this.newPerms = this.id+":table:template:add";
                this.deletePerms = this.id+":table:template:delete";
                this.getColumnsUp();
                this.getColumnsDown();

            })
    }
}
