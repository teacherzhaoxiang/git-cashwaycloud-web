import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit, ChangeDetectorRef,
    Component,
    DoCheck, Injector,
    OnChanges,
    OnInit,
    SimpleChanges, ViewChild
} from '@angular/core';
import {ControlWidget, SFComponent, SFItemComponent} from '@delon/form';
import {
    NzCardComponent,
    NzCarouselComponent,
    NzFormatEmitEvent, NzMessageService, NzModalRef,
    NzTreeComponent,
    NzTreeNode,
    NzTreeSelectComponent
} from "ng-zorro-antd";
import {environment} from "@env/environment";
import {_HttpClient} from "@delon/theme";

@Component({
    selector: 'nz-demo-carousel-autoplay',
    template: `
        <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
            <nz-tree #nt id="tree"
                     [nzData]="nodes"
                     [nzCheckable]="nzCheckable"
                     [nzSelectedKeys]="nzSelectedKeys"
                     [nzMultiple]="nzMultiple"
                     nzShowLine="true"
                     nzShowIcon="true"
                     nzAsyncData="true"
                     [nzCheckedKeys]="defaultCheckedKeys"
                     [nzExpandedKeys]="defaultExpandedKeys"
                     [nzSelectedKeys]="selectedKeys"
                     [nzDefaultCheckedKeys] = "nzDefaultCheckedKeys"
                     (nzClick)="nzEvent($event)"
                     (nzExpandChange)="nzEvent($event)"
                     (nzCheckBoxChange)="nzCheckBoxChange($event)">
            </nz-tree>
        </sf-item-wrap>
        
        
        `
})
export class TreeCashwayFormItemWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'tree-cashway';

    defaultCheckedKeys = [];
    selectedKeys = [];
    nzDefaultCheckedKeys = [];
    defaultExpandedKeys = [];
    nodes = [];
    nzMultiple;
    nzCheckable;

    @ViewChild('nt',{ static: false })
    nt: NzTreeComponent;
    constructor(protected http:_HttpClient,cd: ChangeDetectorRef, injector: Injector,sfItemComp: SFItemComponent , sfComp: SFComponent ) {
        super(cd,injector,sfItemComp,sfComp);
    };

    dataUri;
    selectDataUri;
    nzSelectedKeys;

    ngOnInit(): void {

        console.log("============111eeee");
        this.nzMultiple = this.ui['nzMultiple'];
        this.nzCheckable = this.ui['nzCheckable'];
        console.log("============"+this.nzMultiple);
        this.dataUri = environment.gateway_server_url+this.ui.dataUri;

        let id = this.formProperty.parent.formData["id"];
        if(id == null){
            this.selectDataUri = environment.gateway_server_url+this.ui.selectDataUri;
        }else{
            this.selectDataUri = environment.gateway_server_url+this.ui.selectDataUri+"?id="+id;
        }

        //this.dataUri = environment.manage_server_url+"/sys/menus/tree?orgId=1";
        //this.selectDataUri = environment.manage_server_url+"/sys/roles/1";

            //先查菜单树
        this.http.get(this.dataUri).subscribe((res:any)=>{
            this.nodes = res;
            if(this.ui.selectDataUri == null){
                this.detectChanges();
                return;
            }
            //再查这个角色已有的菜单
            this.http.get(this.selectDataUri).subscribe((res:any)=>{
                if(!this.nzCheckable && !this.nzMultiple){
                    this.nzSelectedKeys = res;
                }else{
                    this.nzDefaultCheckedKeys = res;
                }
                let key = this.formProperty.path.substring(1);
                this.formProperty.parent.properties[key].setValue(res);
                this.detectChanges();


                // this.nzDefaultCheckedKeys = res;
                //
                // console.log("=======222=====");
                // console.log(this.selectedKeys);
                // this.detectChanges();
                // let key = this.formProperty.path.substring(1);
                // this.formProperty.parent.properties[key].setValue(this.nzDefaultCheckedKeys);
               //
                //console.log(this.selectedKeys);

            })
        })
    }


    reset(value: any) {
        //this.detectChanges();
    }


    nzCheckBoxChange(event: NzFormatEmitEvent): void {
        if(!this.nzCheckable && !this.nzMultiple){
            return;
        }
        let keys =[];
        // for(let i=0;i<this.nt.getHalfCheckedNodeList().length;i++) {
        //     keys.push(this.nt.getHalfCheckedNodeList()[i].key);
        // }
        this.getKeys(this.nt.getCheckedNodeList(),keys);


        let key = this.formProperty.path.substring(1);
        if(keys.length == 0){
            this.formProperty.parent.properties[key].setValue("");
        }else{
            this.formProperty.parent.properties[key].setValue(keys);
        }

    }
    getKeys(nzTreeNode:NzTreeNode[],keys:any){
        for(let i=0;i<nzTreeNode.length;i++){
            let node = nzTreeNode[i];
            keys.push(node.key);
            if(node.isAllChecked){
                this.getKeys(node.getChildren(),keys);
            }
        }
    }

    nzEvent(event: NzFormatEmitEvent): void {
        if(!this.nzCheckable && !this.nzMultiple){
            let key = this.formProperty.path.substring(1);
            this.formProperty.parent.properties[key].setValue(event.node.key);
        }
    }
}
