import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationPlacementComponent } from './confirmation-placement.component';

describe('ConfirmationPlacementComponent', () => {
  let component: ConfirmationPlacementComponent;
  let fixture: ComponentFixture<ConfirmationPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
