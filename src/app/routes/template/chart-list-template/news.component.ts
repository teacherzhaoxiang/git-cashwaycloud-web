import {ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';

// import * as echarts from 'echarts';
import {_HttpClient} from "@delon/theme";
import {EventService} from "@shared/event/event.service";
import {environment} from "@env/environment";
import {Router} from "@angular/router";
import {UserService} from "../../service/user.service";
import {RoleMenu} from "../../entity/role-menu";
import Timer = NodeJS.Timer;
@Component({
    selector: 'my-news',
    template: `
        <nz-list [nzDataSource]="data" [nzRenderItem]="item" [nzItemLayout]="'horizontal'">
            <ng-template #item let-item>
                <nz-list-item *ngIf="checkPerms(item)" >
                    <nz-list-item-meta
                            [nzTitle]="nzTitle"
                            [nzDescription]="nzDescription">
                        <ng-template #nzTitle>
                            <span class="my-list-item-title">{{item.title}}</span>
                        </ng-template>
                        <ng-template #nzDescription>
                            <a class="my-list-item-disc" [routerLink]="[item.route]">{{ templates[item.id] }}</a>
                        </ng-template>
                    </nz-list-item-meta>
                </nz-list-item>
            </ng-template>
        </nz-list>
    `,
    styles:[`
        .my-list-item-title {
            font-weight: bold;
        }
        
        .my-list-item-disc{
            padding-left: 12px;
        }
        ::ng-deep .ant-list-item{
            padding: 6px 0 6px 12px;
        }
    `]
})
export class NewsComponent implements OnInit,OnDestroy {
    @Input()
    data:any[] = [];
    @Input()
    refresh:number = 60;
    templates:any = {};
    //标识数据是否正在加载中，避免多条通知同时返回导致数据丢失
    loadFlag:boolean = false;
    constructor(
        protected http:_HttpClient,
        private router: Router,
        private userService:UserService,
    ) {}
    interval1:Timer
    ngOnInit(): void {
        console.log("通知消息-data："+JSON.stringify(this.data));
        this.refreshNotifyData();
        this.getUserPerms();
        this.interval1 = setInterval(()=>{
            this.refreshNotifyData();
        },this.refresh*1000)
    }

    refreshNotifyData(){
        this.data.forEach((item:any,index:number)=>{
            let url = item["refreshUri"];
            if(url!=null && url != ""){
                if (!url.startsWith("http") && !url.startsWith("https")) {
                    url = environment.gateway_server_url + url;
                }

                this.http.get(url).subscribe((res:any)=>{
                    let template = this.handleTemplate(item.template,res);
                    while (!this.loadFlag){
                        this.loadFlag = true;
                        let templatesTemp = JSON.parse(JSON.stringify(this.templates));
                        templatesTemp[item.id] = template;
                        this.templates = templatesTemp;
                        this.loadFlag = false;
                        break;
                    }

                })
            }else {
                while (!this.loadFlag){
                    this.loadFlag = true;
                    let templatesTemp = JSON.parse(JSON.stringify(this.templates));
                    templatesTemp[item.id] = item.template;
                    this.templates = templatesTemp;
                    this.loadFlag = false;
                    break;
                }
            }
        })
    }
    handleTemplate(template:string,data:any){
        while (template.indexOf("{{") > 0 && template.indexOf("}}") > 0) {
            let i = template.indexOf("{{");
            let j = template.indexOf("}}");
            if (j > i) {
                let key = template.substring(i + 2, j);
                console.log(key);
                template = template.replace("{{" + key + "}}", data[key]);
            }
        }
        return template;
    }

    permsList:string[] = [];
    interval:NodeJS.Timer
    getUserPerms(){
        let flag= true;
        this.interval  = setInterval(()=>{
            let roleMenus:RoleMenu[] = this.userService.getRoleMenuList();
            if(roleMenus && roleMenus.length>0){
                roleMenus.forEach((value:RoleMenu,index:number)=>{
                    this.permsList.push(value.perms);
                })
                clearInterval(this.interval);
                this.data = JSON.parse(JSON.stringify(this.data));
            }
        },300)
    }
    checkPerms(item:any){
        if(this.permsList.indexOf(item.perms) >= 0){
            return true;
        }else {
            return false;
        }
    }
    route(item:any){
        this.router.navigate([item.route], {
            queryParams: {
                "backRouter":this.router.url
            }
        });
    }

    ngOnDestroy(){
        if(this.interval){
            clearInterval(this.interval);
        }
        if(this.interval1){
            clearInterval(this.interval1);
        }
    }
}
