import { ClientOnboardingComponent } from './client-onboarding/client-onboarding.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/AuthGuard/auth.guard';
import { ClientEditDetailsComponent } from './client-edit-details/client-edit-details.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { PortfolioProfileTabComponent } from 'src/app/shared/portfolio-profile-tab/portfolio-profile-tab.component';
import { BrokerClientHoldingsTableComponent } from 'src/app/shared/broker-client-portfolio-module/broker-client-holdings-table/broker-client-holdings-table.component';
import { BrokerClientTransactionsTableComponent } from 'src/app/shared/broker-client-portfolio-module/broker-client-transactions-table/broker-client-transactions-table.component';
import { BrokerClientRiskProfileComponentComponent } from 'src/app/shared/broker-client-portfolio-module/broker-client-risk-profile-component/broker-client-risk-profile-component.component';
import { RiskProfileResultComponent } from 'src/app/shared/risk-profile-result/risk-profile-result.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: ClientDashboardComponent,
  },

  {
    path: 'client-onboarding',
    canActivate: [AuthGuard],
    component: ClientOnboardingComponent,
  },

  {
    path: 'edit-details/:id',
    canActivate: [AuthGuard],
    component: ClientEditDetailsComponent,
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: PortfolioProfileTabComponent,
  },
  {
    path: 'holdings',
    canActivate: [AuthGuard],
    component: BrokerClientHoldingsTableComponent,
  },

  {
    path: 'transactions',
    canActivate: [AuthGuard],
    component: BrokerClientTransactionsTableComponent,
  },

  {
    path: 'riskprofile',
    canActivate: [AuthGuard],
    component: BrokerClientRiskProfileComponentComponent,
  },
  {
    path: 'riskprofileresult',
    canActivate: [AuthGuard],
    component: RiskProfileResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
