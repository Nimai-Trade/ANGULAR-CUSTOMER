import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankGuaranteePlacementComponent } from './bank-guarantee-placement.component';

describe('BankGuaranteePlacementComponent', () => {
  let component: BankGuaranteePlacementComponent;
  let fixture: ComponentFixture<BankGuaranteePlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankGuaranteePlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankGuaranteePlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
