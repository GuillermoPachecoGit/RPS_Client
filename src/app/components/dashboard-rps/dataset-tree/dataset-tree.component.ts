import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeModule, TreeComponent } from 'angular-tree-component';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';


/*
 * Services
 */
import { SharedDatasetService } from '../../../services/shared-dataset.service';
import { ValueTransformer } from '@angular/compiler/src/util';
import { count } from 'rxjs/operator/count';

@Component({
  selector: 'app-dataset-tree',
  templateUrl: './dataset-tree.component.html',
  styleUrls: ['./dataset-tree.component.css']
})
export class DatasetTreeComponent implements OnInit {
  nodes = [];
  options = {};

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  subscription: Subscription;
  constructor(private sharedDatasetService: SharedDatasetService) {

    this.subscription = this.sharedDatasetService.getNewProject().subscribe(
      value => {
        this.addProjectNew(value);
    });

    this.subscription = this.sharedDatasetService.getUserProjects().subscribe(
      value => {
        value.forEach(element => {
          this.addProject(element.id, element.project_name);
        });
    });

    this.subscription = this.sharedDatasetService.getMessage().subscribe(
      value => {
        console.log(value);
        // tslint:disable-next-line:no-shadowed-variable
        this.addDataset(value.project_id, value);
    });

   }

  ngOnInit() {

  }

  /*
  onOpen(e) {
    console.log('click');
  }

  onClick(e) {
    console.log(e);
  }*/


  addProject(id, nameProject) {
    this.nodes.push( { id: id, name: nameProject, children: [], isProject: true});
    this.tree.treeModel.update();
  }

  addProjectNew(nameProject) {
    this.nodes.push( { id: this.nodes.length, name: nameProject, children: [], isProject: true});
    this.tree.treeModel.update();
  }

  addDataset(idProject, element) {
    console.log(this.nodes);
    let found = false;
    let i = 0;
    for (let index = 0; index < this.nodes.length && !found; index++) {
      // tslint:disable-next-line:no-shadowed-variable
      const element = this.nodes[index];
      found = element.id === idProject ? true : false;
      i = index;
    }

    // tslint:disable-next-line:max-line-length
    this.nodes[i].children.push( { id: (this.nodes[i].children.length + 1), name: element.dataset_name, children: this.generateSpecimenArray(element.specimens, element.names_specimen, element.dim, element.num_specimens, element.num_landmarks), isDataset : true });
    this.tree.treeModel.update();
    this.tree.treeModel.update();
    this.tree.treeModel.update();
  }
  generateSpecimenArray(specimens, specimen_names, dim, n_spec, n_land) {
    // tslint:disable-next-line:prefer-const
    let resultArray = [];
    // tslint:disable-next-line:prefer-const
    let valueIds = n_spec * n_land;
    for (let index = 0; index < specimens.length; index++) {
      const element = specimens[index];
      // tslint:disable-next-line:max-line-length
      console.log(element);
      resultArray.push({id: (valueIds+1), name: specimen_names[index], children: this.generateLandmarkArray(element['specimen' + index], dim), isSpecimen: true});
      valueIds += n_land;
    }
    return resultArray;
  }

  generateLandmarkArray(landmarks, dim) {
      // tslint:disable-next-line:prefer-const
      let resultArray = [];
      for (let index = 0; index < landmarks.length; index++) {
        const element = landmarks[index];
        // tslint:disable-next-line:prefer-const
        let nameLand = dim === 2 ? (element[0]+'-'+element[1]) : (element[0]+'-'+element[1]+'-'+element[2]);
        resultArray.push({ id: (resultArray.length + 1), name: nameLand, children: [] , isLandmark: true});
      }
      return resultArray;
  }

}
