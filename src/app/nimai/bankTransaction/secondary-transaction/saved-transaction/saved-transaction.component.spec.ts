import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedTransactionComponent } from './saved-transaction.component';

describe('SavedTransactionComponent', () => {
  let component: SavedTransactionComponent;
  let fixture: ComponentFixture<SavedTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
