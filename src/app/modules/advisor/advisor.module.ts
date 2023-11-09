import { NgModule } from '@angular/core';
import { AdvisorRoutingModule } from './advisor.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdvisorDashboardModule } from './advisor-dashboard/advisor-dashboard.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    AdvisorRoutingModule,
    AdvisorDashboardModule
  ]
})
export class AdvisorModule { }
