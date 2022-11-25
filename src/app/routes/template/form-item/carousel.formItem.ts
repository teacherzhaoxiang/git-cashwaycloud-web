import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    Component,
    DoCheck,
    OnChanges,
    OnInit,
    SimpleChanges, ViewChild
} from '@angular/core';
import { ControlWidget } from '@delon/form';
import {NzCardComponent, NzCarouselComponent} from "ng-zorro-antd";
declare var $:any;
declare var $JssorThumbnailNavigator$:any;
declare var Carousel:any;
@Component({
    selector: 'nz-demo-carousel-autoplay',
    template: `
        <nz-carousel #nc id="nc" style="display: none" [nzEffect]="playStyle" [style.width]="style.width" [style.height]="style.height" [nzDots]="false" >
            <div nz-carousel-content *ngFor="let index of arrayUrl">
                <img src="{{index}}" [style.width]="style.width" [style.height]="style.height"/>
            </div>
        </nz-carousel>

        
        <div class="shutter" style="display: none" >
            <div class="shutter-img" id="shutter-img">
                <!--<a onclick="javascript:void(0);"  *ngFor="let index of arrayUrl">-->
                <!--<img src="{{index}}" alt="#">-->
                <!--</a>-->
                <!---->
                <!--<a onclick="javascript:void(0);"  *ngFor="let index of arrayUrl">-->
                <!--<img src="assets/carousel/random/images/shutter_1.jpg" alt="#">-->
                <!--</a>-->
                <!--<a onclick="javascript:void(0);"><img src="http://192.168.0.115:8090/file/file/download?filename=hall/dc6532ca-cf65-4ef0-a414-202706e2c9a7.jpg" alt="#"></a>-->
                <!--<a onclick="javascript:void(0);"><img src="http://192.168.0.115:8090/file/file/download?filename=hall/320296db-c3ea-40b1-a83b-a7a9ad2c4a80.jpg" alt="#"></a>-->
                <!--<a onclick="javascript:void(0);"><img src="http://192.168.0.115:8090/file/file/download?filename=hall/e8efe8a1-4a9b-4dc7-8e83-0d5ae707eca1.jpg" alt="#"></a>-->
                <!--<a onclick="javascript:void(0);"><img src="http://192.168.0.115:8090/file/file/download?filename=hall/e79c0268-38bc-44c2-b462-cd8cc45b9202.jpg" alt="#"></a>-->

            </div>
            <ul  style="display:none;" class="shutter-btn">
                <li class="prev"></li>
                <li class="next"></li>
            </ul>
            <div style="display:none;" class="shutter-desc">
                <p>Iron Man</p>
            </div>
        </div>






        <div class="carousel content-main"  style="display: none;">
            <ul class="three-d-1-list">
          
            </ul>
        </div>
    `,
    styles  : [
            `
            * { margin: 0; padding: 0; }
            body { background-color: #333333; }
            img { border: 0; vertical-align: top; }
            ul, li { list-style: none; }

            .shutter {
                overflow: hidden;
                width: 1000px;
                height: 358px;
                position: relative;

            }
            .shutter-img {
                z-index: 1;
            }
            .shutter-img,
            .shutter-img a {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
            .shutter-img a {
                cursor: default;
            }
            .shutter-img a > img {
                width: 100%;
                height: 100%;
            }
            .shutter-img .created {
                overflow: hidden;
                position: absolute;
                z-index: 20;
            }
            .shutter-btn {}
            .shutter-btn li {
                position: absolute;
                z-index: 2;
                top: 50%;
                width: 49px;
                height: 49px;
                margin-top: -25px;
                cursor: pointer;
            }
            .shutter-btn li.prev {
                left: 20px;
                background: url(../images/shutter_prevBtn.png) no-repeat 0 -49px;
            }
            .shutter-btn li.next {
                right: 20px;
                background: url(../images/shutter_nextBtn.png) no-repeat 0 -49px;
            }
            .shutter-desc {
                position: absolute;
                z-index: 2;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 36px;
                background: url(../images/shutter_shadow.png) repeat;
            }
            .shutter-desc p {
                padding-left: 20px;
                line-height: 36px;
                color: #fff;
                font-size: 14px;
            }



            .carousel {
                
                -webkit-perspective: 500px;
                perspective: 500px;
                overflow: hidden;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                -ms-flex-direction: column;
                flex-direction: column;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
            }
            .carousel > * {
                -webkit-box-flex: 0;
                -ms-flex: 0 0 auto;
                flex: 0 0 auto;
            }
            .carousel figure {
                margin: 0;
                width: 40%;
                -webkit-transform-style: preserve-3d;
                transform-style: preserve-3d;
                -webkit-transition: -webkit-transform 0.5s;
                transition: -webkit-transform 0.5s;
                transition: transform 0.5s;
                transition: transform 0.5s, -webkit-transform 0.5s;
            }
            .carousel figure img {
                width: 100%;
                box-sizing: border-box;
                padding: 0 0px;
            }
            .carousel figure img:not(:first-of-type) {
                position: absolute;
                left: 0;
                top: 0;
            }
            .carousel nav {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                margin: 20px 0 0;
            }
            .carousel nav button {
                -webkit-box-flex: 0;
                -ms-flex: 0 0 auto;
                flex: 0 0 auto;
                margin: 0 5px;
                cursor: pointer;
                color: #333;
                background: none;
                border: 1px solid;
                letter-spacing: 1px;
                padding: 5px 10px;
            }



            
            .content-main ul{
                list-style: none;
            }
            .content-main a,img{
                width:100%;
                height:100%;
                display: block;
            }
            .content-main{ position: relative; width: 800px; height: 411px; background: #bbb9b9; margin-left: auto; margin-right: auto; margin-top: 50px; }
            .content-btn{
                position: absolute;
                width:100px;
                height:411px;
                background: rgba(150,150,150,0.5);
                z-index:10;
                cursor: pointer;
            }
            ::ng-deep .prev-btn{
                left:0;
                top:0;
                display:none;
            }
            ::ng-deep .next-btn{
                display:none;
                right:0;
                top:0;
            }
            .content-main .btn-img{
                display:none;
                opacity:0.8;
                display: block;
                position: absolute;
                left:0;
                top:50%;
                -webkit-transform: translateY(-50%);
                -moz-transform: translateY(-50%);
                -ms-transform: translateY(-50%);
                -o-transform: translateY(-50%);
                transform: translateY(-50%);
            }
            .content-main .three-d-1-list{
                width:800px;
                height:411px;
            }
            .content-main .three-d-1-list li{
                position: absolute;
                left:0;
                top:0;
                overflow: hidden;
            }

        `
    ]
})
export class CarouselFormItemWidget extends ControlWidget implements OnInit,AfterContentInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'carousel';

    arrayUrl;
    @ViewChild('nc',{ static: false })
    nc:NzCarouselComponent;
    loopNumber:number=0;
    style:any;
    shutterShow:any;
    threeDShow:any;
    nzCarouselShow:any = false;
    playStyle:string = 'scrollx';



    ngOnInit(): void {

        this.style = this.ui.style;
        this.arrayUrl = this.ui.arrayUrl;



        // console.log(this.arrayUrl);
        // $("#shutter-img").append("<a onclick='javascript:void(0);'><img src='http://192.168.0.115:8090/file/file/download?filename=hall/320296db-c3ea-40b1-a83b-a7a9ad2c4a80.jpg' alt='#'></a><a onclick='javascript:void(0);'><img src='http://192.168.0.115:8090/file/file/download?filename=hall/e8efe8a1-4a9b-4dc7-8e83-0d5ae707eca1.jpg' alt='#'></a><a onclick='javascript:void(0);'><img src='http://192.168.0.115:8090/file/file/download?filename=hall/e79c0268-38bc-44c2-b462-cd8cc45b9202.jpg' alt='#'></a>");
        // for(let i=0;i<this.arrayUrl.length;i++){
        //     $("#shutter-img").append("<a _ngcontent-c3=\"\" onclick=\"javascript:void(0);\"><img _ngcontent-c3=\"\" src=\""+this.arrayUrl[i]+"\" alt=\"#\"></a>");
        // }
        let tempHeight:any = this.ui.style.height.substring(0,this.ui.style.height.length-2);
        let tempWidth:any  = this.ui.style.width.substring(0,this.ui.style.width.length-2);
        let height:number = Number(tempHeight);
        let width:number = Number(tempWidth);
        // $('.shutter').shutter({
        //     shutterW: width, // 容器宽度
        //     shutterH: height, // 容器高度
        //     isAutoPlay: true, // 是否自动播放
        //     playInterval: 3000, // 自动播放时间
        //     //curDisplay: 1, // 当前显示页
        //     fullPage: false // 是否全屏展示
        // });

        //

        if(this.ui.carouselStyle == 1 || this.ui.carouselStyle == "1"){
            for(let i=0;i<this.arrayUrl.length;i++){
                $(".three-d-1-list").append("<li _ngcontent-c3=\"\"><img _ngcontent-c3=\"\" src=\""+this.arrayUrl[i]+"\"></li>");
            }

            let setting = { "width":width,"height":height*0.9,"postWidth":width*0.7,"postHeight":height*0.9,"autoPlay":true,"delay":new Number(this.ui.interval)};
            $(".carousel").css("display","").attr("data-setting",JSON.stringify(setting))
            $("body").css({"background":"#1D1D1D"});
            Carousel.init($(".carousel"))

        }else if(this.ui.carouselStyle == 0 || this.ui.carouselStyle == "0"){
            console.log("00000000002222222");
            // this.shutterShow = true;
            // for(let i=0;i<this.arrayUrl.length;i++){
            //     $("#shutter-img").append("<a _ngcontent-c3=\"\" onclick=\"javascript:void(0);\"><img _ngcontent-c3=\"\" src=\""+this.arrayUrl[i]+"\" alt=\"#\"></a>");
            // }
            // $('.shutter').css("display","").shutter({
            //     shutterW: width, // 容器宽度
            //     shutterH: height, // 容器高度
            //     isAutoPlay: true, // 是否自动播放
            //     playInterval: new Number(this.ui.interval), // 自动播放时间
            //     curDisplay: 1, // 当前显示页
            //     fullPage: false // 是否全屏展示
            // });
            this.playStyle = 'scrollx';
           $("#nc").css("display","");
           //this.nzCarouselShow = true;
        }else if(this.ui.carouselStyle == 2 || this.ui.carouselStyle == "2"){

            this.playStyle = 'fade';
            $("#nc").css("display","");
        }else{
            this.shutterShow = true;
            for(let i=0;i<this.arrayUrl.length;i++){
                $("#shutter-img").append("<a _ngcontent-c3=\"\" onclick=\"javascript:void(0);\"><img _ngcontent-c3=\"\" src=\""+this.arrayUrl[i]+"\" alt=\"#\"></a>");
            }
            $('.shutter').css("display","").shutter({
                shutterW: width, // 容器宽度
                shutterH: height, // 容器高度
                isAutoPlay: true, // 是否自动播放
                playInterval: new Number(this.ui.interval), // 自动播放时间
                curDisplay: 1, // 当前显示页
                fullPage: false // 是否全屏展示
            });
        }

        // let jssor_1_SlideshowTransitions = [];
        // for(let i=0;i<this.arrayUrl.length;i++){
        //     jssor_1_SlideshowTransitions.push({$Duration:1200,x:0.3,$During:{$Left:[0.3,0.7]},$Easing:"linear",$Opacity:2});
        // }
        // let jssor_1_options = {
        //     $AutoPlay: true,
        //     $Idle:3000,
        //     $SlideshowOptions: {
        //         $Transitions: jssor_1_SlideshowTransitions,
        //         $TransitionsOrder: 1
        //     },
        //
        //     $ThumbnailNavigatorOptions: {
        //         $Class: $JssorThumbnailNavigator$,
        //         $Cols: 10,
        //         $SpacingX: 8,
        //         $SpacingY: 8,
        //         $Align: 360
        //     }
        // };
        //
        //
        // var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);
        // var refSize = jssor_1_slider.$Elmt.parentNode.clientWidth;
        // if (refSize) {
        //     refSize = Math.min(refSize, 1920);
        //     jssor_1_slider.$ScaleWidth(refSize);
        //     jssor_1_slider.$ScaleHeight(1080);
        //
        //
        // }

       // for(let i=0;i<this.arrayUrl.length;i++){
       //       $(".three-d-1-list").append("<li _ngcontent-c3=\"\"><img _ngcontent-c3=\"\" src=\""+this.arrayUrl[i]+"\"></li>");
       //   }
       //
       //  let setting = { "width":width,"height":height*0.9,"postWidth":width*0.7,"postHeight":height*0.9,"autoPlay":true};
       //  $(".carousel").attr("data-setting",JSON.stringify(setting))
       //  $("body").css({"background":"#1D1D1D"});
       //  Carousel.init($(".carousel"))


        // setTimeout(function () {

        // },10000)

         this.detectChanges()


    }

    ngAfterContentInit():void{
        // let height:number = Number(this.ui.style.height);
        // let width:number = Number(this.ui.style.width);
        // $('.shutter').shutter({
        //     shutterW: width, // 容器宽度
        //     shutterH: height, // 容器高度
        //     isAutoPlay: true, // 是否自动播放
        //     playInterval: 3000, // 自动播放时间
        //     //curDisplay: 1, // 当前显示页
        //     fullPage: false // 是否全屏展示
        // });
    }
    ngAfterViewInit():void{

        setTimeout(()=> {
            this.loop();
        }, Number(this.ui.interval));

    }

    loop(){
        if(this.loopNumber!=0) {
            this.nc.next();
            this.detectChanges();
        }
        this.loopNumber=this.loopNumber+1;
        if(this.loopNumber>10000){
            this.loopNumber=1;
        }
        this.ngAfterViewInit();
    }

    // reset 可以更好的解决表单重置过程中所需要的新数据问题
    reset(value: string) {
    }


}
