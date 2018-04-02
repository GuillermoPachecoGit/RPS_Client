import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeModule, TreeComponent } from 'angular-tree-component';
import { Subscription } from 'rxjs';
import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';

const actionMapping:IActionMapping = {
  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
      alert(`context menu for ${node.data.name}`);
    },
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) {
        TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
      }
    },
    click: TREE_ACTIONS.TOGGLE_ACTIVE
  },
  keys: {
    [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
  }
};

/*
 * Services
 */
import { SharedDatasetService } from '../../../services/shared-dataset.service';
import { GetProjectsService } from '../../../services/get-projects.service';
import { ValueTransformer } from '@angular/compiler/src/util';
import { count } from 'rxjs/operator/count';
import { CacheStatementRPS } from './cache_statement'
 // Declaramos las variables para jQuery
 declare var jQuery: any;
 declare var $: any;

@Component({
  selector: 'app-dataset-tree',
  templateUrl: './dataset-tree.component.html',
  styleUrls: ['./dataset-tree.component.css']
})

export class DatasetTreeComponent implements OnInit {
  nodes = [];
  //options = {};
  index = 0;
  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  
 

  options: ITreeOptions = {
    actionMapping
  };

  subscription: Subscription;
  constructor(private sharedDatasetService: SharedDatasetService, private datasetService : GetProjectsService) {
    this.cache = new CacheStatementRPS();

    //Subscriptions
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
        if(!this.expanded_nodes_dataset.includes(value.dataset_id)){
          this.expanded_nodes_dataset.push(value.dataset_id);
          //new
          this.cache.AddDataset(value.dataset_id,value);
          this.addDataset(value.project_id, value);
        }
      
    });

    this.subscription = this.sharedDatasetService.getDistance().subscribe( params => {
       
      if(!this.expanded_nodes_distance.includes(params.distance_id)){
        this.expanded_nodes_distance.push(params.distance_id);
        //new 
        this.cache.AddDistance(params.distance_id,params);
        let i = this.getIndexByProjectId(params.project_id);
        this.nodes[i].children.push( { id: this.getID(), name: params.distance_name, distance_id: params.dataset_id, children:[], isDistance : true });
        this.tree.treeModel.update();
      }

    });

    this.subscription = this.sharedDatasetService.getDatasetViewDelete().subscribe(
      params => {
        console.log(params);
        console.log(this.expanded_nodes_dataset);
        var index  = this.expanded_nodes_dataset.indexOf(parseInt(params.id));
        console.log(index);
        if (index > -1) {
          this.expanded_nodes_dataset.splice(index, 1);
       }
      } 
    );

    this.subscription = this.sharedDatasetService.getDistanceViewDelete().subscribe( params => {
      console.log(params);
      var index  = this.expanded_nodes_distance.indexOf(parseInt(params.id));
      console.log(index);
        if (index > -1) {
          this.expanded_nodes_distance.splice(index, 1);
       }
    });

                                                                                

   }
   //subscription end.

    expanded_nodes_ordination = [];
    expanded_nodes_distance = [];
    expanded_nodes_dataset = [];
    expanded_nodes = [];

    cache : CacheStatementRPS;

  ngOnInit() { 
    
  }

  
  onOpen(e) { }



  loadDatasetsByProject(currentNode){
    this.expanded_nodes.push(currentNode.project_id);
    this.datasetService.getOnlyDatasetsByProject(currentNode.project_id).then((result) =>{
      result.forEach(element => {
        this.addDatasetOnly(currentNode.project_id,element);
      });
    }); 
  }
  
  addDistance(id,params){
    const node = this.tree.treeModel.getNodeById(id);
    node.data.children.push( { id: this.getID(), name: params.distance_name, distance_id: params.distance_id, children: [], isDistance : true } );
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

  addAnalisysOnly(id,element){
    const node = this.tree.treeModel.getNodeById(id);
    node.data.children.push( { id: this.getID(), name: element.dataset_name, dataset_id: element.dataset_id, children: [], isDataset : true });
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
    
    node.data.children = [];
    node.data.children.push({id: this.getID(), name: 'Landmarks', children: this.generateArrayLandmark(element.numbers_of_landmark), isFolderLandmark: true});
    node.data.children.push({id: this.getID(), name: 'Specimens', children: this.generateSpecimenArray(element.specimens, element.specimen_name, element.dimention, element.numbers_of_specimen,element.numbers_of_landmark), isFolderSpecimen: true});
    node.data.children.push({id: this.getID(), project_id: element.project_id, dataset_id: element.dataset_id, name: 'Analisys', children: [], isFolderAnalisys: true});
    this.tree.treeModel.update();
  }

  generateSpecimenArray(specimens, specimen_names, dim, n_spec, n_land) {
    let resultArray = [];
    //resultArray = this.addListLandmarks(resultArray,n_land);


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
      resultArray.push({id: this.getID(), name: name, children: [], isSpecimen: true});
      valueIds += n_land;
    }
    
    return resultArray;
  }

  addListLandmarks(resultArray,n_land){
    resultArray.push({id: this.getID(), name: 'Landmarks', children: this.generateArrayLandmark(n_land), isFolderLandmark: true});
    return resultArray;
  }

  addListSpecimens(resultArray,specimens, specimen_names, dim, n_spec,n_land){
    resultArray.push();
    return resultArray;
  }

  generateArrayLandmark(n_land){
    var resultArray = [];
    for (let index = 1; index <= n_land; index++) {
        resultArray.push({ id: this.getID(), name: 'LM_'+index, children:[], isLandmark: true});
    }
    return resultArray;
  }



  //onclik events. The output depends of clicked item.
  onClick(e) {
    var currentNode = e.node.data;

    if(currentNode.isProject && !this.expanded_nodes.includes(currentNode.id)){
        this.loadDatasetsByProject(currentNode);
    }



    if(currentNode.isDataset && !this.expanded_nodes_dataset.includes(currentNode.dataset_id)){
      this.expanded_nodes_dataset.push(currentNode.dataset_id);

      var data = this.cache.GetDataset(currentNode.dataset_id)

      if(data != null){
        this.sharedDatasetService.sendMessage(data);
        this.addDatasetData(currentNode.id,JSON.parse(data));
      }
      else{
        this.datasetService.getDatasetsById(currentNode.dataset_id).then((result) =>{
          this.sharedDatasetService.sendMessage(result);
          this.addDatasetData(currentNode.id,JSON.parse(result));
        });
      }
      

    }

    if(currentNode.isDistance && !this.expanded_nodes_distance.includes(currentNode.distance_id)){
      this.expanded_nodes_distance.push(currentNode.distance_id);
      var data = this.cache.GetDistance(currentNode.distance_id);

      if(data != null){
        this.sharedDatasetService.setDistance(data);
      }
      else{
        this.datasetService.getDistanceById(currentNode.distance_id).then((result) =>{
          this.sharedDatasetService.setDistance(result);
        });
      }
      
    }

    if(currentNode.isOrdination && !this.expanded_nodes_ordination.includes(currentNode.ordinaton_id)){
      this.expanded_nodes_ordination.push(currentNode.ordinaton_id);
      //mirar request
      var data = this.cache.GetOrdination(currentNode.ordination_id);
      if(data != null){
        this.sharedDatasetService.setOrdination(data);
      }
      else{
        this.datasetService.getOrdinationById(currentNode.ordination_id).then((result) =>{
          this.sharedDatasetService.setOrdination(result);
        });
      } 
    }

    if(currentNode.isFolderAnalisys && !this.expanded_nodes.includes(currentNode.id)){        
      this.datasetService.getAnalisysById(currentNode.dataset_id,currentNode.project_id).then((result) =>{
        this.expanded_nodes.push(currentNode.id);
        result.forEach(element => {
          this.addAnalisysOnly(currentNode.id,element);
        });
      
        this.datasetService.getDistaceByProject(currentNode.dataset_id,currentNode.project_id).then((result) =>{
          result.forEach(element => {
            this.addDistance(currentNode.id,element);
          });
        });
    });
    }
  }
}
