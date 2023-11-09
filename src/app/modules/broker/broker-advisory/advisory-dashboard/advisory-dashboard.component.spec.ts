import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoryDashboardComponent } from './advisory-dashboard.component';

describe('AdvisoryDashboardComponent', () => {
  let component: AdvisoryDashboardComponent;
  let fixture: ComponentFixture<AdvisoryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisoryDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisoryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
