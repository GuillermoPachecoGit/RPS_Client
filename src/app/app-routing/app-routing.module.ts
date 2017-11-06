import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from "../components/login/login.component";
import { Register } from "../components/register/register.component";
import { ProfileNavbar } from '../components/profile-navbar/profile-navbar.component';

const routes: Routes =[
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'register',
      component: Register
    },
    {
      path: 'profile',
      component: ProfileNavbar
    },
    {
      path: '',
      redirectTo: '/login',
      pathMatch: 'full'
    },
  ];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}