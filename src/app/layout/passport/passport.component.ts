import {Component, Inject, Optional} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient, ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService} from '@delon/theme';
import {DA_SERVICE_TOKEN, SocialService, TokenService} from '@delon/auth';
import {ReuseTabService} from '@delon/abc';
import {StartupService} from '@core/startup/startup.service';
import {TranslateService} from '@ngx-translate/core';
import {I18NService} from '@core/i18n/i18n.service';
import {UtilsService} from '../../utils.Service';
import {environment} from '@env/environment';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less'],
})
export class LayoutPassportComponent {
  links = [
    {
      title: '帮助',
      href: '',
    },
    {
      title: '隐私',
      href: '',
    },
    {
      title: '条款',
      href: '',
    },
  ];
    logoFullImage = environment.logoFullImage;
    showLogo = environment.showLogo;
    titleImg = environment.titleImg;
    constructor(
        public router: Router, ) {

    }
}
