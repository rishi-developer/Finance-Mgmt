import { MandateSipTableComponent } from './broker-transactions/mandate-sip/mandate-sip-table/mandate-sip-table.component';
import { BrokerOnboardingComponent } from './broker-admin/broker-onboarding/broker-onboarding.component';
import { AdvisoryDashboardComponent } from './broker-advisory/advisory-dashboard/advisory-dashboard.component';
import { TransactionReportComponent } from './reports/transaction-report/transaction-report.component';
import { AdvisorClientPortfolioDashboardComponent } from '../../shared/advisor-client-portfolio-module/advisor-client-portfolio-dashboard/advisor-client-portfolio-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/AuthGuard/auth.guard';
import { BrokerDashboardComponent } from './broker-dashboard/broker-dashboard.component';
import { AdvisoryClientListComponent } from './broker-dashboard/list-of-clients/advisory-client-list/advisory-client-list.component';
import { BrokerClientPortfolioDashboardComponent } from 'src/app/shared/broker-client-portfolio-module/broker-client-portfolio-dashboard/broker-client-portfolio-dashboard.component';
import { BrokerFreshTransactionComponent } from './broker-transactions/broker-fresh-transaction/broker-fresh-transaction.component';
import { BrokerFreshTransactionStpSwpComponent } from './broker-transactions/broker-fresh-transaction-stp-swp/broker-fresh-transaction-stp-swp.component';
import { TransactionReportViewComponent } from './reports/transaction-report-view/transaction-report-view.component';
import { AdvisoryFundListComponent } from './broker-advisory/advisory-fund-list/advisory-fund-list.component';
import { BrokerAdminDashboardComponent } from './broker-admin/broker-admin-dashboard/broker-admin-dashboard.component';
import { ReportComponent } from './reports/report.component';
import { RmProfileDashboardComponent } from '../relationship-manager/rm-profile-view/rm-profile-dashboard/rm-profile-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: BrokerAdminDashboardComponent
  },
  {
    path : 'reports', canActivate : [AuthGuard],
    component:ReportComponent
  },
  {
    path: 'broker-onboarding', canActivate: [AuthGuard],
    component: BrokerOnboardingComponent
  },
  {
    path: 'advisor-client-portfolio/:id/:role', canActivate: [AuthGuard],
    component: AdvisorClientPortfolioDashboardComponent
  },
  {
    path: 'broker-client-portfolio/:id', canActivate: [AuthGuard],
    component: BrokerClientPortfolioDashboardComponent
  },
  {
    path: 'fresh/transaction/:selectedAction', canActivate: [AuthGuard],
    component: BrokerFreshTransactionComponent
  },
  {
    path: 'fresh/transaction/STP-SWP/:selectedAction', canActivate: [AuthGuard],
    component: BrokerFreshTransactionStpSwpComponent
  },
  {
    path: 'advisory', canActivate: [AuthGuard],
    component: AdvisoryDashboardComponent
  },
  {
    path: 'advisory-fund-list', canActivate: [AuthGuard],
    component: AdvisoryFundListComponent
  },
  {
    path: 'mandate', canActivate: [AuthGuard],
    component: MandateSipTableComponent
  },
  {
    path: 'profile/:rmUserId', canActivate: [AuthGuard],
    component: RmProfileDashboardComponent
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrokerRoutingModule { }
