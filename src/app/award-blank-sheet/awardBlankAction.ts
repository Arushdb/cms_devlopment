import { HttpParams } from "@angular/common/http";
import { ColDef } from "ag-grid-community";
import { UserService } from "../services/user.service";


 
 export class awardBlankAction{

    constructor(
        private userservice:UserService,
                  
        ) { }

    public columnDefs:ColDef[]=[];  
    buttonPressed:string=null;
    componentAC:[];
    //  entityId:string=null;
	//  programId:string=null;
	//  entityType:string=null;
	//  branchId:string=null;
	//  specializationId:string=null;
	//  semesterId:string=null;
	//  courseCode:string=null;
	//  courseName:string=null;
	//  sessionStartDate:string=null;
	//  sessionEndDate:string=null;
	//  resultSystem:string=null;
	//  entityName:string=null;
	// programName:string=null;
	//  branchName:string=null;
	// specializationName:string=null;
	//  semesterName:string=null;
	// entityTypeName:string=null;
	// public var pendingList:PendingRequest;
	// public var approvedList:ApprovedRequest;
	// public var rejectedList:RejectedRequest;
    // msg:string;
    // semesterStartDate:string;
	// semesterEndDate:string;
	// prevousEmployeeId:string;
    // employeeName:String;
    

 setButtonPressed(status){

    console.log(status)
    this.buttonPressed=status;
}
 setVariables(awardsheet_params){

    console.log(this.buttonPressed);
    if(this.buttonPressed==='SW'){ // show button
        //Mask.show(commonFunction.getMessages('pleaseWait'));
console.log("inside setvariables",awardsheet_params);

        this.getEvaluationComponents(awardsheet_params);			
    }
}

    getEvaluationComponents(awardsheet_params:HttpParams){


        let obj = {xmltojs:'Y',
        method:'None' };   
      obj.method='/awardsheet/getEvaluationComponents.htm';
      
      this.userservice.getdata(awardsheet_params,obj).subscribe(res=>{
        //this.userservice.log(" in switch detail selected");
        res = JSON.parse(res);
        this.resultHandlerComponent(res);
      
    })

       

    }

    resultHandlerComponent(res){

        console.log(res);
    //     componentXml=event.result as XML;
		   	
    //     if(componentXml.sessionConfirm == true){
    //      Alert.show(commonFunction.getMessages('sessionInactive'),commonFunction.getMessages('error'), 4, null,null,errorIcon);
    //      this.parentDocument.vStack.selectedIndex=0;
    //      this.parentDocument.loaderCanvas.removeAllChildren();
    //  }
        
        //componentAC.removeAll();

       let componentAC:any[] = [];
       let  flag:Boolean=true;
     
        for (let object of res.ComponentList.component){
            componentAC.push({evaluationId:object.evaluationId,evaluationIdName:object.evaluationIdName,group:object.group,
            rule:object.rule,idType:object.idType,displayType:object.displayType,maximumMarks:object.maximumMarks,componentType:object.componentType});
        }

        console.log("component AC",componentAC);
        if(componentAC.length==0){
        //     Alert.show(commonFunction.getMessages('componentMissing'),"Info",null,null,null,infoIcon);
        //  awardSheetCanvas.visible=false;
        //  Mask.close();
        }
        else{	
            
            this.setColumnsmk(componentAC);
        //  param["entityId"]=entityId;
        //  param["programId"]=programId;
        //  param["branchCode"]=branchId;
        //  param["specCode"]=specializationId;
        //  param["semesterCode"]=semesterId;
        //  param["courseCode"]=courseCode;
        //  param["displayType"]=displayType;
        //  param["programCourseKey"]=programCourseKey;
         
        //  if(buttonPressed=='PL'){
        //      param["startDate"]=sessionStartDate;
        //      param["endDate"]=sessionEndDate;
        //  }else{
        //      param["startDate"]=semesterStartDate;
        //      param["endDate"]=semesterEndDate;
        //  }
        //  param["buttonPressed"]=buttonPressed;
        //  httpStudentList.send(param);
 }

    }


    setColumnsmk(columns) {
        this.columnDefs = [];
        columns.forEach((column: any) => {
          
          console.log("set columns",column);
          let definition: ColDef = { headerName: column.evaluationIdName, field: column.evaluationId, width: 120 };
        //    if (column === 'courseCode' ) {
        //      definition.checkboxSelection=true;
        //   //   // definition.cellRendererFramework = MyLinkRendererComponent;
        //   //   // definition.cellRendererParams = {
        //   //   //   inRouterLink: column,
        //   //   //};
        //    } else if (column ==='Seq_No') {
        //    // definition.valueGetter=this.hashValueGetter;
        //     definition.maxWidth=50;
        //     definition.headerName="Seq_No";
    
        //   //   definition.valueFormatter = (data) => this.dateFormatter.transform(data.value, 'shortDate');
        //   // } else if (column === 'price') {
        //   //   definition.valueFormatter = (data) => this.numberFormatter.transform(data.value, '1.2-2');
        //   //   definition.type = 'numericColumn';
        //    }
          this.columnDefs.push(definition);
        });
    
    
        console.log("colmn definitions",this.columnDefs);
      }
    
  
}



