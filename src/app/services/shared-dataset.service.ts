import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedDatasetService {
  
    private subject = new Subject<any>();
    private subjectProject = new Subject<any>();
    private userProjects = new Subject<any>();
    private distanceResult = new Subject<any>();
    private ordinationResult = new Subject<any>();
    private deleteDatasetView = new Subject<any>();
    private deleteDistanceView = new Subject<any>();
    private deleteOrdinationView = new Subject<any>();
    private selected_dataset = new Subject<any>();
    private isFinished = new Subject<any>();
    private isNew = new Subject<any>();
    private selected_distance = new Subject<any>();
    private notification_count = new Subject<any>();
    private error_login = new Subject<any>();
    private description_msg = new Subject<any>();
    private subjectAnalysis = new Subject<any>();

    private exclutions  = new Subject<any>();
    setDistance(distance: any){
        this.distanceResult.next(JSON.parse(distance));
    }

    getServerIP(){
        return "localhost:80"
    }

    getDistance() : Observable<any> {
        return this.distanceResult.asObservable();
    }

    setOrdination(ordination: any){
        this.ordinationResult.next(JSON.parse(ordination));
    }

    getOrdination() : Observable<any> {
        return this.ordinationResult.asObservable();
    }
    
    sendAnalysis(message: any){
        this.subjectAnalysis.next(JSON.parse(message));
    }

    getAnalysis() : Observable<any> {
        return this.subjectAnalysis.asObservable();
    }

    sendMessage(message: any) {
        this.subject.next(JSON.parse(message));
    }

    setNameProject(value: any) {
        this.subjectProject.next(value);
    }

    getNewProject(): Observable<any> {
        return this.subjectProject.asObservable();
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    setProjects(value: any) {
        this.userProjects.next(value);
    }

    getUserProjects(): Observable<any> {
        return this.userProjects.asObservable();
    }

    //New to delete 
    setDatasetViewDelete(value: any) {
        this.deleteDatasetView.next(value);
    }

    getDatasetViewDelete(): Observable<any> {
        return this.deleteDatasetView.asObservable();
    }

    setDistanceViewDelete(value: any) {
        this.deleteDistanceView.next(value);
    }

    getDistanceViewDelete(): Observable<any> {
        return this.deleteDistanceView.asObservable();
    }

    setOrdinationViewDelete(value: any) {
        this.deleteOrdinationView.next(value);
    }

    getOrdinationViewDelete(): Observable<any> {
        return this.deleteOrdinationView.asObservable();
    }

    setSelectedDataset(value: any) {
        this.selected_dataset.next(value);
    }

    getSelectedDataset(): Observable<any> {
        return this.selected_dataset.asObservable();
    }

    setSelectedDistance(value: any) {
        this.selected_distance.next(value);
    }

    getSelectedDistance(): Observable<any> {
        return this.selected_distance.asObservable();
    }

    finishedAnalisys(value: any) {
        this.isFinished.next(JSON.parse(value));
    }

    isFinishedAnalisys(): Observable<any> {
        return this.isFinished.asObservable();
    }

    newAnalisys(value: any) {
        this.isNew.next(value);
    }

    isNewAnalisys(): Observable<any> {
        return this.isNew.asObservable();
    }

    setNotificationCount(value: any) {
        this.notification_count.next(value);
    }

    getNotificationCount(): Observable<any> {
        return this.notification_count.asObservable();
    }

    setErrorLogin(value: any) {
        this.error_login.next(value);
    }

    getErrorLogin(): Observable<any> {
        return this.error_login.asObservable();
    }

    setDescription(value: any) {
        this.description_msg.next(value);
    }

    getDescription(): Observable<any> {
        return this.description_msg.asObservable();
    }

    setExclutionObject(value: any) {
        this.exclutions.next(value);
    }

    getExclutionObject(): Observable<any> {
        return this.exclutions.asObservable();
    }
}
