import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// public components
import { MainRpsComponent } from './components/main-rps/main-rps.component';
import { DashboardRpsComponent } from './components/dashboard-rps/dashboard-rps.component';

// Guard
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'main',
    loadChildren: 'app/components/main-rps/main-rps.module#MainRpsModule'
  },
  { path: 'dashboard',
    loadChildren: 'app/components/dashboard-rps/dashboard-rps.module#DashboardRPSModule'/*,
    canActivate: [AuthGuardService]*/
  },
  { path: '', redirectTo: '/main', pathMatch: 'full' }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes)],
})

export class AppRoutingModule { }
