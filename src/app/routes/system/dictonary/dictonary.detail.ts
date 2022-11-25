import {Component, Input, ViewChild} from '@angular/core';
import {NzDrawerRef, NzTreeNode} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from '@delon/form';
import {environment} from '@env/environment';
@Component({
  selector: `app-dictonary-detail-modal`,
  template: `
    <!--<div class="modal-header">-->
      <!--<div class="modal-title">{{record.__title}}</div>-->
    <!--</div>-->
    <sf #sf [schema]="detailSchema" [formData]="record" button="none" >
  </sf>`,
})
export class DictonaryDetailDrawerComponent {
  @Input()
  record: any;
  detailSchema: any = {
      properties: {
          /*type: {type: 'string', title: '字典类型',
              readOnly:true,
              ui: {
                  widget: 'select',
                  asyncData: () => this.http.get<SFSchemaEnumType[]>(environment.manage_server_url + '/sys/dictonarys/type'),
                  readOnly:true
              }
          },*/
          key: {type: 'string', title: '字典key', maxLength: 100,readOnly:true },
          value: {type: 'string', title: '字典值', maxLength: 100, readOnly:true},
          description: {type: 'string', title: '参数描述', maxLength: 100, readOnly: true},

          //orderNum: {type: 'string', title: '顺序', maxLength: 50, readOnly:true},
          status: {
              type: 'string', title: '状态',
              readOnly: true,
              ui: { widget: 'select'}, enum: [
                  {label: '启用', value: '0'},
                  {label: '停用', value: '1'},
              ],
              default: '0',
          },
         /* language: {
              type: 'string', title: '语言',
              ui: { widget: 'select'},
              enum: [
                  {label: '中文', value: 'CN'},
                  // {label: '英文', value: 'EN'},
              ],
              default: 'CN',
              readOnly:true
          }*/
          
      },
      //required: ['type', 'key', 'value', 'orderNum', 'status', 'language'],
      required: [ 'key', 'value', 'description', 'status'],
      ui: {
          spanLabel: 8,
          spanControl: 16,
      }

  };
  @ViewChild('sf', { static: false })
  sf: SFComponent;
  constructor(private ref: NzDrawerRef, protected http: _HttpClient) {}

  save(value: any) {
    console.log(JSON.stringify(value));
    this.ref.close(`new time: ${+new Date()}`);
    this.close();
  }

  close() {
    this.ref.close();
  }
  ngOnInit() {
      this.http.get(environment.manage_server_url + '/sys/dictonarys/' + this.record['id']).subscribe((res: any) => {
          this.record = res['rows'];
      });
  }
}
