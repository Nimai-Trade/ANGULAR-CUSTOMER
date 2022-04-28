import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountingPlacementComponent } from './discounting-placement.component';

describe('DiscountingPlacementComponent', () => {
  let component: DiscountingPlacementComponent;
  let fixture: ComponentFixture<DiscountingPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountingPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountingPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
