import { HttpParams, HttpResponse } from '@angular/common/http';
import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {Location} from '@angular/common';


import {UserService} from  'src/app/services/user.service' ;
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/common/dialog.component';


@Component({
  selector: 'register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class RegisterStudentComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
   pgm: any;
   branch: any;
   spec: any;
   sem: any;
   maxcredit: any;
   mincredit: any;
   attempt: any;
   crselected: any;
   entity: any;
  
  
    title = 'my-app';
  semDetail:any;
   tencode:any;
   studentDetail:any;
   url:String;
   urlPrefix:String;
  
   programId:String;
   branchId:String;
   specializationId:String;
    entityId:String;
   semester:String;
  
   semesterStartDate:String;
   semesterEndDate:String
   pck:String;
   creditavailable:number;
   creditselected:number;
  
   credittheory:number;
   creditpractical:number;
   maxcreditrequired:number;
   mincreditrequired:number;
   attemptno:number;
   wrkAC:any;
   selectedbranchId:String ;
   selectedspcId:String;
 
   
   regdataAC:any ;
   selecteddata:any ;
   studentdetailAC:any ;

  public myrowData=[];

   selectedNodes:any;
 

  defaultColDef = {
    sortable: true,
    filter: true
       
};

columnDefs = [
  { field: 'courseCode',checkboxSelection: true  },
  { field: 'coursename' },
  { field: 'credits' }
];
// columnDefs = [
//   { field: 'make' },
//   { field: 'price' }
// ];

   params = new HttpParams()
  .set('application','CMS');

  myparam = new HttpParams()
  .set('application','CMS');

  constructor(private router:Router,
    private userservice:UserService,
    private route:ActivatedRoute,
    
    private location:Location,
    public dialog: MatDialog

    ) { 
      
  }

  ngOnInit(): void {
    console.log(this.route.outlet);
    console.log(this.route.snapshot.pathFromRoot);

    // this.url="/registrationforstudent/" ;//getregistrationdetail.htm";

	  
	  // var CurrentDateTime:Date = new Date();
	  // this.param["date"] = CurrentDateTime ;

	  // this.urlPrefix = this.url+"gettencodes.htm";
   
 
    this.gettencode();
  }

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    console.log(selectedNodes);
    const selectedData = selectedNodes.map(node => node.data );
    console.log(selectedData);
    const selectedDataStringPresentation = selectedData.map(node => node.courseCode + ' ' + node.coursename).join(', ');

    //alert(`Selected nodes: ${selectedDataStringPresentation}`);

    const dialogRef =this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    
    
    });


}

  gettencode(){
      let obj = {xmltojs:'Y',
      method:'/registrationforstudent/gettencodes.htm' };   
  
        this.userservice.getdata(this.params,obj).subscribe(res=>{
          res= JSON.parse(res);
          this.gettencodeSuccess(res);
         });
        }

      //public function
 gettencodeSuccess(res){
 //let data = null;
 
  let myparam = {};
    for (var  obj of  res.registerDetails.Detail ){
    
    if(obj.switchType!=""){
          //if there is a switch
      //Alert.show("switch type"+obj.switchType);
      myparam["module"] ="";
      myparam["switchType"] = obj.switchType ;
          myparam["entitytype"]=obj.entitytype;
          myparam["entityId"]= obj.entityId;
          myparam["entityName"]= obj.entityName;
          
          myparam["switchoption"] = obj.switchoption ;
          
          myparam["currentpck"] = obj.programcoursekey ;
          myparam["newpck"] = obj.newpck ;
          myparam["semesterStartDate"] = obj.semesterStartDate ;
          myparam["semesterEndDate"] = obj.semesterEndDate ;
    }
    
    if(obj.available=="Y"){
       /*   
       vstack.selectedChild=sempanel;
       */
    break;	
    }else{
      
      
      //urlPrefix = url+"getswitchdetail.htm";
      
        //getswitchdetailservice.send(param);
        this.getswitchdetail();
        break;
    }
    
    
    }
   
 }  

  getswitchdetail(){
   // this.params=this.params.set('method','/registrationforstudent/getswitchdetail.htm');
   // console.log(this.params);
   let obj = {xmltojs:'Y',
      method:'None' };   
    obj.method='/registrationforstudent/getswitchdetail.htm';
   
    this.userservice.getdata(this.params,obj).subscribe(res=>{
      //this.userservice.log(" in switch detail selected");
      res = JSON.parse(res);
      console.log('switch_detail',res); 

      this.getswitchdetailSuccess(res);
      // xml2js.parseString( res, function (err, result){
      //  data = result;
        
      // });

      // console.log(data);

      // if(data.registerDetails.Detail[0].available as string =="N"){
      //   this.getcourses();
    
      // }




  })

  }

  getswitchdetailSuccess(res){
		
    //Alert.show("Arush switch detail success"+semDetail);
  
  //urlPrefix = url+"getcourses.htm";
  for (var  obj of  res.registerDetails.Detail ){
    console.log("Object available",obj.available);
    if(obj.available=="N"){
      console.log(" in Object available",obj.available);
    this.params["switchType"] = "NON" ;
    this.params["module"]="";
    
    //getcoursesservice.send(param);    
    this.getcourses();
    break;
    }else{
      
    //	Alert.show("entity detail"+obj.entitytype +"f"+obj.entityId);
      this.params["module"] ="";
      this.params["switchType"] = obj.switchType ;
      this.params["entitytype"]=obj.entitytype;
      this.params["entityId"]= obj.entityId;
      this.params["entityName"]= obj.entityName;
      this.params["switchoption"] = obj.switchoption ;
          
      this.params["currentpck"] = obj.programcoursekey ;
      this.params["newpck"] = obj.newpck ;
      this.params["semesterStartDate"] = obj.semesterStartDate ;
      this.params["semesterEndDate"] = obj.semesterEndDate ;
      
      console.log("Switch option",obj.switchoption);
      if (obj.switchoption=="FIX"){
        
      if (obj.newpck==""){
        //errorlabel.text ="Switch setup not ready";
    
        //vstack.selectedChild=errorpanel;	
        return;
      }	
      this.getcourses();
          //getcoursesservice.send(param);	
      }
      
      if (obj.switchoption=="BRN"){
        
      if (obj.newpck==""){
        //errorlabel.text ="Switch setup not ready";
    
        //vstack.selectedChild=errorpanel;	
        return;
      }	
       // urlPrefix = url+"getbranches.htm";					
       // getbrnservice.send(param);
            
      }
      
      if (obj.switchoption=="SPC"){
        
      if (obj.newpck==""){
        //errorlabel.text ="Switch setup not ready";
    
        //vstack.selectedChild=errorpanel;	
        return;
      }	
      
      //urlPrefix = url+"getspeclizations.htm";					
           
      //getspcservice.send(param);
            
      }
      
      
    }			
    
  }
  
}


  getcourses(){
   // this.params=this.params.set('method','/registrationforstudent/getcourses.htm');
   let myparam = {xmltojs:'Y',
   method:'None' };  
    myparam.method='/registrationforstudent/getcourses.htm';
    this.params=this.params.append('switchType','NON');
    this.params=this.params.append('module','');
  
    this.userservice.getdata(this.params,myparam).subscribe(res=>{
    //   let data = null;
    //   xml2js.parseString( res, function (err, result){
    //    data = result;
    // });
    res = JSON.parse(res);

    this.getcoursesSuccess(res );
   // this.myrowData=data;

    // console.log("in get courses",data);

    // this.userservice.log("courses selected");
    

   
   //this.myrowData = this.rowData;
   

   // this.myrowData = this.rowData;
    //console.log(this.myrowData);
    
  });
 
  


} 

 getcoursesSuccess(res ){
	//semDetail = event.result as XML;
  //regdataAC = new ArrayCollection();
  console.log("courses",res);

  this.myrowData=res.registerDetails.Detail;
	var start:number=0;
	
	
	//Alert.show("arush"+semDetail);

	for (var obj of  res.registerDetails.Detail){
		
		if(obj.available=='N'){
			//errorlabel.text=obj.message;
			//vstack.selectedChild=errorpanel;	
  //		Alert.show("Error :"+obj.message);
  
  			return;
			
		}else{
		//	vstack.selectedChild=regpanel;
			//vstack.selectedChild=regpanel;	
			 if(start==0){
			 	
		
       this.maxcredit="Max Credits Required:"+obj.maxcredit;
       console.log("in start",this.maxcredit.text,"arush",obj.maxcredit);
			 this.mincredit="Min Credits Required:"+obj.mincredit;
			 this.maxcreditrequired =parseFloat(obj.maxcredit);
			 this.mincreditrequired =parseFloat(obj.mincredit);
			 this.programId =obj.programId;
			 this.pgm = obj.programname;
			 
			 this.branchId = obj.branchId;
			 this.branch=obj.branch;
			 
			 this.pck = obj.programcoursekey ;
			 
			 this.specializationId = obj.specializationId;
			 if(obj.speclization=="NONE"){
			 	this.spec = "";
			 }else{
			 	this.spec ="Specialization:"+obj.speclization;
			 }
			 
			 this.sem="Semester:".concat(obj.semestercode);
			 this.semester =obj.semestercode ;
			 this.attempt="Attempt No:"+obj.attemptNumber;
			 this.attemptno =obj.attemptNumber ;
			 
       this.semesterStartDate = obj.semesterStartDate;
       this.semesterEndDate= obj.semesterEndDate;
       this.entityId = obj.entityId ;
       this.entity = obj.entityName ;
       this.creditavailable = obj.creditavailable;
			// Alert.show("creditavailable:"+creditavailable +"  max credit:"+maxcredit.text);
			 
		start++;
		}
		// regdataAC.addItem({
		// sst:obj.semesterStartDate,sed:obj.semesterEndDate,coursetype:obj.coursetype,
		// courseCode:obj.courseCode,coursename:obj.coursename,courseclassification:obj.courseclassification,
		// credits:obj.credits,maxcredit:obj.maxcredit,mincredit:obj.mincredit
		
		
		//});
			}
	}
			
	
			
			// compulsoryCourseGrid.dataProvider=regdataAC;
			// regdataAC.refresh();
			

	
	










}
goBack(): void {
  this.location.back();
}
 submit(){
		
	
  //var subjectselected:ArrayCollection=compulsoryCourseGrid.dataProvider as ArrayCollection;
  
  //var subjectselected =this.getSelectedRows();

  const selectedNodes = this.agGrid.api.getSelectedNodes();

  console.log("Selected Nodes",selectedNodes);
  const subjectselected = selectedNodes.map(node => node.data );
  console.log("Subject selected ",subjectselected);

   
  const dialogRef =this.dialog.open(DialogComponent,
                  {data:{title:"Hello",content:"Press Ok to continue Cancel to Discard"}
              });

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
  
  //const subjectselected = this.agGrid.api.getSelectedNodes();
  //console.log(selectedNodes);
  //const subjectselected1 = subjectselected.map(node => node.data );
 // const subjectselected1 = selectedNodes.map(node => node.data );

    var instructorAssigned:number=0;
    this.credittheory = 0;
    this.creditpractical=0;
    this.creditselected = 0;
    semestermincredit =0;
    semestermaxcredit =0;
    //selecteddata.removeAll();
    
   //submitButton.enabled=false;
   
    
    var semestermaxcredit:number=0;
    var semestermincredit:number=0;
  
    //for(var d:number=0;d<subjectselected.length;d++)
    for (var gridItem of subjectselected) 
    {
        
      
     // var gridItem:Object=subjectselected.getItemAt(d);
         
        semestermaxcredit=parseFloat(gridItem.maxcredit);
        semestermincredit=parseFloat(gridItem.mincredit);
        
        
                 // if(gridItem.select==true)
          // ||
          if(
          (this.creditavailable<=this.mincreditrequired)
          ||
          gridItem.select==true
         
          )
           
           
           
            {
               // Alert.show("gridItem.credits="+gridItem.credits)
               
               console.log("grid item",gridItem.credits);
            	this.creditselected+=parseFloat(gridItem.credits);
            	//this.selecteddata.addItem([gridItem.courseCode]);
            	if(gridItem.courseclassification=="T"){
            		this.credittheory += parseFloat(gridItem.credits);
            	}else{
            		this.creditpractical += parseFloat(gridItem.credits);
            	}
        	  	           	  	
            
     }
     
     }
     //Alert.show("creditselected"+creditselected);
     this.crselected="Credits Selected:"+this.creditselected;
//      Alert.show("creditselected:"+creditselected+
//      "Theory Credit:"+credittheory +"Practical credit:"+creditpractical+
//      
//      "semestercredit"+semestercredit+"creditavailable:"+creditavailable +"creditrequired:"+creditrequired);
      
      console.log("credit selected",this.creditselected);
      
          if(
          (this.creditselected>=semestermincredit)&&(this.creditselected<=semestermaxcredit)
          // ||
          //(creditavailable<=mincreditrequired)
           
           )
           {
           	
           
           	
			  // Alert.show(commonFunction.getMessages('conformForContinue'),
			  // commonFunction.getMessages('confirm'),(Alert.YES|Alert.NO),null,onOK,questionIcon);
           }
           else
           {
          
         
            // Alert.show(("You selected :"+ creditselected +" credits ." +"Please select at least :"+semestermincredit),
            // (commonFunction.getMessages('error')),0,null,null,errorIcon);
           
            return;	
            
           }
           
           
  }



}
