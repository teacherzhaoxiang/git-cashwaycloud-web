import {
    ChangeDetectorRef,
    Component, Inject,
    NgZone,
    OnInit,
    ViewChild
} from '@angular/core';
import {_HttpClient} from "@delon/theme";
import { NzMessageService, NzModalService} from "ng-zorro-antd";
import {ActivatedRoute, Router} from "@angular/router";
import {SFComponent} from "@delon/form";
import {environment} from "@env/environment";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {UtilsService} from "../../../utils.Service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-customer-page-new-template',
    template:`
        <!--<sf style="position:relative;"  mode="edit" [(schema)]="b" button="none"></sf>-->

        <!--<label>11111</label>-->
        <ng-container *ngIf="this.isPadDesign==true">
            <iframe id="mainContent" allowtransparency="true" frameborder="0" [(style.width)]=mainContentWidth [src]="mainContentUrl" [(style.height)]=mainContentHeight></iframe>
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
export class CustomerPagePlayNewTemplateComponent implements OnInit {
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


    programValue:any;
    constructor(private sanitizer: DomSanitizer,private http: _HttpClient, private utilsService: UtilsService, @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,private message: NzMessageService,private route: ActivatedRoute,private modalSrv: NzModalService,private zone: NgZone,private router:Router,private activatedRoute: ActivatedRoute,private changeDetectorRefs:ChangeDetectorRef) {

    }

    ngOnInit(){
        let u = navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        if(isAndroid){
            try{
                this.programValue = window['JSObject'].GetData("PlayProgramEvent", "");
            }catch(exception){
            }
            this.newInit();
        }

    }


    newInit(){

        let programValueObj = JSON.parse(this.programValue);
        if(programValueObj.url !=null && programValueObj.url!="") {
            this.mainContentUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(programValueObj.url); ;
            this.mainContentWidth = programValueObj.width;
            this.mainContentHeight = programValueObj.height;
            this.isPadDesign = true;
        }else{
            let tempData = this.programValue.replace(/http:\\\/\\\/192.168.2.235:8090\\\/file\\\/file\\\/download\?filename=hall\\\//g,'file:///sdcard/CashwayAd/');
            programValueObj =JSON.parse(tempData);
            this.isPadDesign = false;
        }
        let subtitleList = programValueObj.subtitleList;
        this.schema = programValueObj.schema;
        this.data = programValueObj.data;


        //字幕
        if(subtitleList!=null){
            for(let i=0;i<subtitleList.length;i++){
                subtitleList[i]['coordinateX'] = subtitleList[i]['coordinateX']+'px';
                subtitleList[i]['coordinateY'] = subtitleList[i]['coordinateY']+'px';
            }
            this.fontData = subtitleList;
        }
    }

    playPrograme(modules_detail_array,key){
        if(modules_detail_array.length == 0 )return;
        if(modules_detail_array.length <= key){
            this.ngOnInit();
            return;
        }
        let interval = modules_detail_array[key]["interval"];
        let modulesId = modules_detail_array[key]["modulesId"];
        this.http.get(environment.gateway_server_url + "/hall/publish_subtitle/publishSubtitles/list?screenId="+this.screenId+"&programId="+modulesId).subscribe((res: any) => {

            console.log("文字=========="+res.rows);
            if(res.rows!=null){
                for(let i=0;i<res.rows.length;i++){
                    res.rows[i]['coordinateX'] = res.rows[i]['coordinateX']+'px';
                    res.rows[i]['coordinateY'] = res.rows[i]['coordinateY']+'px';
                }
            }
            this.fontData = res.rows;
            this.http.get(environment.runtime_server_url + "/customer-page/init/" + modulesId).subscribe((res: any) => {
                this.schema = res.schema;
                this.data = res.data;
                if(res.url !=null && res.url!=""){
                    this.isPadDesign = true;
                    this.mainContentUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(res.url); ;
                }else{
                    this.isPadDesign = false;
                }

                let intervalInt = parseInt(interval);
                if(interval !=null && interval!="" && interval!="null"){
                    setTimeout(() => {
                        key = key+1;
                        this.playPrograme(modules_detail_array, key);
                    }, intervalInt*1000*60);
                }
            })
        });


    }

}
