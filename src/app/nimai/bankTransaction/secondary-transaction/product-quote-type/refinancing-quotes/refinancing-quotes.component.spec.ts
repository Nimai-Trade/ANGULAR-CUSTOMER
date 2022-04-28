import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefinancingQuotesComponent } from './refinancing-quotes.component';

describe('RefinancingQuotesComponent', () => {
  let component: RefinancingQuotesComponent;
  let fixture: ComponentFixture<RefinancingQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefinancingQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefinancingQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
