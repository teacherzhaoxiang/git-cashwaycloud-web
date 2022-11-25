import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { NzContextMenuService, NzDropdownMenuComponent } from "ng-zorro-antd/dropdown";
import { NzFormatEmitEvent, NzTreeNode } from "ng-zorro-antd/core";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "app-list",
    template: `
        <nz-card>
            <nz-tree
                [nzData]="nodes"
                (nzClick)="activeNode($event)"
                [nzTreeTemplate]="nzTreeTemplate"
            ></nz-tree>
            <ng-template #nzTreeTemplate let-node>
      <span class="custom-node" [class.active]="activedNode?.key === node.key">
        <span *ngIf="!node.isLeaf">
            <!--设置为父节点-->
          <span class="folder-name" [title]="node.title">{{ node.title }}</span>
        </span>
        <span *ngIf="node.isLeaf">
            <!--设置为叶子节点-->
          <span class="file-name" [title]="node.title">{{ node.title }}</span>
        </span>
      </span>
            </ng-template>
    `,
    styles: [`
        :host ::ng-deep .ant-card-body{
            width: 100%;
            padding: 0;
        }
        :host ::ng-deep .custom-node[_ngcontent-kbi-c9]{
            line-height: 30px;
        }
        
        :host ::ng-deep .ant-tree {
            overflow: hidden;
            margin: 0 -24px;
            padding: 0 24px;
        }

        :host ::ng-deep .ant-tree li {
            padding: 4px 0 0 0;
        }

        .custom-node {
            cursor: pointer;
            line-height: 24px;
            margin-left: 4px;
            display: inline-block;
            margin: 0 -1000px;
            padding: 0 1000px;
        }

        .active {
            background: #1890ff;
            color: #fff;
        }

        .file-name,
        .folder-name {
            margin-left: 4px;
        }

        .file-desc,
        .folder-desc {
            padding: 0 8px;
            display: inline-block;
            background: #87ceff;
            color: #ffffff;
            position: relative;
            left: 12px;
        }
    `]
})
export class ListComponent implements OnInit{
    constructor(
        private nzContextMenuService: NzContextMenuService,
        private httpClient: HttpClient,
    ) {}
    @Output() outer = new EventEmitter();
    data: any = [];
    activedNode = {title: "菜单 1",key: "100"};
    // congfig:any = {
    //     dataUri:'',
    //     titleTemplate:'{{label}}',
    //     popTemplate:'{{label}}|{{key}}',
    //     key: '{{key}}'
    // }
    nodes = [
        {
            title: "菜单 1",
            key: "100",
            isLeaf: true, //设置为叶子节点(叶子节点不可被拖拽模式放置)
            // selected: true
        },
        {
            title: "菜单 2",
            key: "101",
            isLeaf: true
        },
        {
            title: "菜单 3",
            key: "102",
            isLeaf: true
        },
        {
            title: "菜单 4",
            key: "103",
            isLeaf: true
        }
    ];

    activeNode(data): void {
        this.activedNode = data.node!;
        this.outer.emit(this.activedNode);
    }
    ngOnInit() {
        // this.httpClient.get(environment.manage_server_url + '/sys/roles/currentUser/menu').subscribe((roleMenuData: any) => {
        //    // this.userService.setRoleMenuList(roleMenuData);
        //
        // });
        // delete this.congfig.dataUri;
        // for(let key in this.congfig){
        //     var arr = this.congfig[key].split('|');
        //     for(let i=0;i<arr.length;i++){
        //         arr[i] = arr[i].replace(/{{/g,'');
        //         arr[i] = arr[i].replace(/}}/g,'');
        //     }
        //     this.congfig[key] = arr;
        // }
        // for(let i=0;i<this.nodes.length;i++){
        //     this.data[i] = {isLeaf: true};
        //
        //     for(let key in this.congfig){
        //         let item = this.congfig[key];
        //         let name = '';
        //         for(let j=0;j<item.length;j++){
        //             name += this.nodes[i][item[i]];
        //         }
        //         this.data[i][key] = name;
        //     }
        // }
        // console.log(this.data);
    }
}
