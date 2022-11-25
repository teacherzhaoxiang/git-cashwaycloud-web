import {Component, Input, ViewChild} from '@angular/core';
import {NzModalRef, NzTreeNode,NzMessageService} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from "@delon/form";
import {environment} from "@env/environment";
@Component({
  selector: `app-org-add-modal`,
  template: `      
    <sf #sf mode="edit" [schema]="editSchema" [formData]="record" button="none" >
      <div class="modal-footer">
          <button nz-button type="button" (click)="close()">关闭</button>
          <button nz-button type="submit" (click)="save(sf.value)" [disabled]="!sf.valid" >保存</button>
      </div>
  </sf>`,
})
export class OrgAddModalComponent {
  @Input()
  record:any;

  editSchema:any = {
      properties:{
        name:{type:"string",title:"机构名称", maxLength:100,},
        parentId: {
            type: "string", title: "上级机构", maxLength: 36,
            ui: {
                widget: 'org-tree-cashway'
            },
        },
        code:{type:"string",format: 'regex', pattern: '^[0-9a-zA-Z]{1,20}$', title:"机构编号",maxLength:50,},
        address: { type: 'string', title: '地址', maxLength: 100,},
/*
        phone: { type: 'string', title: '联系电话', maxLength: 80, },
*/
       /* show:{ title: '类型', type: "string",
            enum: [{label: "机构",value: "1"}, {label: "部门",value: "0"}], },*/
/*
        orderNum:{title:"排序",type:"integer", maximum: 99},
*/
        status:{ title: '状态', type: "string",
            enum: [{label: "正常",value: "1"}, {label: "失效",value: "0"}], },
      },
      required:["name","parentId","code","orderNum","status","show"]
  };
  @ViewChild('sf',{static:true})
  sf:SFComponent;
  constructor(private modal: NzModalRef, protected http: _HttpClient,private message: NzMessageService) {}
  save(value:any) {
    // console.log(JSON.stringify(value));
    // this.modal.close(`new time: ${+new Date()}`);
    // this.close();
      this.http.post(environment.manage_server_url+"/sys/orgs",value).subscribe((res:any)=>{
          //弹窗保存成功
          this.message.success('保存成功');
          this.modal.close(true);
          this.close();
      },(res:any)=>{

      })

  }
  close() {
    this.modal.destroy();
      console.log("=================2222222");
  }
  ngOnInit(){
    console.log(JSON.stringify(this.record));
  }
}
