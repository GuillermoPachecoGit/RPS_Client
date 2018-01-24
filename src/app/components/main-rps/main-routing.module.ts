import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// public components
import { SignInMainComponent } from './sign-in-main/sign-in-main.component';
import { HomeRpsMainComponent } from './home-rps-main/home-rps-main.component';
import { SignUpMainComponent } from './sign-up-main/sign-up-main.component';
import { MainRpsComponent } from './main-rps.component';


const routes_child: Routes = [
  { path : '',
    component: MainRpsComponent,
    children : [
      { path: 'signin', component: SignInMainComponent},
      { path: 'home', component: HomeRpsMainComponent},
      { path: 'signup', component: SignUpMainComponent}
    ]
  }];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forChild(routes_child)],
})

export class MainRoutingModule { }
