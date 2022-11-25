import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {Observable} from "rxjs";
import {BehaviorSubject} from "rxjs";

/**
 * 用户数据
 */
@Injectable()
export class WidgetService {
  private subject = new Subject<any>();
  tab_menu = new BehaviorSubject<object>({});
  list_version = new BehaviorSubject<object>({});
  option = new BehaviorSubject<string>('');  //订阅的属性：用来给订阅方存储数据
  publish_status = new BehaviorSubject<number>( 0);  //0:发布失败/还没发布   1:发布成功
  publish_disable = new BehaviorSubject<number>( 1);  //0:不可发布   1:可发布
  sendTabMenu(menu: any) {
    this.tab_menu.next(menu);
  }
  sendPublishDisable(message: any) {  //订阅的方法，接收订阅方发布的publish_disable
    this.publish_disable.next(message);
  }
  sendListVersion(message: any) {
    this.list_version.next(message);
  }
  sendOption(message: any) {  //订阅的方法，接收订阅方发布的option
    this.option.next(message);
  }
  sendPublishStatus(message:number) {
    this.publish_status.next(message);
  }
  handleUrl(url,source={}) {  //处理url
    let urlArr = url.split('$');
    for(let i=0;i<urlArr.length;i++) {
      let index1 = urlArr[i].indexOf('{{');
      let index2 = urlArr[i].indexOf('}}');
      if (index1>-1&&index2>index1) {
        let key = urlArr[i].substring(index1+2,index2);
        let value:any = '';
        value = source[key]||'';

        let reg = '{{'+key+'}}';
        urlArr[i] = urlArr[i].replace(reg,value);
      }
    }
    return urlArr.join('');
  }
  handleParams(params,source={}) {
    for(let key in params){
      let s_key = params[key];
      params[key] = source[s_key]?source[s_key]:'';
    }
    return params;
  }
}
