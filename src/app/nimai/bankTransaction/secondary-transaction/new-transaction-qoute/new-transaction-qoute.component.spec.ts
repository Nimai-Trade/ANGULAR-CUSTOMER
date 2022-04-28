import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTransactionQouteComponent } from './new-transaction-qoute.component';

describe('NewTransactionQouteComponent', () => {
  let component: NewTransactionQouteComponent;
  let fixture: ComponentFixture<NewTransactionQouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTransactionQouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTransactionQouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
