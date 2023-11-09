import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductAdminRoutingModule } from './product-admin.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductAdminDashboardComponent } from './product-admin-dashboard/product-admin-dashboard.component';
import { AddNewBrokerComponent } from './add-new-broker/add-new-broker.component';


@NgModule({
  declarations: [
    ProductAdminDashboardComponent,
    AddNewBrokerComponent
  ],
  imports: [
    CommonModule,
    ProductAdminRoutingModule,
    SharedModule
  ]
})
export class ProductAdminModule { }
