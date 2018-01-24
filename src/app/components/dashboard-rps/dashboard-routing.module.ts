import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// public components
import { DashboardRpsComponent } from './dashboard-rps.component';

const routes_dashboard: Routes = [
  { path : '',
    component: DashboardRpsComponent
  },
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forChild(routes_dashboard)],
})

export class DashboardRoutingModule { }
