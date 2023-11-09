import { BrokerTransactionsModule } from './broker-transactions/broker-transactions.module';
import { NgModule } from '@angular/core';
import { BrokerDashboardComponent } from './broker-dashboard/broker-dashboard.component';
import { BrokerRoutingModule } from './broker.routing.module';
import { AdvisoryClientListComponent } from './broker-dashboard/list-of-clients/advisory-client-list/advisory-client-list.component';
import { BrokerClientListComponent } from './broker-dashboard/list-of-clients/broker-client-list/broker-client-list/broker-client-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BseCredentialModalComponent } from './bse-modal/bse-credential-modal/bse-credential-modal.component';
import { BseCredentialConfirmationModalComponent } from './bse-modal/bse-credential-confirmation-modal/bse-credential-confirmation-modal.component';
import { ReportsModule } from './reports/reports.module';
import { AdvisoryDashboardComponent } from './broker-advisory/advisory-dashboard/advisory-dashboard.component';
import { AdvisoryFundListComponent } from './broker-advisory/advisory-fund-list/advisory-fund-list.component';
import { BrokerAdminDashboardComponent } from './broker-admin/broker-admin-dashboard/broker-admin-dashboard.component';
import { ListOfClientsComponent } from './broker-admin/list-of-clients/list-of-clients.component';
import { ListOfRMComponent } from './broker-admin/list-of-rm/list-of-rm.component';
import { InviteRMModalComponent } from './broker-admin/invite-rm-modal/invite-rm-modal.component';
import { BrokerOnboardingComponent } from './broker-admin/broker-onboarding/broker-onboarding.component';
import { CapitalGainRealizedReportComponent } from './reports/capital-gain-realized-report/capital-gain-realized-report.component';
import { PortfolioPerformanceReportComponent } from './reports/portfolio-performance-report/portfolio-performance-report.component';
import { CapitalGainUnrealizedReportComponent } from './reports/capital-gain-unrealized-report/capital-gain-unrealized-report.component';
import { ListOfRequestsComponent } from './broker-admin/list-of-requests/list-of-requests.component';
@NgModule({
  declarations: [
    BrokerDashboardComponent,
    AdvisoryClientListComponent,
    BrokerClientListComponent,
    BseCredentialModalComponent,
    BseCredentialConfirmationModalComponent,
    AdvisoryDashboardComponent,
    AdvisoryFundListComponent,
    BrokerAdminDashboardComponent,
    ListOfClientsComponent,
    ListOfRMComponent,
    InviteRMModalComponent,
    BrokerOnboardingComponent,
    ListOfRequestsComponent,
    
  ],
  imports: [
    SharedModule,
    BrokerRoutingModule,
    BrokerTransactionsModule,
    ReportsModule
  ]
})
export class BrokerModule { }
