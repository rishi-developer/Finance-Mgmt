import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerAdminDashboardComponent } from './broker-admin-dashboard.component';

describe('BrokerAdminDashboardComponent', () => {
  let component: BrokerAdminDashboardComponent;
  let fixture: ComponentFixture<BrokerAdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerAdminDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
