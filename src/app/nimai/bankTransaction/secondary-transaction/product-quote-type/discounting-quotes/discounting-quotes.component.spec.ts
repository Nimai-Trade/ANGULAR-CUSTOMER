import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountingQuotesComponent } from './discounting-quotes.component';

describe('DiscountingQuotesComponent', () => {
  let component: DiscountingQuotesComponent;
  let fixture: ComponentFixture<DiscountingQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountingQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountingQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
