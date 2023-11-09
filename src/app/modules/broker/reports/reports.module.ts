import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionReportComponent } from './transaction-report/transaction-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TransactionReportViewComponent } from './transaction-report-view/transaction-report-view.component';
import { PortfolioValuationReportComponent } from './portfolio-valuation-report/portfolio-valuation-report.component';
import { CapitalGainRealizedReportComponent } from './capital-gain-realized-report/capital-gain-realized-report.component';
import { PortfolioPerformanceReportComponent } from './portfolio-performance-report/portfolio-performance-report.component';
import { CapitalGainUnrealizedReportComponent } from './capital-gain-unrealized-report/capital-gain-unrealized-report.component';
import { ReportsRoutingModule } from './reports.routing.module';
import { ReportComponent } from './report.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { PorfolioValuationSummaryReportComponent } from './portfolio-valuation-report/porfolio-valuation-summary-report/porfolio-valuation-summary-report.component';
import { PortfolioValuationDetailedReportComponent } from './portfolio-valuation-report/portfolio-valuation-detailed-report/portfolio-valuation-detailed-report.component';
import { TransactionSummaryReportComponent } from './transactions/transaction-summary-report/transaction-summary-report.component';
import { CapitalGainSummaryReportComponent } from './capital-gain-realized-report/capital-gain-summary-report/capital-gain-summary-report.component';
import { CapitalGainDetailedReportComponent } from './capital-gain-realized-report/capital-gain-detailed-report/capital-gain-detailed-report.component';


@NgModule({
  declarations: [
    TransactionReportComponent,
    TransactionReportViewComponent,
    PortfolioValuationReportComponent,
    CapitalGainRealizedReportComponent,
    PortfolioPerformanceReportComponent,
    CapitalGainUnrealizedReportComponent,
    TransactionsComponent,
    PorfolioValuationSummaryReportComponent,
    ReportComponent,
    PortfolioValuationDetailedReportComponent,
    TransactionSummaryReportComponent,
    CapitalGainSummaryReportComponent,
    CapitalGainDetailedReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
