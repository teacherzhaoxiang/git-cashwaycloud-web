import { Pipe, PipeTransform } from '@angular/core';
import {OnInit} from "@angular/core";

@Pipe({
  name: 'lang'   //管道名  使用方法：{{ 数据 | 管道名 : 参数1 : 参数2 }}
})
export class LangTransferPipe implements PipeTransform,OnInit {
  json = {};
  constructor () {
  }
  ngOnInit(){

  }
  transform(key) {  //key: | 前面的值          （可以接收多个参数）
    const langType = localStorage.getItem('lang');  //zn-CH:中文   1：en-US
    if(langType == 'zn-CH'){

    }else if(langType == 'en-US') {

    }
    return this.json[key];
  }
}
