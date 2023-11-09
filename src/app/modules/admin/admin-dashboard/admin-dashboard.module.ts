import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddBrokerModalComponent } from './add-broker-modal/add-broker-modal.component';





@NgModule({
  declarations: [
    DashboardComponent,
    AddBrokerModalComponent
  ],
  imports: [
    SharedModule,
    AdminDashboardRoutingModule
  ]
})
export class AdminDashboardModule { }
