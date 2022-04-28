import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankGuaranteeQuotesComponent } from './bank-guarantee-quotes.component';

describe('BankGuaranteeQuotesComponent', () => {
  let component: BankGuaranteeQuotesComponent;
  let fixture: ComponentFixture<BankGuaranteeQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankGuaranteeQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankGuaranteeQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
