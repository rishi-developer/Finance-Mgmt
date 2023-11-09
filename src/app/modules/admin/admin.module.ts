import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    AdminRoutingModule,
    AdminDashboardModule
  ]
})
export class AdminModule { }
