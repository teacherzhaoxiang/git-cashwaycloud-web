import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleProgram } from './simple-program.component';

describe('SimpleProgram', () => {
  let component: SimpleProgram;
  let fixture: ComponentFixture<SimpleProgram>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleProgram ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleProgram);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
