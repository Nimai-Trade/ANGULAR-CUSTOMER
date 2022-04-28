import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDetailQouteComponent } from './transaction-detail-qoute.component';

describe('TransactionDetailQouteComponent', () => {
  let component: TransactionDetailQouteComponent;
  let fixture: ComponentFixture<TransactionDetailQouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionDetailQouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailQouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
