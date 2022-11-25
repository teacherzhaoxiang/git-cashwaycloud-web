import {Component, Input, OnInit} from '@angular/core';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import { NoticeItem, NoticeIconList } from '@delon/abc';
import {environment} from "@env/environment";
import {_HttpClient} from "@delon/theme";
import {DatePipe} from "@angular/common";
import {TableAddModalComponent} from "../../../../routes/template/table-template/add.template";
import {NotifyShowTableModalComponent} from "./notify.show-st.modal";

/**
 * 菜单通知
 */
@Component({
  selector: 'header-notify',
  template: `
  <notice-icon
    [data]="notifyDatas"
    [count]="notifyNum"
    [loading]="loading"
    (select)="select($event)"
    (clear)="clear($event)"
    (popoverVisibleChange)="loadData()"></notice-icon>
  `,
})
export class HeaderNotifyComponent implements OnInit{
    initTotal:number = 0;
    currInit:number = 0;
    notifyDatas:any[]=[];
    notifyNum:number = 0;
    notifyTimeStamps:any = {};
    showDatas:any = {};
    selectConfigs:any = {};
    showTitles:any = {};
    counts:any = {};
    ngOnInit(): void {
      this.http.get(environment.gateway_server_url+"/manage/rest/notify").subscribe((res:any[])=>{
        res.forEach((item:any,index)=>{
            this.notifyTimeStamps[item["NOTIFY_TYPE"]] = {};
            this.notifyTimeStamps[item["NOTIFY_TYPE"]]["begin"] = new Date(item["READ_TIME"]);
        })
          this.handleDatas();
      })
        setInterval(()=>{
            this.handleDatas();
        },120*1000)
    }
  loading = false;

    handleDatas(){
        this.notifyNum = 0;
        this.currInit = 0;
        this.initTotal = 0;
        this.http.get("/assets/notify/notify.config").subscribe((res:any[])=>{
            let tmp = JSON.stringify(res);
            res.forEach((item:any,index:any)=>{
                if(item.list != null && item.list.length>0){

                    item.list.forEach((item1:any,index1:any)=>{
                        let itemId = item1.id;
                        if(this.notifyTimeStamps[itemId] == null){
                            this.notifyTimeStamps[itemId] = {};
                        }
                        this.showTitles[itemId] = item1["title"];
                        this.initTotal++;
                        let total = 0;
                        this.http.get("/assets/notify/notifyItem/"+itemId+".config").subscribe((itemConfig:any[])=>{
                            let url = itemConfig["initUri"];
                            let params = itemConfig["params"];
                            this.selectConfigs[itemId] = itemConfig["select"];
                            params.begin = this.notifyTimeStamps[itemId]["begin"]==null?"":this.notifyTimeStamps[itemId]["begin"];
                            let currTime = new Date();
                            params.end = currTime;

                            if(url==null || ""==url){
                                if(itemConfig["entity"] == null || itemConfig["entity"]==""){
                                    let data1 = {}
                                    this.currInit++ ;
                                    return;
                                }else {
                                    params = {param:JSON.stringify(params)};
                                    url = environment.common_crud_url+"/"+itemConfig["entity"];
                                }
                            }else {
                                if(!url.toString().startsWith("http") || !url.toString().startsWith("https")){
                                    url = environment.gateway_server_url+url;
                                }
                            }

                            console.log(url);
                            this.http.get(url,params).subscribe((itemData:any)=>{
                                let data;
                                if(itemData && itemData.rows != null){
                                    data = itemData.rows;
                                }else {
                                    data = itemData;
                                }
                                total = data.length;
                                this.showDatas[itemId] = data;
                                this.notifyTimeStamps[itemId]["end"] = currTime;
                                tmp = tmp.replace("{{"+itemId+"Total}}",total+"").replace("{{"+itemId+"Time}}",this.datePipe.transform(currTime,'yyyy-MM-dd HH:mm:ss'));
                                this.currInit++ ;
                                this.notifyNum = this.notifyNum+total;
                                this.counts[itemId] = total;
                                if(this.initTotal == this.currInit){
                                    this.notifyDatas = JSON.parse(tmp);
                                }
                            })
                        })

                    })
                }
            })
        });
    }
  constructor(private msg: NzMessageService,
              private http:_HttpClient,
              private datePipe:DatePipe,
              private modalSrv: NzModalService,) {}

   loadData() {

  }

  clear(type: string) {
    // this.msg.success(`清空了 ${type}`);
  }

  select(res: any) {
      /**
       * 更新下次查询数据的起始时间，将已点击项的数目置为0,
       */
    let itemId:string = res.item.id;
    let time:Date = this.notifyTimeStamps[itemId]["end"];
    let method = "PUT";
    let params = {"notifyType":itemId,"readTime":time.getTime().toString()};
    if(this.notifyTimeStamps[itemId]["begin"] == null){
        method = "POST"
    }
    this.http.request(method,environment.gateway_server_url+"/manage/rest/notify",{params:params}).subscribe(()=>{
        this.notifyTimeStamps[itemId]["begin"] = time;
        this.notifyTimeStamps[itemId]["end"] = null;
    })
      // this.msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
    let selectConfig = this.selectConfigs[itemId];
    this.hanleSelect(itemId,selectConfig);
    res.item.title = this.showTitles[itemId].replace("{{"+itemId+"Total}}","0");
    res.item.datetime = "";
    this.notifyNum = this.notifyNum - this.counts[itemId];
  }

    hanleSelect(itemId,selectConfig:any){
        console.log("select~~~~~~~~~~~~~~~")
        if("modal" == selectConfig.show){
            const modal = this.modalSrv.create({
                nzTitle: selectConfig.name,
                nzContent: NotifyShowTableModalComponent,
                nzWidth:800,
                nzComponentParams: {
                    datas:this.showDatas[itemId],
                    columns:selectConfig.config.fields,
                },
                nzFooter:null,
                nzMaskClosable:false
            });
        }
    }

}
