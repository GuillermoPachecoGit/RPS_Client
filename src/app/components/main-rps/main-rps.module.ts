import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }    from '@angular/forms';

//Components
import { MainRpsComponent } from "./main-rps.component";
import { HomeRpsMainComponent } from "./home-rps-main/home-rps-main.component";
import { NavbarMainComponent } from "./navbar-main/navbar-main.component";
import { SignInMainComponent } from "./sign-in-main/sign-in-main.component";
import { SignUpMainComponent } from "./sign-up-main/sign-up-main.component";

//Routing
import { MainRoutingModule } from "./main-routing.module";

//Services
import { InitTemplateService } from "../../services/init-template.service";
import { UserService } from "../../services/user.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MainRoutingModule
  ],
  declarations: [
     MainRpsComponent,
     HomeRpsMainComponent,
     NavbarMainComponent,
     SignInMainComponent,
     SignUpMainComponent
  ],
  providers: [
    InitTemplateService,
    UserService
  ]
})
export class MainRpsModule { }
