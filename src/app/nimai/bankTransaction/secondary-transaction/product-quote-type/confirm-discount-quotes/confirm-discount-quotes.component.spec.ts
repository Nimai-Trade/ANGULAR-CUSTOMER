import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDiscountQuotesComponent } from './confirm-discount-quotes.component';

describe('ConfirmDiscountQuotesComponent', () => {
  let component: ConfirmDiscountQuotesComponent;
  let fixture: ComponentFixture<ConfirmDiscountQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDiscountQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDiscountQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
