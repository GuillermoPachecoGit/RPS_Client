import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeModule, TreeComponent } from 'angular-tree-component';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
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
 declare var pdfMake: any;

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
  isAnalysis = false;
  idRepository = 0;
  isRepository = false;
  description_msg = '';
  idUser = '';


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
     private ordinationService : OrdinationService,
     private route: ActivatedRoute
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
        
        this.idRepository = this.getID()
        this.nodes.push( { id: this.idRepository,isRepository:true , name: 'Analyses Repository', children: []});
        this.tree.treeModel.update();
    });




    this.subscription = this.sharedDatasetService.getMessage().subscribe(
      value => {
        if(!this.expanded_nodes_dataset.includes(value.dataset_id)){
          //lo expando
          this.expanded_nodes_dataset.push(value.dataset_id); 
          this.loaded_dataset.push(value.dataset_id);
          if(this.selected_node != 0){
            var node = this.tree.treeModel.getNodeById(this.selected_node);
            this.cache.AddDataset(value.dataset_id,value);
            this.selected_node = 0;
            this.addDataset(value.project_id, value);
            //node.data.children.push({ id: this.getID(), name: value.dataset_name, project_id: value.project_id ,dataset_id: value.dataset_id, children: [{id: this.getID(), name: 'Specimens', children: this.generateSpecimenArray(value.specimens.data, value.objects_name, value.dimention, value.number_of_objects,value.number_of_landmarks), isFolderSpecimen: true}], isDataset : true });
            this.tree.treeModel.update();
          }
          else{       
            this.cache.AddDataset(value.dataset_id,value);
            this.selected_node = 0;
            //node.data.children.push({ id: this.getID(), name: value.dataset_name, project_id: value.project_id ,dataset_id: value.dataset_id, children: [{id: this.getID(), name: 'Specimens', children: this.generateSpecimenArray(value.specimens.data, value.objects_name, value.dimention, value.number_of_objects,value.number_of_landmarks), isFolderSpecimen: true}], isDataset : true });
            this.addDataset(value.project_id, value);
            this.tree.treeModel.update();
          }
        }
    });

    this.subscription = this.sharedDatasetService.getAnalysis().subscribe(
      value => {
        if(!this.expanded_nodes_dataset.includes(value.dataset_id)){
          //lo expando
          this.expanded_nodes_dataset.push(value.dataset_id); 
          this.loaded_dataset.push(value.dataset_id);
          if(this.selected_node != 0){
            this.cache.AddDataset(value.dataset_id,value);
            this.selected_node = 0;
            this.addAnalisys(value.project_id, value);
            this.tree.treeModel.update();
          }
          else{       
            this.cache.AddDataset(value.dataset_id,value);
            this.selected_node = 0;
            this.addAnalisys(value.project_id, value);
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
    this.route.params.subscribe((params: Params) => {
      this.idUser = params['id'];
   });  
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
    if(params.node_tree){
      const node = this.tree.treeModel.getNodeById(params.node_tree);
      node.data.children.push( { id: this.getID(), name: params.distance_name, dataset_id: params.dataset_id_ref, project_id: params.project_id_ref , distance_id: params.distance_id, children: [], isDistance : true ,isAnalysis:true} );
      this.tree.treeModel.update();
    }else{
      const node = this.tree.treeModel.getNodeById(this.idRepository);
      node.data.children.push( { id: this.getID(), name: params.distance_name, dataset_id: params.dataset_id_ref, project_id: params.project_id_ref , distance_id: params.distance_id, children: [], isDistance : true ,isAnalysis:true} );
      this.tree.treeModel.update();
    }
    
  }

  addDistanceClick(id,params){
    const node = this.tree.treeModel.getNodeById(id);
    console.log("inserto la distancia...");
    node.data.children.push( { id: this.getID(), name: params.distance_name, dataset_id: params.dataset_id_ref, project_id: params.project_id_ref , distance_id: params.distance_id, children: [], isDistance : true ,isAnalysis:true} );
    this.tree.treeModel.update();
  }

  addOrdination(id,params): any {
    if(params.node_tree){
      const node = this.tree.treeModel.getNodeById(params.node_tree);
      node.data.children.push( { id: this.getID(), name: params.ordination_name, ordination_id: params.ordination_id, dataset_id: params.dataset_id_ref, project_id: params.project_id_ref, children: [], isOrdination: true, isAnalysis:true } );
      this.tree.treeModel.update();
    }else{
      const node = this.tree.treeModel.getNodeById(this.idRepository);
      node.data.children.push( { id: this.getID(), name: params.ordination_name, ordination_id: params.ordination_id, dataset_id: params.dataset_id_ref, project_id: params.project_id_ref, children: [], isOrdination: true, isAnalysis:true } );
      this.tree.treeModel.update();
    }
    
  }

  addOrdinationClick(id,params): any {
    const node = this.tree.treeModel.getNodeById(id);
    node.data.children.push( { id: this.getID(), name: params.ordination_name, ordination_id: params.ordination_id, dataset_id: params.dataset_id_ref, project_id: params.project_id_ref, isOrdination: true, isAnalysis:true } );
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
    node.data.children.push( { id: this.getID(), name: element.dataset_name, project_id: element.project_id_ref, dataset_id: element.dataset_id, children: [], isDataset : true, isAnalysis: true });
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
    var repo = [  { id: this.getID(),user_id: id_user, name: nameProject, children: [],project_id: id, isProject: true}];
    this.nodes = repo.concat(this.nodes);
    this.tree.treeModel.update();
  }

  addDataset(idProject, element){
    let i = this.getIndexByProjectId(idProject);
    this.nodes[i].children.push({ id: this.getID(), name: element.dataset_name, project_id: element.project_id ,dataset_id: element.dataset_id, children: [{id: this.getID(), name: 'Specimens', children: this.generateSpecimenArray(element.data.data, element.objects_name, element.dimention, element.number_of_objects,element.number_of_landmarks), isFolderSpecimen: true}], isDataset : true });
    this.tree.treeModel.update();
  }

  addAnalisys(idProject, element){
    if(element.node_tree){
      const node = this.tree.treeModel.getNodeById(element.node_tree);
      node.data.children.push({ id: this.getID(), name: element.dataset_name, project_id: element.project_id_ref ,dataset_id: element.dataset_id, children: [{id: this.getID(), name: 'Specimens', children: this.generateSpecimenArray(element.data.data, element.objects_name, element.dimention, element.number_of_objects,element.number_of_landmarks), isFolderSpecimen: true}], isDataset : true, isAnalysis: true });
      this.tree.treeModel.update();
    }
    else{
      const node = this.tree.treeModel.getNodeById(this.idRepository);
      node.data.children.push({ id: this.getID(), name: element.dataset_name, project_id: element.project_id_ref ,dataset_id: element.dataset_id, children: [{id: this.getID(), name: 'Specimens', children: this.generateSpecimenArray(element.data.data, element.objects_name, element.dimention, element.number_of_objects,element.number_of_landmarks), isFolderSpecimen: true}], isDataset : true, isAnalysis: true });
      this.tree.treeModel.update();
    }
    
  }

  addDatasetData(id, values) {

    if(!this.loaded_dataset.includes(values.dataset_id) ){
         //MIRAR ACA, IMPLEMENTAR MECANISMO DE CARGA UNA SOLA VEZ EN EL TREE
          this.loaded_dataset.push(values.dataset_id);
          const node = this.tree.treeModel.getNodeById(id);
          var specimen = [{id: this.getID(), name: 'Specimens', children: this.generateSpecimenArray(values.data.data, values.objects_name, values.dimention, values.number_of_objects,values.number_of_landmarks), isFolderSpecimen: true}];
          node.data.children = specimen.concat(node.data.children);
          
          //ajustes
          this.datasetService.getAnalisysById(values.dataset_id).then((result) =>{
            result.forEach(element => {
              if(!this.expanded_nodes_dataset.includes(element.dataset_id)){    
                this.addAnalisysOnly(id,element);
              }
              
            });
          });
          //distances
            this.distanceService.getDistaceByDatasets(values.dataset_id).then((result) =>{
              result.forEach(element => {
                if(!this.expanded_nodes_distance.includes(element.distance_id)){
                  this.addDistance(id,element);
                }
              });
            });

          this.tree.treeModel.update();
    }
 
  }

  addDatasetDataClick(id, values) {

    if(!this.loaded_dataset.includes(values.dataset_id) ){
         //MIRAR ACA, IMPLEMENTAR MECANISMO DE CARGA UNA SOLA VEZ EN EL TREE
          this.loaded_dataset.push(values.dataset_id);
          const node = this.tree.treeModel.getNodeById(id);
          var specimen = [{id: this.getID(), name: 'Specimens', children: this.generateSpecimenArray(values.data.data, values.objects_name, values.dimention, values.number_of_objects,values.number_of_landmarks), isFolderSpecimen: true}];
          node.data.children = specimen.concat(node.data.children);
          
          //ajustes
          this.datasetService.getAnalisysById(values.dataset_id).then((result) =>{
            result.forEach(element => {
              if(!this.expanded_nodes_dataset.includes(element.dataset_id)){    
                this.addAnalisysOnly(id,element);
              }
              
            });
          });
          //distances
            this.distanceService.getDistaceByDatasets(values.dataset_id).then((result) =>{
              result.forEach(element => {
                  this.addDistanceClick(id,element);
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




  project_id = -1;

  deleteData(e){
    var result = confirm("Want to delete?");
    if (result) {
        //Logic to delete the item
        const node = this.tree.treeModel.getNodeById(this.selected_node);
        var index;
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
      index = nodeParent.data.children.findIndex(x => x.id === node.data.id);
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


  export(e){
    var currentNode = this.tree.treeModel.getNodeById(this.selected_node);
    if(currentNode.data.isDataset){
      this.datasetService.getPDFById(currentNode.data.dataset_id).then( (params) => {
        var aux = JSON.parse(params)
        pdfMake.createPdf(aux.pdf).download(aux.dataset_name+'.pdf');
        document.getElementById('buttonClose').click();
      })
    }

    if(currentNode.data.isDistance){
      this.distanceService.getPDFById(currentNode.data.distance_id).then( (params) => {
        var aux = JSON.parse(params)
        pdfMake.createPdf(aux.pdf).download(aux.distance_name+'.pdf');
        document.getElementById('buttonClose').click();
      })
    }

    if(currentNode.data.isOrdination){
      this.ordinationService.getPDFById(currentNode.data.ordination_id).then( (params) => {
        var aux = JSON.parse(params)
        pdfMake.createPdf(aux.pdf).download(aux.ordination_name+'.pdf');
        document.getElementById('buttonClose').click();
      })
    }
    
  }
  
  reload(e){
    this.nodes = [];
    this.projectService.getProjectsByData(this.idUser).then
      ( result => {
          this.sharedDatasetService.setProjects(result);
       });
    this.loaded_dataset = [];
    this.expanded_nodes_dataset = [];
    this.expanded_nodes_distance = [];
    this.expanded_nodes_ordination = [];
    this.tree.treeModel.update();
  }

  //onclik events. The output depends of clicked item.
  onClick(e) {
    var currentNode = e.node.data;

    if(currentNode.isProject && (currentNode.folder_opened === undefined) && !this.expanded_nodes.includes(currentNode.id)){
        console.log(e.index);        
        this.loadDatasetsByProject(currentNode);
    }

   
    
    if(currentNode.isDataset && !this.expanded_nodes_dataset.includes(currentNode.dataset_id)){
      this.expanded_nodes_dataset.push(currentNode.dataset_id);

      currentNode.loaded = true;
      var data = this.cache.GetDataset(currentNode.dataset_id)
      if(data != null){
        this.addDatasetDataClick(currentNode.id,JSON.parse(data));
        this.sharedDatasetService.sendMessage(data);
        
      }
      else{
        this.datasetService.getDatasetsById(currentNode.dataset_id).then((result) =>{
          this.addDatasetDataClick(currentNode.id,JSON.parse(result));
          this.sharedDatasetService.sendMessage(result);   
        });
      }
      

    }

    if(currentNode.isDistance && !this.expanded_nodes_distance.includes(currentNode.distance_id)){
      this.expanded_nodes_distance.push(currentNode.distance_id);   
      var data = this.cache.GetDistance(currentNode.distance_id);
      if(data != null){
        if(!this.expanded_nodes_distance.includes(data.distance_id)){
          this.sharedDatasetService.setDistance(data);
        }
      }
      else{
        this.distanceService.getDistanceById(currentNode.distance_id).then((result) =>{
          if(!this.expanded_nodes_distance.includes(result.distance_id)){
            this.cache.AddDistance(result.distance,result);
            this.sharedDatasetService.setDistance(result);       
          }
        });
      }

      this.ordinationService.getOrdinationsById(currentNode.dataset_id,currentNode.project_id, currentNode.distance_id).then((result) => {
        result.forEach(element => {
          if(!this.expanded_nodes_ordination.includes(element.ordination_id)){
            this.addOrdinationClick(currentNode.id,element);
          }
        });
      });
      
    }



    if(currentNode.folder_opened){
      this.isRepository = true;
    }

    if(currentNode.isOrdination && !this.expanded_nodes_ordination.includes(currentNode.ordinaton_id)){
      this.expanded_nodes_ordination.push(currentNode.ordination_id);
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

  exportCSV(){
  const node = this.tree.treeModel.getNodeById(this.selected_node);
  if(node.data.isDataset){
      this.datasetService.getDatasetsById(node.data.dataset_id).then(result => {
        var value = JSON.parse(result);
        this.download(this.ConvertToCSVDataset(value.data.data,value.objects_name),value.dataset_name);
    });
  }

  if(node.data.isDistance){
    this.distanceService.getDistanceById(node.data.distance_id).then( result => {
        var value = JSON.parse(result);
        this.download(this.ConvertToCSVDistance(value.data,value.objects_name),value.distance_name);
    });
  }

  if(node.data.isOrdination){
    this.ordinationService.getOrdinationById(node.data.ordination_id).then( result => {
      var value = JSON.parse(result);
      this.download(this.ConvertToCSVDistance(value.data,value.objects_name),value.ordination_name);
    });
  }

  document.getElementById('buttonClose').click();
  }
  
    // Download CSV
    download(csvData:any, filename:string){
      var a: any = document.createElement("a");
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      var blob = new Blob([csvData], { type: 'text/csv' });
      var url= window.URL.createObjectURL(blob);
      a.href = url;
      
      var isIE = /*@cc_on!@*/false || !!(<any> document).documentMode;
      
      if (isIE)
      {   
          var retVal = navigator.msSaveBlob(blob, filename+'.csv');
      }
      else{
          a.download = filename+'.csv';
      }
      // If you will any error in a.download then dont worry about this. 
      a.click();
  }


    // convert Json to CSV data
    ConvertToCSVDataset(data,names) {
        var file = "";
        console.log(data);
        console.log(names);
        for (var i = 0; i < names.length; i++) {
            
            var object = data[i]["specimen"+i];
            console.log(object);
            file += names[i] + '\r\n';
            for(var j=0; j <object.length; j++ ){
              file += this.buildRow(object[j]);
            }
            file += '\r\n';
        }
        return file;
    }

    // convert Json to CSV data
    ConvertToCSVDistance(data,names) {
      var file = "";
      console.log(data);
      console.log(names);
      for (var i = 0; i < data.length; i++) {
          file += this.buildRowDistance(data[i],names[i]);
      }
      return file;
  }
    
  buildRow(array){
    var line = "";
    for (var i = 0; i < array.length; i++) {
      line += array[i]+',';
        }
    line += '\r\n';
    return line;
  }

  buildRowDistance(array,name){
    var line = name+",";
    for (var i = 0; i < array.length; i++) {
      line += array[i]+',';
        }
    line += '\r\n';
    return line;
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
      if(currentNode.isAnalysis){
        this.isAnalysis = true;
      }
      this.isProject = false;
      this.isRepository = false;
    }

    if(currentNode.isRepository){
      this.isRepository = true;
    }
   
    if(currentNode.isOrdination){
      //this.selected_node = currentNode.id;
      this.isDataset = false;
      this.isDistance = false;
      this.isAnalysis = true;
      this.isProject = false;
      this.isRepository = false;
    }  

    if(currentNode.isDistance){
      //this.selected_node = currentNode.id;
      this.sharedDatasetService.setSelectedDistance({ node: currentNode.id, name: currentNode.name, dataset_id: currentNode.dataset_id, project_id: currentNode.project_id, distance_id: currentNode.distance_id});
      this.isDistance = true;
      this.isAnalysis = true;
      this.isProject = false;
      this.isRepository = false;
    }    

    if(currentNode.isProject){
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

      this.isRepository = false;
      this.isAnalysis = false;
      this.isProject = true;
    } 
  }

  
}
