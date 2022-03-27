import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveSecondTransactionComponent } from './active-second-transaction.component';

describe('ActiveSecondTransactionComponent', () => {
  let component: ActiveSecondTransactionComponent;
  let fixture: ComponentFixture<ActiveSecondTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveSecondTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveSecondTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
