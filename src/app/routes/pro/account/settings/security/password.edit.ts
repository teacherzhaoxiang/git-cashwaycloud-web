import {Component, Input, ViewChild,Inject} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService, NzTreeNode} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
import {Md5} from "ts-md5";
import {UserService} from "../../../../service/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DA_SERVICE_TOKEN,ITokenService} from "@delon/auth";
import {UtilsService} from "../../../../../utils.Service";
import {Router} from "@angular/router";

@Component({
  selector: `app-org-edit-modal`,
  template: `
      <form id="forms" nz-form [formGroup]="validateForm" style="display: block;">
          <nz-form-item style="display: block;">
              <nz-form-label [nzSpan]="3" nzRequired nzFor="note">旧密码</nz-form-label>
              <nz-form-control [nzSpan]="21" nzErrorTip="必填项" [nzValidateStatus]="oldPassword['validator']">
                  <input oncopy="return false" onpaste="return false"  type="text" nz-input formControlName="oldPassword" autocomplete="off" (ngModelChange)="inputVal($event,'oldPassword')" />
              </nz-form-control>
          </nz-form-item>
          <nz-form-item>
              <nz-form-label [nzSpan]="3" nzRequired nzFor="note">新密码</nz-form-label>
              <nz-form-control [nzSpan]="21" [nzErrorTip]="newPassword['tips']" [nzValidateStatus]="newPassword['validator']">
                  <input oncopy="return false" onpaste="return false" type="text" nz-input formControlName="newPassword"  autocomplete="off" (ngModelChange)="inputVal($event,'newPassword')"/>
              </nz-form-control>
          </nz-form-item>
          <nz-form-item>
              <nz-form-label [nzSpan]="3" nzRequired nzFor="note">确认密码</nz-form-label>
              <nz-form-control [nzSpan]="21" nzErrorTip="必填项" [nzValidateStatus]="rePassword['validator']">
                  <input oncopy="return false" onpaste="return false" type="text" nz-input formControlName="rePassword" autocomplete="off" (ngModelChange)="inputVal($event,'rePassword')"/>
              </nz-form-control>
          </nz-form-item>
          <nz-form-item nz-row class="register-area">
              <nz-form-control>
                  <div style="display: flex;justify-content: flex-end;border-top: 1px solid #ececec;padding-top: 26px;">
                      <button nz-button type="button" (click)="formReset()">重置</button>
                      <button nz-button type="submit" (click)="submit()" [disabled]="keep" >保存</button>
                  </div>
              </nz-form-control>
          </nz-form-item>
      </form>
  `,
    styles:[`
        :host ::ng-deep .ant-form-item-with-help{
            margin-bottom: 24px;
        }
    `]
})
export class PasswordEditModalComponent {
    oldPassword = {
        str:'',
        password:'',
        validator:'',
        tips:''
    };
    newPassword = {
        str:'',
        password:'',
        validator:'',
        tips:''
    };
    rePassword = {
        str:'',
        password:'',
        validator:'',
        tips:''
    };
    keep = true;
    validateForm: FormGroup;
  @Input()
  record:any;
  constructor(
      protected http:_HttpClient,
      private message: NzMessageService,
      private router: Router,
      private userService:UserService,
      private fb: FormBuilder,
      @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
      private utilsService:UtilsService,
  ) {}

    formReset(){
        this.oldPassword = {
            str:'',
            password:'',
            validator:'',
            tips:''
        };
        this.newPassword = {
            str:'',
            password:'',
            validator:'',
            tips:''
        };
        this.rePassword = {
            str:'',
            password:'',
            validator:'',
            tips:''
        };
        this.validateForm = this.fb.group({
            oldPassword: [null, [Validators.required]],
            newPassword: [null, [Validators.required]],
            rePassword: [null, [Validators.required]],
            remember: [true]
        });
    }
    changeVal(val){
      var str = '';
      for(var i=0;i<val.length;i++){
          str+='*';
      }
      return str;
    }
    inputVal(e,type){
        var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
        var res = reg.test(e);
        if(!res){
            this[type]['password'] += e.length>0?e[e.length-1]:'';
            this[type]['str'] = e;
            if(this[type]['password'].length>this[type]['str'].length){
                this[type]['password'] = this[type]['password'].substr(0,this[type]['str'].length);
            }
            if(type=='oldPassword'){
                this.oldPassword.validator = this.oldPassword['password'].length>0?'success':'error';
            }
            if(type=='rePassword'){
                this.rePassword.validator = this.rePassword['password'].length>0?'success':'error';
            }
            if(type=='newPassword'){
                this.checkNewPassword(this.newPassword['password'])
            }
            this.validateForm = this.fb.group({
                oldPassword: [this.changeVal(this.oldPassword['str']), [Validators.required]],
                newPassword: [this.changeVal(this.newPassword['str']), [Validators.required]],
                rePassword: [this.changeVal(this.rePassword['str']), [Validators.required]],
                remember: [true]
            });
        }else {
            this.validateForm = this.fb.group({
                oldPassword: [this.changeVal(this.oldPassword['str']), [Validators.required]],
                newPassword: [this.changeVal(this.newPassword['str']), [Validators.required]],
                rePassword: [this.changeVal(this.rePassword['str']), [Validators.required]],
                remember: [true]
            });
        }
        if(!this.oldPassword['password']||!this.newPassword['password']||!this.rePassword['password']||this.oldPassword['validator']=='error'||this.newPassword['validator']=='error'||this.rePassword['validator']=='error'){
            this.keep = true;
        }else {
            this.keep = false;
        }

    }
    checkNewPassword(value: string) {
        if (value == null||value=='') {
            this.newPassword['tips'] = '必填项';
            this.newPassword['validator'] = 'error';
            return;
        }
        let length = this.passwordRules.minLength?this.passwordRules.minLength:8;
        if (value.length < length ) {
            this.newPassword['tips'] = '密码长度必须大于'+length+'位';
            this.newPassword['validator'] = 'error';
            return;
        }

        if (!/\d/.test(value) && this.passwordRules.number) {
            this.newPassword['tips'] = '密码必须包含数字';
            this.newPassword['validator'] = 'error';
            return;
        }
        if (!/[a-z]/.test(value) && this.passwordRules.alphabet) {
            this.newPassword['tips'] = '密码必须包含小写字母';
            this.newPassword['validator'] = 'error';
            return;
        }
        if (!/[A-Z]/.test(value) && this.passwordRules.uppercase) {
            this.newPassword['tips'] = '密码必须包含大写字母';
            this.newPassword['validator'] = 'error';
            return;
        }
        if (!/\W/.test(value) && this.passwordRules.specialCha) {
            this.newPassword['tips'] = '密码必须包含特殊字符';
            this.newPassword['validator'] = 'error';
            return;
        }
        let maxLength = this.passwordRules.maxLength?this.passwordRules.maxLength:16;
        if (value.length > maxLength) {
            this.newPassword['tips'] = '密码长度必须小于'+maxLength+'位';
            this.newPassword['validator'] = 'error';
            return;
        }
        this.newPassword['validator'] = 'success';
    }

    passwordRules:any = {}
    ngOnInit() {
        this.validateForm = this.fb.group({
            oldPassword: [null, [Validators.required]],
            newPassword: [null, [Validators.required]],
            rePassword: [null, [Validators.required]],
            remember: [true]
        });
        this.passwordRules = environment["password"]?environment["password"]:{};
    }
    submit(): void {
        if(this.newPassword['password'] != this.rePassword['password']){
            //alert("两次输入密码不一致，请重新输入");
            this.message.error("两次输入密码不一致，请重新输入");
            return;
        }
        if(this.newPassword['password'] == this.oldPassword['password']){
            this.message.warning("新旧密码一致")
            return;
        }
        let url = environment.manage_server_url+"/sys/users/password/update";
        url = url+"?userName="+this.userService.getUser().userName+"&oldPassword="+Md5.hashStr(this.userService.encryptedDES(this.oldPassword['password']))+"&newPassword="+Md5.hashStr(this.userService.encryptedDES(this.newPassword['password']));
        this.http.put(url).subscribe((res:any)=>{
            if(res.code !=0){
                this.message.error(res.msg)
            }else{
                // this.sf.reset();
                this.message.success("修改成功");
                this.tokenService.clear();
                console.log("=======logout:"+this.utilsService.loginUrl)

                if(this.utilsService.loginUrl == ""){
                    this.utilsService.loginUrl = localStorage.getItem("loginUrl");
                }
                this.router.navigateByUrl(this.utilsService.loginUrl);
            }

        },(res:any)=>{
            this.message.error("修改失败")
        })
    }
}
