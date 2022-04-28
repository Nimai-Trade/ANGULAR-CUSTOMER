import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefinancingPlacementComponent } from './refinancing-placement.component';

describe('RefinancingPlacementComponent', () => {
  let component: RefinancingPlacementComponent;
  let fixture: ComponentFixture<RefinancingPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefinancingPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefinancingPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
