import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeModule, TreeComponent } from 'angular-tree-component';
import { Subscription } from 'rxjs';


/*
 * Services
 */
import { SharedDatasetService } from '../../../services/shared-dataset.service';
import { GetProjectsService } from '../../../services/get-projects.service';
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
  index = 0;
  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  subscription: Subscription;
  constructor(private sharedDatasetService: SharedDatasetService, private datasetService : GetProjectsService) {

    this.subscription = this.sharedDatasetService.getNewProject().subscribe(
      value => {
        this.addProjectNew(value.project_id,value.project_name);
    });

    this.subscription = this.sharedDatasetService.getUserProjects().subscribe(
      value => {
        value.forEach(element => {
          this.addProject(element.project_id, element.project_name);
        });
    });

    this.subscription = this.sharedDatasetService.getMessage().subscribe(
      value => {
        if(!this.expanded_nodes.includes(value.dataset_id)){
          this.expanded_nodes_dataset.push(value.dataset_id);
          this.addDataset(value.project_id, value);
        }
      
    });


   
    this.subscription = this.sharedDatasetService.getDistance().subscribe( params => {
       
      if(!this.expanded_nodes_distance.includes(params.distance_id)){
        this.expanded_nodes_distance.push(params.distance_id);
        let i = this.getIndexByProjectId(params.project_id);
        this.nodes[i].children.push( { id: this.getID(), name: params.distance_name, distance_id: params.dataset_id, children:[], isDistance : true });
        this.tree.treeModel.update();
      }

    });
   }

    expanded_nodes_distance = [];


  ngOnInit() { }

  
  onOpen(e) { }

  expanded_nodes = [];
  expanded_nodes_dataset = [];

  loadDatasetsByProject(currentNode){
    this.expanded_nodes.push(currentNode.project_id);
    this.datasetService.getDatasetsByProject(currentNode.project_id).then((result) =>{
      result.forEach(element => {
        this.addDatasetOnly(currentNode.project_id,element);
      });
    });

    this.datasetService.getDistaceByProject(currentNode.project_id).then((result) =>{
      result.forEach(element => {
        this.addDistance(currentNode.project_id,element);
      });
    });
    
  }

  onClick(e) {
    var currentNode = e.node.data;
    if(currentNode.isProject && !this.expanded_nodes.includes(currentNode.project_id)){
        this.loadDatasetsByProject(currentNode);
    }

    if(currentNode.isDataset && !this.expanded_nodes_dataset.includes(currentNode.dataset_id)){
      this.expanded_nodes_dataset.push(currentNode.dataset_id);
      this.datasetService.getDatasetsById(currentNode.dataset_id).then((result) =>{
          this.expanded_nodes_dataset.push(currentNode.dataset_id);
          this.sharedDatasetService.sendMessage(result);
          this.addDatasetData(currentNode.id,JSON.parse(result));
      });
    }

    if(currentNode.isDistance && !this.expanded_nodes_distance.includes(currentNode.distance_id)){
      this.expanded_nodes_distance.push(currentNode.distance_id);
      this.datasetService.getDistanceById(currentNode.distance_id).then((result) =>{
          this.expanded_nodes_dataset.push(result.distance_id);
          console.log(result);
          this.sharedDatasetService.setDistance(result);
      });
    }

  }

  addDistance(project_id,params){
    let i = this.getIndexByProjectId(project_id);
    console.log
    this.nodes[i].children.push( { id: this.getID(), name: params.distance_name, distance_id: params.distance_id, children: [], isDistance : true } );
    this.tree.treeModel.update();
  }


  getIndexByProjectId(project_id){
    for (let index = 0; index < this.nodes.length; index++) {
      const element = this.nodes[index];
      if(element.project_id == project_id){
        return index;
      }
    }
  }


  addDatasetOnly(project_id,element){
    let i = this.getIndexByProjectId(project_id);
    this.nodes[i].children.push( { id: this.getID(), name: element.dataset_name, dataset_id: element.dataset_id, children: [], isDataset : true });
    this.tree.treeModel.update();
  }

  getID(){
    this.index += 1;
    return this.index;
  }

  addProject(id, nameProject) {
    this.nodes.push( { id: this.getID(), name: nameProject, children: [],project_id: id, isProject: true});
    this.tree.treeModel.update();
  }

  addProjectNew(id,nameProject) {
    this.nodes.push( { id: this.getID(), name: nameProject, children: [],project_id: id, isProject: true});
    this.tree.treeModel.update();
  }

  addDataset(idProject, element){
    let found = false;
    let i = this.getIndexByProjectId(idProject);
    this.nodes[i].children.push( { id: this.getID(), name: element.dataset_name, dataset_id: element.dataset_id, children: this.generateSpecimenArray(element.specimens, element.specimen_name, element.dimention, element.numbers_of_specimen, element.numbers_of_landmark), isDataset : true } );
    this.tree.treeModel.update();
  }

  addDatasetData(id, element) {
    let found = false;
    const node = this.tree.treeModel.getNodeById(id);
    console.log(node);
    node.data.children = this.generateSpecimenArray(element.specimens, element.specimen_name, element.dimention, element.numbers_of_specimen, element.numbers_of_landmark);
    this.tree.treeModel.update();
  }

  generateSpecimenArray(specimens, specimen_names, dim, n_spec, n_land) {
    let resultArray = [];
    let valueIds = n_spec * n_land;
    for (let index = 0; index < specimens.length; index++) {
      const element = specimens[index];
      var name = '';
      if(specimen_names[index]){
        name = specimen_names[index];
      }
      else{
        name = 'trace'+index;
      }
      resultArray.push({id: this.getID(), name: name, children: this.generateLandmarkArray(element['specimen' + index], dim), isSpecimen: true});
      valueIds += n_land;
    }
    return resultArray;
  }

  generateLandmarkArray(landmarks, dim) {
      let resultArray = [];
      for (let index = 0; index < landmarks.length; index++) {
        const element = landmarks[index];
        let nameLand = dim === 2 ? (element[0]+' / '+element[1]) : (element[0]+' / '+element[1]+' / '+element[2]);
        resultArray.push({ id: this.getID(), name: nameLand, children: [] , isLandmark: true});
      }
      return resultArray;
  }

}
