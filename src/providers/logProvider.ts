import { Injectable } from '@angular/core';



@Injectable()
export class LogProvider {


    logArray: any[] = new Array();
    constructor() { }

    log(logMsg, arr:any="") {
        console.log(logMsg, arr)
        this.logArray.push(logMsg);
    }


}