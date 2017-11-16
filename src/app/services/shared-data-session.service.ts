import { Injectable } from '@angular/core';

@Injectable()
export class SharedDataSessionService {
    private userId:string;
  
    constructor(){
      this.userId = "";
    }
  
    setUserId (data) {
      this.userId = data;
    }
    getUserId () {
      return this.userId;
    }

}
