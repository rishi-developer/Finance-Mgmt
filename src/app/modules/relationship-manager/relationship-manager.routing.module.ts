import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/AuthGuard/auth.guard';
import { RmDashboardComponent } from './rm-dashboard/rm-dashboard.component';
import { RmProfileDashboardComponent } from './rm-profile-view/rm-profile-dashboard/rm-profile-dashboard.component';

const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard],
    component: RmDashboardComponent
  },
  {
    path: 'rm-profile/:rmUserId', canActivate: [AuthGuard],
    component: RmProfileDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelationshipManagerRoutingModule { }
