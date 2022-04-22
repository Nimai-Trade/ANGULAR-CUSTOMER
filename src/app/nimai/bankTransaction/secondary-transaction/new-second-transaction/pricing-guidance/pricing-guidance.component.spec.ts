import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingGuidanceComponent } from './pricing-guidance.component';

describe('PricingGuidanceComponent', () => {
  let component: PricingGuidanceComponent;
  let fixture: ComponentFixture<PricingGuidanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingGuidanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingGuidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
