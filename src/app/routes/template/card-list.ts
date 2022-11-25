import {
  Component,
  OnInit,
} from "@angular/core";
import {_HttpClient} from "@delon/theme";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'card-list',
  template: `
      <page-header [title]="'处理流程'"></page-header>
    <as-split class="splitPane" [direction]="'horizontal'" (dragEnd)="resize($event)">
        <as-split-area [size]="treeSize">
            <as-split>
                <!--<tree-menu></tree-menu>-->
                <menu-tree *ngIf="list_item" [list_item]="list_item" (handleSelect)="handleSelect($event)"></menu-tree>
            </as-split>
        </as-split-area>
        <as-split-area [size]="cardSize">
            <as-split>
                <div style="display: flex;flex-direction: column;width: 100%"  *ngIf="schema">
                    <div class="r_top">
                        <div class="small_title">设备基本信息</div>
                        <sf class="sf" [schema]="schema" [formData]="data" button="none"></sf>
                    </div>
                    <div class="small_title">版本信息</div>
                    <div class="r_content">
                        <versionMsg [termMsg]="termMsg"></versionMsg>
                    </div>
                </div>
            </as-split>
        </as-split-area>
    </as-split>
        
        
    `,
  styles: [ `
      :host ::ng-deep .ant-card .ant-card-body {
          padding: 0 !important;
      }
      :host ::ng-deep .ant-col-12{
          height: 25px;
      }
      .alain-default__content {
          margin: 0 !important;
      }

      .as-split-back {
          background-image: url('./assets/tree-icon/tree-background.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
      }

      :host {
          display: block;
          width: 100%;
          height: -webkit-calc(100% - 90px);
      }
    .splitPane{
        background-image: url('./assets/tree-icon/tree-background.png');
    }
    .r_top{
        display: block;
    }
      .r_top .sf{
          padding: 10px 0;
          padding-bottom: 20px;
      }
    .small_title{
        height: 32px;
        line-height: 32px;
        background: #ececec;
        padding-left: 20px;
    }
    .r_content{
        display: block;
        flex: 1;
        overflow-y: scroll;
    }
      :host ::ng-deep .ant-form-item{
          margin-bottom: 0;
      }
  `]
})
export class CardListComponent implements OnInit {
  treeSize = 20;
  cardSize = 80;
  list_item:object;
  schema :any;
  data={};
  termMsg = {};
  constructor(private http: _HttpClient, private router:Router) { }
  ngOnInit() {
    this.http.get(environment.runtime_server_url+'/init/page_template/'+'handle_process').subscribe(res=>{
      this.getTreeConfig(res['id']);
      this.schema = res['schema'];
    });
  }
getTreeConfig(id){
    this.http.get(environment.runtime_server_url+'/init/tree/'+id).subscribe(res=>{
      this.list_item = {id:id,config:res};
    });
}
  resize(e) {

  }
  handleSelect(e) {
    this.termMsg = e;
    if(JSON.stringify(e)=='{}'){
      this.data = {};
    }else {
      this.http.get('http://114.116.120.8:8090/atmc-manage/term/'+e['no']).subscribe(res=>{
        this.data = res;
      });
    }
  }
}

