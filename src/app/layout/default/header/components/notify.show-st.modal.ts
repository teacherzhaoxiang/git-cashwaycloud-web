import {
    ChangeDetectorRef,
    Component,
    DoCheck,
    EventEmitter,
    Input,
    NgZone,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {_HttpClient} from "@delon/theme";
import {STChange, STColumn, STComponent, STPage} from "@delon/abc";

@Component({
    selector: 'notify-show-table',
    template: `
    <nz-card>
      <st #st [data]="data"  [columns]="columns" [req]="{params: params}" [page]="page" [total]="total" (change)="tableChange($event)"></st>
    </nz-card>
  `

})
export class NotifyShowTableModalComponent implements OnInit{
    static readonly KEY = 'NotifyShowTable';
    @Input()
    columns: STColumn[] =  [];
    @Input()
    datas : any[];
    data:any
    @ViewChild('st',{static:true})
    st: STComponent;
    //查询条件绑定参数
    params: any = {};

    //数据总数
    total = 0;
    //分页参数
    page : STPage = {
        front:false,
        showQuickJumper:true,
        total:true,
        showSize:true
    }
    pageNumber:number = 1;
    pageSize : number = 10;
    //当前页
//绑定分页参数改变想要事件
    tableChange(e : STChange){
        if(e.type == 'pi' || e.type == 'ps'){
            this.pageNumber = e.pi;
            this.pageSize = e.ps
            this.getData();
        }
    }

    getData(){
        let dataTmp = [];
        this.datas.forEach((item,index)=>{
            if(index >= (this.pageNumber-1)*this.pageSize && index < this.pageNumber*this.pageSize){
                dataTmp.push(item);
            }
        })
        this.data = dataTmp;
    }

    constructor() {}

    ngOnInit() {
        console.log("show~~~~~~~~~~~~~~~~~")
        this.pageNumber = 1;
        this.pageSize = 10;
        this.getData();

    }

}
