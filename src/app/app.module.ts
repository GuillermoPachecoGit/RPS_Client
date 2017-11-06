import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { ValidateService } from './services/validate-service.service'
import { RegisterService  }  from './services/register.service'
import { UploadFileService } from './services/upload-file.service';
import { CountryService} from './services/country.service';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { Register } from './components/register/register.component';
import { ProfileNavbar } from './components/profile-navbar/profile-navbar.component';
import { FormsModule }   from '@angular/forms';

import { HttpModule } from '@angular/http';


@NgModule({
  imports:      [ 
    BrowserModule,
    AppRoutingModule,
    FormsModule,
	  HttpModule
  ],
  declarations: [ 
      AppComponent, 
      LoginComponent,
      Register,
      NavbarComponent,
      FooterComponent,
      ProfileNavbar
  ],
  providers: [ RegisterService,CountryService, UploadFileService],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }