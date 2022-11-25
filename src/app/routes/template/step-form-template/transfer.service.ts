import { Injectable } from '@angular/core';

@Injectable()
export class TransferService {
    /**
     * 当前步数
     */
  currentStep:number=0;
    /**
     * 总步数
     */
  steps:number;
    /**
     * 分布表单内容
     */
  childrens:any[];

  params:any ={};
  tempParams:any ={};

  components:any = [];

    /**
     * 主表表名字
     */
  entity:string;

    /**
     * 所有表名字，和关系
     */
  tables:any[];

  constructor() {

  }
}
