import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecentAdviceTableComponent } from './recent-advice-table/recent-advice-table.component';
import { AdvisorClientHoldingsTableComponent } from './advisor-client-holdings-table/advisor-client-holdings-table.component';
import { AdvisorClientPortfolioDashboardComponent } from './advisor-client-portfolio-dashboard/advisor-client-portfolio-dashboard.component';

@NgModule({
  declarations: [
    RecentAdviceTableComponent,
    AdvisorClientHoldingsTableComponent,
    AdvisorClientPortfolioDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AdvisorClientPortfolioModuleModule { }
