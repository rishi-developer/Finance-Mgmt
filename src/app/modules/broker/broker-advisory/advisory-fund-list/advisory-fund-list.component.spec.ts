import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoryFundListComponent } from './advisory-fund-list.component';

describe('AdvisoryFundListComponent', () => {
  let component: AdvisoryFundListComponent;
  let fixture: ComponentFixture<AdvisoryFundListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisoryFundListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisoryFundListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
