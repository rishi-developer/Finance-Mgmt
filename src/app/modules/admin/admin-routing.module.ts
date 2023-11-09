import { BrokerClientPortfolioDashboardComponent } from 'src/app/shared/broker-client-portfolio-module/broker-client-portfolio-dashboard/broker-client-portfolio-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/AuthGuard/auth.guard';
import { Role } from 'src/app/_helper/role';
import { DashboardComponent } from './admin-dashboard/dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'broker-client-portfolio/:id/:role',canActivate: [AuthGuard],
    component: BrokerClientPortfolioDashboardComponent
  },
  



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
