import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Components
import { DashboardRpsComponent } from './dashboard-rps.component';
import { DatasetTreeComponent } from './dataset-tree/dataset-tree.component';
import { GraphicsDashboardComponent } from './graphics-dashboard/graphics-dashboard.component';
import { NavbarDashboardComponent } from './navbar-dashboard/navbar-dashboard.component';
import { ResultDashboardComponent } from './result-dashboard/result-dashboard.component';

// Routing
import { DashboardRoutingModule } from './dashboard-routing.module';

// Services
import { UploadFileService } from '../../services/upload-file.service';
import { GetProjectsService } from '../../services/get-projects.service';
import { AnalyzeService  } from "../../services/analyze.service";

/**
 * Tree view
 */
import { TreeModule } from 'angular-tree-component';
import { AnalisysDashboardComponent } from './analisys-dashboard/analisys-dashboard.component';
import { RemoveService } from '../../services/remove.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TreeModule,
    DashboardRoutingModule
  ],
  declarations: [

    DashboardRpsComponent,
    DatasetTreeComponent,
    GraphicsDashboardComponent,
    NavbarDashboardComponent,
    ResultDashboardComponent,
    AnalisysDashboardComponent
  ],
  providers: [UploadFileService, GetProjectsService, AnalyzeService, RemoveService]
})
export class DashboardRPSModule { }
