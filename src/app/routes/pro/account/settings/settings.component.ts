import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { filter, debounceTime } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-account-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProAccountSettingsComponent implements AfterViewInit, OnDestroy {
  private resize$: Subscription;
  private router$: Subscription;
  mode = 'inline';
  title: string;
  user: any;
  menus: any[] = [
    {
      key: 'base',
      title: '个人信息',
    },
    {
      key: 'security',
      title: '密码设置',
    },

    // //先隐藏
    // {
    //   key: 'binding',
    //   title: '账号绑定',
    // },
    // {
    //   key: 'notification',
    //   title: '新消息通知',
    // },
    //   {
    //       key: 'buttons-contain-icon',
    //       title: '按钮带图标',
    //   },
    //   {
    //       key: 'default-role',
    //       title: '默认角色',
    //   },
      // {
      //     key: 'default-index-html',
      //     title: '默认首页',
      // },


  ];
  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private el: ElementRef,
  ) {
    this.router$ = this.router.events
      .pipe(filter(e => e instanceof ActivationEnd))
      .subscribe(() => this.setActive());
  }

  private setActive() {
    const key = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    this.menus.forEach(i => {
      i.selected = i.key === key;
    });
   // this.title = this.menus.find(w => w.selected).title;
  }

  to(item: any) {
    this.router.navigateByUrl(`/pro/account/settings/${item.key}`);
  }

  private resize() {
    const el = this.el.nativeElement as HTMLElement;
    let mode = 'inline';
    const { offsetWidth } = el;
    if (offsetWidth < 641 && offsetWidth > 400) {
      mode = 'horizontal';
    }
    if (window.innerWidth < 768 && offsetWidth > 400) {
      mode = 'horizontal';
    }
    this.mode = mode;
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    this.resize$ = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.resize());
  }

  ngOnDestroy(): void {
    this.resize$.unsubscribe();
    this.router$.unsubscribe();
  }
}
