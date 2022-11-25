import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import { Validators } from '@angular/forms';

import { FieldConfig } from './models/field-config.interface';
import { DynamicFormComponent } from './containers/dynamic-form/dynamic-form.component';
import {_HttpClient} from "@delon/theme";

@Component({
  selector: 'dynamic-form-model',
  styleUrls: ['form-model.component.less'],
  template: `
    <div class="app">
      <dynamic-form
        [config]="config"
        #form="dynamicForm"
        (submit)="submit($event)">
      </dynamic-form>
    </div>
  `
})



export class FormModelComponent implements AfterViewInit,OnInit {
  @ViewChild(DynamicFormComponent,{static:false}) form: DynamicFormComponent;

  constructor(private http: _HttpClient) {};

  config: FieldConfig[] = [
    // {
    //   type: 'input',
    //   label: 'Full name',
    //   name: 'name',
    //   placeholder: 'Enter your name',
    //   validation: [Validators.required, Validators.minLength(4)]
    // },
    // {
    //   type: 'select',
    //   label: 'Favourite Food',
    //   name: 'food',
    //   options: ['Pizza', 'Hot Dogs', 'Knakworstje', 'Coffee'],
    //   placeholder: 'Select an option',
    //   validation: [Validators.required]
    // },
    // {
    //   label: 'Submit',
    //   name: 'submit',
    //   type: 'button'
    // }
  ];
  ngOnInit() {
      this.http.get("assets/dynamicTest/dynamicForm.json").subscribe((res: any) =>
        {
          this.config = res;
        }
      );
  }
  ngAfterViewInit() {
    let previousValid = this.form.valid;
    this.form.changes.subscribe(() => {
      if (this.form.valid !== previousValid) {
        previousValid = this.form.valid;
        this.form.setDisabled('submit', !previousValid);
      }
    });

    this.form.setDisabled('submit', true);
    this.form.setValue('name', 'Todd Motto');
  }

  submit(value: {[name: string]: any}) {
    console.log(value);
    alert(JSON.stringify(value));
  }
}
