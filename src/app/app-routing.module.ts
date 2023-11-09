import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './AuthGuard/auth.guard';
import { RoleGuard } from './RoleGuard/role.guard';
import { Role } from './_helper/role';
import { ErrorPageComponent } from './modules/error-page/error-page.component';
import { ReportsRoutingModule } from './modules/broker/reports/reports.routing.module';
import { LoginRoutingModule } from './modules/login/login-routing.module';
import { BrokerRoutingModule } from './modules/broker/broker.routing.module';
import { SharedRoutingModule } from './shared/shared.routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'broker',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: Role.Broker,
    },
    loadChildren: () =>
      import('./modules/broker/broker.module').then((m) => m.BrokerModule),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    canActivateChild: [AuthGuard],
    data: {
      role: Role.Admin,
    },
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'product-admin',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: Role.ProductAdmin,
    },
    loadChildren: () =>
      import('./modules/product-admin/product-admin.module').then(
        (m) => m.ProductAdminModule
      ),
  },
  {
    path: 'relationshipManager',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: Role.RelationshipManager,
    },
    loadChildren: () =>
      import('./modules/relationship-manager/relationship-manager.module').then(
        (m) => m.RelationshipManagerModule
      ),
  },
  {
    path: 'client',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: Role.Client,
    },
    loadChildren: () =>
      import('./modules/client/client.module').then((m) => m.ClientModule),
  },

  { path: '', loadChildren: () => ReportsRoutingModule },
  { path: '', loadChildren: () => LoginRoutingModule },
  { path: '', loadChildren: () => BrokerRoutingModule },
  { path: '', loadChildren: () => SharedRoutingModule },
  {
    path: '**',
    component: ErrorPageComponent,
    //pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
