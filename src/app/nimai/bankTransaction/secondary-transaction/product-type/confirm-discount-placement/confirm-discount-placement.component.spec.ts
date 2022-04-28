import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDiscountPlacementComponent } from './confirm-discount-placement.component';

describe('ConfirmDiscountPlacementComponent', () => {
  let component: ConfirmDiscountPlacementComponent;
  let fixture: ComponentFixture<ConfirmDiscountPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDiscountPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDiscountPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
