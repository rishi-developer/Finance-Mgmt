import { SharedModule } from './../../shared/shared.module';
import { RelationshipManagerRoutingModule } from './relationship-manager.routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RmProfileDetailsViewComponent } from './rm-profile-view/rm-profile-details-view/rm-profile-details-view.component';
import { RmProfileDashboardComponent } from './rm-profile-view/rm-profile-dashboard/rm-profile-dashboard.component';
import { RmDashboardComponent } from './rm-dashboard/rm-dashboard.component';
import { RmProfileChangePasswordComponent } from './rm-profile-view/rm-profile-change-password/rm-profile-change-password.component';


@NgModule({
  declarations: [

    RmProfileDetailsViewComponent,
        RmProfileDashboardComponent,
        RmDashboardComponent,
  ],
  imports: [
    CommonModule,
    RelationshipManagerRoutingModule,
    SharedModule
  ]
})
export class RelationshipManagerModule { }
