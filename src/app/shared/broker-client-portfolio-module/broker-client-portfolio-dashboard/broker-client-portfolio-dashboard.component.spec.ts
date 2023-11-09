import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerClientPortfolioDashboardComponent } from './broker-client-portfolio-dashboard.component';

describe('BrokerClientPortfolioDashboardComponent', () => {
  let component: BrokerClientPortfolioDashboardComponent;
  let fixture: ComponentFixture<BrokerClientPortfolioDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerClientPortfolioDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerClientPortfolioDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
