import { ChangeDetectorRef, Component, Injector, OnInit,OnDestroy,AfterViewInit } from "@angular/core";
import { ControlWidget } from "@delon/form";
import {_HttpClient} from "@delon/theme";
import {WidgetService} from "../../routes/service/widget.service";
import { environment } from "@env/environment";
import {Subscription} from "rxjs";

let TIMEOUT = null;

@Component({
    selector: "upload-files",
    template: `
        <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error"
                      [showTitle]="''">
            <!-- 开始自定义控件区域 -->
            <nz-upload [(nzFileList)]="fileList" [nzLimit]="limit" [nzBeforeUpload]="beforeUpload">
                <button nz-button><i nz-icon nzType="upload"></i>上传apk包</button>
            </nz-upload>
            <!-- 结束自定义控件区域 -->
        </sf-item-wrap>
    `,
    styles: [``]
})
export class UploadFilesWidgetComponent extends ControlWidget implements OnInit, OnDestroy, AfterViewInit{
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = "uploadFiles";
    fileList:any[] = [];
    version = '';
    versionMsg = {};
    initUri = '';
    limit = 1;
  versionService:Subscription;
  optionService:Subscription;
    constructor( cd: ChangeDetectorRef, injector: Injector,private http:_HttpClient, private service:WidgetService){
        super(cd, injector);
    }
  // 组件所需要的参数，建议使用 `ngOnInit` 获取
    ngOnInit(): void {
      this.versionService = this.service.list_version.subscribe(res => {
          if(res&&JSON.stringify(res)!='{}'&&res['version']!=this.version){
              this.version = res['version'];
            this.initUri = environment.atmcManageUrl + this.service.handleUrl(this.schema['initUri'],res);
            this.getData();
          }
          console.log(res);
      });
      this.optionService = this.service.option.subscribe(res=>{
        if(JSON.stringify(res)!='{}'&&res=='keep'){
          this.save();
        }
      })
      /*this.http.get(environment.runtime_server_url + '/init/form/' + this.service.tab_menu.value.id).subscribe(res => {
          debugger
        console.log(res);
      });*/
    }
    getData() {
        this.http.get(this.initUri).subscribe(res => {
          console.log(res);
        });
    }
    save(){
        console.log(this.fileList);
    }
  beforeUpload = (file): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  }
    // reset 可以更好的解决表单重置过程中所需要的新数据问题
    reset(value: string) {

    }

    change(value: string) {
        if (this.ui.change) this.ui.change(value);
        this.setValue(value);
    }
    ngAfterViewInit() {

    }
    ngOnDestroy() {
        if(this.versionService){
          this.versionService.unsubscribe();
          this.optionService.unsubscribe();
        }
    }
}
