import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineConfigTemplateComponent } from './online-config-template.component';

describe('SimpleProgram', () => {
  let component: OnlineConfigTemplateComponent;
  let fixture: ComponentFixture<OnlineConfigTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineConfigTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineConfigTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
