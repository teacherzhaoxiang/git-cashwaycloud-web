import { Component, OnInit, ViewChild} from '@angular/core';
import { NzModalRef } from "ng-zorro-antd";
@Component({
  selector: 'form-completion',
  template: `
      <div class="edit_box" drag>
          <div class="modal-header box_header" style="margin: 0">
              <div class="modal-title">编辑</div>
              <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
          </div>
          <div (mousedown)="$event.stopPropagation()">
              <div nz-row class="modal-content">
                  <nz-steps [nzCurrent]="current" nzSize="small">
                      <nz-step nzTitle="步骤1"></nz-step>
                      <nz-step nzTitle="步骤2"></nz-step>
                      <nz-step nzTitle="步骤3"></nz-step>
                  </nz-steps>
                  <div class="content">
                      <sf #sf mode="edit" [ui]="searchSchema.ui" [schema]="searchSchema" [formData]="params" (formReset)="sf.reset()" button="none"></sf>
                  </div>
              </div>
          </div>
          <div class="modal-footer">
              <button nz-button type="submit" *ngIf="current>0" (click)="goBack()">上一步</button>
              <button nz-button type="submit" (click)="submit()" [disabled]="!sf.valid">下一步</button>
          </div>
      </div>

  `,
  styleUrls: ['./form-completion.component.css']
})
export class FormCompletionComponent implements OnInit {
    @ViewChild( 'sf', { static: true } ) sf: any;
    current = 0;
    searchSchema = {
        properties: {
            email: {
                type: 'string',
                title: '邮箱',
                maxLength: 5
            },
            name: {
                type: 'string',
                title: '姓名',
                minLength: 3,
            },
            phone: {
                type: 'string',
                title: '电话',
                maxLength: 20,
            },
            age: {
                type: 'string',
                title: '年龄',
                minLength: 3,
            },
            address: {
                type: 'string',
                title: '住址',
                minLength: 3,
            },
            occupation: {
                type: 'string',
                title: '职业',
                minLength: 3,
            },
            salary: {
                type: 'string',
                title: '薪资',
                minLength: 3,
            }
        },
        ui: {
            grid: {
                span: 12
            }
        }
    };
    params = {

    }
  constructor(private modal: NzModalRef) { }

  ngOnInit() {
  }
  //关闭弹框
    close() {
        this.modal.destroy();
    }
    //上一步
    goBack() {
        if (this.current > 0) {
            --this.current;
        }
    }
    //点击下一步触发提交
    submit() {
      console.log(this.sf.valid);
      ++this.current;
    }
}
