import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { ProRoutingModule } from './pro-routing.module';

import { BasicFormComponent } from './form/basic-form/basic-form.component';
import { StepFormComponent } from './form/step-form/step-form.component';
import { Step1Component } from './form/step-form/step1.component';
import { Step2Component } from './form/step-form/step2.component';
import { Step3Component } from './form/step-form/step3.component';
import { AdvancedFormComponent } from './form/advanced-form/advanced-form.component';
import { ProTableListComponent } from './list/table-list/table-list.component';
import { ProBasicListComponent } from './list/basic-list/basic-list.component';
import { ProCardListComponent } from './list/card-list/card-list.component';
import { ProListLayoutComponent } from './list/list/list.component';
import { ProListArticlesComponent } from './list/articles/articles.component';
import { ProListProjectsComponent } from './list/projects/projects.component';
import { ProListApplicationsComponent } from './list/applications/applications.component';
import { ProProfileBaseComponent } from './profile/basic/basic.component';
import { ProProfileAdvancedComponent } from './profile/advanced/advanced.component';
import { ProResultSuccessComponent } from './result/success/success.component';
import { ProResultFailComponent } from './result/fail/fail.component';
import { ProAccountCenterComponent } from './account/center/center.component';
import { ProAccountCenterArticlesComponent } from './account/center/articles/articles.component';
import { ProAccountCenterApplicationsComponent } from './account/center/applications/applications.component';
import { ProAccountCenterProjectsComponent } from './account/center/projects/projects.component';
import { ProAccountSettingsComponent } from './account/settings/settings.component';
import { ProAccountSettingsBaseComponent } from './account/settings/base/base.component';
import { ProAccountSettingsSecurityComponent } from './account/settings/security/security.component';
import { ProAccountSettingsBindingComponent } from './account/settings/binding/binding.component';
import { ProAccountSettingsNotificationComponent } from './account/settings/notification/notification.component';
import {PasswordEditModalComponent} from "./account/settings/security/password.edit";
import {ProAccountSettingsButtonsContainIconComponent} from "./account/settings/buttons-contain-icon/buttons-contain-icon.component";
import {ProAccountSettingsDefaultRoleComponent} from "./account/settings/default-role/default-role.component";
import {
    ProAccountSettingsDefaultIndexHtmlComponent
} from "./account/settings/default-index-html/default-index-html.component";
import {UserSettingComponent} from "./account/settings/base/user.edit.component";

const COMPONENTS_NOROUNT = [Step1Component, Step2Component, Step3Component];

@NgModule({
  imports: [SharedModule, ProRoutingModule],
  declarations: [
    BasicFormComponent,
    StepFormComponent,
    AdvancedFormComponent,
    ProTableListComponent,
    ProBasicListComponent,
    ProCardListComponent,
    ProListLayoutComponent,
    ProListArticlesComponent,
    ProListProjectsComponent,
    ProListApplicationsComponent,
    ProProfileBaseComponent,
    ProProfileAdvancedComponent,
    ProResultSuccessComponent,
    ProResultFailComponent,
    ProAccountCenterComponent,
    ProAccountCenterArticlesComponent,
    ProAccountCenterProjectsComponent,
    ProAccountCenterApplicationsComponent,
    ProAccountSettingsComponent,
    UserSettingComponent,
    ProAccountSettingsBaseComponent,
    ProAccountSettingsSecurityComponent,
    ProAccountSettingsBindingComponent,
    ProAccountSettingsNotificationComponent,
    PasswordEditModalComponent,
    ProAccountSettingsButtonsContainIconComponent,
    ProAccountSettingsDefaultRoleComponent,
    ProAccountSettingsDefaultIndexHtmlComponent,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ProModule {}
