import {Component, Input, OnInit, ViewChild} from '@angular/core';
@Component({
    selector: `app-show-home-labels`,
    template: `
        <div *ngFor="let num of _nums" class="spanDiv">
            <span class="spanLable">{{num}}</span>
        </div>
    `,
    styles:[`
        .spanLable{
            font-size: 18px;
            color: white;
        }
        
        .spanDiv{
            width: 38px;
            float: left;
            margin-top: 17px;
        }
    `],
})
export class ShowStatisticComponent implements OnInit{
    _nums:string[] ;

    @Input()
    get nums(){
        return this._nums;
    }

    set nums(value) {
        this._nums = value;
    }
    ngOnInit(){
        console.log("111");
    }
}
