import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedDatasetService {
    private subject = new Subject<any>();
    private subjectProject = new Subject<any>();
    private userProjects = new Subject<any>();


    sendMessage(message: any) {
        this.subject.next(JSON.parse(message));
    }

    setNameProject(value: any) {
        this.subjectProject.next(value);
    }

    getNewProject(): Observable<any> {

        console.log('retorno el id');
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

        console.log('retorno el id');
        return this.userProjects.asObservable();
    }
}
