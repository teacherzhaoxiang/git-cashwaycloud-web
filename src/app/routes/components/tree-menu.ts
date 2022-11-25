import { Component, OnInit } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd';
@Component({
  selector: 'tree-menu',
  template: `
        <div class="tree_menu">
            <nz-tree
                [nzData]="nodes"
                [nzCheckedKeys]="defaultCheckedKeys"
                [nzExpandedKeys]="defaultExpandedKeys"
                [nzSelectedKeys]="defaultSelectedKeys"
                (nzClick)="nzEvent($event)"
                (nzExpandChange)="nzEvent($event)"
                (nzCheckBoxChange)="nzEvent($event)"
            >
            </nz-tree>
        </div>
    `,
  styles: [`
      :host ::ng-deep .ant-tree.ant-tree-show-line li span.ant-tree-switcher{
          background: none;
      }
      .tree_menu{
          display: inline-block;
      }
    `]
})
export class TreeMenuComponent implements OnInit {
  defaultCheckedKeys = ['0-0-0'];
  defaultSelectedKeys = ['0-0-0'];
  defaultExpandedKeys = ['0-0', '0-0-0', '0-0-1'];
  constructor() {

  }
  nodes = [
    {
      title: '0-0',
      key: '0-0',
      expanded: true,
      children: [
        {
          title: '0-0-0',
          key: '0-0-0',
          children: [
            { title: '0-0-0-0', key: '0-0-0-0', isLeaf: true },
            { title: '0-0-0-1', key: '0-0-0-1', isLeaf: true },
            { title: '0-0-0-2', key: '0-0-0-2', isLeaf: true }
          ]
        },
        {
          title: '0-0-1',
          key: '0-0-1',
          children: [
            { title: '0-0-1-0', key: '0-0-1-0', isLeaf: true },
            { title: '0-0-1-1', key: '0-0-1-1', isLeaf: true },
            { title: '0-0-1-2', key: '0-0-1-2', isLeaf: true }
          ]
        },
        {
          title: '0-0-2',
          key: '0-0-2',
          isLeaf: true
        }
      ]
    },
    {
      title: '0-1',
      key: '0-1',
      children: [
        { title: '0-1-0-0', key: '0-1-0-0', isLeaf: true },
        { title: '0-1-0-1', key: '0-1-0-1', isLeaf: true },
        { title: '0-1-0-2', key: '0-1-0-2', isLeaf: true }
      ]
    },
    {
      title: '0-2',
      key: '0-2',
      isLeaf: true
    }
  ];

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
    console.log(this.nodes);
  }
  ngOnInit() {


  }

}
