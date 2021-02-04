import { HttpParams } from "@angular/common/http";
import { ColDef } from "ag-grid-community";
import { UserService } from "../services/user.service";


 
 export class awardBlankAction{

    constructor(
        private userservice:UserService,
                  
        ) { }


        submitConfirm(){
        console.log("test");

        }

        
  
}



