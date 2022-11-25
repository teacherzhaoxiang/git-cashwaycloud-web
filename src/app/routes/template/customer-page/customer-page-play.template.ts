import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component, Inject,
    Input,
    NgZone, OnChanges,
    OnInit,
    ViewChild
} from '@angular/core';
import {TableAddModalComponent} from "../table-template/add.template";
import {_HttpClient} from "@delon/theme";
import {NzListComponent, NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {CustomerPageAddModalComponent} from "./customer-page.add";
import {SFComponent, SFSchema} from "@delon/form";
import {ObserveOnSubscriber} from "rxjs/internal/operators/observeOn";
import {environment} from "@env/environment";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {UtilsService} from "../../../utils.Service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-customer-page-template',
    template:`

        <ng-container *ngIf="this.isPadDesign==true">
            <iframe id="mainContent" allowtransparency="true" frameborder="0" style="width:1920px;height:1080px;" [src]="mainContentUrl"></iframe>

            <!--<iframe id="mainContent" allowtransparency="true" frameborder="0" [(style.width)]=mainContentWidth [src]="mainContentUrl" [(style.height)]=mainContentHeight></iframe>-->
        </ng-container>
        <ng-container *ngIf="this.isPadDesign==null || this.isPadDesign==false">


            <!--<label>2222222222</label>-->
            <div *ngFor="let item of data" style="overflow: hidden">
                <div  [(style.left)]="item.style.left" [(style.top)]="item.style.top" style="position: absolute" >
                    <div style="z-index: 1000;opacity:0.5;position: absolute" [(style.width)]="item.style.width" >
                        <div style="float: right;padding-right: 10px;padding-top: 5px">
                        </div>
                    </div>
                    <sf style="position:relative;"  mode="edit" [(schema)]="schema[item.key]" button="none"></sf>
                </div>
            </div>

            <div *ngFor="let item of fontData" style="z-index: 10000;position: absolute;width:100%">
                <ng-container *ngIf="item.wordRoll==1">
                    <marquee style="position: relative;" [(style.left)]="item.coordinateX" [(style.top)]="item.coordinateY" direction="right"  behavior="scroll"  scrollamount="15"  scrolldelay="10"  >

                        <font  [face]="item.wordFont"  [color]="item.wordColor"   [size]="item.wordSize">{{item.wordText}}</font>
                    </marquee>
                </ng-container>
                <ng-container *ngIf="item.wordRoll==0 ||item.wordRoll== null ||item.wordRoll== ''">
                    <font style="position: relative;" [(style.left)]="item.coordinateX" [(style.top)]="item.coordinateY"  [face]="item.wordFont"  [color]="item.wordColor"   [size]="item.wordSize">{{item.wordText}}</font>
                </ng-container>
            </div>
        </ng-container>
    `,
    styles:[
            `
            ::ng-deep .ant-card-body{
                padding: 0;
            }

            ::ng-deep .ant-form-item{
                margin-bottom: 0;
            }
            ::ng-deep .ant-list-item{
                padding: 0;
            }
            ::ng-deep .ant-card{
                margin-bottom: 0;
            }
            ::ng-deep .ant-card-bordered{
                border-top-width: 0;
                border-bottom-width: 0;
                border-left-width: 0;
                border-right-width: 0;

            }
        `]
})
export class CustomerPagePlayTemplateComponent implements OnInit {
    schema:any = {}
    data:any = [];
    isPadDesign:boolean = false;
    @ViewChild('sf',{ static: false })
    sf:SFComponent;
    screenId:string;

    mainContentUrl:any;
    mainContentWidth:any;
    mainContentHeight:any;
    fontData:any;

    constructor(private sanitizer: DomSanitizer,private http: _HttpClient, private utilsService: UtilsService, @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,private message: NzMessageService,private route: ActivatedRoute,private modalSrv: NzModalService,private zone: NgZone,private router:Router,private activatedRoute: ActivatedRoute,private changeDetectorRefs:ChangeDetectorRef) {
        window.addEventListener("androidEvent", function() {
            //alert("111222");
        });

    }

    ngOnInit(){
        console.log("111111=========");
        console.log("22222=========");
        document.body.style.overflow = 'hidden'
        let url = environment.gateway_server_url+"/login";
        let params = {"userName":"admin","password":"113d41ff9929a08a4b60bdc98eaf9bd6"};
        this.http.post(url,params).subscribe((res:any) => {

            if (res["code"] == 0) {
                // 清空路由复用信息
                // this.reuseTabService.clear();
                // 设置Token信息
                console.log("设置Token信息");
                console.log(res["msg"]);
                this.tokenService.set({
                    token: res["msg"]
                    // token: res["token"]
                    // name: this.userName.value,
                    // email: `cipchk@qq.com`,
                    //id: 10000,
                    // time: +new Date(),
                });
            }
        });

        // this.tokenService.set({
        //     token: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxIiwiZXhwIjoxNTU1OTkxMTkwLCJzdWIiOiJhZG1pbiIsInJhbmRvbUtleSI6ImJlMDczZmJlZGJmMTlmMDA0YzU4OGI3ZGU2NmZlODYxIiwicm9sZU9yZ0xpc3QiOiJbe1wiSURcIjpcIjFcIixcIk9SR1BBVEhcIjpcIjBcIn1dIiwidXNlclJvbGVMaXN0IjoiW1wiMVwiXSIsImlhdCI6MTU1NTM4NjM5MH0.PG1Q1fKDdJs7exA574gxEmqF4WHnmKaryVWr_E63bKA",
        //     // token: res["token"]
        //     name: "kk",
        //     email: `cipchk@qq.com`,
        //     id: 10000,
        //     time: +new Date(),
        // });
        setTimeout(() => {
            let id = this.route.snapshot.queryParams.id;
            this.screenId = this.route.snapshot.queryParams.screenId;
                this.http.get(environment.gateway_server_url + "/hall/busi/publish/pad/program-id?taskId=" + id).subscribe((res: any) => {

                    console.log("===================11111")
                    console.log(res);
                this.playPrograme(res.msg,0)

            });
        }, 5000);


    }

    playPrograme(modulesId,key){
        // if(modules_detail_array.length == 0 )return;
        // if(modules_detail_array.length <= key){
        //     this.ngOnInit();
        //     return;
        // }
       //  console.log("===========222");
       //  console.log(modules_detail_array);
       //  console.log(modules_detail_array[key]);
       // // let interval = modules_detail_array[key]["interval"];
       //  let modulesId = modules_detail_array[key]["modulesId"];
        console.log("=====screenId========"+this.screenId);
        console.log("=====modulesId========"+modulesId);
        this.http.get(environment.gateway_server_url + "/hall/publish_subtitle/publishSubtitles/list?screenId="+this.screenId+"&programId="+modulesId).subscribe((res: any) => {

            console.log("文字=========="+res.rows);
            if(res.rows!=null){
                for(let i=0;i<res.rows.length;i++){
                    res.rows[i]['coordinateX'] = res.rows[i]['coordinateX']+'px';
                    res.rows[i]['coordinateY'] = res.rows[i]['coordinateY']+'px';
                }
            }
            console.log(res.rows)
            this.fontData = res.rows;
            this.http.get(environment.runtime_server_url + "/customer-page/init/" + modulesId).subscribe((res: any) => {
                console.log(res.schema);
                // let tempSchema = JSON.stringify(res.schema);
                // let result = tempSchema.replace(/http:\/\/192.168.0.107:8090\/file\/file\/download\?filename=hall\//g,'http://androidimg/sdcard/CashwayAd/');
                // this.schema =JSON.parse(result);
                this.schema = res.schema;
                console.log(this.schema);
                this.data = res.data;
                if(res.url !=null && res.url!=""){
                    this.isPadDesign = true;
                    this.mainContentUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(res.url); ;
                }else{
                    this.isPadDesign = false;
                }

                // let intervalInt = parseInt(interval);
                // console.log(intervalInt);
                // if(interval !=null && interval!="" && interval!="null"){
                //     setTimeout(() => {
                //         key = key+1;
                //         this.playPrograme(modules_detail_array, key);
                //     }, intervalInt*1000*60);
                // }
            })
        });


    }

}


//旧的代码
// import {
//     AfterViewChecked,
//     AfterViewInit,
//     ChangeDetectorRef,
//     Component, Inject,
//     Input,
//     NgZone, OnChanges,
//     OnInit,
//     ViewChild
// } from '@angular/core';
// import {TableAddModalComponent} from "../table-template/add.template";
// import {_HttpClient} from "@delon/theme";
// import {NzListComponent, NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
// import {ActivatedRoute, Route, Router} from "@angular/router";
// import {CustomerPageAddModalComponent} from "./customer-page.add";
// import {SFComponent, SFSchema} from "@delon/form";
// import {ObserveOnSubscriber} from "rxjs/internal/operators/observeOn";
// import {environment} from "@env/environment";
// import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
// import {UtilsService} from "../../../utils.Service";
// import {DomSanitizer} from "@angular/platform-browser";
//
// @Component({
//     selector: 'app-customer-page-template',
//     template:`
//
//         <ng-container *ngIf="this.isPadDesign==true">
//             <iframe id="mainContent" allowtransparency="true" frameborder="0" width="1920px" [src]="mainContentUrl" height="1200px"></iframe>
//         </ng-container>
//         <ng-container *ngIf="this.isPadDesign==null || this.isPadDesign==false">
//
//
//
//         <div *ngFor="let item of data" style="overflow: hidden">
//             <div  [(style.left)]="item.style.left" [(style.top)]="item.style.top" style="position: absolute" >
//                 <div style="z-index: 1000;opacity:0.5;position: absolute" [(style.width)]="item.style.width" >
//                     <div style="float: right;padding-right: 10px;padding-top: 5px">
//                     </div>
//                 </div>
//                 <sf style="position:relative;"  mode="edit" [(schema)]="schema[item.key]" button="none"></sf>
//             </div>
//         </div>
//
//             <div *ngFor="let item of fontData" style="z-index: 10000;position: absolute;width:100%">
//                 <ng-container *ngIf="item.wordRoll==1">
//                     <marquee style="position: relative;" [(style.left)]="item.coordinateX" [(style.top)]="item.coordinateY" direction="right"  behavior="scroll"  scrollamount="15"  scrolldelay="10"  >
//
//                         <font  [face]="item.wordFont"  [color]="item.wordColor"   [size]="item.wordSize">{{item.wordText}}</font>
//                     </marquee>
//                 </ng-container>
//                 <ng-container *ngIf="item.wordRoll==0 ||item.wordRoll== null ||item.wordRoll== ''">
//                     <font style="position: relative;" [(style.left)]="item.coordinateX" [(style.top)]="item.coordinateY"  [face]="item.wordFont"  [color]="item.wordColor"   [size]="item.wordSize">{{item.wordText}}</font>
//                 </ng-container>
//             </div>
//         </ng-container>
//     `,
//     styles:[
//         `
//             ::ng-deep .ant-card-body{
//                 padding: 0;
//             }
//
//             ::ng-deep .ant-form-item{
//                 margin-bottom: 0;
//             }
//             ::ng-deep .ant-list-item{
//                 padding: 0;
//             }
//             ::ng-deep .ant-card{
//                 margin-bottom: 0;
//             }
//             ::ng-deep .ant-card-bordered{
//                 border-top-width: 0;
//                 border-bottom-width: 0;
//                 border-left-width: 0;
//                 border-right-width: 0;
//
//             }
//         `]
// })



// export class CustomerPagePlayTemplateComponent implements OnInit {
//     schema:any = {}
//     data:any = [];
//     isPadDesign:boolean = false;
//     @ViewChild('sf',{ static: false })
//     sf:SFComponent;
//     screenId:string;
//     mainContentUrl:any;
//     fontData:any;
//
//     constructor(private sanitizer: DomSanitizer,private http: _HttpClient, private utilsService: UtilsService, @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,private message: NzMessageService,private route: ActivatedRoute,private modalSrv: NzModalService,private zone: NgZone,private router:Router,private activatedRoute: ActivatedRoute,private changeDetectorRefs:ChangeDetectorRef) {
//         window.addEventListener("androidEvent", function() {
//             //alert("111222");
//         });
//
//     }
//
//     ngOnInit(){
//         console.log("111111=========");
//         console.log("22222=========");
//         let url = environment.gateway_server_url+"/login";
//         let params = {"userName":"admin","password":"113d41ff9929a08a4b60bdc98eaf9bd6"};
//         this.http.post(url,params).subscribe((res:any) => {
//
//             if (res["code"] == 0) {
//                 // 清空路由复用信息
//                 // this.reuseTabService.clear();
//                 // 设置Token信息
//                 console.log("设置Token信息");
//                 console.log(res["msg"]);
//                 this.tokenService.set({
//                     token: res["msg"]
//                     // token: res["token"]
//                     // name: this.userName.value,
//                     // email: `cipchk@qq.com`,
//                     //id: 10000,
//                     // time: +new Date(),
//                 });
//             }
//         });
//
//         // this.tokenService.set({
//         //     token: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxIiwiZXhwIjoxNTU1OTkxMTkwLCJzdWIiOiJhZG1pbiIsInJhbmRvbUtleSI6ImJlMDczZmJlZGJmMTlmMDA0YzU4OGI3ZGU2NmZlODYxIiwicm9sZU9yZ0xpc3QiOiJbe1wiSURcIjpcIjFcIixcIk9SR1BBVEhcIjpcIjBcIn1dIiwidXNlclJvbGVMaXN0IjoiW1wiMVwiXSIsImlhdCI6MTU1NTM4NjM5MH0.PG1Q1fKDdJs7exA574gxEmqF4WHnmKaryVWr_E63bKA",
//         //     // token: res["token"]
//         //     name: "kk",
//         //     email: `cipchk@qq.com`,
//         //     id: 10000,
//         //     time: +new Date(),
//         // });
//         setTimeout(() => {
//             let id = this.route.snapshot.queryParams.id;
//             this.screenId = this.route.snapshot.queryParams.screenId;
//             this.http.get(environment.common_crud_url + "/publish_task/" + id).subscribe((res: any) => {
//                 let program_id = res.program_id;
//                 this.http.get(environment.common_crud_url + "/publish_program_manage/" + program_id).subscribe((res: any) => {
//
//                     console.log("===================11111");
//                     console.log(res);
//                     let modules_detail_array;
//                     if (!res.modules_detail.startsWith('[')) {
//                         modules_detail_array = JSON.parse("[" + res.modules_detail + "]");
//                     }else{
//                         modules_detail_array = JSON.parse(  res.modules_detail );
//                     }
//                     this.playPrograme(modules_detail_array,0)
//                 });
//
//             });
//         }, 5000);
//
//
//     }
//
//     playPrograme(modules_detail_array,key){
//         if(modules_detail_array.length == 0 )return;
//         if(modules_detail_array.length <= key){
//             this.ngOnInit();
//             return;
//         }
//         console.log("===========222");
//         console.log(modules_detail_array);
//         console.log(modules_detail_array[key]);
//         let interval = modules_detail_array[key]["interval"];
//         let modulesId = modules_detail_array[key]["modulesId"];
//         console.log("=====screenId========"+this.screenId);
//         console.log("=====modulesId========"+modulesId);
//         this.http.get(environment.gateway_server_url + "/hall/publish_subtitle/publishSubtitles/list?screenId="+this.screenId+"&programId="+modulesId).subscribe((res: any) => {
//
//             console.log("文字=========="+res.rows);
//             if(res.rows!=null){
//                 for(let i=0;i<res.rows.length;i++){
//                     res.rows[i]['coordinateX'] = res.rows[i]['coordinateX']+'px';
//                     res.rows[i]['coordinateY'] = res.rows[i]['coordinateY']+'px';
//                 }
//             }
//             console.log(res.rows)
//             this.fontData = res.rows;
//             this.http.get(environment.runtime_server_url + "/customer-page/init/" + modulesId).subscribe((res: any) => {
//                 console.log(res.schema);
//                 // let tempSchema = JSON.stringify(res.schema);
//                 // let result = tempSchema.replace(/http:\/\/192.168.0.107:8090\/file\/file\/download\?filename=hall\//g,'http://androidimg/sdcard/CashwayAd/');
//                 // this.schema =JSON.parse(result);
//                 this.schema = res.schema;
//                 console.log(this.schema);
//                 this.data = res.data;
//                 if(res.url !=null && res.url!=""){
//                     this.isPadDesign = true;
//                     this.mainContentUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(res.url); ;
//                 }else{
//                     this.isPadDesign = false;
//                 }
//
//                 let intervalInt = parseInt(interval);
//                 console.log(intervalInt);
//                 if(interval !=null && interval!="" && interval!="null"){
//                     setTimeout(() => {
//                         key = key+1;
//                         this.playPrograme(modules_detail_array, key);
//                     }, intervalInt*1000*60);
//                 }
//             })
//         });
//
//
//     }
//
// }
