import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSortModule } from '@angular/material/sort';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';

import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";

import { ListOfClientTabComponent } from './list-of-client-tab/list-of-client-tab.component';
import { SharedRoutingModule } from './shared.routing.module';
import { AdvisorClientPortfolioModuleModule } from './advisor-client-portfolio-module/advisor-client-portfolio-module.module';
import { ListOfBrokersTabComponent } from './list-of-brokers-tab/list-of-brokers-tab.component';
import { BrokerDetailsViewComponent } from './broker-details-view/broker-details-view.component';
import { AdvisoryClientBrokerTabComponent } from './advisory-client-broker-tab/advisory-client-broker-tab.component';
import { BrokerClientBrokerTabComponent } from './broker-client-broker-tab/broker-client-broker-tab.component';
import { PortfolioProfileTabComponent } from './portfolio-profile-tab/portfolio-profile-tab.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { RiskProfileComponent } from './risk-profile/risk-profile.component';
import { RiskProfileResultComponent } from './risk-profile-result/risk-profile-result.component';
import { UploadIPDMpdalComponent } from './upload-ipd-mpdal/upload-ipd-mpdal.component';
import { UpdatePasswordModalComponent } from './update-password-modal/update-password-modal.component';
import { UpdatePasswordOtpModalComponent } from './update-password-otp-modal/update-password-otp-modal.component';
import { UpdatePasswordConfirmationModalComponent } from './update-password-confirmation-modal/update-password-confirmation-modal.component';
import { ClientProfileOverviewComponent } from './client-profile-overview/client-profile-overview.component';
import { ClientPersonalDetailsComponent } from './client-personal-details/client-personal-details.component';
import { ClientCommunicationDetailsComponent } from './client-communication-details/client-communication-details.component';
import { ClientBankDetailsComponent } from './client-bank-details/client-bank-details.component';
import { GenerateReportModalComponent } from './generate-report-modal/generate-report-modal.component';
import { BrokerClientPortfolioDashboardComponent } from './broker-client-portfolio-module/broker-client-portfolio-dashboard/broker-client-portfolio-dashboard.component';
import { BrokerClientHoldingsTableComponent } from './broker-client-portfolio-module/broker-client-holdings-table/broker-client-holdings-table.component';
import { BrokerClientTransactionsTableComponent } from './broker-client-portfolio-module/broker-client-transactions-table/broker-client-transactions-table.component';
import { BrokerClientRiskProfileComponentComponent } from './broker-client-portfolio-module/broker-client-risk-profile-component/broker-client-risk-profile-component.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'primeng/chart';
import { RmProfileChangePasswordComponent } from '../modules/relationship-manager/rm-profile-view/rm-profile-change-password/rm-profile-change-password.component';
import { RequestRemarksModalComponentComponent } from './request-remarks-modal-component/request-remarks-modal-component.component';
@NgModule({
  declarations: [
    ListOfClientTabComponent,
    ListOfBrokersTabComponent,
    BrokerDetailsViewComponent,
    AdvisoryClientBrokerTabComponent,
    BrokerClientBrokerTabComponent,
    PortfolioProfileTabComponent,
    ConfirmationModalComponent,
    RiskProfileComponent,
    RiskProfileResultComponent,
    UploadIPDMpdalComponent,
    UpdatePasswordModalComponent,
    UpdatePasswordOtpModalComponent,
    UpdatePasswordConfirmationModalComponent,
    ClientProfileOverviewComponent,
    ClientPersonalDetailsComponent,
    ClientCommunicationDetailsComponent,
    ClientBankDetailsComponent,
    GenerateReportModalComponent,
    BrokerClientPortfolioDashboardComponent,
    BrokerClientHoldingsTableComponent,
    BrokerClientTransactionsTableComponent,
    BrokerClientRiskProfileComponentComponent,
    RmProfileChangePasswordComponent,
    RequestRemarksModalComponentComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatChipsModule,
    MatTabsModule,
    FormsModule,
    NgbModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule,
    SharedRoutingModule,
    MatExpansionModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    NgxMatSelectSearchModule,
    MatTooltipModule,
    NgxChartsModule,
    ChartModule ,
    ToastrModule.forRoot(
      {
        timeOut: 3500,
        positionClass: 'toast-top-center',
        preventDuplicates: true,
        progressBar: true,
        progressAnimation: 'increasing',
        closeButton: true,
      }
    ),
    MatPasswordStrengthModule.forRoot(),

  ],
  exports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatTableModule,
    MatSelectModule,
    MatChipsModule,
    MatTabsModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    ToastrModule,
    Ng2SearchPipeModule,
    MatPasswordStrengthModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ListOfClientTabComponent,
    ListOfBrokersTabComponent,
    PortfolioProfileTabComponent,
    MatExpansionModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    NgxMatSelectSearchModule,
    MatTooltipModule,
    BrokerClientPortfolioDashboardComponent,
    BrokerClientHoldingsTableComponent,
    BrokerClientTransactionsTableComponent, 
    BrokerClientRiskProfileComponentComponent,
    NgxChartsModule,
    ChartModule,
    RmProfileChangePasswordComponent,
    RequestRemarksModalComponentComponent
  ]
})
export class SharedModule { }
