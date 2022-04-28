import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedTransactionQouteComponent } from './saved-transaction-qoute.component';

describe('SavedTransactionQouteComponent', () => {
  let component: SavedTransactionQouteComponent;
  let fixture: ComponentFixture<SavedTransactionQouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedTransactionQouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedTransactionQouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
