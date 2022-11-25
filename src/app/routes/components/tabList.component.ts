import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    Output,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "@env/environment";
import {_HttpClient} from "@delon/theme";

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tab-list',
    template: `
        <ng-template #defaultTemplate>
            <div border="1" class="menu" cellspacing="0" cellpadding="0" [ngStyle]="{'width':box_width,'font-size':tabListConfig['font-size']}">
                <div nz-row style="width: 100%" [ngStyle]="{'line-height':tabListConfig['line-height']}">
                    <ng-container *ngFor="let item of tabListConfig.listCols">
                        <div nz-col [nzSpan]="item['span']?item['span']:tabListConfig['colspan']" [ngStyle]="{'font-size':item['font-size'],'font-weight':item['font-weight']}">
                            <div class="type_list" [ngStyle]="{'visibility':!item['title']?'hidden':''}" (click)="upward(item.searchKey,item.searchValue)" nz-row>
                                <div class="title ellipse1" nz-col [nzSpan]="tabListConfig['spanLabel']" [ngStyle]="{'background':item['TitleBackground']}" >{{item.title}}</div>
                                <div class="num ellipse1" nz-col [nzSpan]="tabListConfig['spanControl']" [ngStyle]="{'color':item['valColor'],'background':item['valBackground']}">{{item.val?item.val:0}}</div>
                                <ul class="childrenList">
                                    <ng-container *ngFor="let option of item.children">
                                        <li nz-row *ngIf="option.val" (click)="upward(option.searchKey,option.searchValue)">
                                            <div class="child_title ellipse1" nz-col nzSpan="16">{{option.title}}</div>
                                            <div class="child_num ellipse1" nz-col nzSpan="8">{{option.val?option.val:0}}</div>
                                        </li>
                                    </ng-container>
                                </ul>
                            </div>
                        </div>
                    </ng-container>
                </div>
            </div>
        </ng-template>
        <ng-container *ngTemplateOutlet="defaultTemplate"></ng-container>
    `,
    styles:[`        
        ul,ul li{
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        .ellipse1{
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow:ellipsis;
        }
        .menu{
            display: flex;
            table-layout:fixed;
            flex-wrap: wrap;
            margin-bottom: 16px;
        }
        .menu .type_list{
            position: relative;
            border: 1px solid #ececec;
        }
        .menu .type_list .title{
            background-color: #dbebfd;
            padding: 0 6px;
            border-right: 1px solid #ececec;
        }
        .menu .type_list .num{
            background-color: #f7f9fb;
            padding: 0 6px;
            text-decoration: underline;
        }
        .menu .type_list .num:hover{
            cursor: pointer;
        }
        .menu .type_list .childrenList{
            background: #fff;
            position: absolute;
            top: 23px;
            left: 0;
            width: 100%;
            z-index: 99;
            visibility: hidden;
            max-height: 120px;
            overflow-y: auto;
        }
        .menu .type_list .childrenList::-webkit-scrollbar {
            width: 8px;
            background: #ececec;
        }
        .menu .type_list .childrenList::-webkit-scrollbar-thumb {
            background-color: #aaaaaa;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
        }
        .menu .type_list:hover .childrenList{
            visibility: visible;
        }
        .menu .type_list:hover .childrenList li:hover{
            background-color: #e4f6fe;
        }
        .menu .type_list .childrenList .child_title{
            padding: 0 6px;
        }
        .menu .type_list .childrenList .child_num{
            padding: 0 8px;
        }
        .ant-menu-item .anticon, .ant-menu-submenu-title .anticon{
            margin-right: 0;
            margin-left: 6px;
            float: right !important;
            line-height: 36px;
        }
        .itembox li{
            height: 20px;
            line-height: 20px;
        }
    `]
})
export class tablistComponent implements OnInit,OnChanges{
    @Output() event = new EventEmitter();
    @Input() tabListConfig:any;//获取父组件传递的配置文件
    @Input() url:any = ""
    box_width = ''; //组件总宽度
    constructor(private http:_HttpClient){}
    ngOnInit(): void {
        // this.http.get(environment.gateway_server_url+this.url).subscribe(res=>{
        //     if(this.tabListConfig.listCols){
        //         this.getlist(this.tabListConfig.listCols,res);
        //         let wd = this.tabListConfig.width;
        //         if(/^\d+$/.test(wd)){
        //             wd = wd + 'px';
        //         }
        //         this.box_width = wd;
        //         if(this.tabListConfig.rows!='' && this.tabListConfig.rows!= null){
        //             this.i_width = 100 / Math.ceil(this.tabListConfig.cols/this.tabListConfig.rows)+'%';
        //         }
        //     }
        // })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes.tabListConfig){
            this.http.get(environment.gateway_server_url+this.tabListConfig['asyncData']).subscribe(res=>{
                if(this.tabListConfig.listCols){
                    console.log(res,'获取了数据')
                    this.getlist(this.tabListConfig.listCols,res);
                    let wd = this.tabListConfig.width;
                    if(/^\d+$/.test(wd)){
                        wd = wd + 'px';
                    }
                    this.box_width = wd;
                }
            })
        }
    }

    upward(key,val){
        let arr = [key,val];
        this.event.emit(arr);
        // console.log('点击了',arr)
        this.update()
    }
    update(){
        this.http.get(environment.gateway_server_url+this.tabListConfig['asyncData']).subscribe(res=>{
            if(this.tabListConfig.listCols){
                console.log(res,'获取了数据')
                // res[0].value = res[0].value + 50
                this.getlist(this.tabListConfig.listCols,res);
                let wd = this.tabListConfig.width;
                if(/^\d+$/.test(wd)){
                    wd = wd + 'px';
                }
                this.box_width = wd;
            }
        })
    }
    //获取数据映射到配置中
    getlist(listCols,listRow){
        listCols.map(item=>{
            listRow.filter(res=>{
                if(res.key==item.index){
                    item.val=res.value;
                    if(item.children){
                        item.children.map(iChild=>{
                            for(let obj in res.children){
                                let child = res.children[obj];
                                if(child.key==iChild.index){
                                    iChild.val = child.value;
                                }
                            };
                        })
                    }
                }
            });
        })
    }
}
