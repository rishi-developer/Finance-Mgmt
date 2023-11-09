import { BrokerDetailsViewComponent } from './broker-details-view/broker-details-view.component';
import { BrokerClientPortfolioDashboardComponent } from './broker-client-portfolio-module/broker-client-portfolio-dashboard/broker-client-portfolio-dashboard.component';
import { AdvisorClientPortfolioDashboardComponent } from './advisor-client-portfolio-module/advisor-client-portfolio-dashboard/advisor-client-portfolio-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/AuthGuard/auth.guard';
import { BrokerAdditionalTransactionComponent } from '../modules/broker/broker-transactions/broker-additional-transaction/broker-additional-transaction.component';
import { BrokerFreshTransactionComponent } from '../modules/broker/broker-transactions/broker-fresh-transaction/broker-fresh-transaction.component';
import { RiskProfileComponent } from './risk-profile/risk-profile.component';
import { RiskProfileResultComponent } from './risk-profile-result/risk-profile-result.component';
import { BrokerClientRiskProfileComponentComponent } from './broker-client-portfolio-module/broker-client-risk-profile-component/broker-client-risk-profile-component.component';
const routes: Routes = [
  {
    path: 'advisor-client-portfolio/:id/:role' ,canActivate: [AuthGuard],
    component: AdvisorClientPortfolioDashboardComponent
  },
  {
    path: 'broker-client-portfolio/:id/:role', canActivate: [AuthGuard],
    component: BrokerClientPortfolioDashboardComponent
  },
  {
    path:'broker-details/:id/:role',
    component:BrokerDetailsViewComponent
  },
  {
    path:'transaction/:selectedAction',
    component:BrokerAdditionalTransactionComponent
  },
  {
    path:'risk-profile',
    component:RiskProfileComponent
  },
  {
    path:'risk-profile-result',
    component:RiskProfileResultComponent
  },
  {
    path: 'broker-client-risk-profile-component',
    component: BrokerClientRiskProfileComponentComponent
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
