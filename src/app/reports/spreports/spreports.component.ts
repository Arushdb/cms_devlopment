import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ViewChild } from '@angular/core';
import { GridReadyEvent } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
//import { UserService } from 'src/app/services/user.service';
import { UserService } from '../../services/user.service';
//import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { SubscriptionContainer } from '../../shared/subscription-container';
import { HttpParams } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
//import { alertComponent } from 'src/app/shared/alert/alert.component';
import { alertComponent } from '../../shared/alert/alert.component';
import { SpinputsComponent } from '../spinputs/spinputs.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-spreports',
  templateUrl: './spreports.component.html',
  styleUrls: ['./spreports.component.css']
})
export class SpreportsComponent implements OnInit, OnDestroy  {

  @ViewChild('agGrid') agGrid: AgGridAngular;

  constructor(private router:Router,
    private userservice:UserService, public dialog: MatDialog,
    private elementRef:ElementRef) { }

  showProGridPanel: Boolean = false;
  defaultColDef = { sortable: true, filter: true, resizable: true, suppressSizeToFit:false };
  columnDefs = [
      { headerName:'Report Number', field: 'reportId', checkboxSelection: true },
      { headerName:'Report Name', field: 'reportName'  },
      { field: 'reportCallStmt', hide:true },
      { headerName:'Number of Inputs required',field: 'numofparams', hide:true },
      { field: 'parameterNames', hide:true },
      { field: 'inputValues', hide:true },
      { field: 'fileName', hide:true },
      ];
  subs = new SubscriptionContainer();
  urlGridList:String="/report/getReportSPList.htm";
  urlGeneratefile:String="/report/generateSPfile.htm";
  gridList: any[]=[];
  fileName: string="";
  showOk:boolean = false;
  mask:boolean=false;
  params = new HttpParams().set('application','CMS');
  curDate = new Date;
  reportName : String = "";
  repCallStmt : String = "";
  repFileName : String = "";
  repParams : String = "";
  inputValues : String ="";
  path1 : String="";
  paramNames : string[]=[];
  paramValues : string[]=[];

  ngOnInit(): void {
          this.showGrid();
  }

  ngOnDestroy(): void {
		this.subs.dispose();
		this.elementRef.nativeElement.remove();	
	}
  
  
showGrid():void 
{   	
	var CurrentDateTime:Date = new Date();
  this.params = new HttpParams();
  this.params = this.params.set("currDate", CurrentDateTime.toString());
	this.mask = true;
	let obj = {xmltojs:'Y', method: this.urlGridList };   
	this.mask=true;
	this.subs.add=this.userservice.getdata(this.params,obj).subscribe(res=>{
			res= JSON.parse(res);
			this.processGridResultHandler(res);
			this.mask=false;
			});
		return;
}

 private processGridResultHandler(res):void{
	  this.gridList.splice(0,this.gridList.length);
	  if (!isNullOrUndefined(res.result) )
	  {
      for (var o of res.result.object)
      {
        this.gridList.push({reportName:o.reportName, reportId:o.reportId, reportCallStmt:o.reportCallStmt, 
          numofparams:o.parameters, parameterNames:o.parameterNames, inputValues:o.placeholderNames,
          fileName:o.reportFileName});
      }
	  }
	  if (this.gridList.length > 0)
	  { 
		  this.showProGridPanel = true; 
	  }
	  else
	  {
		  this.showProGridPanel = false;
	  }
      this.mask = false;
  }

  OnGridReady(parameters:GridReadyEvent){
      this.agGrid.columnApi.autoSizeAllColumns(false);
    }

 onSPSelectionChanged(event){
      const repGridData = this.agGrid.api.getSelectedNodes();
      const selectedRepGridItem = repGridData.map(node => node.data );
      for(var gridItem of selectedRepGridItem)
      {
        this.reportName = gridItem.reportName.toString();
        this.repCallStmt = gridItem.reportCallStmt;
        this.repFileName = gridItem.fileName; 
        this.repParams = gridItem.numofparams.toString();
        const dialogRef=  this.dialog.open(SpinputsComponent, 
          {data:{width:"100px", height:"100px", title:"Inputs",content:gridItem, ok:true,cancel:false,color:"warn"}
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(res => {
          if(res.getData)
          {
            if(!isNullOrUndefined(res.getparamValues))
            {
              this.paramNames = res.getparamNms;
              this.paramValues = res.getparamValues;
              console.log("paramValues=" + this.paramValues);
              this.getDataSet();
            }
            else {
              const dialogRef=  this.dialog.open(alertComponent,
                {data:{title:"Error",content:"Error in processing. Please contact Administrator",ok:true,cancel:false,color:"warn"} });
                dialogRef.disableClose = true;
              return;    
            }
          }
        })
      } 
  }

  getDataSet()
  {
      if (this.repCallStmt.length > 0 )
      {
        this.params = this.params.set("reportName", this.reportName.toString()); 
        this.params = this.params.set("reportCallStmt", this.repCallStmt.toString()); 
        this.params = this.params.set("reportFileName", this.repFileName.toString());
        this.params = this.params.set("parameters", this.repParams.toString());
        this.params = this.params.set("getparamNms", JSON.stringify(this.paramNames));
        this.params = this.params.set("getparamValues", JSON.stringify(this.paramValues));
        let obj = {xmltojs:'Y', method: this.urlGeneratefile };   
        this.mask=true;
        this.subs.add=this.userservice.getdata(this.params,obj).subscribe(res=>{
          res= JSON.parse(res);
          this.GenerateFileSuccess(res);
          this.mask=false;
          });
      }
      else
      {
        const dialogRef=  this.dialog.open(alertComponent,
          {data:{title:"Information",content:"Please select the report",ok:true,cancel:false,color:"warn"} });
          dialogRef.disableClose = true;
      }
  }

  public GenerateFileSuccess(res)
  {
      this.path1="";
      for (var  o of res.path.rd)
      {
        this.path1 = o.Path;
		  }
      console.log(this.path1);
      if (this.path1 == "Error") {
        const dialogRef=  this.dialog.open(alertComponent,
          {data:{title:"Error",content:"Error in generating file. Please contact Administrator",ok:true,cancel:false,color:"warn"} });
          dialogRef.disableClose = true;
        return;
      }
     
      if(!isNullOrUndefined(this.path1) && (this.path1 != "Error" || this.path1 != "MissingInputs") )
      {
         if (this.path1.toString().length > 0 ) {
          window.open(this.userservice.url + '/' + this.path1);
          }
      }
      else
      {
        const dialogRef=  this.dialog.open(alertComponent,
          {data:{title:"Information",content:"No data found",ok:true,cancel:false,color:"warn"} });
          dialogRef.disableClose = true;
      } 
      return;
  }

  onCancel(){
    this.router.navigate(['dashboard']);
  } 
}
