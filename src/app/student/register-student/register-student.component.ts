import { HttpParams, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, Renderer2, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {Location} from '@angular/common';

import * as Collections from 'typescript-collections';
//import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {MyItem} from 'src/app/interfaces/my-item';



import {UserService} from  'src/app/services/user.service' ;
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import {alertComponent} from  'src/app/shared/alert/alert.component'

import { CustomComboboxComponent } from 'src/app/shared/custom-combobox/custom-combobox.component';
import { GridReadyEvent } from 'ag-grid-community';




@Component({
  selector: 'register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class RegisterStudentComponent implements AfterViewInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('CustomComboboxComponent') custcombo: CustomComboboxComponent;
  combowidth: string;
  public displaybutton: boolean =false;
  //suppressRowDeselection = false;
  check=false;
  
  //  mode: ProgressSpinnerMode = 'indeterminate';
  // color: ThemePalette = 'primary';
  // value = 50;

  constructor(private router:Router,
    private userservice:UserService,
    private route:ActivatedRoute,
    
    
    private location:Location,
    public dialog: MatDialog,
    private renderer:Renderer2

    ) { 
      
  }
  ngAfterViewInit(): void {
    
  }

  // OnSelectAll(){
  //   this.agGrid.api.selectAll();
  // }
  Onchange(){
    console.log(this.check);
    this.check?this.agGrid.api.selectAll():this.agGrid.api.deselectAll();
  }

  OngridReady(parameters:GridReadyEvent){
    //this.agGrid.api.forEachNode((node,index)=>{console.log(node,index)});


      if(this.mincreditrequired===this.maxcreditrequired){
        parameters.api.selectAll();
      
        this.check=true;
        //this.suppressRowDeselection=true;

  }
  }

  ngOnInit(): void {
    this.gettencode();
  }
  itemselected:MyItem;
  combolabel:string;
   mask:boolean=false;
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
   url:string;
   urlPrefix:string;
  
   programId:string;
   branchId:string;
   specializationId:string;
    entityId:string;
   semester:string;
  
   semesterStartDate:string;
   semesterEndDate:string
   pck:string;
   creditavailable:number;
   creditselected:number;
  
   credittheory:number;
   creditpractical:number;
   maxcreditrequired:number;
   mincreditrequired:number;
   attemptno:number;
   wrkAC:any;
   selectedbranchId:string ;
   selectedspcId:string;

  
    
   
   regdataAC:any ;
   //selecteddata=new Collections.Set<string>();
     selecteddata:string=""; 
   studentdetailAC:any ;

   spinnerstatus:boolean=false;

  public myrowData=[];

   selectedNodes:any;
 

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


   params = new HttpParams()
  .set('application','CMS');

  myparam = new HttpParams()
  .set('application','CMS');
  
  public combodata :MyItem []=[];

 

//   getSelectedRows() {
//     const selectedNodes = this.agGrid.api.getSelectedNodes();
//     console.log(selectedNodes);
//     const selectedData = selectedNodes.map(node => node.data );
//     console.log(selectedData);
//     const selectedDataStringPresentation = selectedData.map(node => node.courseCode + ' ' + node.coursename).join(', ');

//     //alert(`Selected nodes: ${selectedDataStringPresentation}`);

//     const dialogRef =this.dialog.open(alertComponent);
//     dialogRef.afterClosed().subscribe(result => {
//       console.log(`Dialog result: ${result}`);
    
    
//     });


// }

  gettencode(){
      let obj = {xmltojs:'Y',
      method:'/registrationforstudent/gettencodes.htm' };   
     this.mask=true;
        this.userservice.getdata(this.params,obj).subscribe(res=>{
          res= JSON.parse(res);
          this.gettencodeSuccess(res);
          this.mask=false;
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
      for (var num:number =1;num<17;num++ ){
  
        this.combodata.push({id:num.toString(),label:num.toString()});
      
      }
  
    
     this.combolabel = "Select Module" ;
     this.combowidth = "50%";
     console.log("In Module",this.combodata); 
    
      return;
      

    
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
    this.mask=true;
    this.userservice.getdata(this.params,obj).subscribe(res=>{
      //this.userservice.log(" in switch detail selected");
      res = JSON.parse(res);
      this.mask=false;
      console.log('switch_detail',res); 

      this.getswitchdetailSuccess(res);
     




  })

  }

  getswitchdetailSuccess(res){
		
    //Alert.show("Arush switch detail success"+semDetail);
  
 
  for (var  obj of  res.registerDetails.Detail ){
    console.log("Object available",obj.available);
    if(obj.available=="N"){
      console.log(" in Object available",obj.available);
      this.params=this.params.append('switchType','NON');  
      this.params=this.params.append('module','');  
   
    //this.params["module"]="";
    
   
    this.getcoursesservice(this.params);
    break;
    }else{
      
    //	Alert.show("entity detail"+obj.entitytype +"f"+obj.entityId);
    this.params=this.params.append('module',''); 
    this.params=this.params.append('switchType',obj.switchType); 
    this.params=this.params.append('entitytype',obj.entitytype); 
    this.params=this.params.append('entityId',obj.entityId ); 
    this.params=this.params.append('entityName',obj.entityName ); 
    this.params=this.params.append('switchoption',obj.switchoption ); 
    this.params=this.params.append('currentpck',obj.programcoursekey ); 
    this.params=this.params.append('newpck',obj.newpck ); 
    this.params=this.params.append('semesterStartDate',obj.semesterStartDate ); 
    this.params=this.params.append('semesterEndDate',obj.semesterEndDate ); 
    
      
      
      console.log("Switch option",obj.switchoption);
      if (obj.switchoption=="FIX"){
        
      if (obj.newpck==""){
        //errorlabel.text ="Switch setup not ready";
        //vstack.selectedChild=errorpanel;	
        
        this.userservice.log("Switch setup not ready");
        this.router.navigate(['../dashboard']);
        return;
      }	
     
      this.getcoursesservice(this.params);
         
      }
      
      if (obj.switchoption=="BRN"){
        
      if (obj.newpck==""){
        //errorlabel.text ="Switch setup not ready";
    
        //vstack.selectedChild=errorpanel;	

        this.userservice.log("Switch setup not ready");
        this.router.navigate(['../dashboard']);
        return;
      }	
      				
        this.getbrnservice(this.params);
            
      }
      
      if (obj.switchoption=="SPC"){
        
      if (obj.newpck==""){
        //errorlabel.text ="Switch setup not ready";
    
        //vstack.selectedChild=errorpanel;
        this.userservice.log("Switch setup not ready");
        this.router.navigate(['../dashboard']);
        return;	
      
      }	
      
      	console.log("before spcservice",this.params);			
           
      this.getspcservice(this.params);
            
      }
      
      
    }			
    
  }
  
}
getbrnservice(param){
 // urlPrefix = url+"getbranches.htm";	

 let myparam = {xmltojs:'Y',
   method:'None' };  
    myparam.method='/registrationforstudent/getbranches.htm';

    this.mask=true;
    this.userservice.getdata(this.params,myparam).subscribe(res=>{
  
    res = JSON.parse(res);
    this.mask=false;
    this.getbrnSuccess(res );
    });

}

getspcservice(param){

  let myparam = {xmltojs:'Y',
   method:'None' };  
    myparam.method='/registrationforstudent/getspeclizations.htm';

    this.mask=true;
    this.userservice.getdata(this.params,myparam).subscribe(res=>{
  
    res = JSON.parse(res);
    this.mask=false;
    this.getspcSuccess(res );
    });

}

getcoursesservice(param){
  
 
   let myparam = {xmltojs:'Y',
   method:'None' };  
    myparam.method='/registrationforstudent/getcourses.htm';
    // this.params=this.params.append('switchType','NON');
    // this.params=this.params.append('module','');
    this.mask=true;
    this.userservice.getdata(this.params,myparam).subscribe(res=>{
  
    res = JSON.parse(res);
    this.combodata.splice(0,this.combodata.length);
    //this.combodata =[];
    this.mask=false;
    this.getcoursesSuccess(res );
  
    
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
      
      this.myrowData.splice(0,this.myrowData.length);// clear the myrowdata array
      this.userservice.log(obj.message);
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
       console.log("in course success",obj.entityName);
       this.creditavailable = obj.creditavailable;
      // Alert.show("creditavailable:"+creditavailable +"  max credit:"+maxcredit.text);
      console.log(this.creditavailable,obj.creditavailable);
			 
		start++;
		}
		// regdataAC.addItem({
		// sst:obj.semesterStartDate,sed:obj.semesterEndDate,coursetype:obj.coursetype,
		// courseCode:obj.courseCode,coursename:obj.coursename,courseclassification:obj.courseclassification,
		// credits:obj.credits,maxcredit:obj.maxcredit,mincredit:obj.mincredit
		//this.agGrid.api.refreshCells();
		
    //});
    
    // this.agGrid.api.forEachNode((node,index)=>{
    //   console.log(node,index);

    // });
			}
	}

}
goBack(): void {
  this.location.back();
}
 submit(){
		
	
  //var subjectselected:ArrayCollection=compulsoryCourseGrid.dataProvider as ArrayCollection;
  
  //var subjectselected =this.getSelectedRows();

  //this.agGrid.api.forEachNode((node,index)=>{console.log(node,index)});
 
  const selectedNodes = this.agGrid.api.getSelectedNodes();

  console.log("Selected Nodes",selectedNodes);
  const subjectselected = selectedNodes.map(node => node.data );
  console.log("Subject selected ",subjectselected);


  

   
  // const dialogRef =this.dialog.open(DialogComponent,
  //                 {data:{title:"Hello",content:"Press Ok to continue Cancel to Discard"}
  //             });

  // dialogRef.afterClosed().subscribe(result => {
  //   console.log(`Dialog result: ${result}`);
  // });
  
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

       console.log(subjectselected.length);
    if (subjectselected.length==0){
      const dialogRef=  this.dialog.open(alertComponent,
        {data:{title:"Warning",content:"You selected :"+ 0+" credits ." +
        this.mincredit,ok:true,cancel:false,color:"warn"}
    });
     return;
    }
  
    //for(var d:number=0;d<subjectselected.length;d++)
    for (var gridItem of subjectselected) 
    {
        
      
     // var gridItem:Object=subjectselected.getItemAt(d);
         console.log("grid item",gridItem);
        semestermaxcredit=parseFloat(gridItem.maxcredit);
        semestermincredit=parseFloat(gridItem.mincredit);
        
        
                 // if(gridItem.select==true)
          // ||
          if(
          (this.creditavailable<=this.mincreditrequired)
          ||
          (subjectselected.length>0)
         
          )
           
           
           
            {
               // Alert.show("gridItem.credits="+gridItem.credits)
               
               console.log("grid item",gridItem.credits);
            	this.creditselected+=parseFloat(gridItem.credits);
              //this.selecteddata.addItem([gridItem.courseCode]);
             // this.selecteddata.add(gridItem.courseCode);
             this.selecteddata= this.selecteddata+gridItem.courseCode+",";
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
             console.log("success");
             const dialogconf =new MatDialogConfig();
             dialogconf.disableClose=true;
             dialogconf.autoFocus=true;
             let data={title:"",content:"Please confirm" ,ok:true,cancel:true,color:"warn"};
             dialogconf.data=data;
            // dialogconf.role=

            const  dialogRef=  this.dialog.open(alertComponent,dialogconf);
              

          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
            if(result){
              this.onOK();
            }

            });      
           
           	
			  // Alert.show(commonFunction.getMessages('conformForContinue'),
			  // commonFunction.getMessages('confirm'),(Alert.YES|Alert.NO),null,onOK,questionIcon);
           }
           else
           {
            //const dialogRef =
            console.log("Failure");
            const dialogRef=  this.dialog.open(alertComponent,
              {data:{title:"Warning",content:"You selected :"+ this.creditselected +" credits ." +
              "Please select at least :"+semestermincredit,ok:true,cancel:false,color:"warn"}
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);


            });      

            
            // Alert.show(("You selected :"+ creditselected +" credits ." +"Please select at least :"+semestermincredit),
            // (commonFunction.getMessages('error')),0,null,null,errorIcon);
           
            return;	
            
           }
           
           
  }

    onOK(){
    
      //if(event.detail==Alert.YES){
        
      
    //	Alert.show("On OK called ");

      
    
    let  myparam1 = new HttpParams();
     //.set('application','CMS');
      var CurrentDateTime:Date = new Date();

      myparam1= myparam1.append("application","CMS");
      myparam1=myparam1.append("date",CurrentDateTime.toString());
      myparam1=myparam1.append("selecteddata",this.selecteddata);
      myparam1=myparam1.append("semester", this.semester );
      myparam1=myparam1.append("programId",this.programId );
      myparam1=myparam1.append("branchId",this.branchId);
      myparam1=myparam1.append("specializationId",this.specializationId);
      myparam1=myparam1.append("pck",this.pck);
      myparam1=myparam1.append("credits",this.creditselected.toString());
      myparam1=myparam1.append("semesterStartDate",this.semesterStartDate);
      myparam1=myparam1.append("semesterEndDate",this.semesterEndDate);
      myparam1=myparam1.append("attemptno",this.attemptno.toString());
      myparam1=myparam1.append("entityId",this.entityId);
      myparam1=myparam1.append("credittheory",this.credittheory.toString());
      myparam1=myparam1.append("creditpractical",this.creditpractical.toString());

      //myparam1["application"]="CMS";
      //Alert.show("Date :"+CurrentDateTime);
          
    console.log(myparam1);      
         
             
          
  //		  Alert.show("Cureent PCK"+ param.currentpck+"newpck"+pck+
  //		  "Switch type"+param.switchType +"switch option"+param.switchoption + "credits="+creditselected+"credittheory"+credittheory
  //		  +"creditpractical"+creditpractical);     
              
              
              
        
          //Arush on 27/10/18  If it is a switched student take values from myparam at global level else take from param.
          
          if (this.myparam["switchType"]!=null){
            
            myparam1=myparam1.append("currentpck",this.myparam["currentpck"]);
            myparam1=myparam1.append("switchType",this.myparam["switchType"]);
            myparam1=myparam1.append("switchoption",this.myparam["switchoption"]);

            // myparam1["switchType"]=this.myparam["switchType"];
            // myparam1["switchoption"] = this.myparam["switchoption"] ;
            // myparam1["currentpck"] = this.myparam["currentpck"] ;
        }else{
          myparam1=myparam1.append("switchType", this.params.get("switchType")) ;
          myparam1=myparam1.append("switchoption", this.params.get("switchoption")) ;
          myparam1=myparam1.append("currentpck", this.params.get("currentpck")) 
        }
          
   
        this.urlPrefix = this.url+"registerstudent.htm";
      //Mask.show(commonFunction.getMessages('pleaseWait'));

      let obj = {xmltojs:'Y',
      method:'/registrationforstudent/registerstudent.htm' };   
      this.mask=true;
      this.userservice.getdata(myparam1,obj).subscribe(res=>{
        //   let data = null;
        //   xml2js.parseString( res, function (err, result){
        //    data = result;
        // });
     
        res = JSON.parse(res);
        this.mask=false;
        this.registerstudentSuccess(res);
        //this.userservice.log(res.registerDetails.Detail.message);
     // console.log("output of registration",res.registerDetails.Detail.message);   
      //registerstudentservice.send(myparam1) ;
      });
   
     // console.log(myparam1);     
    }
   
    
    //}
    
     registerstudentSuccess(res ){
      //Mask.close();
       //semDetail = event.result as XML;
       
       //Alert.show("regstatus:"+semDetail);
       //vstack.selectedChild=errorpanel;
       for (var  obj of  res.registerDetails.Detail ){
         if(obj.available=="err"){
     //errorlabel.text=obj.message;
     this.userservice.log(obj.message);
     this.router.navigate(['../dashboard']); 

         return;
       
 //		Alert.show("Error :"+obj.message);
     
         }
           if(obj.available=="reg"){
            // errorlabel.text ="You are successfully registered";
            this.userservice.log("You are successfully registered");
     
     //vstack.selectedChild=errorpanel;
     this.router.navigate(['../dashboard']);  
     return;	
 //		Alert.show("Error :"+obj.message);
     
         }else{
          this.userservice.log("Error in registration");
             //errorlabel.text ="Error in registration";
             this.router.navigate(['../dashboard']);  
             return;
             
         }
        
         
         
       }
       
       
       //vstack.selectedChild=errorpanel;
       
       //Alert.show("registerstudentsuccess"+semDetail);
     }
     
     getbrnSuccess(res  ){
       console.log("In branches",res);

      for (var  obj of   res.registerDetails.Detail ){
  
        this.combodata.push({id:obj.branchId,label:obj.branch});
      
      }
  
    
     this.combolabel = "Select Branch" ;
     this.combowidth = "50%";
      
    
      return;
  

     }
     
   


    getspcSuccess(res  ){
     
      for (var  obj of   res.registerDetails.Detail ){
  
      this.combodata.push({id:obj.specializationId,label:obj.speclization});
    
    }

  
   this.combolabel = "Select Speclization" ;
   this.combowidth = "50%";
    
  
    return;
  
     
   }
   OnOptionselected(obj){
     if(obj.id==="-1"){
      this.displaybutton =false;
     }else{
      this.displaybutton =true;
      this.itemselected=obj; 
     }
     console.log("on option selected",obj);
  
   }
     
  
 
onContinue(){

  //console.log("on Continue");
 
  
   if(this.combolabel==="Select Speclization"){
    console.log("on  select specilization");
    if(this.itemselected.id=="00"){
      this.params=this.params.append("switchType","NON")  ;
    }else{
  
    }
    this.params=this.params.append("specializationId", this.itemselected.id);   
    this.getcoursesservice(this.params);
   }else if(this.combolabel==="Select Branch"){
    //console.log("on  select Branch");
    this.params=this.params.append("branchId", this.itemselected.id);
    this.params =this.params.append("module","");
    this.getcoursesservice(this.params);
     
   }else if(this.combolabel==="Select Module"){
    this.params=this.params.append("switchType","NON" );
    this.params=this.params.append("module",this.itemselected.id );
    this.myparam=this.myparam.append("module",this.itemselected.id );
    this.params=this.params.append("switchType","NON" );
   
    if (this.myparam["switchType"]!=null){
      //this.getcourses(myparam);
      this.getcoursesservice(this.myparam); 
    }else{
      //this.getcourses(param);
      this.getcoursesservice(this.params);
    }


   }
  
  

}



   
    

    }
    
    

    
  
