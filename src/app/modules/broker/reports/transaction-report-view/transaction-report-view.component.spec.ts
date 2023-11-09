import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionReportViewComponent } from './transaction-report-view.component';

describe('TransactionReportViewComponent', () => {
  let component: TransactionReportViewComponent;
  let fixture: ComponentFixture<TransactionReportViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionReportViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
