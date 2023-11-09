import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmProfileDashboardComponent } from './rm-profile-dashboard.component';

describe('RmProfileDashboardComponent', () => {
  let component: RmProfileDashboardComponent;
  let fixture: ComponentFixture<RmProfileDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmProfileDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmProfileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
