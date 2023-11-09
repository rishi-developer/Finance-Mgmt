import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorClientHoldingsTableComponent } from './advisor-client-holdings-table.component';

describe('AdvisorClientHoldingsTableComponent', () => {
  let component: AdvisorClientHoldingsTableComponent;
  let fixture: ComponentFixture<AdvisorClientHoldingsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisorClientHoldingsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorClientHoldingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
