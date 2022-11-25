import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd';
@Component({
  selector: 'options-button',
  template: `
        <div style="display: flex;justify-content: center">
            <button nz-button nzType="primary" [disabled]="schema&&schema.cancel&&schema.cancel.disabled?schema.cancel.disabled:false" [ngStyle]="{'display':schema&&schema.cancel&&schema.cancel.display?schema.cancel.display:'block'}" nzGhost (click)="nzEvent('cancel')">取消</button>
            <button nz-button nzType="primary" [disabled]="schema&&schema.keep&&schema.keep.disabled?schema.keep.disabled:false" [ngStyle]="{'display':schema&&schema.keep&&schema.keep.display?schema.keep.display:'block'}" (click)="nzEvent('keep')" [nzLoading]="isKeepLoading">保存</button>
            <button nz-button nzType="primary" [disabled]="schema&&schema.publish&&schema.publish.disabled?schema.publish.disabled:false" [ngStyle]="{'display':schema&&schema.publish&&schema.publish.display?schema.publish.display:'block'}" (click)="nzEvent('publish')" [nzLoading]="isPublishLoading">发布</button>
        </div>
    `,
  styles: [`
      
    `]
})
export class OptionsBtnComponent implements OnInit, DoCheck {
  isKeepLoading = false;
  isPublishLoading = false;
  @Input() schema: any;  // {'cancel': {'disabled': true, display: 'none'}, 'publish': {'disabled': true, display: 'none'}, 'keep': {'disabled': true, display: 'none'}}
  @Input() nzLoading: any;
  @Output() option = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() keep = new EventEmitter();
  @Output() publish = new EventEmitter();
  type = '';

  constructor() {

  }
  nzEvent(type) {
    if(this.isKeepLoading || this.isPublishLoading) return;
    this[type].emit(type);
    this.type = type;
  }
  ngDoCheck() {
    if(this.type == 'keep'){
      this.isKeepLoading = this.nzLoading;
    }else  if(this.type == 'publish'){
      this.isPublishLoading = this.nzLoading;
    }
    //console.log(this.nzLoading);
  }
  ngOnInit() {

  }

}
