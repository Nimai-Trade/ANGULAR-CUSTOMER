import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondTransactionDetailsComponent } from './second-transaction-details.component';

describe('SecondTransactionDetailsComponent', () => {
  let component: SecondTransactionDetailsComponent;
  let fixture: ComponentFixture<SecondTransactionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondTransactionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
