import { Component,OnInit,
    OnDestroy,
    ChangeDetectorRef,
    Input,
    Output,
    EventEmitter} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReuseTabService } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService,MenuService,Menu } from '@delon/theme';
import {UtilsService} from "../../../utils.Service";
import {environment} from "@env/environment";
import {Nav} from "@delon/abc/sidebar-nav/sidebar-nav.types";
import {filter} from "rxjs/operators";

@Component({
    selector: 'layout-sidebar',
    templateUrl: './sidebar.component.html',
    styles:[
        `
           :host ::ng-deep .sidebar-nav__group-title{
               padding:0px;
               display: none;
               margin-top: 105px;
           }
           :host ::ng-deep .ant-dropdown-trigger{
               margin-bottom: 10px;
           }
           :host ::ng-deep .sidebar-nav__depth1 .sidebar-nav__item > a {
               padding-left: 54px;
           }
           :host ::ng-deep .sidebar-nav__depth2 .sidebar-nav__item > a {
               padding-left: 70px !important;
               font-size: 12px;
           }

           :host ::ng-deep .alain-default__aside-user{
               display: block;
               align-items: center;
               justify-content: center;
               margin: 24px 24px 0;
               cursor:pointer;
           }
      `
    ]

})
export class SidebarComponent implements OnInit{
    list: Nav[] = [];
    private menuChange$: Subscription;
    private reuseChange$: Subscription;

    @Input() autoCloseUnderPad = true;

    @Output() select = new EventEmitter<Menu>();
    loginUrl:string;
    programName:string= environment.programName;
    constructor(
        public settings: SettingsService,
        public msgSrv: NzMessageService,
        public utilsService: UtilsService,
        private menuSrv: MenuService,
        private reuseSrv: ReuseTabService,
        private router: Router,
        private cd: ChangeDetectorRef,
    ) {
        this.loginUrl = localStorage.getItem("loginUrl");
    }
    ngOnInit() {
        this.menuSrv.openedByUrl(this.router.url);
        console.log(this.menuSrv)
        this.menuChange$ = <any>this.menuSrv.change.subscribe(res => {
            this.list = res;
            this.cd.detectChanges();
        });
        this.reuseChange$ = <any>this.reuseSrv.change.subscribe(res => {
            this.updateOpen();
            this.cd.detectChanges();
        });
        this.installUnderPad();
    }
    updateOpen() {
        const currentLink = this.router.url;
        let imenu: Nav;
        this.menuSrv.visit( [] , (i, p) => {
            if (i.link === currentLink) {
                imenu = i;
            } else {
                i._open = false;
            }
        });
        while (imenu) {
            imenu._open = true;
            imenu = imenu.__parent;
        }
        this.cd.markForCheck();
    }
    timer :any = null;
    onSelect(item: Nav) {
        let debounce = ()=>{
            this.select.emit(item);
            if (item._type === 1) {
                if(item.link[0]!= '/'){
                    item.link = '/' +item.link
                }
                if(this.router.url == item.link){
                    console.log('相同路径')
                    this.router.navigateByUrl('/pro');
                    setTimeout(() => {
                        this.router.navigateByUrl(item.link);
                    }, 0);
                }else{
                    this.router.navigateByUrl(item.link);
                }
            } else if (item._type === 2) {
                // ......
            }
        }
        if(this.timer !== null){
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(()=>{debounce()},300)
    }

    ngOnDestroy(): void {
        this.menuChange$.unsubscribe();
        this.reuseChange$.unsubscribe();
        if (this.route$) {
            this.route$.unsubscribe();
        }
    }

    // region: Under pad

    private route$: Subscription;
    private installUnderPad() {
        if (!this.autoCloseUnderPad) return;
        this.route$ = <any>this.router.events.pipe( filter(e => e instanceof NavigationEnd)).subscribe(s => this.underPad());
        this.underPad();
    }

    private underPad() {
        if (window.innerWidth < 992 && !this.settings.layout.collapsed) {
            this.settings.setLayout('collapsed', true);
        }
    }
}
