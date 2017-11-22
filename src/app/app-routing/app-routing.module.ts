import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from "../components/login/login.component";
import { Register } from "../components/register/register.component";
import { ProfileNavbar } from '../components/profile-navbar/profile-navbar.component';
import { DashboardRpsComponent } from "../components/dashboard-rps/dashboard-rps.component";

const routes: Routes =[
    {
      path: 'dashboard',
      component: DashboardRpsComponent
    },
    {
      path: '',
      redirectTo: '/dashboard',
      pathMatch: 'full'
    },
  ];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}