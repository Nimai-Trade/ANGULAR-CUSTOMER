import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvalisationComponent } from './avalisation.component';

describe('AvalisationComponent', () => {
  let component: AvalisationComponent;
  let fixture: ComponentFixture<AvalisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvalisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvalisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
