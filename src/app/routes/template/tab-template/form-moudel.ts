import { Component, OnInit,OnDestroy,ViewChild } from '@angular/core';
import {ActivatedRoute, Params,Router} from "@angular/router";
import {environment} from "@env/environment";
import {_HttpClient} from "@delon/theme";

@Component({
  selector: 'app-form-moudel',
  template: `
    <!--<my-sf></my-sf>-->
  `,
  styles: [ `
  `]
})
export class FormMoudelComponent implements OnInit,OnDestroy {

  constructor() { }
  ngOnInit() {

  }
  ngOnDestroy(): void {
  }

}
