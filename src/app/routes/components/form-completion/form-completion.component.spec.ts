import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCompletionComponent } from './form-completion.component';

describe('FormCompletionComponent', () => {
  let component: FormCompletionComponent;
  let fixture: ComponentFixture<FormCompletionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCompletionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
