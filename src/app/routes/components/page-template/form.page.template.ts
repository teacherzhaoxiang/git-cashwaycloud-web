import {Component, Inject, Input, OnInit, Renderer2} from "@angular/core";
import {environment} from "@env/environment";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {_HttpClient, TitleService} from "@delon/theme";
import {NzDrawerService, NzMessageService, NzModalService} from "ng-zorro-antd";
import {DOCUMENT} from "@angular/common";
import {UserService} from "../../service/user.service";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {EventService} from "@shared/event/event.service";

@Component({
    selector: `cashway-form-page`,
    template: `        
        <div >
            <cashway-edit-form #editForm
                               [id]="id"
                               [initUri]="record"
            ></cashway-edit-form>
        </div>
        `,
    styles:[`        
    `]
})

export class FormPageTemplate implements OnInit {
    id:string="";
  record = '';
    constructor(private http: _HttpClient,private message: NzMessageService, private route: ActivatedRoute,private eventService: EventService) {}

    formInit(){

    }
    ngOnInit(): void {
        console.log("form~~~~~~~~")
        this.route.params
            .subscribe((params: Params) => {
                this.id = params['id'];
                this.formInit();
            })
    }

}