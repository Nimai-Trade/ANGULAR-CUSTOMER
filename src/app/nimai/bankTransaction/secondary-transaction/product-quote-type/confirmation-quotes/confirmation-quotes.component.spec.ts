import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationQuotesComponent } from './confirmation-quotes.component';

describe('ConfirmationQuotesComponent', () => {
  let component: ConfirmationQuotesComponent;
  let fixture: ComponentFixture<ConfirmationQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
