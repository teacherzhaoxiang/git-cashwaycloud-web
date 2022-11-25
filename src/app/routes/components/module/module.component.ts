import { Component, OnInit } from '@angular/core';
import { NzModalRef} from "ng-zorro-antd";

@Component({
  selector: 'module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {

  constructor(private modal: NzModalRef) { }

  ngOnInit() {
  }
  close() {
    this.modal.destroy();
  }
}
