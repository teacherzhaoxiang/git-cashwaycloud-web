import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {ControlWidget, SFComponent, SFItemComponent} from "@delon/form";
import {_HttpClient} from "@delon/theme";
import {environment} from "@env/environment";
@Component({
    selector: 'tag-group-formItem',
    template: `
        <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
            <button (click)="handleAllClick()" class="ant-btn" style="color: black;border-color: #f5f7fa" [style.background-color]="colorList[allNum]">全部</button>
            <div *ngFor="let group of hotTags" nz-row>
                <nz-col [nzSpan]="24">
                    <span style="width: 100%">{{group.label}}</span>
                </nz-col>
                
                <button *ngFor="let tag of group.children" (click)="handleClick(tag)" class="ant-btn" style="color: black;border-color: #f5f7fa" [style.background-color]="colorList[selectNumList[tag.value]||0]" >
                    {{ tag.label }}
                </button>
            </div>
        </sf-item-wrap>
    `,
    styles  : []
})
export class TagGroupFormItemWidget extends ControlWidget implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'tag-group';
    hotTags = [];
    colorList = [];
    labelList = [];
    selectNumList = {};
    tagList = [];
    defaultNum = 0;
    allNum = 0;

    constructor(private http: _HttpClient,cd: ChangeDetectorRef, injector: Injector,sfItemComp: SFItemComponent , sfComp: SFComponent ) {
        super(cd,injector,sfItemComp,sfComp);
    };
    ngOnInit(): void {
        console.log("tagGroup")

        this.colorList = this.ui.colorList||[];
        this.labelList = this.ui.labelList||[];
        this.defaultNum = this.ui.defaultCheck||0;
        if(this.ui.initUri != null){
            let initUri = environment.common_crud_url + this.ui.initUri;
            this.http.get(initUri,{
                mate: JSON.stringify(this.ui.mate),
                params:this.ui.params?this.ui.params:""
            }).subscribe((res:any)=>{
                if(res != null){
                    this.tagList = res;
                    let tmpTags = [];
                    let tmpJson:Map<string,Object> = new Map<string, Object>();
                    for(let i=0;i<res.length;i++){
                        let obj = res[i];
                        let list = [];
                        if(tmpJson[obj.typeName] != null){
                            list = tmpJson[obj.typeName];
                        }
                        list.push(obj);
                        tmpJson[obj.typeName] = list;
                    }
                    for(let key in tmpJson){
                        let group = {};
                        group["label"] = key;
                        group["children"] = tmpJson[key]
                        tmpTags.push(group);
                    }
                    this.hotTags = tmpTags;
                }
                this.detectChanges();
            });
        }
    }

    reset(value:any){
        console.log(this.value);
        let json = JSON.parse(value);
         this.selectNumList = json == null?{}:json;
        this.detectChanges();
    }

    handleAllClick(){
        let len = this.colorList.length;
        let finalNum = 0;
        if(this.allNum+1 < len){
            finalNum = this.allNum+1;
        }
        this.allNum = finalNum;
        let json = {};
        this.tagList.forEach((item,index)=>{
            let key = item["value"];
            json[key] = this.allNum;
        });
        this.setValue(JSON.stringify(json));
        this.selectNumList = JSON.parse(JSON.stringify(json));
        console.log(this.value);
        this.detectChanges();
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
        let json = {};
        this.tagList.forEach((item,index)=>{
            let key = item["value"];
            if(this.selectNumList[key] != null){
                json[key] = this.selectNumList[key];
            }else {
                json[key] = 0;
            }
        })
        // for(let key in this.selectNumList){
        //     console.log(key +"   "+ this.selectNumList[key]);
        //         json[key] = this.selectNumList[key];
        // }
        this.setValue(JSON.stringify(json));
        console.log(this.value);
        this.detectChanges();
    }
}
