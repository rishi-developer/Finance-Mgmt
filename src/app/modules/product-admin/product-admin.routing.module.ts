import { ProductAdminDashboardComponent } from './product-admin-dashboard/product-admin-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/AuthGuard/auth.guard';
import { AddNewBrokerComponent } from './add-new-broker/add-new-broker.component';

const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard],
    component: ProductAdminDashboardComponent
  },
  {
    path: 'broker-onboarding', canActivate: [AuthGuard],
    component: AddNewBrokerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductAdminRoutingModule { }
