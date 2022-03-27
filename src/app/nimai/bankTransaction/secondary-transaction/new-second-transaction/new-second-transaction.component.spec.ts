import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSecondTransactionComponent } from './new-second-transaction.component';

describe('NewSecondTransactionComponent', () => {
  let component: NewSecondTransactionComponent;
  let fixture: ComponentFixture<NewSecondTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSecondTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSecondTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
