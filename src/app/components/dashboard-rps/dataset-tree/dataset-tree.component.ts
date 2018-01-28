import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeModule, TreeComponent } from 'angular-tree-component';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';


/*
 * Services
 */
import { SharedDatasetService } from '../../../services/shared-dataset.service';
import { ValueTransformer } from '@angular/compiler/src/util';

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
        this.addProject(value);
    });

   }

  ngOnInit() {
  }

  onOpen(e) {
    console.log('click');
  }

  onClick(e) {
    console.log(e);
  }


  addProject(nameProject) {
    this.nodes.push( { id: (this.nodes.length + 1), name: nameProject, children: [], isProject: true});
    this.tree.treeModel.update();
  }

  addLandmark(idProject, idSpecimen, value) {
    this.nodes[idProject][idSpecimen].push( { id: (this.nodes.length + 1), name: value, children: [], isLandmark: true});
    this.tree.treeModel.update();
  }

  addSpecimen(idProject, value) {
    this.nodes[idProject].children.push( { id: (this.nodes.length + 1), name: value, children: [], isSpecimen: true});
    this.tree.treeModel.update();
  }


}
