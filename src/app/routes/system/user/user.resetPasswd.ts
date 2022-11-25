import {Component, Input, ViewChild} from '@angular/core';
import {NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
import {Md5} from "ts-md5";
import {UserService} from "../../service/user.service";
let TIMEOUT = null;
@Component({
  selector: `app-user-resetPasswd-modal`,
  template: `
    <div class="modal-header">
      <div class="modal-title">编辑</div>
    </div>
    <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none" >
      <div class="modal-footer">
          <button nz-button type="button" (click)="close()">关闭</button>
          <button nz-button [nzLoading]="loading" type="submit" (click)="save(sf.value)" [disabled]="!sf.valid" >保存</button>
      </div>
  </sf>`,
})
export class UserResetPasswdModalComponent {
    loading = false;
  @Input()
  record:any;

  private userService:UserService;

  editSchema:any = {
    properties:{
        passwd:{type:"string",title:"原密码","ui":{"type":"password"}},
        newPasswd:{type:"string",title:"新密码","ui":{"type":"password"}},
        confirmPasswd:{type:"string",title:"确认密码","ui":{"type":"password"}}
    }
  };
  @ViewChild('sf',{ static: false })
  sf:SFComponent;
  constructor(private modal: NzModalRef,protected http:_HttpClient) {}

  save(value:any) {
      this.loading = true;
      TIMEOUT = setTimeout(() => {
          this.loading = false;
          clearTimeout(TIMEOUT);
      }, 5000);
    let passwd = value.passwd;
      let newPasswd = value.newPasswd;
      let confirmPasswd = value.confirmPasswd;
      if(newPasswd != confirmPasswd){
          this.loading = false;
          clearTimeout(TIMEOUT);
        alert("两次输入密码不一致，清重新输入");
        return;
      }

    console.log(JSON.stringify(value));
      value["passwd"] = Md5.hashStr(this.userService.encryptedDES(passwd));
      value["newPasswd"] = Md5.hashStr(this.userService.encryptedDES(newPasswd))
    this.modal.close(`new time: ${+new Date()}`);
    this.close();
  }

  close() {
    this.modal.destroy();
  }
  ngOnInit(){
    console.log(JSON.stringify(this.record));
  }
}
