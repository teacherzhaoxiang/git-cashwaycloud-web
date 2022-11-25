import {Component, Input, ViewChild} from '@angular/core';
import {NzFormatEmitEvent, NzMessageService, NzModalRef, NzTreeComponent, NzTreeNode, NzTreeNodeOptions} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType} from '@delon/form';
import {environment} from '@env/environment';
import {STComponent} from '@delon/abc';
import {del} from "selenium-webdriver/http";
import { log } from 'console';
import { title } from 'process';
let TIMEOUT = null;
@Component({
    selector: `app-role-auth-modal`,
    template: `
        <div class="edit_box" drag>
            <div class="modal-header box_header" style="margin: 0">
                <div class="modal-title">角色授权</div>
                <div class="closer" (click)="close()"><i nz-icon nzType="close" nzTheme="outline"></i></div>
            </div>
            <div (mousedown)="$event.stopPropagation()">
                <div nz-row class="modal-content">
                    <nz-col nzSpan="24">
                        <nz-input-group [nzSuffix]="suffixIcon">
                            <input type="text" nz-input placeholder="请输入关键字" [(ngModel)]="searchValue" />
                        </nz-input-group>
                        <ng-template #suffixIcon>
                            <i nz-icon nzType="search"></i>
                        </ng-template>
                        <nz-tree #nt id="tree"
                                 [nzData]="nodes"
                                 nzCheckable="true"
                                 nzMultiple="true"
                                 nzShowLine="true"
                                 nzShowIcon="true"
                                 nzCheckStrictly="false"
                                 nzAsyncData="true"
                                 [nzSearchValue]="searchValue"
                                 [nzCheckedKeys]="defaultCheckedKeys"
                                 [nzExpandedKeys]="defaultExpandedKeys"
                                 [nzSelectedKeys]="selectedKeys"
                                 [nzDefaultCheckedKeys] = "nzDefaultCheckedKeys"
                                 (nzClick)="nzEvent($event)"
                                 (nzExpandChange)="nzEvent($event)">
                        </nz-tree>
                    </nz-col>
                </div>
            </div>
            <div class="modal-footer">
                <button nz-button type="button" (click)="close()" class="closeBtn">关闭</button>
                <button [nzLoading]="loading" nz-button type="submit" (click)="save()" class="keep">保存</button>
            </div>
        </div>
    `,
    styles:[`
        nz-input-group {
            margin-bottom: 12px;
        }
        .edit_box{
            background: #FFFFFF;
            width: 800px;
            z-index: 999999999999;
            border-radius: 6px;
        }
        .edit_box .box_header{
            margin: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-footer{
            margin: 0;
        }
        .modal-content{
            padding: 16px;
            max-height: 600px;
            overflow-y: scroll;
        }
        .modal-footer .keep{
            background: #1890ff;
            color: #FFFFFF;
        }
        .closeBtn{
            border: 1px solid #1890ff;color: #1890ff
        }
        .closer{
            cursor: pointer;
        }
    `]
})
export class RoleAuthModalComponent {
    loading = false;
    @Input()
    record: any;
    @ViewChild('nt', { static: true })
    nt: NzTreeComponent;
    defaultCheckedKeys = [];
    selectedKeys = [];
    nzDefaultCheckedKeys = [];
    defaultExpandedKeys = [];
    nodes = [];
    selectNode = [];
    flat = false;
    searchValue = '';
    menuIdList=[];
    constructor(private modal: NzModalRef, private message: NzMessageService, protected http: _HttpClient) {}
    save() {
        this.loading = true;
        TIMEOUT = setTimeout(() => {
            this.loading = false;
            clearTimeout(TIMEOUT);
        }, 5000);
        const keys = [];
        // for (let i = 0; i < this.nt.getHalfCheckedNodeList().length; i++) {
        //     keys.push(this.nt.getHalfCheckedNodeList()[i].key);
        // }
        // debugger;
        // console.log("getCheckedNodeList" + JSON.stringify(this.nt.getCheckedNodeList()))
        // this.getKeys(this.nt.getCheckedNodeList(), keys);

        console.log("=======================");

        // this.getKeys(this.nt.getCheckedNodeList(), keys);

        //获取全选
        const list = this.nt.getCheckedNodeList();
        for (const key in list) {
            this.selectNode.push(list[key].key);
            this.getChildNodeOptions(list[key].origin.children);
        }
        //获取半选
        for (let i = 0; i < this.nt.getHalfCheckedNodeList().length; i++) {
            this.selectNode.push(this.nt.getHalfCheckedNodeList()[i].key);
        }
        
        const role = {
            id: this.record.id,
            menuIdList: this.selectNode
        };

        this.http.post(environment.manage_server_url + '/sys/roles/authorize/role_menu', role).subscribe((res: any) => {
          if(res.code==500){
            this.message.error(res.msg);
            return;
          }
            this.message.success('授权成功');
            this.modal.close(`new time: ${+new Date()}`);
            this.close();
        },error=>{

        },()=>{
            this.loading = false;
            clearTimeout(TIMEOUT);
        });
    }

    getKeys(nzTreeNode: NzTreeNode[], keys: any) {
        for (let i = 0; i < nzTreeNode.length; i++) {
            const node = nzTreeNode[i];
            console.log("JSON.stringify(node)" + JSON.stringify(node.key))
            keys.push(node.key);
            if (node.isAllChecked) {
                this.getKeys(node.getChildren(), keys);
            }
        }
    }


    close() {
        this.modal.destroy();
    }
    ngOnInit() {
        // 先查菜单树
        this.http.get(environment.manage_server_url + '/sys/menus/tree?orgId=' + this.record.orgId).subscribe((res: any) => {
            this.nodes = res;
            // 再查这个角色已有的菜单
            this.http.get(environment.manage_server_url + '/sys/roles/' + this.record.id).subscribe((res: any) => {
                this.selectNode = [];

                const menuIdList = JSON.parse(JSON.stringify(res['rows'].menuIdList));
                this.threeToList(this.nodes);
                const list = this.spliceNodesHalfChecked(this.nodes,menuIdList);
                this.menuIdList=list;
                //移除父级id
                for (const key in this.parentIdArr) {
                    this.spliceNodesParentId(this.parentIdArr[key]);
                }
                this.nzDefaultCheckedKeys = list;
            });
        });
    }

    nzCheckBoxChange(event: NzFormatEmitEvent): void {
        let nodeKey = event.node.key;
        let delValue = this.selectNode.indexOf(nodeKey);

        let children = event.node.children;
        
        if (delValue > 0) {
            this.selectNode.splice(delValue, 1);
            this.changeChildren(children, false);
        }
        else if(delValue === 0){
            this.changeChildren(children, this.flat);
            this.flat = !this.flat;
        }
        else{
            this.selectNode.push(nodeKey);
            this.changeChildren(children, true);
        }
    }

    /**
     * 点击父节点选中全选子节点
     * @param children
     * @param isAdd
     */
     private changeChildren(children: NzTreeNode[], isAdd: boolean) {
        if (children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                let key = children[i].key;
                let delValue = this.selectNode.indexOf(key);
                if (isAdd) {
                    if (delValue >= 0) {
                        continue;
                    } else {
                        this.selectNode.push(key);
                        children[i].isChecked = true;
                    }
                } else {
                    if (delValue >= 0) {
                        this.selectNode.splice(delValue, 1);
                        children[i].isChecked = false;
                    } else {
                        continue;
                    }

                }

                // 递归子节点
                this.changeChildren(children[i].children, isAdd);
            }
        }
    }

    /**
     * 遍历选中的子级
     * @param options 
     */
     getChildNodeOptions(options:NzTreeNodeOptions[]) {
        for (let index = 0; index < options.length; index++) {
            const item = options[index];
            this.selectNode.push(item.key);
            this.getChildNodeOptions(item.children);
        }
     }

     /**数结构转列表 */
     private threeToListArr=[];
     private threeToList(nodes) {
        for (let index = 0; index < nodes.length; index++) {
            const item =  nodes[index];
            this.threeToListArr.push({key:item.key,title:item.title,parentId:item.parentId});
            if(item.children&&item.children.length>0){
                this.threeToList(item.children);
            }
        }
     }

     /**
      * 过滤移除半选中状态(反显)
      * @param nodes 菜单树
      * @param keyList 菜单key列表
      * @returns 
      */
    
    private spliceNodesHalfChecked(nodes, keyList:string[]) {
        let list = keyList;
        for (let index = 0; index < nodes.length; index++) {
            const item =  nodes[index];
            let childrenArr = [];
            let findArr=[];
            for (let i = 0; i < item.children.length; i++) {
                childrenArr.push(item.children[i]);
               let kk= list.find(items=>{
                    return items == item.children[i].key
                })
                if(kk!==undefined) findArr.push(kk);
            }
            
            if(findArr.length!==childrenArr.length&&childrenArr.length>0){
            let of = list.indexOf(childrenArr[0].parentId);
            if(of>-1){
                this.parentIdArr.push(childrenArr[0].parentId);
                list.splice(of,1);
            }
            }
            if(item.children&&item.children.length>0){
                this.spliceNodesHalfChecked(item.children,list);
            }
        }
        
        return list;
    }

     /**需移除未选中状态父级id */
     private parentIdArr = [];

     /**
      * 遍历移除未选中状态父级id
      * @param id key
      * @param list 
      */
     private spliceNodesParentId(id) {
        let kk = this.threeToListArr.find(items=>{
            return id == items['key'];
        });
        if(kk!==undefined&&kk.parentId!==""){
            let of = this.menuIdList.indexOf(kk.parentId);
            if(of>-1){
                this.menuIdList.splice(of,1);
                this.spliceNodesParentId(kk.parentId);
            }
        };
     }

    nzEvent(event: NzFormatEmitEvent): void {

    }

}
