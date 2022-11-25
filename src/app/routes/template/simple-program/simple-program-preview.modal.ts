import { UploadFile } from 'ng-zorro-antd/upload';
import {Component, Input, ViewChild} from '@angular/core';
import {CascaderOption, NzMessageService, NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {CascaderWidget, SFComponent, SFSchema, SFSchemaEnumType} from '@delon/form';
import {environment} from '@env/environment';
import {Message} from '@angular/compiler/src/i18n/i18n_ast';
import {EventService} from "@shared/event/event.service";
import {map} from "rxjs/operators";
interface Data{
  addBeforeSaveFunctionResult: boolean;
  type: string;
  md5: string;
  name: string;
  url: string;
  thumbnail_url:string;


};
let TIMEOUT = null;
@Component({
  selector: `simple-program-preview-modal`,
  template: `
      <div style="width: 100%;height: 100%">
          <img *ngIf="type=='image'"  [_src]="src" style="width: 100%;height: 100%"/>
          <video *ngIf="type=='video'"  style="width: 100%;height: 100%" autoplay>
              <source [_src]="src" />
          </video>
          <video *ngIf="type=='music'"  [_src]="src" style="width: 100%;height: 100%"></video>
      </div>
  `,
  styles:[`
      
  `]
})

export class SimpleProgramPreviewModalComponent {
  @Input()
  type: string;
  @Input()
  src:string;
  constructor() {
  }

    ngOnInit() {
        console.log(this.type);
        console.log(this.src);
        this.src = this.src;
    }

}
