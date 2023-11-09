import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClientRoutingModule } from './client-routing.module';
import { ClientOnboardingComponent } from './client-onboarding/client-onboarding.component';
import { UccActivationModalComponent } from './ucc-activation-modal/ucc-activation-modal.component';
import { ClientEditDetailsComponent } from './client-edit-details/client-edit-details.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { UccActivationConfirmationModalComponent } from './ucc-activation-confirmation-modal/ucc-activation-confirmation-modal.component';


@NgModule({
  declarations: [
    ClientOnboardingComponent,
    UccActivationModalComponent,
    ClientEditDetailsComponent,
    ClientDashboardComponent,
    UccActivationConfirmationModalComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule
  ]
})
export class ClientModule { }
