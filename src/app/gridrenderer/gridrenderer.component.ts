import { HttpParams } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GridReadyEvent } from 'ag-grid-community';
import { UserService } from '../services/user.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-gridrenderer',
  templateUrl: './gridrenderer.component.html',
  styleUrls: ['./gridrenderer.component.css']
})
export class GridrendererComponent implements OnInit {
  urlPrefix:any;
  param = new HttpParams()
  .set('application','CMS');
  public myrowData=[];
  defaultColDef = {
    sortable: true,
    filter: true
       
};
hashValueGetter = function (params) {
  return params.node.rowIndex;
};

columnDefs = [
  {
    headerName: 'Seq No',
    maxWidth: 100,
    valueGetter: this.hashValueGetter,
  },
  { field: 'courseCode',checkboxSelection: true  },
  { field: 'coursename' },
  { field: 'credits' }
];

  constructor(private router:Router,
    private userservice:UserService,
    private route:ActivatedRoute,
    
    
    private location:Location,
    public dialog: MatDialog,
    private renderer:Renderer2

    ) { 
      
  }

  ngOnInit(): void {
    this.moduleCreationCompleteHandler();
  
  }

 moduleCreationCompleteHandler():void{
		
		this.urlPrefix="/awardsheet/";
		//var param:Object = new Object();
//Change Done By Dheeraj For Allowing Access To Examination Dept. For Entering External And Remedial Marks
//		param["time"]=new Date();
this.param=this.param.append('displayType',"I");
		
		this.employeeCourseHttpService(this.param);
  }
  
  employeeCourseHttpService(param){
    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/awardsheet/getCourseList.htm';
  
  this.userservice.getdata(param,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.employeeCourseHttpServiceResultHandler(res);
    console.log(res);
})
  }


  // employeeCourseHttpServiceResultHandler(res){
  //  console.log(res);
  // }
  //=====
  private function employeeCourseHttpServiceResultHandler(res):void{

    console.log(res);
		var employeeCourse:XML = event.result as XML;
//		Alert.show(employeeCourse);
		if (displayType=="I"){
			courselabel.text = "Select Course to enter internal Marks " ;
			
		} else if (displayType=="E"){
			courselabel.text = "Select Course to enter External Marks " ;
		}else{
			courselabel.text = "Select Course to enter Remedial " ;
		}
		
		
		if(employeeCourse.sessionConfirm == true){
    		Alert.show(commonFunction.getMessages('sessionInactive'),commonFunction.getMessages('error'), 4, null,null,errorIcon);
    		this.parentDocument.vStack.selectedIndex=0;
			this.parentDocument.loaderCanvas.removeAllChildren();
    	}
		
		var param:Object =new Object();
	 	param["time"]=new Date();
		gradeHttpService.send(param);
		
		if(String(employeeCourse+"").length==0){
			httpEmployeeCode.send(param);
		}
		else{
			employeeCourseArrCol=new ArrayCollection();
			for each(var obj:Object in employeeCourse.root){
				employeeCourseArrCol.addItem({select:false,entityId:obj.entityId, programId:obj.programId, programName:obj.programName, 
				branchId:obj.branchId, branchName:obj.branchName, specializationId:obj.specializationId, 
				specializationName:obj.specializationName, semesterCode:obj.semesterCode, semesterName:obj.semesterName, 
				semesterStartDate:obj.semesterStartDate, semesterEndDate:obj.semesterEndDate, courseCode:obj.courseCode, 
				courseName:obj.courseName, programCourseKey:obj.programCourseKey, resultSystem:obj.resultSystem, 
				employeeCode:obj.employeeCode, entityType:obj.entityType, entityName:obj.entityName, 
				startDate:obj.startDate, endDate:obj.endDate, employeeName:obj.employeeName, gradelimit:obj.gradelimit,createrId:obj.creatorId});
			LoggedInUser=obj.creatorId;
			}
			
			courseListGrid.dataProvider=null;
			courseListGrid.dataProvider=employeeCourseArrCol;
			employeeCode=employeeCourseArrCol.getItemAt(0).employeeCode;
			
			Mask.close();
			var params:Object=new Object();
			params["employeeCode"]=employeeCode;
			params["displayType"]=displayType;
			httpPendingRequests.send(params);
			// httpApprovedRequests & httpRejectedRequests service calling the same 
			// serverside method with different status 
			params["status"]="APR";
			httpApprovedRequests.send(params);  
			params["status"]="REJ";
			httpRejectedRequests.send(params);
		}
	}
	
  //=====

  OngridReady(parameters:GridReadyEvent){
    //this.agGrid.api.forEachNode((node,index)=>{console.log(node,index)});


      //if(this.mincreditrequired===this.maxcreditrequired){
        parameters.api.selectAll();
      
        //this.check=true;
        //this.suppressRowDeselection=true;

  }
 
 
   


  }

