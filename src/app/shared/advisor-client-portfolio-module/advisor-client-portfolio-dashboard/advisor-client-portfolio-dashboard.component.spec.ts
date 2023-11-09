import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorClientPortfolioDashboardComponent } from './advisor-client-portfolio-dashboard.component';

describe('AdvisorClientPortfolioDashboardComponent', () => {
  let component: AdvisorClientPortfolioDashboardComponent;
  let fixture: ComponentFixture<AdvisorClientPortfolioDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisorClientPortfolioDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorClientPortfolioDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
