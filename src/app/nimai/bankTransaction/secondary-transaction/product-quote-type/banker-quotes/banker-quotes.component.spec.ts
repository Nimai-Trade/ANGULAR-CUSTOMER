import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankerQuotesComponent } from './banker-quotes.component';

describe('BankerQuotesComponent', () => {
  let component: BankerQuotesComponent;
  let fixture: ComponentFixture<BankerQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankerQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankerQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
