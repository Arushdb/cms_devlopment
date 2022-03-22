import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';

import { AgGridEvent, CellFocusedEvent, CellKeyPressEvent,
   ColDef, GridOptions, StartEditingCellParams, ValueSetterParams } from 'ag-grid-community';
import { CellChangedEvent } from 'ag-grid-community/dist/lib/entities/rowNode';
import { NumeriCellRendererComponent } from '../numeri-cell-renderer/numeri-cell-renderer.component';
import { UserService } from 'src/app/services/user.service';
import { alertComponent } from '../alert/alert.component';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';

@Component({
  selector: 'app-griddialog',
  templateUrl: './griddialog.component.html',
  styleUrls: ['./griddialog.component.css']
})
export class GriddialogComponent implements OnInit ,OnDestroy{
  @ViewChild('agGrid') agGrid: AgGridAngular;
  private gridApi;
  private gridColumnApi;

  public columnDefs:ColDef[];
  public defaultColDef;
  public rowSelection;
  public rowData:any []=[];
  public rowDataEditGrid:any []=[];
  private gradeparam:HttpParams;
  private gradelimits:number[]=[0,0,0,0,0,0,0,0,0,0,0];
  private  gradeidx;
  spinnerstatus: boolean=false;
  gridOptions: GridOptions;
  
  private pck:string;
  private entity:string;
  //private grades:string;
  private lower:string;

  public showAddbutton:boolean=false;
  public showgrid:boolean=false;
  public showsave:boolean=false;
  public gradelimitsvalid:boolean=false;
  subs = new SubscriptionContainer();
 
  style: { width: string; height: string; flex: string; };
  columnDefsEditGrid: ColDef[];
  showconfirm: boolean;
  
  
  constructor(private dialogRef: MatDialogRef<GriddialogComponent> ,
    //@Inject(MAT_DIALOG_DATA) public data: {title: string,content:string,ok:boolean,cancel:boolean,color:string}) { }
    @Inject(MAT_DIALOG_DATA) public data,
    
    private userservice:UserService, public dialog: MatDialog,private elementRef:ElementRef) { 
      this.showAddbutton=false;

      this.gridOptions = <GridOptions>{
        enableSorting: true,
        enableFilter: true               
      } ;
   
       this.gradeidx = {
        "lowerA":10,
        "lowerAM":9,
        "lowerB":8,
        "lowerBM":7,
        "lowerC":6,
        "lowerCM":5,
        "lowerD":4,
        "lowerDM":3,
        "lowerE":2,
        "lowerEM":1
          };
       

      this.gradeparam=new HttpParams()
      .set("courseCode",data.courseCode)
      .set("semesterStartDate",data.semesterStartDate)
      .set("semesterEndDate",data.semesterEndDate)
      .set("displayType",data.displayType)
      .set("totalMarks",data.totalMarks)
      .set("marksEndSem",data.marksEndSemester)
      .set("sessionStartDate",data.sessionStartDate)
      .set("sessionEndDate",data.sessionEndDate)

               
      ;
      

      const gradecolwidth =70;
      this.columnDefs = [
        { headerName:"Subject",
          field: 'courseCode',
          maxWidth: 100,
          pinned:"left"
        },
      
        { headerName:"Faculity",
          field: 'ownerEntityName',
          maxWidth: 250,
          pinned:"left"
        },
       
             
        {headerName:"Program",
          field: 'ownerProgramName',
          maxWidth: 250,
        },
       
        {headerName:"Branch",
          field: 'ownerBranchName',
          maxWidth: 120,
        },
        {headerName:"Specialization",
          field: 'ownerSpecializationName',
          maxWidth: 120,
        },
        {headerName:"Sem",
          field: 'semester',
          maxWidth: 50,
        },
        {headerName:"A",
          field: 'lowerA',
          maxWidth: gradecolwidth,
        },
        {headerName:"A-",
          field: 'lowerAM',
          maxWidth: gradecolwidth,
        },
        {headerName:"B",
          field: 'lowerB',
          maxWidth: gradecolwidth
        },
        {headerName:"B-",
          field: 'lowerBM',
          maxWidth: gradecolwidth
        },
        {headerName:"C",
          field: 'lowerC',
          maxWidth: gradecolwidth
        },
        {headerName:"C-",
          field: 'lowerCM',
          maxWidth: gradecolwidth
        },
        {headerName:"D",
          field: 'lowerD',
          maxWidth: gradecolwidth
        },
       
        {headerName:"D-",
          field: 'lowerDM',
          maxWidth: gradecolwidth
        },
       
        {headerName:"E",
          field: 'lowerE',
          maxWidth: gradecolwidth
        },
       
        {headerName:"E-",
          field: 'lowerEM',
          maxWidth: gradecolwidth
        },
       
        {headerName:"F",
          field: 'lowerF',
          maxWidth: gradecolwidth
        },
        {headerName:"Result Status",
          field: 'userId',
          maxWidth: 150
        },
        {headerName:"AwardSheetStatus",
          field: 'status',
          maxWidth: 150,
          pinned:"right"
        },
       
      ];
      //////
      this.columnDefsEditGrid = [
        { headerName:"Subject",
          field: 'courseCode',
          maxWidth: 100,
          editable:false

        },
              
        {headerName:"A",
          field: 'lowerA',
          maxWidth: gradecolwidth,
          editable:true,

          cellRendererFramework:NumeriCellRendererComponent,
          cellRendererParams:{
             values:[ data.totalMarks ,data.marksEndSemester]},
           valueSetter:this.hasValuesetter 

        },
        {headerName:"A-",
          field: 'lowerAM',
          maxWidth:gradecolwidth ,
          editable:true,
          cellRendererFramework:NumeriCellRendererComponent,
          cellRendererParams:{
             values:[ data.totalMarks ,data.marksEndSemester]},
           valueSetter:this.hasValuesetter 
        },
        {headerName:"B",
          field: 'lowerB',
          maxWidth: gradecolwidth,
          editable:true,
          cellRendererFramework:NumeriCellRendererComponent,
          cellRendererParams:{
             values:[ data.totalMarks ,data.marksEndSemester]},
           valueSetter:this.hasValuesetter 
        },
        {headerName:"B-",
          field: 'lowerBM',
          maxWidth: gradecolwidth,
          editable:true,
          cellRendererFramework:NumeriCellRendererComponent,
          cellRendererParams:{
             values:[ data.totalMarks ,data.marksEndSemester]},
           valueSetter:this.hasValuesetter 
        },
        {headerName:"C",
          field: 'lowerC',
          maxWidth: gradecolwidth,
          editable:true,
          cellRendererFramework:NumeriCellRendererComponent,
          cellRendererParams:{
             values:[ data.totalMarks ,data.marksEndSemester]},
           valueSetter:this.hasValuesetter 
        },
        {headerName:"C-",
          field: 'lowerCM',
          maxWidth: gradecolwidth,
          editable:true,
          cellRendererFramework:NumeriCellRendererComponent,
          cellRendererParams:{
             values:[ data.totalMarks ,data.marksEndSemester]},
           valueSetter:this.hasValuesetter 
        },
        {headerName:"D",
          field: 'lowerD',
          maxWidth: gradecolwidth,
          editable:true,
          cellRendererFramework:NumeriCellRendererComponent,
          cellRendererParams:{
             values:[ data.totalMarks ,data.marksEndSemester]},
           valueSetter:this.hasValuesetter 
        },
       
        {headerName:"D-",
          field: 'lowerDM',
          maxWidth: gradecolwidth,
          editable:true,
          cellRendererFramework:NumeriCellRendererComponent,
          cellRendererParams:{
             values:[ data.totalMarks ,data.marksEndSemester]},
           valueSetter:this.hasValuesetter 
        },
       
        {headerName:"E",
          field: 'lowerE',
          maxWidth: gradecolwidth,
          editable:true,
          cellRendererFramework:NumeriCellRendererComponent,
          cellRendererParams:{
             values:[ data.totalMarks ,data.marksEndSemester]},
           valueSetter:this.hasValuesetter 
        },
       
        {headerName:"E-",
          field: 'lowerEM',
          maxWidth: gradecolwidth,
          editable:true,
          cellRendererFramework:NumeriCellRendererComponent,
          cellRendererParams:{
             values:[ data.totalMarks ,data.marksEndSemester]},
           valueSetter:this.hasValuesetter 
        },
       
        {headerName:"F",
          field: 'lowerF',
          maxWidth: gradecolwidth,
          editable:false
          
        }
        
       
      ];





      this.defaultColDef = {
        flex: 1,
        minWidth: 500,
        // enableRowGroup: true,
        // enablePivot: true,
        // enableValue: true,
        sortable: true,
        filter: true,
        //resizable: true,
      };
     
           
        }

        hasValuesetter=function(params:ValueSetterParams):boolean{

        
          let maxmarks:number;
          let endsemmarks:number;
          let maxgradelimitmarks:number;

         
          console.log(params);
         if( isNaN(Number(params.colDef.cellRendererParams.values[0])) ){
          this.userservice.log(params.column.getColId()+":Component Max marks invalid")
          return false;

         }else{
          maxmarks=params.colDef.cellRendererParams.values[0];
          endsemmarks=params.colDef.cellRendererParams.values[1];
          maxgradelimitmarks=maxmarks-endsemmarks;

         }
          console.log(maxmarks,endsemmarks);
      
          let id =params.column.getColId();

          if ((params.newValue !== undefined && params.newValue !== null && String(params.newValue).trim() !=="")) 
          
          
          {
                  
                       if(!(isNaN(Number(params.newValue)))){  // check if number is typed

                        console.log(Number(params.newValue) <= maxgradelimitmarks);

                          if( Number(params.newValue) <= maxgradelimitmarks ){
                              params.data[id]=params.newValue;
                              return true;

                        }else{
                          params.data[id]="Invalid";
                          return false;

                        }
                        
                       

                       }else{   
                        params.data[id]="Invalid";                 // if number is not entered
                        return false;
                       }


               


                }else{   // if value is undefined or null
                  params.data[id]="Invalid";
                  return false;
                }
       
        
         

        }
        
        ngOnDestroy(): void {
          this.subs.dispose();
          this.elementRef.nativeElement.remove();
         
        }
        oncellValueChanged(event:CellChangedEvent){
         let id =event.column.getColId();
                
         this.gradelimits[this.gradeidx[id]] =event.newValue;




          
        }


         checkIfArrayIsUnique(myArray) {
           
         let sts= true;
         loop1:
        for(let  i=0 ;i<myArray.length;i++){
          loop2:
          for(let  j=i+1 ;j<myArray.length;j++){
            console.log(myArray[i]+":"+myArray[j]);
             if (parseInt(myArray[i])==parseInt(myArray[j])){
              sts = false;
              break loop1;

             }
            

          }

      
         // return myArray.length === new Set(myArray).size;
        }
        return sts;
      }
        
        oncellKeyPress(event:CellKeyPressEvent){
          console.log(event.node.rowIndex,event.column.getColId());

          let params: StartEditingCellParams={rowIndex:event.node.rowIndex,colKey:event.column.getColId()};
          // params.rowIndex =event.node.rowIndex;
          // params.colKey=event.column.getColId();


          this.gridOptions.api.startEditingCell(params);

        }

        oncellFocused(event:CellFocusedEvent){
          console.log(event.rowIndex,event.column.getColId());
          let params: StartEditingCellParams={rowIndex:event.rowIndex,colKey:event.column.getColId()};
          this.gridOptions.api.startEditingCell(params);

        }

        onConfirm(){
          const dialogConfig = new MatDialogConfig();
          dialogConfig.width="100%";
          dialogConfig.height="50%";
          this.gridOptions.api.stopEditing();
         
          const dialogRef=  this.dialog.open(alertComponent,
            {data:{title:"Warning",content:"Please confirm ",ok:true,cancel:true,color:"warn"},
            width:"20%",height:"20%"
            });
      
            this.subs.add=dialogRef.afterClosed().subscribe((result:boolean) => {
         
          if (result===true){
          // validate grade limit;
             this.validategradelimits();
             if (this.gradelimitsvalid)
            this.saveGradeLimit();
            else
            return;
            
          }else{
      
            return;
          }
         
          
        })
      }
  validategradelimits() {

    this.gradelimitsvalid=false;
    
    
    // this.gradelimits.forEach(item=>{
    //   console.log(item);
    //   if((String(item)==="0")){
    //    zerocount++;
    //   }

    // });

    // if(zerocount>1){
    //   console.log("More than one zero");
    // }else{
    //  console.log("Single zero");
    // }

 if (this.checkIfArrayIsUnique(this.gradelimits)){

   console.log("Array is uniques");
 }else{
  this.gradelimitsvalid=false;
  window.alert("Grade limits not valid.Please check");
  console.log("Array is not uniques");
  return this.gradelimitsvalid;
   
 }


    if(!(this.isSorted(this.gradelimits)) ){
        
      this.gradelimitsvalid = false;
      window.alert("Grade limits is not in order .Please check");
 
  return this.gradelimitsvalid;
    
    
    
    }  
  return(  this.gradelimitsvalid =true);
   
  }

        oncellEditingStopped(event){
          

        }

      isSorted= function (arr :number[]):boolean{
        let sorted = true;
     
        for (let  i = 0; i < arr.length - 1; i++) {
         
            if (Number(arr[i]) > Number(arr[i+1])) {
                sorted = false;
                break;
            }
        }
      return sorted;
      }
       


    onGridReady(params:AgGridEvent) {
            
      if(String(this.data.allowEdit).toString()==="Y")
      this.showAddbutton=true;
      else
      this.showAddbutton=false;
      
      
      console.log(this.data.allowEdit,this.showAddbutton);
      this.style = {
       
        width: '100%',
        height: '70%',
        flex: '1 1 auto'
       };
      
       params.columnApi.autoSizeAllColumns()
   
    }
    onGridReadyGradeLimit(){

      this.gridOptions.api.setRowData(this.rowDataEditGrid);
    }

    getCourseGradeLimit(){
      this.spinnerstatus=true;
      let obj = {xmltojs:'Y',
      method:'None' };   
      obj.method='/coursegradelimitpercourse/getCourseGradeLimit.htm';
     
      this.subs.add=this.userservice.getdata(this.gradeparam,obj).subscribe(res=>{
      //this.userservice.log(" in switch detail selected");
      res = JSON.parse(res);
      
      this.getCourseGradeLimitSuccess(res)
    this.spinnerstatus=false;
          })

    }

    getCourseGradeLimitSuccess(res){

    console.log("grade limit success",res);
    console.log(res.courseDetails.Details,res.courseDetails);
    
    let  gradevalues =res.courseDetails.Details[0];
       this.initGradeLimits(gradevalues);
 
    this.pck="";
    this.entity="";

    this.rowData=res.courseDetails.Details;
    this.rowData.forEach(item=>{
      this.pck+=item.programCourseKey+"|";
      this.entity+=item.ownerEntityId+"|";

    });


 
    if(this.rowData.length>0){
      
      this.rowDataEditGrid[0]=this.rowData[0];
     
    }else{
      this.rowDataEditGrid=[];
    }
   
    
    }

    initGradeLimits = function  (gradevalues: any):void {

      let index =10;
      console.log(this.gradeidx);
      for (const [key, value] of Object.entries(gradevalues)) {
        
        if(key.toString()==="lowerA" && value.toString()===""){
          gradevalues[key]="Z";
          this.gradelimits[this.gradeidx["lowerA"]]=0;
          
        }else if(key.toString()==="lowerA"){
          this.gradelimits[this.gradeidx["lowerA"]]=gradevalues[key];
        }
        
        if(key.toString()==="lowerAM" && value.toString()===""){
          gradevalues[key]="Z";
          this.gradelimits[this.gradeidx.lowerAM]=0;
        }else if(key.toString()==="lowerAM"){
          this.gradelimits[this.gradeidx.lowerAM]=gradevalues[key];
        }

        if(key.toString()==="lowerB" && value.toString()===""){
          gradevalues[key]="Z";
          this.gradelimits[this.gradeidx.lowerB]=0;
        }else if(key.toString()==="lowerB"){
          this.gradelimits[this.gradeidx.lowerB]=gradevalues[key];
        }
        

        if(key.toString()==="lowerBM" && value.toString()===""){
          gradevalues[key]="Z";
          this.gradelimits[this.gradeidx.lowerBM]=0;
        }else if(key.toString()==="lowerBM"){
          this.gradelimits[this.gradeidx.lowerBM]=gradevalues[key];
        }

        if(key.toString()==="lowerC" && value.toString()===""){
          gradevalues[key]="Z";
          this.gradelimits[this.gradeidx.lowerC]=0;
        }else if(key.toString()==="lowerC"){
          this.gradelimits[this.gradeidx.lowerC]=gradevalues[key];
        }
        if(key.toString()==="lowerCM" && value.toString()===""){
          gradevalues[key]="Z";
          this.gradelimits[this.gradeidx.lowerCM]=0;
        }else if(key.toString()==="lowerCM"){
          this.gradelimits[this.gradeidx.lowerCM]=gradevalues[key];
        }

        if(key.toString()==="lowerD" && value.toString()===""){
          gradevalues[key]="Z";
          this.gradelimits[this.gradeidx.lowerD]=0;
        }else if(key.toString()==="lowerD"){
          this.gradelimits[this.gradeidx.lowerD]=gradevalues[key];
        }

        if(key.toString()==="lowerDM" && value.toString()===""){
          gradevalues[key]="Z";
          this.gradelimits[this.gradeidx.lowerDM]=0;
        }else if(key.toString()==="lowerDM"){
          this.gradelimits[this.gradeidx.lowerDM]=gradevalues[key];
        }
        if(key.toString()==="lowerE" && value.toString()===""){
          gradevalues[key]="Z";
          this.gradelimits[this.gradeidx.lowerE]=0;
        }else if(key.toString()==="lowerE"){
          this.gradelimits[this.gradeidx.lowerE]=gradevalues[key];
        }
        if(key.toString()==="lowerEM" && value.toString()===""){
          gradevalues[key]="Z";
          this.gradelimits[this.gradeidx.lowerEM]=0;
          
        }else if(key.toString()==="lowerEM"){
          this.gradelimits[this.gradeidx.lowerEM]=gradevalues[key];
        }
        if(key.toString()==="lowerF" && value.toString()===""){
          gradevalues[key]=0;
          this.gradelimits[0]=0;
        }else{
          this.gradelimits[0]=0;
        }
            
          
             

            }

            console.log(this.gradelimits);
    }
    ngOnInit(): void {
      console.log(this.data);
      this.getCourseGradeLimit()
    }
  
  
  
      close() {
        this.dialogRef.close(false);
      }
  
    okbuttonclick()
       {
  
      this.dialogRef.close(true);
    }
    addbuttonclick(){
      this.showgrid=!this.showgrid;
    }


    saveGradeLimit(){
      
      const grades:string= "A"+ "|" + "A-" +"|"+ "B" + "|" + "B-"+ "|" + "C"+ "|" + "C-" + "|" + "D"+ "|" + "D-" + "|" + "E" + "|" + "E-" + "|" + "F"+"|";

      this.lower="";
    
      for(let i=10; i >=0;i--){
      
         this.lower+=this.gradelimits[i]+"|";
         
      }
     console.log(Number(this.data.marksEndSemester)===0);
    if(Number(this.data.marksEndSemester)===0){
      this.gradeparam=this.gradeparam.set("internalActive","0");
    }else{
      this.gradeparam=this.gradeparam.set("internalActive","1");
    }
    
      this.gradeparam=this.gradeparam.set("programCourseKey",this.pck);
      this.gradeparam=this.gradeparam.set("lowers",this.lower);
      this.gradeparam=this.gradeparam.set("grades",grades);
      this.gradeparam=this.gradeparam.set("entityId",this.entity);
      
      let obj = {xmltojs:'Y',
      method:'None' };   
      obj.method='/coursegradelimitpercourse/insertCourseGrade.htm';
     // obj.method='/coursegradelimit/insertCourseGrade.htm';
     
      this.subs.add=this.userservice.getdata(this.gradeparam,obj).subscribe(res=>{
      //this.userservice.log(" in switch detail selected");
      res = JSON.parse(res);
      
      this.getInsertCourseGradeSuccess(res)
    
          })
       
    
      }

    getInsertCourseGradeSuccess(res){
       
       let ary:[]=res.basicDetails.Details;
       let str =String(res.basicDetails.Details[0].list_values).toString();
       if(ary.length>0)
       
       var matches =str.match(/(\d+)/);
     
    
       this.userservice.log("Grade limits modified"+" for total students = "+matches[0]);
       this.dialogRef.close(true)
    }



  }
