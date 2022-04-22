import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantBenficiarySecondaryComponent } from './applicant-benficiary-secondary.component';

describe('ApplicantBenficiarySecondaryComponent', () => {
  let component: ApplicantBenficiarySecondaryComponent;
  let fixture: ComponentFixture<ApplicantBenficiarySecondaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantBenficiarySecondaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantBenficiarySecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
