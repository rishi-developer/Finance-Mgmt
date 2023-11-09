import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/AuthGuard/auth.guard';
import { CapitalGainDetailedReportComponent } from './capital-gain-realized-report/capital-gain-detailed-report/capital-gain-detailed-report.component';
import { CapitalGainRealizedReportComponent } from './capital-gain-realized-report/capital-gain-realized-report.component';
import { CapitalGainSummaryReportComponent } from './capital-gain-realized-report/capital-gain-summary-report/capital-gain-summary-report.component';
import { CapitalGainUnrealizedReportComponent } from './capital-gain-unrealized-report/capital-gain-unrealized-report.component';
import { PortfolioPerformanceReportComponent } from './portfolio-performance-report/portfolio-performance-report.component';
import { PorfolioValuationSummaryReportComponent } from './portfolio-valuation-report/porfolio-valuation-summary-report/porfolio-valuation-summary-report.component';
import { PortfolioValuationDetailedReportComponent } from './portfolio-valuation-report/portfolio-valuation-detailed-report/portfolio-valuation-detailed-report.component';
import { PortfolioValuationReportComponent } from './portfolio-valuation-report/portfolio-valuation-report.component';
import { ReportComponent } from './report.component';
import { TransactionReportViewComponent } from './transaction-report-view/transaction-report-view.component';
import { TransactionReportComponent } from './transaction-report/transaction-report.component';
import { TransactionSummaryReportComponent } from './transactions/transaction-summary-report/transaction-summary-report.component';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
  {
    path: 'reports',
    component: ReportComponent,
    canActivate: [AuthGuard],
    children : [
      {
        path:'transactions' , canActivate: [AuthGuard],
        component:TransactionsComponent
      },
      {
        path:'transaction-report' , canActivate: [AuthGuard],
        component:TransactionReportComponent
      },
      {
        path:'transaction-report-view' , canActivate: [AuthGuard],
        component:TransactionReportViewComponent
      },
      {
        path:'portfolio-valuation-report' , canActivate: [AuthGuard],
        component:PortfolioValuationReportComponent,
      },
     
      {
        path:'capital-gain-realized-report' , canActivate: [AuthGuard],
        component:CapitalGainRealizedReportComponent,
      },
      {
        path:'portfolio-performace-report' , canActivate: [AuthGuard],
        component:PortfolioPerformanceReportComponent
      },
      {
        path:'capital-gain-unrealized-report' , canActivate: [AuthGuard],
        component:CapitalGainUnrealizedReportComponent
      }
    ]
  },
  {
    path:'portfolio-valuation-summary-report',
    component:PorfolioValuationSummaryReportComponent
  },
  {
    path:'portfolio-valuation-detail-report',
    component:PortfolioValuationDetailedReportComponent
  },
  {
    path:'capital-gain-detailed-report',
    component:CapitalGainDetailedReportComponent
  },
  {
    path:'capital-gain-summary-report',
    component:CapitalGainSummaryReportComponent
  },
  {
    path :'transaction-summary-report',
    component:TransactionSummaryReportComponent
  },
  

   
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ReportsRoutingModule { }