import { Component,  DebugEventListener,  ElementRef,  HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgramService } from 'src/app/services/program.service';
import { EntityService } from 'src/app/services/entity.service';

import { MyItem } from 'src/app/interfaces/my-item';
import { ColDef,  GridReadyEvent } from 'ag-grid-community';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { ListComponent } from 'src/app/shared/list/list.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { CustomComboboxComponent } from 'src/app/shared/custom-combobox/custom-combobox.component';




function customComboValidator(obj): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {

if(control.value==' '){ 
  return {'id':true}; 
}

return null;

};
}

@Component({
  selector: 'app-revertresultprocess',
  templateUrl: './revertresultprocess.component.html',
  styleUrls: ['./revertresultprocess.component.css']
})
export class RevertresultprocessComponent implements OnInit ,OnDestroy{
 
  @ViewChild('entityCombo') entityCombo:CustomComboboxComponent; 
  @ViewChild('sessionCombo') sessionCombo:CustomComboboxComponent; 
  @ViewChild('programCombo') programCombo:CustomComboboxComponent; 
  @ViewChild('branchCombo') branchCombo:CustomComboboxComponent; 
  @ViewChild('spcCombo') spcCombo:CustomComboboxComponent; 
  @ViewChild('semCombo') semCombo:CustomComboboxComponent; 
 

  programcombolabel: string;
  sessioncombolabel: string;
  semestercombolabel: string;
  branchcombolabel: string;
  spccombolabel: string;
  entitycombolabel: string;

  subs = new SubscriptionContainer();
  public rowData=[];

  public entitydata :MyItem []=[];
  public semesterdata :MyItem []=[];
  public programdata :MyItem []=[];
  public branchdata :MyItem []=[];
  public sessiondata :MyItem []=[];
  public spcdata :MyItem []=[];
  combowidth: string;
  _pgm: any;
  _pgmName: any;
  _sem: any;
  _ses: any;
  _brn: any;
  _brnName: any;
  _spc: any;
  _spcName: any;
  _entity: any;
  _entityName: any;
  


  
  revertform:FormGroup;

  spinnerstatus: boolean=false;
  defaultColDef = {
    sortable: true,
    filter: true
       
};

hashValueGetter = function (params) {
  return params.node.rowIndex+1;
};
  columnDefs:ColDef[] = [
 
    {
      headerName: 'Seq No',
      filter:false,
      maxWidth: 100,
      valueGetter: this.hashValueGetter,
    },
      
    
    { field: 'rollno',maxWidth: 200,type: 'numberColumn',filter: 'agNumberColumnFilter' },
    { field: 'status' },
    { field: 'semesterStartDate' }
    
  
   
  ];
  
    constructor(private formBuilder: FormBuilder, 
    private router: Router,
    private programService:ProgramService,
    private entityService:EntityService,
    public dialog: MatDialog
    
   
    ) {
      this.semesterdata=[];
      this.semesterdata.push(
        {id:'SM1',label:"SM1"}
      , {id:'SM2',label:"SM2"}
      , {id:'SM3',label:"SM3"}
      , {id:'SM4',label:"SM4"}
      , {id:'SM5',label:"SM5"}
      , {id:'SM6',label:"SM6"}
      , {id:'SM7',label:"SM7"}
      , {id:'SM8',label:"SM8"}
      , {id:'SM9',label:"SM9"}
      , {id:'SM10',label:"SM10"}
      , {id:'SM11',label:"SM11"}
      , {id:'SM12',label:"SM12"}
      );
      
    this.sessioncombolabel="Select Session";
    this.programcombolabel = "Select Program" ;
    this.semestercombolabel="Select Semester";
    this.branchcombolabel ="Select Branch";
    this.spccombolabel = "Select Speclization";
    this.entitycombolabel= "Select Faculty";
   
    this.combowidth = "100%";
  
  
   }

   @HostListener('unloaded')
  ngOnDestroy(): void {
    
    console.log("Component Destroyed");
    this.subs.dispose();
    //throw new Error('Method not implemented.');
  }
 
  ngOnInit(): void {
    this._createForm();
    this.getsession(); 
    this.getEntities();
   
   
    this.spinnerstatus=false;
          
  }

  private _createForm(): void {
    this.revertform = this.formBuilder.group({
          
      sessionStartDate: [" ", [Validators.required,customComboValidator(this._ses)]],
      programCourseKey: [" "],
      semesterStartDate: [" "],
      semesterEndDate: [" "],
      programId: [" ", [Validators.required,customComboValidator(this._pgm)]],
      branchId: [" ", [Validators.required,customComboValidator(this._brn)]],
      semesterId: [" ",[Validators.required,customComboValidator(this._sem)]],
      entityId: [" ",[Validators.required,customComboValidator(this._entity)]],
      specializationId: [" ",[Validators.required,customComboValidator(this._spc)]],
      rollno: ['', Validators.required]
    });
  } 

 
  
  Onpgmselected(obj){
   
    this.revertform.get('programId').setValue(obj.id[0]);
    this._pgm=obj.id[0];
    this._pgmName=obj.label[0];
   
    this.branchCombo.myControl.setValue({"":""});
    this.spcCombo.myControl.setValue({"":""});
    this.semCombo.myControl.setValue({"":""});
    
    this.getBranches();
    this.getSpc();
 
  }
  OnentitySelected(obj){
    debugger;
    this.revertform.get('entityId').setValue(obj.id[0]);
    this._entity=obj.id[0];
    this._entityName=obj.label[0];
    this.programCombo.myControl.setValue({"":""});
    this.branchCombo.myControl.setValue({"":""});
    this.spcCombo.myControl.setValue({"":""});
    this.semCombo.myControl.setValue({"":""});
    
    this.getAuthPrograms();
    
 
  }

  Onsemselected(obj){
    this.revertform.get('semesterId').setValue(obj.id);
  
    this._sem=obj.id;
 
  }

  Onsessionselected(obj){
    console.log(obj);
    this.revertform.get('sessionStartDate').setValue(obj.id[0]);
    this._ses=obj.id[0];
   
  
   this.entityCombo.myControl.setValue({"":""});
   this.programCombo.myControl.setValue({"":""});
   this.branchCombo.myControl.setValue({"":""});
   this.spcCombo.myControl.setValue({"":""});
   this.semCombo.myControl.setValue({"":""});
   
    
  }
  Onbrnselected(obj){
    this.revertform.get('branchId').setValue(obj.id[0]);
    this._brn=obj.id[0];
    this._brnName=obj.label[0];
 
  }
  Onspcselected(obj){
    this.revertform.get('specializationId').setValue(obj.id[0]);
    this._spc=obj.id[0];
    this._spcName=obj.label[0];
 
  }

  

  onCancel(){
  
    this.router.navigate(['dashboard']);

  }  

  onSubmit(userForm: NgForm){

  if (this.revertform.status!="VALID"){

    this.programService.log("Input not Valid");
    return;
  }

  this.validateProgram(this.revertform);
 


  }


  get f() {
          
    return this.revertform.controls; }



    OngridReady(parameters:GridReadyEvent){

     // this.rowData=[{'Roll_Number':'1000','Name':'Arush'},{'Roll_Number':'1001','Name':'Arush1'}];
      
   
   
}

getAuthPrograms(){
   
      this.programService.getAuthorizeProgramsformenu_62(this._entity).subscribe(res=>{

       
        this.programdata =[];       
      let  data = JSON.parse(res);
      if(isUndefined(data.Details.Detail)){
        this.programService.log("You are not Authorized");
        return;
      }
      
      data.Details.Detail.forEach(element => {
        
      this.programdata.push({id:element.programId,label:element.programName});
         
       });  
       
      },
      error=>{
        
        this.programService.log(error.originalError.message);

      })

  }

  getsession(){
    this.programService.getsession().subscribe(res=>{
      let  data = JSON.parse(res);
      if(isUndefined(data.Details.Detail)){
        this.programService.log("Session not available");
        return;
      }
      
      this.sessiondata=[];
      data.Details.Detail.forEach(element => {
        
      this.sessiondata.push({id:element.sessionStartDate,
        label:String(element.sessionStartDate).slice(0,4)+'-'+
        String(element.sessionEndDate).slice(2,4)});
         
       });  
       
      },
      error=>{
         this.programService.log(error.originalError.message);

      })

  }
  getEntities(){
   
    this.entityService.getEntities().subscribe(res=>{

     
            
    let  data = JSON.parse(res);
    console.log("Arush",data);
    if(isUndefined(data.Details.Detail)){
      this.programService.log("You are not Authorized");
      return;
    }
    this.entitydata=[];
    data.Details.Detail.forEach(element => {
      
    this.entitydata.push({id:element.entityId,label:element.entityName});
       
     });  
     
    },
    error=>{
      
      this.entityService.log(error.originalError.message);

    })

}
  

getBranches(){

  
  let obj:any= {};
  obj.pgm=this._pgm;
  obj.entity=this._entity;
  this.programService.getbranches(obj).subscribe(res=>{
    let  data = JSON.parse(res);
    console.log("Response branches",data);
    if(isUndefined(data.Details.Detail)){
      this.programService.log("Branches  not available");
      return;
    }
    
    console.log("Arush",data);
    this.branchdata=[];
    data.Details.Detail.forEach(element => {
      
    this.branchdata.push({id:element.branchId,
      label:element.branchName});
       
     });  
     
    },
    error=>{
       this.programService.log(error.originalError.message);

    })

console.log(this.branchdata,"Length:"+this.branchdata.length);

}
getSpc(){

  
  let obj:any= {};
  obj.pgm=this._pgm;
  obj.entity=this._entity;
  this.programService.getspc(obj).subscribe(res=>{
    let  data = JSON.parse(res);
    
    if(isUndefined(data.Details.Detail)){
      this.programService.log("Speclization not available");
      return;
    }
    
    this.spcdata=[];
    data.Details.Detail.forEach(element => {
      
    this.spcdata.push({id:element.specializationId,
      label:element.specializationName});
       
     });  
     
    },
    error=>{
       this.programService.log(error.originalError.message);

    })



}


validateProgram(revertform:FormGroup){

let rvform =revertform.getRawValue();
let serializedForm = JSON.stringify(rvform);

this.programService.vaildateProgram(serializedForm).subscribe(res=>
  {
    let  data = JSON.parse(res);
    if (!isUndefined(data.Details.Exception)){
      this.programService.log(data.Details.Exception[0]);
      return;
    }
    
    if(isUndefined(data.Details.Detail)){
      this.programService.log("Server issue");
      return;
    }
    else
  {
      let resultObj:Object=new Object();
      data.Details.Detail.forEach(element => {
    
      resultObj["rollno"]=element.rollno[0];
      
      resultObj["status"]=element.status[0];
      resultObj["semesterStartDate"]=element.semesterStartDate[0];
      resultObj["semesterEndDate"]=element.semesterEndDate[0];
      resultObj["programCourseKey"]=element.programCourseKey[0];
      
      this.rowData.push(resultObj);
      resultObj = new Object();});
                                
  
        if (this._brnName==='NONE')
        this._brnName='';
        if (this._spcName==='NONE')
        this._spcName='';
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width="70%";
      dialogConfig.height="80%";
      dialogConfig.data={ 
        rowData:this.rowData,
      columnDefs:this.columnDefs,
      header:'Revert Result for '+this._entityName+ ':'+
      this._pgmName+' '+this._brnName+' '+this._spcName +'Semester:'+this._sem};
 
  
      const dialogRef=  this.dialog.open(ListComponent,dialogConfig);
      dialogRef.disableClose = true;
    
      dialogRef.afterClosed().subscribe(res=>{ 
             this.revertresult();
              });
        
  
  }
},error=>{
  
  this.programService.log(error.originalError.message);
});


}
  revertresult() {
    this.revertform.get('programCourseKey').setValue(this.rowData[0].programCourseKey);
    this.revertform.get('semesterStartDate').setValue(this.rowData[0].semesterStartDate);
    this.revertform.get('semesterEndDate').setValue(this.rowData[0].semesterEndDate);
    let rvform =this.revertform.getRawValue();
    let serializedForm = JSON.stringify(rvform);
  
    this.programService.revertResult(serializedForm).subscribe(res=>{
    this.programService.log("Result Reverted");
    this.entityCombo.myControl.setValue({"":""});
    this.programCombo.myControl.setValue({"":""});
    this.branchCombo.myControl.setValue({"":""});
    this.spcCombo.myControl.setValue({"":""});
    this.semCombo.myControl.setValue({"":""});
    this.revertform.reset();
    },error=>{ this.programService.log(error.originalError.message);})
   
  }



}
  


