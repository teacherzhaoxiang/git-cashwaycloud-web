import {Component, Input, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from '@delon/form';
import {environment} from '@env/environment';
import {HttpParams, HttpRequest} from '@angular/common/http';
import {Md5} from 'ts-md5';
import {UserService} from '../../routes/service/user.service';
import {EventService} from '@shared/event/event.service';
@Component({
  selector: `app-audit-modal`,
  template: `
    <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none">
    <div class="modal-footer">
        <button nz-button type="button" (click)="close()">关闭</button>
        <button nz-button type="submit" (click)="save(sf.value)" [disabled]="!sf.valid" >保存</button>
    </div>
  </sf>`,
})
export class AuditModalComponent {
  @Input()
  record: any;
  @Input()
  req: HttpRequest<any>;
  @Input()
  perms: any;
  @Input()
  approveFlag: number;
  editSchema: any = {
      properties: {
          auditUser: {
              type: 'string',
              title: '审核人',
              ui: {
                  widget: 'select',
                  asyncData: () => this.http.get<SFSchemaEnumType[]>(environment.manage_server_url + '/rest/approve/auth?perms=' + this.perms)
              },
          },
        password: {type: 'string', title: '密码', maxLength: 100,ui: {
                type: 'password'
            }}
      },
      required: ['auditUser', 'password']
  };
  @ViewChild('sf', { static: false })
  sf: SFComponent;
  constructor(private modal: NzModalRef, protected http: _HttpClient, private msg: NzMessageService, private userService: UserService, private eventService: EventService) {}


  save(value: any) {
      let url = environment.manage_server_url + '/rest/approve/';

      console.log('==========8888===========');

      //// url 参数加密开始
      let params: HttpParams = this.req.params;
     // params = params.set("_timestamp",new Date().getTime().toString())
      let paramStr = '';
      let uri: string = this.req.url;

      if (this.req.url.indexOf('?') >= 0) {
          const urlParamStr = this.req.url.substring(this.req.url.indexOf('?') + 1);
          const urlParams: string[] = urlParamStr.split('&');
          urlParams.forEach((urlParam) => {
              const strs: string[] = urlParam.split('=');
              params = params.set(strs[0], strs[1]);
          });
          uri = this.req.url.substring(0, this.req.url.indexOf('?'));
      }
      const keyList = params.keys();
      keyList.sort();
      keyList.forEach((value, index, array) => {
          if(value == "ids"){
             let ids:[] =  params['map'].get("ids");
             for(let i=0;i<ids.length;i++){
                 paramStr = paramStr + value + '=' + ids[i] + '&';
             }
          }else{
              paramStr = paramStr + value + '=' + params.get(value) + '&';
          }
      });
      if (paramStr.length > 0) {
          paramStr = paramStr.substr(0, paramStr.length - 1);
      }
      console.log(paramStr);
      // let encrypted = Md5.hashStr(this.userService.encryptedDES(paramStr));

      // params = params.set("_signature",encrypted+"");

      //// url 参数加密end


      const method: string = this.req.method;
      let objectIds = '';
      if ('PUT' == method) {
          if (this.req.url.indexOf('?') > 0) {
              objectIds = this.req.url.substring(this.req.url.lastIndexOf('/') + 1, this.req.url.indexOf('?'));
          } else {
              objectIds = this.req.url.substring(this.req.url.lastIndexOf('/') + 1, this.req.url.length);
          }

      }

      const keys: string[] = params.keys();
      let tempParams = '';
      for (let i = 0; i < keys.length; i++) {
          tempParams = tempParams + keys[i] + '=' + params.get(keys[i]) + '&';
          if ('DELETE' == method && keys[i] == 'ids') {

              let ids:any =  params['map'].get("ids");
              for(let j=0;j<ids.length;j++){
                  if(j == 0) {
                      objectIds +=  ids[j] + '&';
                  }else{
                      objectIds += 'objectIds=' + ids[j] + '&';
                  }
              }
          }
      }
      if (tempParams.length > 0) {
          tempParams = tempParams.substring(0, tempParams.length - 1);
          objectIds = objectIds.substring(0, objectIds.length - 1);
      }

      url = url + '?objectIds=' + objectIds;
      url = url + '&perms=' + this.perms;
      url = url + '&method=' + this.req.method;
      url = url + '&approveType=' + this.approveFlag;
      url = url + '&uri=' + uri;
      paramStr = paramStr.replace(/=/g,",");
      paramStr = paramStr.replace(/&/g,";");
      url = url + '&params=' +paramStr;
      // url = url + '&params=' + JSON.stringify(params['updates']);
      url = url + '&approveUserId=' + value.auditUser;
      url = url + '&authParam=' + Md5.hashStr(this.userService.encryptedDES(value.password));

      // console.log(thnotify.show-st.modal.ts.NotifyShowTableModalComponent.htmlis.req)
      // value.perms = this.perms;

      console.log(url);
      // value.objectIds = objectIds
    this.http.post(url, this.req.body).subscribe((res: any) => {
        if(res!=null && res.code == 0){
            this.eventService.emit('auditSubmitOk');
            this.modal.close(true);
            this.close();
        }else{
            this.msg.error(res.msg)
        }
    }, (res: any) => {
        console.log(this.req);
    });

  }
  close() {
    this.modal.destroy();
  }
  ngOnInit() {
    console.log(JSON.stringify(this.record));
  }
}
