import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankerPlacementComponent } from './banker-placement.component';

describe('BankerPlacementComponent', () => {
  let component: BankerPlacementComponent;
  let fixture: ComponentFixture<BankerPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankerPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankerPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
