import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeModule, TreeComponent } from 'angular-tree-component';
import { Subscription } from 'rxjs';
import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';

const actionMapping:IActionMapping = {
  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
      //console.log(node.data);
      $("#myModal").modal();
      TREE_ACTIONS.FOCUS(tree, node, $event);
      
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
import { ProjectService } from '../../../services/get-projects.service';
import { ValueTransformer } from '@angular/compiler/src/util';
import { count } from 'rxjs/operator/count';
import { CacheStatementRPS } from './cache_statement'
import { RemoveService } from '../../../services/remove.service';
import { DatasetService } from '../../../services/dataset.service';
import { DistanceService } from '../../../services/distance.service';
import { OrdinationService } from '../../../services/ordination.service';
 // Declaramos las variables para jQuery
 declare var jQuery: any;
 declare var $: any;

@Component({
  selector: 'app-dataset-tree',
  templateUrl: './dataset-tree.component.html',
  styleUrls: ['./dataset-tree.component.css']
})

export class TreeViewComponent implements OnInit {
 
  selected_node = 0;
  nodes = [];
  index = 0;
  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  
  isDataset = false;
  isDistance = false;   
   description_msg = '';


  options: ITreeOptions = {
    actionMapping
  };

  subscription: Subscription;
  constructor(
     private sharedDatasetService: SharedDatasetService,
     private projectService : ProjectService, 
     private removeService : RemoveService,
     private datasetService :   DatasetService, 
     private distanceService : DistanceService,
     private ordinationService : OrdinationService
    
    ) {
       
    this.cache = new CacheStatementRPS();

    //Subscriptions
    this.subscription = this.sharedDatasetService.getNewProject().subscribe(
      value => {
        this.addProjectNew(value.project_id,value.project_name,value.user_id);
    });

    this.subscription = this.sharedDatasetService.getUserProjects().subscribe(
      value => {
        value.forEach(element => {
          this.addProject(element.project_id, element.project_name,element.user_id);
        });
    });

    this.subscription = this.sharedDatasetService.getMessage().subscribe(
      value => {

        if(!this.expanded_nodes_dataset.includes(value.dataset_id)){
          //lo expando
          console.log("AGREGO EL NUEVO DATASET: "+value.dataset_id);
          this.expanded_nodes_dataset.push(value.dataset_id); 
          this.loaded_dataset.push(value.dataset_id);
          if(this.selected_node != 0){
            var node = this.tree.treeModel.getNodeById(this.selected_node);
            this.cache.AddDataset(value.dataset_id,value);
            this.selected_node = 0;
            this.addDataset(value.project_id, value);
            //node.data.children.push({ id: this.getID(), name: value.dataset_name, project_id: value.project_id ,dataset_id: value.dataset_id, children: [{id: this.getID(), name: 'Specimens', children: this.generateSpecimenArray(value.specimens.data, value.specimen_name, value.dimention, value.numbers_of_specimen,value.numbers_of_landmark), isFolderSpecimen: true}], isDataset : true });
            this.tree.treeModel.update();
          }
          else{       
            this.cache.AddDataset(value.dataset_id,value);
            this.selected_node = 0;
            //node.data.children.push({ id: this.getID(), name: value.dataset_name, project_id: value.project_id ,dataset_id: value.dataset_id, children: [{id: this.getID(), name: 'Specimens', children: this.generateSpecimenArray(value.specimens.data, value.specimen_name, value.dimention, value.numbers_of_specimen,value.numbers_of_landmark), isFolderSpecimen: true}], isDataset : true });
            this.addDataset(value.project_id, value);
            this.tree.treeModel.update();
          }

        }
      
    });
    

    this.subscription = this.sharedDatasetService.getDistance().subscribe( params => {
       
      if(!this.expanded_nodes_distance.includes(params.distance_id)){
        this.expanded_nodes_distance.push(params.distance_id);
        this.cache.AddDistance(params.distance_id,params);

        this.addDistance(this.selected_node,params)
        this.tree.treeModel.update();
      }
    });

    this.subscription = this.sharedDatasetService.getOrdination().subscribe(params => {

      if(!this.expanded_nodes_ordination.includes(params.ordination_id)){
        this.expanded_nodes_ordination.push(params.ordination_id);
        this.cache.AddOrdination(params.ordination_id,params);

        this.addOrdination(this.selected_node,params)
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

      
    this.subscription = this.sharedDatasetService.isFinishedAnalisys().subscribe( params => {
      this.isDataset = false;
      this.isDistance = false;
      document.getElementById('buttonClose').click();

    });


    this.subscription = this.sharedDatasetService.getDescription().subscribe( params => {
        console.log(params);
        this.description_msg = params;
    });




    var options = [];


   }
   //subscription end.

    expanded_nodes_ordination = [];
    expanded_nodes_distance = [];
    expanded_nodes_dataset = [];
    expanded_nodes = [];
    loaded_dataset = [];

    cache : CacheStatementRPS;

  ngOnInit() { 
    
  }
  
  onOpen(e) { }

  loadDatasetsByProject(currentNode){
    this.expanded_nodes.push(currentNode.project_id);
    this.datasetService.getOnlyDatasetsByProject(currentNode.project_id).then((result) =>{
      result.forEach(element => {
        if(!this.expanded_nodes_dataset.includes(element.dataset_id)){
          this.addDatasetOnly(currentNode.project_id,element);
        }
      });
    }); 
  }
  
  addDistance(id,params){
    const node = this.tree.treeModel.getNodeById(id);
    node.data.children.push( { id: this.getID(), name: params.distance_name, dataset_id: params.dataset_id_ref, project_id: params.project_id_ref , distance_id: params.distance_id, children: [], isDistance : true } );
    this.tree.treeModel.update();
  }

  addOrdination(id,params): any {
    const node = this.tree.treeModel.getNodeById(id);
    node.data.children.push( { id: this.getID(), name: params.ordination_name, ordination_id: params.ordination_id, dataset_id: params.dataset_id_ref, project_id: params.project_id_ref, children: [], isOrdination: true } );
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
    this.nodes[i].children.push( { id: this.getID(), name: element.dataset_name, project_id: project_id ,dataset_id: element.dataset_id, children: [], isDataset : true });
    this.tree.treeModel.update();
  }

  addAnalisysOnly(id,element){
    const node = this.tree.treeModel.getNodeById(id);
    console.log(element);
    node.data.children.push( { id: this.getID(), name: element.dataset_name, project_id: element.project_id, dataset_id: element.dataset_id, children: [], isDataset : true });
    this.tree.treeModel.update();
  }

  getID(){
    this.index += 1;
    return this.index;
  }

  addProject(id, nameProject,id_user) {
    this.nodes.push( { id: this.getID(),user_id: id_user , name: nameProject, children: [],project_id: id, isProject: true});
    this.tree.treeModel.update();
  }

  addProjectNew(id,nameProject,id_user) {
    this.nodes.push( { id: this.getID(),user_id: id_user, name: nameProject, children: [],project_id: id, isProject: true});
    this.tree.treeModel.update();
  }

  addDataset(idProject, element){
    let i = this.getIndexByProjectId(idProject);
    this.nodes[i].children.push({ id: this.getID(), name: element.dataset_name, project_id: element.project_id ,dataset_id: element.dataset_id, children: [{id: this.getID(), name: 'Specimens', children: this.generateSpecimenArray(element.specimens.data, element.specimen_name, element.dimention, element.numbers_of_specimen,element.numbers_of_landmark), isFolderSpecimen: true}], isDataset : true });
    //this.nodes[i].children.push();
    //this.nodes[i].children.push( { id: this.getID(), name: element.dataset_name, project_id: element.project_id  , dataset_id: element.dataset_id, children: this.generateSpecimenArray(element.specimens, element.specimen_name, element.dimention, element.numbers_of_specimen, element.numbers_of_landmark), isDataset : true } );
    this.tree.treeModel.update();
  }

  addDatasetData(id, values) {

    if(!this.loaded_dataset.includes(values.dataset_id) ){
         //MIRAR ACA, IMPLEMENTAR MECANISMO DE CARGA UNA SOLA VEZ EN EL TREE
          this.loaded_dataset.push(values.dataset_id);
          const node = this.tree.treeModel.getNodeById(id);
          //node.data.children.push({id: this.getID(), name: 'Landmarks', children: this.generateArrayLandmark(element.numbers_of_landmark), isFolderLandmark: true});
          //node.data.children.push({id: this.getID(), project_id: element.project_id, dataset_id: element.dataset_id, name: 'Analisys', children: [], isFolderAnalisys: true});    
          node.data.children.push({id: this.getID(), name: 'Specimens', children: this.generateSpecimenArray(values.specimens.data, values.specimen_name, values.dimention, values.numbers_of_specimen,values.numbers_of_landmark), isFolderSpecimen: true});
          
          //ajustes
          this.datasetService.getAnalisysById(values.dataset_id,values.project_id).then((result) =>{
            result.forEach(element => {
              if(!this.expanded_nodes_dataset.includes(element.dataset_id)){    
                this.addAnalisysOnly(id,element);
              }
              
            });
          });
          //distances
            this.distanceService.getDistaceByDatasets(values.dataset_id,values.project_id).then((result) =>{
              result.forEach(element => {
                if(!this.expanded_nodes_distance.includes(element.distance_id)){
                  this.addDistance(id,element);
                }
              });
            });

          this.tree.treeModel.update();
    }
 
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


  editDescription = false;

  changeDescription(e){
    this.editDescription = true;
  }

  isProject = false;
  name_msg = '';
  error_msg = '';
  invalid = false;
  user_id_project = '';
  confirmDescription(e){
    //servicio de update de description
  this.projectService.updateProject({description: this.description_msg, project_name: this.name_msg, project_id: this.project_id, user_id: this.user_id_project}).subscribe( params => {
      if(params.result == "ok"){
        const node = this.tree.treeModel.getNodeById(this.selected_node);
        node.data.name = this.name_msg;
        this.tree.treeModel.update();
        this.editDescription = false;
        document.getElementById('buttonClose').click();
      }else{
        this.invalid = true;
        this.error_msg = params.result;
      }
    });
  }


  onRightClick(e){
    console.log(e.node.data);
    var currentNode = e.node.data;
    this.selected_node = currentNode.id;

    if(currentNode.isDataset){

      var data = this.cache.GetDataset(currentNode.dataset_id)
      if(data == null){
        this.datasetService.getDatasetsById(currentNode.dataset_id).then((result) =>{
          data = JSON.parse(result);
          this.sharedDatasetService.setSelectedDataset({ node: currentNode.id, name: currentNode.name, dataset_id: currentNode.dataset_id, project_id: currentNode.project_id, "data": data});
          this.cache.AddDataset(result.dataset_id,result);
        });
      }else{
        this.sharedDatasetService.setSelectedDataset({ node: currentNode.id, name: currentNode.name, dataset_id: currentNode.dataset_id, project_id: currentNode.project_id, "data": data});
      }
    
      this.isDataset = true;
      this.isProject = false;
    }

    if(currentNode.isDistance){
      console.log("PASE POR ACA "+currentNode);
      //this.selected_node = currentNode.id;
      this.sharedDatasetService.setSelectedDistance({ name: currentNode.name, dataset_id: currentNode.dataset_id, project_id: currentNode.project_id, distance_id: currentNode.distance_id});
      this.isDistance = true;
      this.isProject = false;
    }    

    if(currentNode.isProject){
      console.log("PASE POR ACA "+currentNode);
      this.editDescription = false;
      this.invalid = false;
      this.error_msg = '';
      this.projectService.getProjectDescription(currentNode.project_id).then( params => {
        //this.sharedDatasetService.setDescription(params.description);
        this.name_msg = params.project_name;
        this.description_msg = params.description;
        this.project_id = currentNode.project_id;
        this.user_id_project = currentNode.user_id;
      });

      this.isProject = true;
    } 
  }

  project_id = -1;

  deleteData(e){
    var result = confirm("Want to delete?");
    if (result) {
        //Logic to delete the item
        const node = this.tree.treeModel.getNodeById(this.selected_node);
        var index;
        console.log(node);
        if(node.data.isProject){

          index = this.nodes.findIndex(x => x.id === node.data.id);
          this.nodes.splice(index,1);

          this.removeService.removeProject(node.data.project_id).subscribe( result => {
            console.log(result);
          });
          this.tree.treeModel.update();
          document.getElementById('buttonClose').click();
          return;
        }

        var parent_id = node.parent.id;
        const nodeParent = this.tree.treeModel.getNodeById(parent_id);
        console.log(nodeParent);
        index = nodeParent.data.children.findIndex(x => x.id === node.data.id);
       console.log(index);
       nodeParent.data.children.splice(index,1);
      this.tree.treeModel.update();

      if(node.data.isDataset){
          this.removeService.removeDataset(node.data.dataset_id).subscribe(result => {
            console.log(result);
        });
      }

      if(node.data.isDistance){
        this.removeService.removeDistance(node.data.distance_id).subscribe( result => {
          console.log(result);
        });
      }

      if(node.data.isOrdination){
        this.removeService.removeOrdination(node.data.ordination_id).subscribe( result => {
          console.log(result);
        });
      }
      
      document.getElementById('buttonClose').click();
    }
  }

  //onclik events. The output depends of clicked item.
  onClick(e) {
    var currentNode = e.node.data;

    if(currentNode.isProject && !this.expanded_nodes.includes(currentNode.id)){
        console.log(e.index);        
        this.loadDatasetsByProject(currentNode);
    }

   
    
    if(currentNode.isDataset && !this.expanded_nodes_dataset.includes(currentNode.dataset_id)){
      this.expanded_nodes_dataset.push(currentNode.dataset_id);
      console.log("EXPANDO EL DATASET: "+ currentNode.dataset_id);
      var data = this.cache.GetDataset(currentNode.dataset_id)
      if(data != null){
        this.addDatasetData(currentNode.id,JSON.parse(data));
        this.sharedDatasetService.sendMessage(data);
        
      }
      else{
        this.datasetService.getDatasetsById(currentNode.dataset_id).then((result) =>{
          this.addDatasetData(currentNode.id,JSON.parse(result));
          this.sharedDatasetService.sendMessage(result);   
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
        this.distanceService.getDistanceById(currentNode.distance_id).then((result) =>{
          this.sharedDatasetService.setDistance(result);
        });
      }

      this.ordinationService.getOrdinationsById(currentNode.dataset_id,currentNode.project_id, currentNode.distance_id).then((result) => {
        result.forEach(element => {
          if(!this.expanded_nodes_ordination.includes(element.ordination_id)){
            this.addOrdination(currentNode.id,element);
          }
        });
      });
      
    }

    if(currentNode.isOrdination && !this.expanded_nodes_ordination.includes(currentNode.ordinaton_id)){
      //this.expanded_nodes_ordination.push(currentNode.ordinaton_id);
      //mirar request
      var data = this.cache.GetOrdination(currentNode.ordination_id);
      if(data != null){
        this.sharedDatasetService.setOrdination(data);
      }
      else{
        this.ordinationService.getOrdinationById(currentNode.ordination_id).then((result) =>{
          this.sharedDatasetService.setOrdination(result);
        });
      } 
    }
  }
}
