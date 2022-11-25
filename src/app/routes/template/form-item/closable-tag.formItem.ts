import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {ControlWidget, SFComponent, SFItemComponent} from "@delon/form";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";
@Component({
    selector: 'clickable-tag-formItem',
    template: `
        <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error">
            <div style="width: 100%;height: 30px">
                <div  *ngFor="let label of labelList;index as i" style="list-style:none;float: left;margin-left: 5px;margin-right: 5px">
                    <img src="/assets/tmp/img/status/status_module.png" [style.background-color]="colorList[i]"  style="width: 24px;height: 24px" >{{label}}
                </div>
            </div>
            <div style="width: 100%;float: left;">
                <button *ngFor="let tag of hotTags" (click)="handleClick(tag)" class="ant-btn my-tag-button" style="" [style.background-color]="colorList[selectNumList[tag.value]||0]" >
                    {{ tag.label }}
                </button>
            </div>
        </sf-item-wrap>
    `,
    styles  : [
        `
            .my-tag-button {
                color: black;
                border-color: #f5f7fa
            }
            
            .my-tag-button:first-child {
                margin-left:10px;
            }
        `
    ]
})
export class ClosableTagFormItemWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'clickable-tag';
    hotTags = [];
    colorList = [];
    labelList = [];
    selectNumList = {};

    constructor(private http: _HttpClient,cd: ChangeDetectorRef, injector: Injector,sfItemComp: SFItemComponent , sfComp: SFComponent) {
        super(cd,injector,sfItemComp,sfComp);
    };
    ngOnInit(): void {
        console.log("clickableTag")

        this.colorList = this.ui.colorList||[];
        this.labelList = this.ui.labelList||[];

        if(this.ui.initUri != null){
            let initUri = environment.common_crud_url + this.ui.initUri;
            this.http.get(initUri,{
                mate: JSON.stringify(this.ui.mate)
            }).subscribe((res:any)=>{
                this.hotTags = res;
                this.detectChanges();
            });
        }
        // this.http.get(this.ui.initUrl).subscribe((res:any)=>{
        //     //let data = {"a":1,"b":2,"c":0,"d":0,"e":2,"f":0};
        //     this.hotTags = res;
        //     this.detectChanges();
        // });
        // setTimeout(()=>{
        //     //let data = {"a":1,"b":2,"c":0,"d":0,"e":2,"f":0};
        //     this.hotTags = [{label:"发卡模块",value:"a"},{label:"读卡器",value:"b"},{label:"流水打印机",value:"c"},{label:"出钞模块",value:"d"},{label:"ic读卡器",value:"e"},{label:"验钞模块",value:"f"}];
        //     //this.selectNumList = data;
        //     this.detectChanges();
        // },1000)
    }

    reset(value:any){


        // if( value == undefined){
        //     values = {};
        // }

        console.log(this.value);
        let jsonString = "{";
        let json = "";
        if(value != null){
            for(let i=0;i< value.length;i++){
                jsonString = jsonString+ '"'+value[i]["key"] +'":'+ value[i]["value"] +",";
            }
            jsonString = jsonString.substring(0,jsonString.length-1);
            jsonString = jsonString+"}";
            json = JSON.parse(jsonString);
            console.log("=============json "+JSON.stringify(json));
            console.log("=============json "+json);
            this.selectNumList = json;
            this.detectChanges();
        }else {
            this.selectNumList ={};
        }


         //this.selectNumList = value||{};
        // console.log("==========111");
        // console.log(this.hotTags);
        // console.log(this.selectNumList);

    }

    handleClick(tag: any): void {
        let len = this.colorList.length;
        let id = tag.value;
        let num = this.selectNumList[id]||0;
        let finalNum = 0;
        if(num+1 < len){
            finalNum = num+1;
        }

        this.selectNumList[id] = finalNum;
        let jsonArray = [];
        for(let key in this.selectNumList){
            console.log(key +"   "+ this.selectNumList[key]);
                let item = {"key":key,"value":this.selectNumList[key]};
                jsonArray.push(item);
        }
        this.setValue(jsonArray);
        console.log(this.value);
        // for(let i=0;i<this.selectNumList;i++){
        //     let item = {};
        //     item[this.selectNumList[i]]
        //     jsonArray.push();
        // }
        // this.setValue(this.selectNumList)
        this.detectChanges();
    }
}
