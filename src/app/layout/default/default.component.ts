import {
  Component,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  AfterViewInit,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  Inject,
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError,
  NavigationCancel,
} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ScrollService, MenuService, SettingsService } from '@delon/theme';

import { environment } from '@env/environment';
import { SettingDrawerComponent } from './setting-drawer/setting-drawer.component';
import { Subscription } from 'rxjs';
import { updateHostClass } from '@delon/util';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'layout-default',
  templateUrl: './default.component.html',
  preserveWhitespaces: false,
  host: {
    '[class.alain-default]': 'true',
  },
    styles: [
        `
          ::ng-deep .alain-default{
                height: 100%;
            }
          ::ng-deep .alain-default__content{
              height: -webkit-calc(100% - 70px);
          }
      `
    ]
})
export class LayoutDefaultComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private notify$: Subscription;
  isFetching = false;
    @ViewChild('settingHost', { read: ViewContainerRef, static: true })
    // @ViewChild('settingHost', { read: ViewContainerRef })
  settingHost: ViewContainerRef;
  headerBg = environment.headerBg;
  constructor(
    router: Router,
    scroll: ScrollService,
    _message: NzMessageService,
    private resolver: ComponentFactoryResolver,
    public menuSrv: MenuService,
    public settings: SettingsService,
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private doc: any,
  ) {
    // scroll to top in change page
    router.events.subscribe(evt => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
      }
      if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
        this.isFetching = false;
        if (evt instanceof NavigationError) {
          _message.error(`????????????${evt.url}??????`, { nzDuration: 1000 * 3 });
        }
        return;
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      setTimeout(() => {
        scroll.scrollToTop();
        this.isFetching = false;
      }, 100);
    });
  }

  private setClass() {
    const { el, renderer, settings } = this;
    const layout = settings.layout;
    updateHostClass(
      el.nativeElement,
      renderer,
      {
        ['alain-default']: true,
        [`alain-default__fixed`]: layout.fixed,
        [`alain-default__boxed`]: layout.boxed,
        [`alain-default__collapsed`]: layout.collapsed,
      },
      true,
    );

    this.doc.body.classList[layout.colorWeak ? 'add' : 'remove']('color-weak');
  }

  ngAfterViewInit(): void {
    // Setting componet for only developer
    if (!environment.production) {
      setTimeout(() => {
        const settingFactory = this.resolver.resolveComponentFactory(
          SettingDrawerComponent,
        );
        this.settingHost.createComponent(settingFactory);
      }, 22);
    }
    //   alert(123);
    //   setTimeout(() => {
    //       const settingFactory = this.resolver.resolveComponentFactory(
    //           SettingDrawerComponent,
    //       );
    //       this.settingHost.createComponent(settingFactory);
    //   }, 22);
  }

  ngOnInit() {
    this.notify$ = this.settings.notify.subscribe(() => this.setClass());
    this.setClass();
  }

  ngOnDestroy() {
    this.notify$.unsubscribe();
  }
}
