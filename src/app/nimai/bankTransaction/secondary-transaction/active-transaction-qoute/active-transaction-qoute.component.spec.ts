import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTransactionQouteComponent } from './active-transaction-qoute.component';

describe('ActiveTransactionQouteComponent', () => {
  let component: ActiveTransactionQouteComponent;
  let fixture: ComponentFixture<ActiveTransactionQouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveTransactionQouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveTransactionQouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
