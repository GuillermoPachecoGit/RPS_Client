import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Components
import { DashboardRpsComponent } from './dashboard-rps.component';
import { TreeViewComponent } from './dataset-tree/dataset-tree.component';
import { GraphicsDashboardComponent } from './graphics-dashboard/graphics-dashboard.component';
import { NavbarDashboardComponent } from './navbar-dashboard/navbar-dashboard.component';
import { ResultDashboardComponent } from './result-dashboard/result-dashboard.component';

// Routing
import { DashboardRoutingModule } from './dashboard-routing.module';

// Services
import { UploadFileService } from '../../services/upload-file.service';
import { ProjectService } from '../../services/get-projects.service';
import { AnalyzeService  } from "../../services/analyze.service";
/**
 * Tree view
 */
import { TreeModule } from 'angular-tree-component';
import { AnalisysDashboardComponent } from './analisys-dashboard/analisys-dashboard.component';
import { RemoveService } from '../../services/remove.service';
import { DistanceAnalysisComponent } from './distance-analysis/distance-analysis.component';
import { Ordination } from './navbar-dashboard/ordination';
import { OrdinationAnalysisComponent } from './ordination-analysis/ordination-analysis.component';
import { ProcrustesAnalysisComponent } from './procrustes-analysis/procrustes-analysis.component';
import { DatasetService } from '../../services/dataset.service';
import { DistanceService } from '../../services/distance.service';
import { OrdinationService } from '../../services/ordination.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TreeModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardRpsComponent,
    TreeViewComponent,
    GraphicsDashboardComponent,
    NavbarDashboardComponent,
    ResultDashboardComponent,
    AnalisysDashboardComponent,
    DistanceAnalysisComponent,
    OrdinationAnalysisComponent,
    ProcrustesAnalysisComponent
  ],
  providers: [UploadFileService, ProjectService, AnalyzeService, RemoveService, DatasetService, DistanceService, OrdinationService]
})
export class DashboardRPSModule { }
