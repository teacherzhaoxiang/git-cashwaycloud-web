import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild, OnChanges } from '@angular/core';
import { _HttpClient, TitleService, MenuService } from '@delon/theme';
import { STChange, STColumn, STColumnButton, STComponent, STData, STPage } from '@delon/abc';
import { SFComponent, SFSchema, SFSchemaEnum, SFSchemaEnumType } from '@delon/form';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NzDrawerService, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TableEditModalComponent } from "./edit.template";
import { MenuTreeTemplateComponent } from "./menu-tree.template";
import { TableDetailDrawerComponent } from "./detail.template";
import { environment } from "./../../../../environments/environment";
import { TableAddModalComponent } from "./add.template";
import { CustomerModalTemplate } from "./customer.modal.template";
import { CustomerDrawerTemplate } from "./customer.drawer.template";
import { CustomerModalSingleTemplate } from "./customer.modal.single.template";
import { CustomerModalStSfTemplate } from "./customer.modal.st.sftemplate";
import { UserService } from "../../service/user.service";
import { TableCloneModalComponent } from "./clone.template";
import { DOCUMENT } from "@angular/common";
import { DA_SERVICE_TOKEN, TokenService } from "@delon/auth";
import { SfComponent } from "../../components/sf.component";
import { ModifyCheckModalTemplate } from "./modify-check.modal.template";
import { FormTabsBasicComponent } from "../../components/tab/tab.component";
import { HttpHeaders } from "@angular/common/http";
import { EventService } from "@shared/event/event.service";
import { User } from "../../entity/user";
import { ImageMessageModalComponent } from "../image-message-list-template/image-message-list.detail";
import { AuditModalTemplate } from "./audit.modal.template";
import { Console } from 'console';
import { deepCopy } from '@delon/util';

let TIMEOUT = null;
let TIMEOUT2 = null;
@Component({
    selector: 'app-table-template',
    templateUrl: './table.template.html',
    styles: [
        `
 /*:host ::ng-deep .ant-table-tbody > tr:nth-child(4n+1)  {*/
     /*background-color:#FFFFFF;*/
/*}*/
 /*:host ::ng-deep .ant-table-tbody > tr:nth-child(4n+3)  {*/
     /*background-color: #fefefe;*/
 /*}*/
 /*:host ::ng-deep .ant-table td .img {*/
     /*max-width: none;*/
 /*}*/
 :host ::ng-deep .modal-footer .ant-btn-default[type='button']{
     border: 1px solid #1890ff;
     color: #1890ff
 }
 :host ::ng-deep .modal-footer .ant-btn-default[type='submit']{
     background:  #1890ff;
     color: #fff;
 }
 :host ::ng-deep .modal-footer .ant-btn-default[type='submit'] span{
     color: #fff;
 }
 :host ::ng-deep .modal-footer .ant-btn:disabled{
     color: rgba(0, 0, 0, 0.25) !important;
     background-color: #f5f5f5;
     border: 1px solid #d9d9d9 !important;
 }
    :host ::ng-deep .table .ng-star-inserted{
        text-align: center;
    }
    :host ::ng-deep .ng-star-inserted a{
        white-space: nowrap
    }
 
 :host ::ng-deep .ant-modal-close{
     display: none !important;
 }
  ant-upload-list-item-info{        
     display:none;
 }
  :host ::ng-deep .ng-star-inserted img[src*='download']{
      display: inline-block !important;
  }
 :host ::ng-deep .ng-star-inserted img{
     display: none;
 }
   .ant-card {
       background: #eef9fe;
   }
 :host ::ng-deep .ng-star-inserted img[src*='download']{
     display: inline-block !important;
 }
 :host ::ng-deep .ng-star-inserted img{
     display: none;
 }
 .split-container{
    position: relative;
 }
 .spin{
    position: absolute;
    left: 50%;
    top: 50%;
 }
 .titleContainer{
    width:100%;
 }
 .mainTitle{
    text-align:center;
 }
 .subTitle{
    text-align:center;
    display:flex;
    align-items:center;
 }
 .subTitle :first-child{
 }
 .subTitle .text{
     display:inline-block;
     box-sizing:border-box;
     padding:0px 20px 0px 0px;
 }
 .subData{
     display:flex;
     align-items:center;
     width:100%;
     height:100%;
 }
 .subData .text{
     display:inline-block;
    text-align:center;
    margin:0px 20px 0px 0px;
    flex:1;
}
`]
})
export class TableTemplateComponent implements OnInit {
    waiting = false;
    loading = false;
    //查询条件绑定参数
    params: any = {};
    //表格中数据绑定参数
    data: any;
    //对象id，唯一标识一个页面
    id = "";
    name = "";
    showResetButton = "inline";
    showTable = "inline";
    initUri = "";
    //自定义删除的url
    deleteMoreUri = "";
    //循环间隔
    interval: number = 0;
    //循环条件
    exitInterval: string;
    maxTry: number = 0;
    maxTryErrorMsg: string = "";
    editFlag = true;
    modalResult: Map<string, Object> = new Map<string, Object>();
    doc_name: any = '';
    _this: any;
    @ViewChild('st', { static: false })
    st: STComponent;

    @ViewChild('sf', { static: false })
    sf: SFComponent;

    newPerms: any = "";
    deletePerms: any = "";
    @ViewChild('buttonsDiv', { static: true })
    buttonsDiv: ElementRef;
    buttons: string[];
    viewFields: any;
    delayFlag: boolean = false;
    nzAction: string = environment.file_server_url + "/upload?typeName=hall";
    perms: string[];
    menuButton: object = JSON.parse(localStorage.getItem('menuButton'))
    searchSchema: any = {
        properties: {
        }
    }
    //数据总数
    total = 0;
    //分页参数
    page: STPage = {
        front: false,
        showQuickJumper: true,
        total: true,
        showSize: true,
    }
    pageNumber: number = 1;
    pageSize: number = 10;
    pageSizes: any = [];  //分页器中每页显示条目数下拉框值
    selections: STData[] = [];
    //统计栏
    statisticLabels: any = [];
    statisticCols: number = 4;
    staticAsyncData: string = "";
    statisticEnum: any;
    hasHeader: any = true;
    checkable: any;
    user: User;
    firstPS: number = 10;
    SearchBeforeFunction = ''; //查询之前校验
    formatkey: "";
    /**
     * 权限字符串
     */
    aclString: string;
    formatter: any = [];
    showLoading: boolean = true;
    layerFlag: boolean;
    layerColumns: Array<any> = []
    originSfValue:object = {}
    tag = {};  //保存tag标签数据
    displayCondition = {}
    scrollBar: any;
    //当前页
    //绑定分页参数改变想要事件
    showLoadingAnime(judge) {
        if (judge == 'show') {
            this.showLoading = true
            setTimeout(() => {
                this.showLoading = false
            }, 1500)
        }
        if (judge == 'close') {
            if (this.showLoading == true) {
                setTimeout(() => {
                    this.showLoading = false
                }, 300)
            }
        }
    }
    tableChange(e?: STChange) {
        console.log(e,'翻页')
        if (e.type == 'pi' || e.type == 'ps') {
            console.log('翻页了')
            this.showLoadingAnime('show')
            this.pageNumber = e.pi;
            this.pageSize = e.ps;
            this.getData(false);
        }

        if (e.checkbox != undefined) {
            this.selections = e.checkbox;
        }

    }

    pageHandle(showFlag) {
        let pageTemp: STPage = {
            front: false,
            showQuickJumper: true,
            total: true,
            showSize: true,
        }
        if (showFlag != null && !showFlag) {
            pageTemp.show = false;
            this.page = pageTemp;
        }
    }
    constructor(private menuService: MenuService, private http: _HttpClient, private message: NzMessageService, private titleService: TitleService, private route: ActivatedRoute, private modalSrv: NzModalService, private drawerSrv: NzDrawerService, private router: Router, public render: Renderer2, @Inject(DOCUMENT) private document, public userService: UserService, @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService, private eventService: EventService) {
        this.user = userService.getUser();
    }
    defaultParams = {};
    //表格绑定参数
    columns: STColumn[] = [{ title: '编号', index: 'id' }];
    fieldDefaultValue: boolean = false;
    ngAfterViewInitl() {
        console.log(this.layerFlag)
        this.searchSchema = {properties:{}}        
        if (this.defaultParams != null) {
            for (let key in this.defaultParams) {
                if (key != "pageNumber" && key != "pageSize") {
                    delete this.defaultParams[key];
                }
            }
        }
        if (this.searchSchema != null && this.searchSchema['properties'] != null) {
            for (let key in this.searchSchema['properties']) {
                delete this.searchSchema['properties'][key];
            }
        }
        let url = environment.runtime_server_url + '/table' + '/operation/' + this.id;
        console.log('ngAfterViewInitl')
        this.http.get(url).subscribe((res: any) => {
            console.log(res, 'ngAfterViewInitl')
            if (res == null || res.operations == null) {
                this.getMenu(null)
            } else {
                this.getMenu(res.operations)
            }
        });
    }
    getMenu(operations) {
        console.log('getMenu')
        if (operations != null) {
            this.getColumns();
            console.log(this.menuButton[this.id], '当前页菜单允许的按钮', this.id)
            console.log(operations, 'json配置的按钮区')
            // this.buttons = operations.filter(ele=>this.menuButton[this.id].some(e=>e.text == ele.label))
            this.buttons = operations
        } else {
            this.getColumns();
        }

    }
    getColumns() {
        this.pageNumber = 1;
        let url = environment.runtime_server_url + '/table' + '/init/' + this.id;
        console.log(url)
        this.http.get(url).subscribe((res: any) => {
            console.log(res)
            console.log(res["name"])
            this.name = res["name"];
            this.initUri = res["initUri"];
            this.deleteMoreUri = res["deleteMoreUri"];
            this.delayFlag = res["delayFlag"];
            this.editFlag = !res['readOnly'];
            this.interval = res["interval"];
            this.exitInterval = res["exitInterval"];
            this.maxTry = res["maxTry"];
            this.maxTryErrorMsg = res["maxTryErrorMsg"];
            this.defaultParams = res["defaultParams"];
            this.showResetButton = res["showResetButton"] == null ? "inline" : res["showResetButton"];
            this.showTable = res["showTable"] == null ? "inline" : res["showTable"];
            this.pageHandle(res["pageShow"]);
            this.genSearchSchema(res["searchFields"]);
            this.viewFields = res["viewFields"];
            this.pageSizes = res['pageSizes'];
            this.layerFlag = res['layerFlag'];
            this.scrollBar = res['scrollBar']
            //接收分页的条数数组
            // console.log('薛-后端传' + res['pageSizes']);

            if (res["pageNumber"] != 0) {
                this.pageSize = res['pageNumber'];   //接收一进来显示多少条
                console.log('一进来接收到显示多少条:' + this.pageSize);
            } else {
                this.pageSize = 10; //每页10条
            }

            if (res["statistic"] != null) {
                this.statisticLabels = res["statistic"]["labels"];
                this.statisticCols = res["statistic"]["cols"];
                this.staticAsyncData = res["statistic"]["asyncData"];
                this.statisticEnum = res["statistic"]["enum"];
            }
            //    debugger;
            this.showLoadingAnime('close')
            this.genTableColumns(res["viewFields"]);
            if (!this.delayFlag) {
                this.getData(true);
            }
            // 如果有传值就改变分页条数
            if (res['pageSizes'] != null) {
                this.page = {
                    front: false,
                    showQuickJumper: true,
                    total: true,
                    showSize: true,
                    show: true,
                    pageSizes: this.pageSizes,
                }
            }

        });
    }
    scrollComputed(){
        if(this.scrollBar){
            console.log('1')
            return {x: this.columns.length*120 + 'px'}
        }else{
            console.log('2')
            return ''
        }
    }
    globalButtonClick(item: any) {
        if (item['click'] == 'add') {
            this.add();
        } else if (item['click'] == 'refresh') {
            this.getData(false);
        } else if (item['click'] == 'modal') {
            if (item['selectionsFlag'] == true) {
                if (this.selections != null && this.selections.length > 0) {
                    this.openCustomerModal(item['option'], item);
                } else {
                    this.message.error(("请选择一条数据"));
                    return;
                }
            } else {
                this.openCustomerModal(item['option'], item);
            }
        } else if (item['click'] == 'deletes') {
            this.deletes();
        } else if (item['click'] == 'downloadTemplate') {
            // 创建隐藏的可下载链接
            let eleLink = document.createElement('a');
            console.log("downloadTemplate:" + JSON.stringify(this.buttons))
            let url = environment.file_server_url + '/download?filename=templates/' + this.id + ".xls";
            // let url = environment.file_server_url+'/download?filename=hall/monitor_crown_blacklist_manage.xls';
            eleLink.style.display = 'none';
            // 字符内容转变成blob地址
            //var blob = new Blob([content]);
            eleLink.href = url;
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
        } else if (item['click'] == 'export') {
            let key: string = '';
            let canContinue: boolean = true;
            let limitDates: number;
            const searchSchema = this.searchSchema.properties
            const hasDate = Object.keys(searchSchema).some(ele => {
                if (searchSchema[ele]['ui']['widget'] == 'date' && searchSchema[ele]['ui']['mode'] == 'range' && searchSchema[ele]['ui']['limitDates']) {
                    key = ele
                    limitDates = Number(searchSchema[ele]['ui']['limitDates'])
                    return true
                }
            })
            if (hasDate && Array.isArray(this.sf.value[key])) {
                const start = new Date(this.sf.value[key][0]).getTime()
                const end = new Date(this.sf.value[key][1]).getTime()
                if (end - start > limitDates * 86400000) {
                    canContinue = false
                    this.message.error(`只能查询${limitDates}天内的数据`)
                }
            }
            if (canContinue) {
                this.waiting = true;
                TIMEOUT2 = setTimeout(() => {
                    this.waiting = false;
                    clearTimeout(TIMEOUT2);
                }, 15000);
                let params = this.sf.value;
                params["pageSize"] = this.pageSize;
                params["pageNumber"] = this.pageNumber;
                let sendParams: any = { param: JSON.stringify(params) }
                let eleLink = document.createElement('a');
                // eleLink.download = item['url'];
                eleLink.style.display = 'none';
                // 字符内容转变成blob地址
                let newVar = this.tokenService.get();
                let token = newVar['token'];
                let excelUrl = item["url"];
                console.log('excelUrl:' + excelUrl);
                let header = new HttpHeaders();
                header.append("Content-Type", "application/json");
                header.append("token", token);
                let url = '';
                if (excelUrl == null || excelUrl == undefined || excelUrl == "") {
                    url = environment.gateway_server_url + '/engine/excel/exportByConfig/' + this.id + '?token=' + token + '&param=' + JSON.stringify(params);
                } else {
                    url = environment.gateway_server_url + excelUrl + '?token=' + token + '&param=' + JSON.stringify(params);
                }
                let properties = this.searchSchema.properties;
                for (let i in properties) {
                    if (properties[i]['required'] == true || properties[i]['required-flag'] == true) {
                        if (!params[i]) {
                            this.message.error(properties[i]['title'] + '是必须的');
                            this.waiting = false;
                            clearTimeout(TIMEOUT2);
                            return false;
                        }
                    }
                }
                this.http.post(url, null, null, {
                    responseType: "blob",
                    headers: header
                }).subscribe(resp => {
                    // resp: 文件流
                    this.downloadFile(resp, this.sf.value);
                }, error => { }, () => {
                    this.waiting = false;
                    clearTimeout(TIMEOUT2);
                })
            }

        } else if (item['click'] == 'download') {
            // 创建隐藏的可下载链接
            let eleLink = document.createElement('a');
            console.log("downloadTemplate:" + JSON.stringify(this.buttons))
            let url = environment.file_server_url + '/download?filename=' + item.url;
            // let url = environment.file_server_url+'/download?filename=hall/monitor_crown_blacklist_manage.xls';
            eleLink.style.display = 'none';
            // 字符内容转变成blob地址
            eleLink.href = url;
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
        } else if (item['click'] == 'serviceUrl') {
            let url: string = item["url"];
            if (!url.startsWith("http") && !url.startsWith("https")) {
                url = environment.gateway_server_url + url;
                if (item['selectionsFlag'] == true) {
                    if (this.selections != null && this.selections.length > 0) {
                        let ids: string = "";
                        for (let i = 0; i < this.selections.length; i++) {
                            ids = ids + this.selections[i].id + ",";
                        }
                        ids = ids.substring(0, ids.length - 1);
                        if (url.indexOf("?") > 0) {
                            url = url + "&ids=" + ids;
                        } else {
                            url = url + "?ids=" + ids;
                        }

                    } else {
                        this.message.error(("请选择一条数据"));
                        return;
                    }

                }
            }
            let method = item["method"];
            if (method == null) {
                method = 'get';
            }
            this.http[method](url).subscribe((res: any) => {
                this.message.success("操作成功")
                if (item["afterOption"] == "refresh") {
                    this.getData(false);
                } else if (item["afterOption"] == "null") {

                } else {
                    this.data = this.transFormRows(res["rows"]);
                    this.total = res["total"]
                }
            }, (res: any) => {
                this.message.success("操作失败")
            })
        } else if (item['click'] == 'router') {
            console.log("009888888888");
            this.router.navigate([item.url]);
        } else if (item['click'] == 'jump') {
            console.log("jump");
            window.open(item['url'])
        }
    }
    //文件下载
    downloadFile(data, jsonData: any = '') {
        console.log(jsonData);
        // 下载类型 xls
        const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        // 下载类型：csv
        const contentType2 = 'text/csv';
        const uA = window.navigator.userAgent;//判断本机内核
        const isIE = /msie\s|trident\/|edge\//i.test(uA) && !!("uniqueID" in document || "documentMode" in document || ("ActiveXObject" in window) || "MSInputMethodContext" in window);

        const blob = new Blob([data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        // 打开新窗口方式进行下载
        // window.open(url);

        // 以动态创建a标签进行下载
        const a = document.createElement('a');
        let fileName: any = "";
        try {
            if (jsonData["statistic_date"].length == '7') {
                fileName = "-" + jsonData["statistic_date"];
            } else {
                fileName = jsonData["statistic_date"][0] + "—" + jsonData["statistic_date"][1];
            }
        } catch (err) {
            fileName = new Date().toLocaleDateString();
        }
        a.href = url;
        // a.download = fileName;
        a.download = this.name + fileName + '.xls';

        if (isIE) {
            // 兼容IE11无法触发下载的问题

            navigator.msSaveBlob(new Blob([data]), a.download);
        } else {
            console.log(123);
            console.log(a.href);
            a.click();
        }
        // a.click();
        window.URL.revokeObjectURL(url);
    }

    add() {
        this.data = null;
        const modal = this.modalSrv.create({
            //nzTitle: '新增',
            nzContent: TableAddModalComponent,
            nzWidth: 0,
            nzComponentParams: {
                entity: this.id,
            },
            nzFooter: null,
            nzMaskClosable: false,
            nzClosable: false,
            nzBodyStyle: {
                "width": "0px",
                "background": "rgba(0,0,0,0)",
                "position": "fixed",
                "left": "50%",
                "margin-left": "-400px",
                "top": "50%",
                "transform": "translateY(-50%)"
            }
        }).afterClose.subscribe(res => {
            res ? (this.getData(false), console.log(523)) : ''
        })

    }
    openCustomerModal(modalId: any, item: any) {
        const modal = this.modalSrv.create({
            nzContent: CustomerModalTemplate,
            nzWidth: 800,
            nzComponentParams: {
                record: { __entity: this.id, __modalId: modalId, __modal: item, ids: this.selections },
            },
            nzFooter: null,
            nzClosable: false,
            nzBodyStyle: {
                "width": "0px",
                "background": "rgba(0,0,0,0)",
                "position": "fixed",
                "left": "50%",
                "margin-left": "-400px",
                "top": "50%",
                "transform": "translateY(-50%)"
            }
        });
        if (item["afterOption"] != 'unRefresh') {
            modal.afterClose.subscribe((res) => {
                res ? (this.getData(false), console.log('548')) : ''
            })
        }

    }


    /**
     * 渲染自定义审核按钮
     * @param modalId
     */
    handleCustomerButton(record) {
        this.http.get(environment.runtime_server_url + '/table/init/' + record['entity']).subscribe((res: any) => {
            console.log(res, '561')
            let original: any = JSON.parse(record["object_data"])[0];
            let viewFields = res["viewFields"];

            for (let _jsonObj of viewFields) {
                if (_jsonObj["buttons"] != null) {
                    let _buttons: Array<any> = [];
                    for (let buttonObj of _jsonObj["buttons"]) {
                        if (buttonObj["approve_button"]) {
                            let url = "";
                            switch (buttonObj["type"]) {
                                case "modal":
                                    let _clickObj: any = buttonObj["modal"];
                                    if ("CustomerModalTemplate" == _clickObj["component"]) {
                                        original["__entity"] = this.id;
                                        original["__title"] = _clickObj["name"];
                                        original["__modalId"] = _clickObj["option"];
                                        this.modalSrv.create({
                                            nzContent: CustomerModalTemplate,
                                            nzWidth: 800,
                                            nzComponentParams: {
                                                record: original,
                                            },
                                            nzFooter: null,
                                        });
                                    }
                                    break;
                                case "a":
                                    let eleLink = document.createElement('a');
                                    url = environment.file_server_url + original[buttonObj['field']];
                                    eleLink.style.display = 'none';
                                    eleLink.href = url;
                                    document.body.appendChild(eleLink);
                                    eleLink.click();
                                    document.body.removeChild(eleLink);
                                    break;
                                case "jump":
                                    url = this.genServletUri(buttonObj['url'], original);
                                    window.open(url);
                                    break;
                            }
                            break;
                        }
                    }
                }
            }
        });
    }

    /**
     * 打开审核弹出框
     * @param modalId
     */
    openModifyCheckComponentModal(record, _buttonObj) {
        let title: string = _buttonObj["text"];
        let _width: number = 800;
        if (_buttonObj["modal"] != null && _buttonObj["modal"]["width"] != null) {
            _width = _buttonObj["modal"]["width"]
        }
        const modal = this.modalSrv.create({
            // nzTitle: title,
            nzContent: ModifyCheckModalTemplate,
            nzWidth: _width,
            nzComponentParams: {
                record: record,
                showAudit: _buttonObj["modal"]["showAudit"]
            },
            nzFooter: null,
            nzMaskClosable: false,
            nzClosable: false,
            nzBodyStyle: {
                "width": "0px",
                "background": "rgba(0,0,0,0)",
                "position": "fixed",
                "left": "50%",
                "margin-left": "-400px",
                "top": "50%",
                "transform": "translateY(-50%)"
            }
        });
        modal.afterClose.subscribe(() => {
            this.getData(false); console.log('642')
        })
    }

    /**
     * 打开新的审核弹出框
     * @param modalId
     */
    openAuditComponentModal(record, _buttonObj) {
        let title: string = _buttonObj["text"];
        let _width: number = 800;
        if (_buttonObj["modal"] != null && _buttonObj["modal"]["width"] != null) {
            _width = _buttonObj["modal"]["width"]
        }
        record["entity"] = this.id;
        record["targetTableName"] = _buttonObj["modal"]["targetTableName"];
        record["targetKey"] = _buttonObj["modal"]["targetKey"];
        const modal = this.modalSrv.create({
            // nzTitle: title,
            nzContent: AuditModalTemplate,
            nzWidth: _width,
            nzComponentParams: {
                record: record,
                showAudit: _buttonObj["modal"]["showAudit"],
                auditBefore: _buttonObj["modal"]["auditBefore"],
                auditAfter: _buttonObj["modal"]["auditAfter"],
                agreeUrl: _buttonObj["modal"]["agreeUrl"],
                noAgreeUrl: _buttonObj["modal"]["noAgreeUrl"]
            },
            nzFooter: null,
            nzMaskClosable: false,
            nzClosable: false,
            nzBodyStyle: {
                "width": "0px",
                "background": "rgba(0,0,0,0)",
                "position": "fixed",
                "left": "50%",
                "margin-left": "-400px",
                "top": "50%",
                "transform": "translateY(-50%)"
            }
        });
        modal.afterClose.subscribe(() => {
            this.getData(false); console.log('685')
        })
    }

    edit(record, modal) {
        if (modal) {
            this.getData(false);
        }
    };

    detail(record, modal) {
        if (modal["result"]) {
            this.getData(false);
        }
    };

    delete(record) {
        console.log(record)
        const modal = this.modalSrv.create({
            nzTitle: '确认删除',
            nzContent: '请确认是否删除该信息',
            nzComponentParams: {
            },
            nzStyle: {
                width: '900px',
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: "translate(-50%,-50%)"
            },
            nzOnOk: () => {
                let param: any = { ids: [record.id] }
                this.http.delete(environment.common_crud_url + "/" + this.id, param).subscribe((res: any) => {
                    let code = res["code"];
                    if (code != null) {
                        if (code == 0 || code == 200) {
                            this.message.info(("数据删除成功"));
                        } else {
                            this.message.error(res["msg"]);
                        }
                    } else {
                        this.message.info(("数据删除成功"));
                    }

                    this.getData(false);
                });
            }
        });
    }

    deletes(): void {
        if (this.selections == null || this.selections.length == 0) {
            this.message.error(("请选择一条数据"));
            return;
        }
        this.modalSrv.confirm({
            nzTitle: '确定删除?',
            nzContent: '<b style="color: red;"></b>',
            nzOkText: '是',
            nzOkType: 'danger',
            nzOnOk: () => { this.showDeleteConfirm() },
            nzCancelText: '否',
            nzOnCancel: () => console.log('Cancel')
        });
    }

    showDeleteConfirm() {
        let selectedIds: Array<string> = [];
        for (let selection of this.selections) {
            selectedIds.push(selection["id"]);
        }
        let param: any = { ids: selectedIds };
        let url = environment.common_crud_url + "/" + this.id;
        if (this.deleteMoreUri != null && this.deleteMoreUri != "") {
            url = environment.gateway_server_url + "/" + this.deleteMoreUri;
        }
        this.http.delete(url, param).subscribe((res: any) => {
            console.log(JSON.stringify(res) + "   =ssss==================================");
            let code = res["code"];
            if (code != null) {
                if (code == 0 || code == 200) {
                    this.message.info(("数据删除成功"));
                } else {
                    this.message.error(res["msg"]);
                }
            } else {
                this.message.info(("数据删除成功"));
            }
            this.getData(false);
        });

        this.selections = [];
        this.eventService.subscribe(this.closeModal, this);
    }
    closeModal(_event, _this) {
        if (_event == "auditSubmitOk") {
            _this.getData(false);
        }
    }

    dateMap = {};
    genSearchSchema(searchField: any) {
        let properties = {};
        for (let field of searchField) {
            let data = field["config"];
            let key = field["key"];
            if (data["ui"] != null) {
                let ui = data["ui"];
                // console.log(ui,"这是ui");
                if (ui["asyncData"] != null && ui["mate"] != null) {
                    let uri: string = ui["asyncData"];
                    let mate = ui["mate"];
                    let param = ui["params"];
                    if (!uri.startsWith("http")) {
                        uri = environment.gateway_server_url + uri;
                    }
                    ui["asyncData"] = () => this.http.get<SFSchemaEnumType[]>(uri, { mate: JSON.stringify(mate), params: param });

                }
                if (ui["widget"] == 'slider' && ui['formatter'] != null) {
                    debugger
                    ui['formatter'] = (value) => { return value; };
                }
                if (ui["widget"] == "date") {

                }
                if (ui["widget"] == "date" && ui['disabledDate']) {

                    ui['disabledDate'] = eval(ui['disabledDate'])
                }




                data["ui"] = ui;
            }
            if (typeof field["required"] !== 'undefined') {
                data["required"] = field["required"];
            } else {
                data['required'] = false;
            }

            let perm = 'template:table-template:' + this.id + ":" + field["perm"];//权限
            console.log('----perm----' + perm);
            //默认显示所有超链接，但是如果，配置了权限，那么不显示按钮
            if (field["perm"] != null) {
                if (this.perms.includes(perm)) {
                    properties[key] = data;
                }
            } else {
                properties[key] = data;
            }
            //保存原始默认值
            if(data['default']){
                this.originSfValue[key] = data['default']
            }
            //默认时间
            if (data["ui"]["widget"] == "date" && data["ui"]['showDefaultDate']) {
                console.log(data, '数据')
                let defaultTime: string
                // (() => {
                const time = new Date(new Date().getTime() - (86400000 * Number(data["ui"]['showDefaultDate'])))
                const year = time.getFullYear()  //年
                const month = ("0" + (time.getMonth() + 1)).slice(-2); //月
                const day = ("0" + time.getDate()).slice(-2); //日
                const mydate = year + "-" + month + "-" + day;
                console.log(mydate, '现在时间')
                defaultTime = mydate
                // })()
                this.defaultParams = this.defaultParams == null ? {} : this.defaultParams
                if (!data["ui"]['mode']) {
                    properties[key].default = defaultTime;
                    this.defaultParams[key] = defaultTime;
                } else if (data["ui"]['mode'] == 'range') {
                    properties[key].default = [defaultTime, defaultTime];
                    this.defaultParams[key] = [defaultTime, defaultTime];
                }
                this.searchSchema = { properties: properties };
            } else {
                this.searchSchema = { properties: properties };
            }
            // properties

        }
        // properties['orgId'] = {
        //     title:'',
        //     type:'string',
        //     ui:{
        //         widget:'org-select'
        //     }
        // }
        this.searchSchema = { properties: properties };
        console.log(properties, '查询区')

        this.sf.refreshSchema();
    }
    change($event) {
        for(let key in this.displayCondition){
            if(this.displayCondition[key]){
                console.log(key)
                if($event[key]&&this.originSfValue[key]&&this.originSfValue[key] != $event[key]){
                    this.st.reload()
                    break
                }
            }
        }
        this.originSfValue = deepCopy($event)
    }
    genTableColumns(tableColumns: any) {
        console.log(tableColumns, 'tableColumns')
        let tempColumn: STColumn[] = [];
        let layerColumns = []
        //遍历后端配置页面设计数据包
        this.formatter = []
        for (let _jsonObj of tableColumns) {
            if (_jsonObj["type"] === "tag") {
                _jsonObj['tag']['-'] = { "color": "transparent", "text": "-" };  //设置tag的默认值，匹配不到值时就匹配默认值
                this.tag = _jsonObj;
            }
            if (_jsonObj["index"] == "id") {
                continue;
            }
            //获取动态操作列内容，将详情查阅，编辑，删除三个操作提取转换
            if (_jsonObj["index"] == null && _jsonObj["buttons"] == null) {
                continue;
            }
            if (_jsonObj["display"] == "none") {
                continue;
            }

            if (_jsonObj["format"] != null) {
                let param = _jsonObj["format"];
                _jsonObj["format"] = (item: STData, col: STColumn, index: number) => {
                    let value = "";
                    eval(param);
                    return value;
                };
            }
            if (_jsonObj['formatter'] != null) {
                this.formatter.push({
                    index: _jsonObj['index'],
                    formatter: _jsonObj['formatter']
                })
                console.log(this.formatter, '格式修改')
            }
            // 实现图片预览功能     //暂时关闭图片预览功能
            if (_jsonObj["type"] == "img" && _jsonObj["buttons"] == null) {
                // let previewText = _jsonObj['previewText'] ? _jsonObj['previewText'] : '预览';  // 预览操作按钮的显示文字
                // _jsonObj['buttons'] = [
                //     {
                //         text: previewText, click: (record) => {
                //             let previewIndex = _jsonObj['previewIndex'] ? _jsonObj['previewIndex'] : _jsonObj['index'];  // 配置图片的预览地址，若无配置，则获取当前地址为预览的地址
                //             this.openStatusDetail(record, previewIndex);  //  图片预览操作
                //         }
                //     }
                // ];
            }
            if (_jsonObj["click"] != null) {
                //debugger;
                let _clickObj = _jsonObj["click"];
                let comp: any;
                switch (_clickObj["type"]) {
                    case "drawer":
                        if ("TableDetailDrawerComponent" == _clickObj['component']) {
                            comp = TableDetailDrawerComponent;
                            _jsonObj["click"] = (record, instance) => {
                                record.__entity = _clickObj["entity"];
                                record.__id = record[_clickObj["mateKey"]];
                                this.drawerSrv.create({
                                    nzTitle: _clickObj["title"],
                                    nzContent: comp,
                                    nzWidth: 400,
                                    nzContentParams: {
                                        record: record,
                                    },
                                })
                            }
                        }

                        break;
                    case "modal":
                        if ("CustomerModalSingleTemplate" == _clickObj['component']) {
                            comp = CustomerModalSingleTemplate;
                            _jsonObj["click"] = (record, instance) => {
                                record["__entity"] = this.id;
                                record["__title"] = _clickObj["name"];
                                record["__modalId"] = _clickObj["option"];
                                this.modalSrv.create({
                                    nzContent: CustomerModalSingleTemplate,
                                    nzWidth: 800,
                                    nzComponentParams: {
                                        record: record,
                                    },
                                    nzFooter: null,
                                });
                            }
                        }

                }
            }
            if (_jsonObj["buttons"] != null) {
                let _buttons: Array<any> = [];
                console.log(_jsonObj["buttons"], '屏蔽前表格按钮')
                for (let _buttonObj of _jsonObj["buttons"]) {
                    let button = this.genButtonClick(_buttonObj);
                    console.log(this.id)
                    if (button.popTitle) {
                        button.pop = {
                            title: button.popTitle,
                        }
                    }
                    if (button != null) {
                        _buttons.push(button);
                    }
                    // if (button != null && this.menuButton[this.id].some(ele=>ele.text == button.text)) {
                    //     _buttons.push(button);
                    // }
                }
                _jsonObj["buttons"] = _buttons;
                console.log(_jsonObj["buttons"])
            }
            if (_jsonObj["parentIndex"]) {
                const { index, parentIndex, parentTite, title, _relate } = _jsonObj
                const display = !Boolean(_jsonObj["displayCondition"])   //存在则不默认显示,在template中动态根据key判断显示
                if(!display){
                    _jsonObj["displayCondition"].forEach(ele=>{
                        this.displayCondition[ele.key] = true
                    })
                }
                const i = tempColumn["findIndex"](ele => ele.index == parentIndex)
                if (i == -1) {
                    let children = { index, _relate, title , display}
                    _jsonObj["displayCondition"]?children['displayCondition'] = _jsonObj["displayCondition"] : ''
                    tempColumn.push({
                        index: parentIndex,
                        title: parentTite,
                        render: `${parentIndex}Content`,
                        renderTitle: `${parentIndex}Title`,
                        children: [children]
                    })
                } else {
                    let children = { index, _relate, title , display}
                    _jsonObj["displayCondition"]?children['displayCondition'] = _jsonObj["displayCondition"] : ''
                    tempColumn[i]['children'].push(children)
                }
                continue
            }

            tempColumn.push(_jsonObj);


        }
        this.layerColumns = tempColumn.filter(ele => ele.children)
        this.columns = tempColumn
        console.log(this.layerColumns)
        console.log(this.columns, '表格配置')
    }
    test(obj) {
        console.log(obj)
        // return'abc'
    }
    beforeColumns
    refresh() {
        this.getData(false);
    }

    genInitUri(url: string, params) {
        while (url.indexOf("{{") > 0 && url.indexOf("}}") > 0) {
            let i = url.indexOf("{{");
            let j = url.indexOf("}}");
            if (j > i) {
                let key = url.substring(i + 2, j);
                console.log(key);
                url = url.replace("{{" + key + "}}", this.modalResult[key] == null ? params[key] : this.modalResult[key]);
            }
        }
        return url;
    }

    genServletUri(url: string, record: any) {
        //url = "./assets/online-design/design.html#/flow?applicationId={{application_id}}&applicationName={{application_name}}&token={{_token}}";
        while (url.indexOf("{{") > 0 && url.indexOf("}}") > 0) {
            let i = url.indexOf("{{");
            let j = url.indexOf("}}");
            if (j > i) {
                let key = url.substring(i + 2, j);
                if (key === '_token') {  //url传递token
                    let token = JSON.parse(localStorage.getItem(key));
                    url = url.replace("{{" + key + "}}", token['token']);
                } else {
                    url = url.replace("{{" + key + "}}", record[key]);
                }
            }
        }
        return url;
    }

    genServletUri2(url: string, record: any) {
        //url = "./assets/online-design/design.html#/flow?applicationId={{application_id}}&applicationName={{application_name}}&token={{_token}}";
        while (url.indexOf("{{") >= 0 && url.indexOf("}}") >= 0) {
            let i = url.indexOf("{{");
            let j = url.indexOf("}}");
            if (j > i) {
                let key = url.substring(i + 2, j);
                if (key === '_token') {  //url传递token
                    let token = JSON.parse(localStorage.getItem(key));
                    url = url.replace("{{" + key + "}}", token['token']);
                } else {
                    url = url.replace("{{" + key + "}}", record[key]);
                }
            }
        }
        return url;
    }

    timer;
    buttonGetData() {
        let params = this.sf.value
        let properties = this.searchSchema.properties;
        for (let i in properties) {
            if (properties[i]['required'] == true || properties[i]['required-flag'] == true) {
                if (!params[i]) {
                    this.message.error(properties[i]['title'] + '是必须的');
                    return
                }
            }
        }
        let key: string = ''
        let limitDates: number
        const searchSchema = this.searchSchema.properties
        const hasDate = Object.keys(searchSchema).some(ele => {
            if (searchSchema[ele]['ui']['widget'] == 'date' && searchSchema[ele]['ui']['mode'] == 'range' && searchSchema[ele]['ui']['limitDates']) {
                key = ele
                limitDates = Number(searchSchema[ele]['ui']['limitDates'])
                return true
            }
        })
        if (hasDate && Array.isArray(this.sf.value[key])) {
            const start = new Date(this.sf.value[key][0]).getTime()
            const end = new Date(this.sf.value[key][1]).getTime()
            if (end - start > limitDates * 86400000) {
                this.message.error(`只能查询${limitDates}天内的数据`)
                return
            }
        }
        this.showLoadingAnime('show')
        this.loading = true;
        TIMEOUT = setTimeout(() => {
            this.loading = false;
            clearTimeout(TIMEOUT);
        }, 5000);
        this.pageNumber = 1;
        console.log('get')
        this.getData(false);
    }

    buttonResetData() {
        this.pageNumber = 1;
        this.params = this.defaultParams == null ? {} : this.defaultParams;
        this.sf.reset();
        console.log(this.st, 'st')
        console.log(this.sf, 'sf')
        this.getData(false);
    }

    clearIntervalFun() {
        if (this.timer != null) {
            clearInterval(this.timer);
            this.timer = null
            this._times = 0;
        }

    }
    _times = 0;
    getData(initFlag: boolean) {
        // this.st.clearStatus();
        console.log(this.interval)
        if (this.interval != null && this.interval > 0) {
            console.log(initFlag, 'initFlag')
            this.getTableDatas(initFlag);
            let setTimer = () => {
                this.timer = setInterval(() => {
                    if (this.exitInterval != null && this.exitInterval != "") {
                        let dom = this;
                        let exitFlag: boolean = eval(this.exitInterval);
                        if (exitFlag) {
                            this.clearIntervalFun();
                        } else {
                            if (this.maxTry == null || this.maxTry == undefined || this.maxTry == 0) {
                                console.log(initFlag, 'initFlag')
                                this.getTableDatas(initFlag);
                            } else {
                                if (this._times >= this.maxTry) {
                                    this.clearIntervalFun();
                                    alert(this.maxTryErrorMsg);

                                }
                                this.getTableDatas(initFlag);
                                this._times++
                            }
                        }
                    }

                }
                    , this.interval);
            }
            if (!this.timer) {
                setTimer()
            } else {
                clearInterval(this.timer)
                setTimer()
            }
        } else {
            this.getTableDatas(initFlag);
        }
    }

    getTableDatas(initFlag: boolean) {
        let params = this.sf.value;
        // debugger;
        let date = this.dateMap["dateArray"];
        if (params["approve_time"] != null && date != null) {
            params["approve_time"][0] = date[0];
            params["approve_time"][1] = date[1];

        }
        if (initFlag) {
            params = this.defaultParams == null ? {} : this.defaultParams;
        }
        params["pageSize"] = this.pageSize;
        params["pageNumber"] = this.pageNumber;
        console.log(params)
        let sendParams: any = { param: JSON.stringify(params) }
        let url = environment.common_crud_url + "/" + this.id;
        if (this.initUri != null && this.initUri != "") {
            if (!this.initUri.startsWith("http") && !this.initUri.startsWith("https")) {
                url = environment.gateway_server_url + this.initUri;
            }
            url = this.genInitUri(url, params);
        }
        //获取表格数据
        this.http.get(url, sendParams).subscribe((res: any) => {
            this.showLoadingAnime('close')
            if (res.code == 0) {
                console.log("=======jjjjjjjjj==", res);
                // for(let i in res['rows']){
                //     if(res['rows'][i]['status']!=0){
                //         res['rows'][i]['disabled'] = true;  //如果status!=0,状态不是未处理的情况checkbook不可点击
                //     }
                // }
                this.viewFields[this.viewFields.length - 1]['className'] = 'text-center';
                // console.log(this.viewFields);
                //获取viewFileds中check的装填
                let viewTemp = null;
                for (let i = 0; i < this.viewFields.length; i++) {
                    let data = this.viewFields[i];
                    let type = data.type;
                    let _relate = data._relate;
                    if (type == 'img' && _relate != null && _relate.split('.')[1] != '') {
                        for (let j = 0; j < res['rows'].length; j++) {
                            res['rows'][j][_relate.split('.')[1]] = res['rows'][j][_relate.split('.')[1]];
                        }
                    }
                    if (this.viewFields[i]['index'] == "checked") {
                        viewTemp = this.viewFields[i];
                    }
                }
                //兼容其它没有diasable的情况
                if (viewTemp) {
                    if (!!viewTemp["disabled"]) {
                        //判断是否可选择chekcbox;
                        var item = null;
                        var iifCode = false;
                        for (let k = 0; k < res['rows'].length; k++) {
                            item = res['rows'][k];
                            eval(viewTemp["disabled"]);
                            res["rows"][k]["disabled"] = iifCode;
                            iifCode = false;
                        }
                    }
                }
                let rows = res["rows"];
                if (this.tag["index"]) {
                    for (var key in rows) {
                        let index = this.tag["index"];
                        let rowTag = rows[key][index];
                        if (!this.tag['tag'][rowTag]) {   //匹配不到tag值时把值设置为tag的默认值
                            rows[key][index] = "-";
                        }
                    }
                }
                //更改格式
                this.data = this.formatterRows(this.transFormRows(rows));
                console.log('获取数据完成', this.data)
                // this.data = this.transFormRows(rows)
                this.total = res["total"];
            } else {
                console.log('111112')

                this.clearIntervalFun();
            }
        }, () => {
            console.log('11111')

            this.clearIntervalFun();
        }, (res?: any) => {
            console.log('11113', res)
            this.loading = false;
            clearTimeout(TIMEOUT);
        })
    }
    formatterRows(rows) {
        if (this.formatter.length > 0) {
            console.log(this.formatter)
            for (let key in rows) {
                this.formatter.forEach(ele => {
                    let fn = eval(ele['formatter'])
                    rows[key][ele.index + '_Origin'] = rows[key][ele.index]
                    rows[key][ele.index] = fn(rows[key][ele.index])
                })
            }
        }
        return rows
    }
    transFormRows(rows) {
        return rows;
    }
    genButtonClick(_buttonObj: any) {
        switch (_buttonObj["type"]) {
            case "approve":
                _buttonObj["click"] = (record) => {
                    this.handleCustomerButton(record);
                }
                let iifApprove = _buttonObj["iif"]
                _buttonObj["iif"] = (item: STData, btn: STColumnButton, column: STColumn) => {
                    let iifCode = true;
                    if (iifApprove != null && iifApprove != undefined)
                        eval(iifApprove);
                    return iifCode;
                }
                break;
            case "modal":
                //    debugger;
                if ("menuTree" == _buttonObj["modal"]["component"]) {
                    let _modal = _buttonObj["modal"];
                    _modal["component"] = MenuTreeTemplateComponent;
                    _modal["params"] = (recode: any) => {
                        recode["config"] = _buttonObj["modal"]["config"];
                        recode["__entity"] = this.id;
                        recode["__title"] = this.name;
                        recode["__modalTitle"] = _modal["title"];
                        if (_modal["disabled"] == true) {
                            recode["__disabled"] = true;
                        } else {
                            recode["__disabled"] = false;
                        }
                    }
                    _buttonObj["modal"] = _modal;
                    _buttonObj["click"] = (record, modal) => {
                        console.log("======" + modal);
                        if (modal) {
                            // this.getData(false);
                        }
                    };
                } else if ("TableEditModalComponent" == _buttonObj["modal"]["component"] || "TableCloneModalComponent" == _buttonObj["modal"]["component"]) {
                    let _modal = _buttonObj["modal"];
                    if ("TableEditModalComponent" == _buttonObj["modal"]["component"]) {
                        _modal["component"] = TableEditModalComponent;
                        _modal["params"] = (recode: any) => {
                            recode["__entity"] = this.id;
                            recode["__title"] = this.name;
                            recode["__modalTitle"] = _buttonObj["modal"]["title"];
                            if (_modal["disabled"] == true) {
                                recode["__disabled"] = true;
                            } else {
                                recode["__disabled"] = false;
                            }
                        }
                    } else {
                        _modal["component"] = TableCloneModalComponent;
                        _modal["params"] = (recode: any) => {
                            recode["__entity"] = this.id;
                            recode["__title"] = this.name;
                            recode["__columns"] = _buttonObj["modal"]["columns"];
                        }
                    }
                    _buttonObj["modal"] = _modal;
                    _buttonObj["click"] = (record, modal) => {
                        console.log("======" + modal);
                        if (modal) {
                            this.getData(false);
                        }
                    }
                } else if ("CustomerModalTemplate" == _buttonObj["modal"]["component"]) {
                    let _modal = _buttonObj["modal"];
                    _modal["component"] = CustomerModalTemplate;
                    _modal['size'] = 1200;
                    _modal["params"] = (recode: any) => {
                        recode["__entity"] = this.id;
                        recode["__title"] = _modal["name"];
                        recode["__modalId"] = _modal["option"];
                        recode["__modal"] = _modal;
                    }
                    _buttonObj["modal"] = _modal;
                    _buttonObj["click"] = (record, modal) => {
                        console.log("==2222222222222====" + modal);
                        if (_buttonObj["afterOption"] == "refresh") {
                            this.getData(false);
                        } else {
                            if (modal != null && modal.data != null) {
                                modal.data.forEach((value: any, key: any) => {
                                    this.modalResult.set(key, value);
                                })
                            }
                        }
                    }
                } else if ("CustomerModalSingleTemplate" == _buttonObj["modal"]["component"]) {
                    let _modal = _buttonObj["modal"];
                    _modal["component"] = CustomerModalSingleTemplate;
                    _modal["params"] = (recode: any) => {
                        recode["__entity"] = this.id;
                        recode["__title"] = _modal["name"];
                        recode["__modalId"] = _modal["option"];
                    }
                    _buttonObj["modal"] = _modal;
                    _buttonObj["click"] = (record, modal) => {
                        console.log("======" + modal);
                    }
                } else if ("CustomerPageTemplate" == _buttonObj["modal"]["component"]) {
                    _buttonObj["modal"]["component"] = null;
                    _buttonObj["click"] = (record, modal) => {
                        this.router.navigate(['/publish'], {
                            queryParams: {
                                "id": record.id,
                                "backRouter": this.router.url
                            }
                        });
                    }
                } else if ("CustomerModalStSfTemplate" == _buttonObj["modal"]["component"]) {
                    //debugger;
                    let _modal = _buttonObj["modal"];
                    _modal["component"] = CustomerModalStSfTemplate;
                    _modal["params"] = (recode: any) => {
                        recode["__entity"] = this.id;
                        recode["__title"] = this.name;
                        recode["__columns"] = this.columns; console.log('1418', 'columns');
                        recode["__modalId"] = _modal["option"];
                    }

                    _buttonObj["modal"] = _modal;
                    _buttonObj["click"] = (record, modal) => {
                        console.log("======" + modal);
                        if (modal) {
                            this.getData(false);
                        }
                    }
                } else if ("FormTabsBasicComponent" == _buttonObj["modal"]["component"]) {
                    let _modal = _buttonObj["modal"];
                    _modal["component"] = FormTabsBasicComponent;
                    _modal["includeTabs"] = true;
                    _modal["params"] = (recode: any) => {
                        recode["__entity"] = this.id;
                        recode["__title"] = this.name;
                        recode["__columns"] = this.columns; console.log('1443', 'columns');
                        recode["__options"] = _modal["options"];
                    }

                    _buttonObj["modal"] = _modal;
                    _buttonObj["click"] = (record, modal) => {
                        console.log("======" + modal);
                        if (modal) {
                            this.getData(false);
                        }
                    }
                } else if ("SfComponent" == _buttonObj["modal"]["component"] || "SfComponent" == _buttonObj["modal"]["component"]) {
                    let _modal = _buttonObj["modal"];
                    _modal["component"] = null;
                    _buttonObj["click"] = (record) => {
                        this.openModifyCheckComponentModal(record, _buttonObj);
                    }
                } else if ("AuditModalTemplate" == _buttonObj["modal"]["component"]) {
                    let _modal = _buttonObj["modal"];
                    _modal["component"] = null;
                    _buttonObj["click"] = (record) => {
                        this.openAuditComponentModal(record, _buttonObj);
                    }
                }


                let modal = _buttonObj["modal"];
                modal["modalOptions"] = {
                    nzTitle: '',
                    nzFooter: null,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzBodyStyle: { width: 0, background: 'rgba(0,0,0,0)', position: 'fixed', left: '50%', 'margin-left': '-400px', top: '50%', "transform": "translateY(-50%)" }
                }
                console.log(modal, '这是弹窗')
                if (modal.title == '状态详情') {
                    modal["modalOptions"]['nzBodyStyle'] = ''
                    modal["modalOptions"]['nzClosable'] = true
                }
                _buttonObj["modal"] = modal;
                let _this = this;
                // _this.user.manageFlag = 2;
                let iifTemp = _buttonObj["iif"];
                _buttonObj["iif"] = (item: STData, btn: STColumnButton, column: STColumn) => {
                    let iifCode = true;
                    if (iifTemp != null && iifTemp != undefined)
                        eval(iifTemp);
                    return iifCode;
                }
                break;
            case "drawer":
                if ("TableDetailDrawerComponent" == _buttonObj["drawer"]["component"]) {
                    // debugger;
                    if ("other" == _buttonObj["drawer"]["mark"]) {
                        let _drawer = _buttonObj["drawer"];
                        _drawer["component"] = TableDetailDrawerComponent;
                        // console.log("0000000000000000000000---------------------000000000000000000000000000000000000")
                        _drawer["params"] = (recode: any) => {
                            recode["__entity"] = this.id;
                            recode["__id"] = recode.id;
                        }
                        _buttonObj["drawer"] = _drawer;
                        _buttonObj["click"] = (record, modal) => {
                            // this.st.reload();
                        }
                    } else {
                        let _drawer = _buttonObj["drawer"];
                        _drawer["component"] = TableDetailDrawerComponent;

                        _drawer["params"] = (recode: any) => {
                            recode["__entity"] = this.id;
                            recode["__id"] = recode.id;
                        }
                        _buttonObj["drawer"] = _drawer;
                        _buttonObj["click"] = (record, modal) => {
                            // this.st.reload();
                        }
                    }
                } else if ("CustomerDrawerTemplate" == _buttonObj["drawer"]["component"]) {
                    let _drawer = _buttonObj["drawer"];
                    _drawer["component"] = CustomerDrawerTemplate;
                    _drawer["params"] = (recode: any) => {
                        recode["__entity"] = this.id;
                        recode["__title"] = _drawer["name"];
                        recode["__modalId"] = _drawer["option"];
                    }
                    _buttonObj["modal"] = _drawer;

                }
                break;
            case "del":
                _buttonObj["type"] = 'modal'
                _buttonObj["click"] = (record, modal, comp) => {
                    this.delete(record)
                };
                break;
            case "a":
                _buttonObj["click"] = (record, modal, comp) => {
                    let eleLink = document.createElement('a');
                    console.log("downloadTemplate:" + JSON.stringify(this.buttons))
                    let url = record[_buttonObj['field']]
                    if (record[_buttonObj['replaceFieldName']]) {
                        url = url + '&replaceFieldName=' + record[_buttonObj['replaceFieldName']]
                    }

                    if(url== undefined || url == null){
                        url = environment.file_server_url+this.genServletUri2(_buttonObj['url'], record);
                    }

                    console.log(url)
                    // debugger;
                    // let url = environment.file_server_url+'/download?filename=hall/monitor_crown_blacklist_manage.xls';
                    eleLink.style.display = 'none';

                    // 字符内容转变成blob地址
                    eleLink.href = url;
                    // 触发点击
                    document.body.appendChild(eleLink);
                    eleLink.click();
                    // 然后移除
                    document.body.removeChild(eleLink);
                };
                break;
            case "b":
                let iifServiceUrlForB = _buttonObj["iif"];
                console.log("---i1if-------------" + iifServiceUrlForB);
                _buttonObj["iif"] = (item: STData, btn: STColumnButton, column: STColumn) => {
                    let iifCode = true;
                    if (iifServiceUrlForB != null && iifServiceUrlForB != undefined) {
                        console.log("---iif-------------" + iifServiceUrlForB);
                        eval(iifServiceUrlForB);
                    }
                    console.log("------iifCode----------" + iifCode);
                    return iifCode;
                }
                _buttonObj["click"] = (record, modal, comp) => {
                    let eleLink = document.createElement('a');
                    console.log("downloadTemplate:" + JSON.stringify(this.buttons))
                    //  let url = environment.manage_server_url+record[_buttonObj['field']];
                    let url = environment.log_path_url + record[_buttonObj['field']];
                    // let url = environment.file_server_url+'/download?filename=hall/monitor_crown_blacklist_manage.xls';
                    eleLink.style.display = 'none';
                    // 字符内容转变成blob地址
                    //var blob = new Blob([content]);
                    eleLink.href = url;
                    // 触发点击
                    document.body.appendChild(eleLink);
                    eleLink.click();
                    // 然后移除
                    document.body.removeChild(eleLink);
                };

                break;
            case "innerJump":
                _buttonObj["click"] = (record, modal, comp) => {
                    console.log("------------dfdf--" + _buttonObj['url']);
                    let uriArr = _buttonObj['url'].split('/');
                    for (let i = 0, len = uriArr.length; i < len; i++) {
                        let lIndex = uriArr[i].indexOf('{{');
                        if (lIndex !== -1) {
                            let rIndex = uriArr[i].indexOf('}}');
                            var key = uriArr[i].substring(lIndex + 2, rIndex);
                            uriArr[i] = record[key];
                        }
                    }
                    let url = uriArr.join('/');
                    console.log(_buttonObj["params"])
                    //window.open(url);
                    this.router.navigate([url], { queryParams: _buttonObj["params"] });

                };

                let iifJump1 = _buttonObj["iif"]
                _buttonObj["iif"] = (item: STData, btn: STColumnButton, column: STColumn) => {
                    // console.log(item)
                    let iifCode = true;
                    if (iifJump1 != null && iifJump1 != undefined)
                        eval(iifJump1);
                    return iifCode;
                }
                break;
            case "innerEditPage":
                _buttonObj["click"] = (record, modal, comp) => {
                    console.log("------------dfdf--" + _buttonObj['url']);
                    let uriArr = _buttonObj['url'].split('/');
                    for (let i = 0, len = uriArr.length; i < len; i++) {
                        let lIndex = uriArr[i].indexOf('{{');
                        if (lIndex !== -1) {
                            let rIndex = uriArr[i].indexOf('}}');
                            var key = uriArr[i].substring(lIndex + 2, rIndex);
                            uriArr[i] = record[key];
                        }
                    }
                    let url = uriArr.join('/');
                    console.log(_buttonObj["params"])
                    //window.open(url);
                    sessionStorage.setItem("innerEditPage_" + record['id'], JSON.stringify(record));
                    this.router.navigate([url], {
                        queryParams: {
                            "title": _buttonObj['title'],
                            "entityName": this.id,
                            "option": _buttonObj['option']
                        }
                    });

                };

                // let iifJumpInnerEditPage = _buttonObj["iif"]
                // _buttonObj["iif"] = (item: STData, btn: STColumnButton, column: STColumn) => {
                //     let iifCode = true;
                //     if (iifJumpInnerEditPage != null && iifJumpInnerEditPage != undefined)
                //         eval(iifJumpInnerEditPage);
                //     return iifCode;
                // }
                break;
            case "jump":
                _buttonObj["click"] = (record, modal, comp) => {
                    console.log("------------dfdf--" + _buttonObj['url']);
                    let allg = 'template/simpleProgramEdit/{{id}}';
                    let lIndex = allg
                    let url = this.genServletUri2(_buttonObj['url'], record);
                    window.open(url);

                };

                let iifJump2 = _buttonObj["iif"];
                _buttonObj["iif"] = (item: STData, btn: STColumnButton, column: STColumn) => {
                    let iifCode = true;
                    if (iifJump2 != null && iifJump2 != undefined)
                        eval(iifJump2);
                    return iifCode;
                }
                break;
            case "jumpViewFile":
                _buttonObj["click"] = (record, modal, comp) => {
                    let url = this.genServletUri2(_buttonObj['url'], record);
                    let tempUrl =url.split("filename=")[1];
                    let path = tempUrl.split("/");
                    tempUrl =  environment.file_view_url + "?path="+_buttonObj['path']+path[0]+"/"+path[1]+"&fileName="+path[2];
                    window.open(tempUrl);

                };

                let iifJump3 = _buttonObj["iif"];
                _buttonObj["iif"] = (item: STData, btn: STColumnButton, column: STColumn) => {
                    let iifCode = true;
                    if (iifJump3 != null && iifJump3 != undefined)
                        eval(iifJump3);
                    return iifCode;
                }
                break;
            case "serviceUrl":
                console.log("serviceUrl---------------------------------");
                let perm = 'template:table-template:' + this.id + ":" + _buttonObj["perm"];//权限
                console.log('----perm----' + perm);
                //默认显示所有超链接，但是如果，配置了权限，那么不显示按钮
                if (_buttonObj["perm"] != null && _buttonObj["perm"] != undefined) {
                    if (!this.perms.includes(perm)) {
                        return;
                    }
                }

                let iifServiceUrl = _buttonObj["iif"];
                _buttonObj["iif"] = (item: STData, btn: STColumnButton, column: STColumn) => {
                    let iifCode = true;
                    if (iifServiceUrl != null && iifServiceUrl != undefined) {
                        eval(iifServiceUrl);
                    }
                    return iifCode;
                }
                _buttonObj["click"] = (record, modal, comp) => {
                    console.log("click1---------------------------------");
                    let url = _buttonObj["serviceUrl"];
                    if (!url.startsWith("http") && !url.startsWith("https")) {
                        url = environment.gateway_server_url + url;
                    }

                    let beforeSelect: string = _buttonObj["beforeSelect"];
                    if (beforeSelect != null) {
                        eval(beforeSelect);
                    }

                    console.log("click2---------------------------------");
                    url = this.genServletUri(url, record)
                    let method = _buttonObj["method"];
                    if (method == null) {
                        method = 'get';
                    }

                    this.http[method](url).subscribe((res: any) => {
                        if (res) {
                            if (0 == res.code) {
                                this.message.success(res.msg ? res.msg : "操作成功")
                            } else {
                                this.message.error(res.msg || "操作失败")
                            }
                        }

                        if (_buttonObj["afterOption"] == "refresh") {
                            this.getData(false);
                        } else {
                            this.data = this.transFormRows(res["rows"]);
                            console.log('kkkkkkkkk', this.data);
                            this.total = res["total"]
                        }
                    }, (res: any) => {
                        this.message.error("操作失败")
                    })
                };

                break;
            case "more":
                let children = _buttonObj["children"]
                let childrenButton = [];
                for (let _childObj of children) {
                    childrenButton.push(this.genButtonClick(_childObj));
                }
                _buttonObj["children"] = childrenButton;
                break;
            case "simple-message":
                iifTemp = _buttonObj["iif"]
                _buttonObj["iif"] = (item: STData, btn: STColumnButton, column: STColumn) => {
                    let iifCode = true;
                    if (iifTemp != null && iifTemp != undefined)
                        eval(iifTemp);
                    return iifCode;
                }
                _buttonObj.click = (record) => {
                    console.log(record)
                    let title = _buttonObj.title
                    let content
                    if (_buttonObj.content.indexOf('item') == -1) {
                        content = _buttonObj.conent
                    } else {
                        content = record[JSON.parse(_buttonObj.content.replace('item', ''))[0]]
                    }
                    this.modalSrv.create({
                        nzContent: content,
                        nzTitle: _buttonObj.title,
                        nzClosable: false,
                        nzCancelText: null,
                        nzOnOk: () => { }
                    });
                };
                break;
            default:
                break;
        }
        return _buttonObj;
    }

    uploadChange(event) {
        console.log("uploadChange: " + JSON.stringify(event))
        if (event.type == 'success') {
            let response = event.file.response;
            console.log(response);
            let path = response.path;
            // path = path.substring(5);
            path = path.toString().replace("/download?filename=", "");
            console.log(path);
            let url1 = environment.gateway_server_url + '/engine/excel/import/' + this.id + '?path=' + path;
            console.log("uploadChange url:" + url1);
            this.http.get(url1).subscribe((res: any) => {
                console.log(res);
                this.message.success("导入成功");
                this.refresh();

            });
        }
    }

    //这是最先执行的
    ngOnInit() {
        console.log('ngoninit')
        this.route.data.subscribe(res => {
            this.hasHeader = res.header === false ? res.header : true;
        })
        this._this = this;
        this.interval = 0;
        this._times = 0;
        if (this.timer != null) {
            clearInterval(this.timer);
        }
        let permsString: string = localStorage.getItem("perms");
        this.perms = permsString.split(",");
        this.route.queryParams.subscribe(param => {
            this.doc_name = param['title'];
        })

        this.route.params
            .subscribe((params: Params) => {
                this.pageNumber = 1;
                this.data = new Array();
                this.id = params['id'];
                this.newPerms = this.id + ":table:template:add";
                this.deletePerms = this.id + ":table:template:delete";
                this.ngAfterViewInitl();
                this.aclString = "";

                let aclArray: any[] = this.router.url.split("/");
                if (aclArray != null && aclArray.length > 0) {
                    for (let i = 0; i < aclArray.length; i++) {
                        this.aclString += aclArray[i] + ":";
                    }
                    if (this.aclString.length > 1) {
                        this.aclString = this.aclString.substring(1, this.aclString.length);
                    }
                }
            })


    }
    judgeTrue(element){
        if(element.displayCondition){
            return element.displayCondition.every(ele=>ele.value == this.sf.value[ele.key])
        }
    }
    ngOnChanges() {
    }
    openStatusDetail(data, key) {  // 弹框预览图片
        let arr = data[key].split('null')
        if (arr[1] === '') {
            data[key] = arr[0] + data['url']
        }
        const modal = this.modalSrv.create({
            nzContent: ImageMessageModalComponent,
            nzWidth: 0,
            nzComponentParams: {
                record: data,
                imageSrc: data[key]
            },
            nzFooter: null,
            nzMaskClosable: false,
            nzClosable: false,
            nzBodyStyle: {
                "width": "0px",
                "background": "rgba(0,0,0,0)",
                "position": "fixed",
                "left": "50%",
                "margin-left": "-400px",
                "top": "50%",
                "transform": "translateY(-50%)"
            }
        });
    }
}
