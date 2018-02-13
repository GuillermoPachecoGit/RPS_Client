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


    setDistance(distance: any){
        this.distanceResult.next(JSON.parse(distance));
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
    

    sendMessage(message: any) {
        console.log(message);
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
}
