import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Location} from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ViewChild } from '@angular/core';
import { GridReadyEvent } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { HttpParams } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { alertComponent } from 'src/app/shared/alert/alert.component';
import { MyItem } from 'src/app/interfaces/my-item';

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
      { headerName:'Report Name', field: 'reportName',checkboxSelection: true  },
      { field: 'reportId', hide:true },
      { field: 'reportCallStmt', hide:true },
      { field: 'inputString', hide:true },
      { field: 'fileName', hide:true },
      ];
  subs = new SubscriptionContainer();
  urlSessionList:String="/report/getsession.htm";
  urlGridList:String="/report/getReportSPList.htm";
  urlGeneratefile:String="/report/generateSPfile.htm";
  gridList: any[]=[];
  fileName: string="";
  showOk:boolean = false;
  mask:boolean=false;
  params = new HttpParams().set('application','CMS');
  curDate = new Date;
  repCallStmt : String = "";
  repFileName : String = "";
  repParams : String = "";
  path1 : String="";
  public sessiondata :MyItem []=[];
  sessioncombolabel: String ="Select Session";
  selectedSessionYr: String ="";
  selectedStartDate : String ="";
  
  ngOnInit(): void {
          this.getsession();
  }

  ngOnDestroy(): void {
		this.subs.dispose();
		this.elementRef.nativeElement.remove();	
	}
  
  getsession(){
    
    this.params = new HttpParams();
    this.params = this.params.set("time", this.curDate.toString()); 
    this.mask = true;
    let obj = {xmltojs:'Y', method: this.urlSessionList };   
    this.mask=true;
    this.subs.add=this.userservice.getdata(this.params,obj).subscribe(res=>{
        res= JSON.parse(res);
        this.sessionResultHandler(res);
        this.mask=false;
        });
  }
  
  sessionResultHandler(data)
  {    
    //console.log("resp session ", data);
    if(isNullOrUndefined(data.Session.items)){
        this.userservice.log("Session not available");
        return;
      }
      this.sessiondata=[];
      data.Session.items.forEach(element => {
        this.sessiondata.push({id:element.SessionStartDate,
        label:String(element.SessionStartDate).slice(0,4)+'-'+String(element.SessionEndDate).slice(2,4)});  
       });  
      return;     
   }
  

  Onsessionselected(obj)
  {
      if (obj.id === "-1" )
      {
      this.selectedStartDate = "";
      this.selectedSessionYr = "";
      this.showProGridPanel = false;
      }
      else
      {
      this.selectedStartDate = obj.id[0];  
      this.selectedSessionYr = obj.label;
      this.showGrid();
      //console.log("onsessionselected session start date=" + this.selectedStartDate, " sessionYr=", this.selectedSessionYr );
     }
    return;
  }
  
showGrid():void 
{   	
	this.params = new HttpParams();
	this.params = this.params.set("sessionStartDate", this.selectedStartDate.toString());
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
//result handler 
 private processGridResultHandler(res):void{
	  this.gridList.splice(0,this.gridList.length);
	  if (!isNullOrUndefined(res.result) )
	  {
		for (var o of res.result.object)
		{
     // console.log("reading object ", o.reportName, o.reportId, o.reportFileName);
			this.gridList.push({reportName:o.reportName, reportId:o.reportId, reportCallStmt:o.reportCallStmt, 
        inputString:o.parameters, fileName:o.reportFileName});
		}
	  }
	  //console.log("gridList.length=" + this.gridList.length);
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


  getDataSet()
  {
      const repGridData = this.agGrid.api.getSelectedNodes();
      const selectedRepGridItem = repGridData.map(node => node.data );
      for(var gridItem of selectedRepGridItem)
      {
		    console.log(gridItem.reportName, gridItem.reportId, gridItem.reportCallStmt,
          gridItem.inputString, gridItem.fileName);
        this.repCallStmt = gridItem.reportCallStmt;
        this.repFileName = gridItem.fileName + "_" + this.selectedSessionYr;
        this.repParams = gridItem.inputString.toString();
        console.log("parameters", this.repParams);
	    }
      
      if (this.repCallStmt.length > 0 )
      {
        this.params = this.params.set("reportCallStmt", this.repCallStmt.toString()); 
        this.params = this.params.set("reportFileName", this.repFileName.toString());
        this.params = this.params.set("parameters", this.repParams.toString());
        this.params = this.params.set("sessionStartDate", this.selectedStartDate.toString());
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
      for (var  o of res.path.rd)
      {
        this.path1 = o.Path;
		  }
      //console.log(this.path1);
      if(!isNullOrUndefined(this.path1) && this.path1 != "Error")
      {
       if (this.path1.toString().length > 0 ) {
        window.open(this.userservice.url + '/' + this.path1);
       }
      }
      else if (this.path1 = "Error") {
        const dialogRef=  this.dialog.open(alertComponent,
          {data:{title:"Error",content:"Error in generating file. Please contact Administrator",ok:true,cancel:false,color:"warn"} });
          dialogRef.disableClose = true;
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