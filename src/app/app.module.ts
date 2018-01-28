import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

/**
 * Components
 */
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { FooterMainComponent } from './components/footer-main/footer-main.component';

/**
 * Services
 */
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { SharedDatasetService } from './services/shared-dataset.service';


@NgModule({
  declarations: [
    AppComponent,
    FooterMainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [AuthGuardService, AuthService, UserService, SharedDatasetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
