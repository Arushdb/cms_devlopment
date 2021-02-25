import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { Location} from '@angular/common';
import { MyItem} from '../../interfaces/my-item';
import { UserService} from '../../services/user.service' ;
import { MatDialog } from '@angular/material/dialog';
import { alertComponent } from '../../common/alert.component';
import { CustomComboboxComponent } from '../../common/custom-combobox/custom-combobox.component'; 
import { GridReadyEvent } from 'ag-grid-community';
import { ConfirmwindowComponent } from '../confirmwindow/confirmwindow.component';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-startactivity',
  templateUrl: './startactivity.component.html',
  styleUrls: ['./startactivity.component.css']
})

export class StartactivityComponent implements AfterViewInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('proagGrid') proagGrid: AgGridAngular;
  @ViewChild('rejagGrid') rejagGrid: AgGridAngular;
  @ViewChild('CustomComboboxComponent') custcombo: CustomComboboxComponent;
  
  combowidth: string;
  startactivityform: FormGroup;

  constructor(private fb:FormBuilder, private router:Router,
    private userservice:UserService,
    private route:ActivatedRoute,
    private location:Location,
    public dialog: MatDialog,
	private renderer:Renderer2, private elementRef:ElementRef) 
  { 
	this.startactivityform=this.fb.group({
		f_entity: ['', [Validators.required]],
		f_process: ['',[Validators.required]] ,
		f_sem: ['', [Validators.required]],
		f_program: ['', [Validators.required]],
		f_branch: ['', [Validators.required]],
		f_spc: ['', [Validators.required]],
		});
  }

  ngOnInit(): void {
    this.setDateRangeAndFocus();
  }
  ngOndestroy() {
	this.elementRef.nativeElement.remove();
   }
//--------------------------------------------------------------------
combolabel:string;
entitycombolabel:string;
procombolabel:string;
semcombolabel:string;
prgcombolabel:string;
brcombolabel:string;
spcombolabel:string;
showEntityCB:boolean = false;
showPrgCB:boolean = false;
showBrCB:boolean = false;
showSpCB:boolean = false;
showProcessCB:boolean = false;
showSemCB:boolean = false;
enableOkBtn:boolean = false;
enableErrBtn: boolean = false;
enableCertBtn:boolean = false;
public combodata :MyItem []=[];
public entityCombo : MyItem []=[];
public processCombo : MyItem []=[];
public semesterCombo : MyItem []=[];
public programCombo : MyItem []=[];
public branchCombo : MyItem []=[];
public specializationCombo : MyItem []=[];
public selectedEntityId :string="";
public selectedPrgId :string="";
public selectedBrId : string="";
public selectedSpId : string="";
public selectedSemId : string="";
public selectedProcessId : string="";
public selectedEntityNm :string="";
public selectedPrgNm :string="";
public selectedBrNm : string="";
public selectedSpNm : string="";
public selectedSemNm : string="";
public selectedProcessNm : string="";

//import activityMasterControl.ConfirmWindow;
//import activityMasterControl.SequenceWindow;
//[Embed(source="/images/error.png")]private var errorIcon:Class;
//[Embed(source="/images/success.png")]private var successIcon:Class;
//[Embed(source="/images/reset.png")]private var resetIcon:Class;
//[Embed(source="/images/question1.png")]private var questionIcon:Class;
public forActivities: string="";
public forConfirmActivty: string="";

public processGridList: any[]=[];
public activityGridList: any[]=[];
public rejectedGridData: any[]=[];
/** This function calls on creation complete and It set's the selectable Renge of 
 * Date field for process start date as from 1 month before to 1 month sfter from
 * current date,and also calls a function drawFocousTo */

//private xmldata_entityName: any;
//private xmldata_processName: any;
//private xmldata_semesterName: any;
//private xmldata_programName: any;
//private xmldata_branchName: any;
//private xmldata_specializationName: any;
private xmldata_processGridName: any;
private xmldata_activityGridName: any;
private entityAC: any;
public url_DNS: string ="";
public urlEntityList: string = "";
public urlProcessList: string = "";
public urlSemesterList: string = "";
public urlProgramList: string = "";
public  urlBranchList:String = "";
public  urlSpecializationList:String = "";
public  urlProcessGridList:String="";
public  urlActivityGridList:String="";
public  d: number =0;
public 	buttonStatusAC:any;  
public  paramForAfterRevert:Object;
public  enabledValue:Boolean=true;
public  fileName: string="";
showOk:boolean = false;
mask:boolean=false;
params = new HttpParams().set('application','CMS');
curDate = new Date;
myparam = new HttpParams().set('application','CMS');
entityProcesSemesterforProcess : string;
defaultColDef = { sortable: true, filter: true, resizable: true, suppressSizeToFit:false };
showProGridPanel: boolean= false;
showActGridPanel: boolean = false;	
showPdfView: boolean = false;
showRejectedGridPanel: boolean = false;
localUrl:string="http://localhost:8080/CMS" ;
pdfFilePath: string= "";
columnDefs = [
	{ headerName:'Program', field: 'programname',checkboxSelection: true  },
	{ headerName:'Branch', field: 'branchname' },
	{ headerName:'Specialization', field: 'specilizationname' },
	{ headerName:'Sem Start Date', field: 'semesterstartdate' },
	{ headerName:'Sem End Date', field: 'semesterenddate' },
	{ headerName:'Status', field: 'status' },
	{ field: 'programCourseKey', hide:true },
	{ field: 'programId', hide:true },
	{ field: 'branchId', hide:true },
	{ field: 'specializationId', hide:true }
  ];

columnActDefs = [
	{ headerName:'Program', field: 'activityprogramname',checkboxSelection: true  },
	{ headerName:'Branch', field: 'activitybranchname' },
	{ headerName:'Specialization', field: 'activityspecilizationname' },
	{ headerName:'Sem Start Date', field: 'activitysemesterstartdate' },
	{ headerName:'Sem End Date', field: 'activitysemesterenddate' },
	{ headerName:'Stage', field: 'activitystage' },
	{ headerName:'Sequence', field: 'activitystagesequence' },
	{ headerName:'Status', field: 'activitystatus' },
	{ field: 'processId', hide:true},
	{ field: 'semId', hide:true},
	{ field: 'semester', hide:true},
	{ field: 'entityNm', hide:true},
	{ field: 'programCourseKey', hide:true},
	{ field: 'activityCode', hide:true},
	{ field: 'entityId', hide:true},
	{ field: 'programId', hide:true},
	{ field: 'branchId', hide:true},
	{ field: 'specializationId', hide:true},
	{ field: 'revertsts', hide:true},
	{ field: 'seqsts', hide:true},
	{ field: 'enabledValue', hide:true}
];

columnRejDefs= [
	{ headerName:'Registration/Roll No.', field: 'rollno',checkboxSelection: true  },
	{ headerName:'Reason of Rejection', field: 'reason' },
	{ field: 'detailreason', hide:true }
  ];

prog: string="";
bran: string="";
spcl: string="";
semSD: string="";
semED: string="";
pck: string="";
ostatus: string="";
program: string="";
branch: string="";
specialization: string="";
forStageSequence:number = 0;
forPrevStageSequence:number = 0;
rejArrayList:any[]=[];
processGridData :any[]=[];
//spinnerstatus:boolean=false;
/*
public getString(pass_key: string): string{
			return resourceManager.getString('ApplicationResource', pass_key);
}*/
ngAfterViewInit(): void {

}

reset()
{
	//console.log("reset called", this.startactivityform.value);
	//this.startactivityform.value.f_entity = " ";
	//this.startactivityform.reset();
	//var o: MyItem=null;
	//this.custcombo.displayFn(o);
	this.startactivityform.reset();
	this.selectedEntityId ="";
	this.selectedEntityNm = "";
	this.selectedPrgId ="";
	this.selectedPrgNm ="";
	this.selectedProcessId ="";
	this.selectedProcessNm ="";
	this.selectedSemId ="";
	this.selectedSemNm ="";
	this.selectedBrId ="";
	this.selectedBrNm ="";
	this.selectedSpId ="";
	this.selectedSpNm ="";
	this.showEntityCB = false;
	this.showProcessCB = false;
	this.showSemCB = false;
	this.showPrgCB = false;
	this.showBrCB = false;
	this.showSpCB = false;
	this.entityCombo.splice(0, this.entityCombo.length);
	this.processCombo.splice(0,this.processCombo.length);
	this.semesterCombo.splice(0, this.semesterCombo.length);
	this.programCombo.splice(0, this.programCombo.length);
	this.branchCombo.splice(0, this.branchCombo.length);
	this.specializationCombo.splice(0, this.specializationCombo.length);
	this.showOk = false;
	this.showProGridPanel = false;
	this.showActGridPanel= false;
	this.showRejectedGridPanel = false;
	this.setDateRangeAndFocus();
	//this.custcombo.reset();
}

public  setDateRangeAndFocus():void
{			
		var startMonth: Date=new Date();
		startMonth.setMonth(startMonth.getMonth()-1);
		var endMonth: Date=new Date();
		endMonth.setMonth(endMonth.getMonth()+1);

		//this.drawFocusTo(entityCombo);
					  //url_DNS = commonFunction.getConstants('url');
		this.url_DNS = ""; //jyoti
		this.urlEntityList = this.url_DNS+"/consolidatedChart/getEntityList.htm";
		this.urlProcessList = this.url_DNS+"/startActivity/getProcesses.htm";
		this.urlSemesterList = this.url_DNS+"/startActivity/getSemesterList.htm";
		this.urlProgramList = this.url_DNS+"/associatecoursewithinstructor/programList.htm";
		this.urlBranchList = this.url_DNS+"/associatecoursewithinstructor/branchList.htm";
		this.urlSpecializationList = this.url_DNS+"/associatecoursewithinstructor/specializationList.htm";
		this.urlProcessGridList = this.url_DNS+"/startActivity/processList.htm";
		this.urlActivityGridList = this.url_DNS+"/startActivity/activityList.htm"; 
		this.mask = true;
		this.get_Entity_data();
		this.get_Process_data();
		this.get_Semester_data();
}


	public get_Entity_data():void
	{
		this.params = this.params.set("time", this.curDate.toString()); 
		this.params = this.params.set("mode","all");
		this.params = this.params.set("menuCode","MEB");
    // httpXmlEntityList.send(params);
		let obj = {xmltojs:'Y',
		method: this.urlEntityList };   
		this.mask=true;
			this.userservice.getdata(this.params,obj).subscribe(res=>{
			res= JSON.parse(res);
			this.resultHandler(res);
			this.mask=false;
			});

	}
	
	public  get_Process_data():void
	{
		//httpXmlProcessList.send(new Date);
		this.params['time']=new Date;
		let obj = {xmltojs:'Y',
		method: this.urlProcessList };   
		this.mask=true;
			this.userservice.getdata(this.params,obj).subscribe(res=>{
			res= JSON.parse(res);
			this.processResultHandler(res);
			this.mask=false;
			});
	}

	public  get_Semester_data():void
	{
		//httpXmlSemesterList.send();
		let obj = {xmltojs:'Y',
		method: this.urlSemesterList };   
		this.mask=true;
			this.userservice.getdata(this.params,obj).subscribe(res=>{
			res= JSON.parse(res);
			this.semesterResultHandler(res);
			this.mask=false;
			});
	} 

	public  resultHandler(res):void
	{
	   if(!isNullOrUndefined(res.componentDetails.Details) )
	   {	//console.log("entity --- " + res.componentDetails.Details.length);
     		for (var  o of res.componentDetails.Details){
          		this.entityCombo.push({id:o.id,label:o.name});
			}
		}
        this.entitycombolabel = "Entity: " ;
		this.combowidth = "80%";
		this.prgcombolabel = "Program: ";
		this.brcombolabel = "Branch: ";
		this.spcombolabel = "Specialization: ";
		if(this.selectedEntityId.toString() ==="" && this.entityCombo.length >0)
		{
			this.showEntityCB = true;
			this.showProcessCB = true;
			this.showSemCB = true;
		}
		else
		{
			this.showEntityCB = false;
			this.showProcessCB = false;
			this.showSemCB = false;
		}
    }
    
	public  processResultHandler(res):void
	{
		if ( !isNullOrUndefined(res.componentDetails.Details))
		{	//console.log("process --- " + res.componentDetails.Details.length);
			for (var  o of res.componentDetails.Details){
				this.processCombo.push({id:o.id,label:o.name});
		  	}
		}
		this.procombolabel = "Process: ";
	}
	
	OnOptionselected(obj){
		/*if(obj.id==="-1"){
		 this.displaybutton =false;
		}else{
		 this.displaybutton =true;
		 this.itemselected=obj; 
		}*/
		console.log("on option selected",obj);
	 
	  }
    
	public  semesterResultHandler(res):void{
		this.mask = false;
		if( !isNullOrUndefined(res.componentDetails.Details))
		{	//console.log("semester --- " + res.componentDetails.Details.length);
			for (var  o of res.componentDetails.Details){
				this.semesterCombo.push({id:o.id,label:o.name});
			}
		}
		this.semcombolabel = "Semester: ";
    }
	
	public  get_program_data():void
	{
	  //programCombo.enabled=true;
	  this.myparam = new HttpParams();
	  this.myparam = this.myparam.set("entityId",this.selectedEntityId);
	   this.mask = true;
	  //httpXmlProgramList.send(this.params);
	    let obj = {xmltojs:'Y',
		method: this.urlProgramList };   
		this.mask=true;
			this.userservice.getdata(this.myparam,obj).subscribe(res=>{
			res= JSON.parse(res);
			this.programResultHandler(res);
			this.mask=false;
			});
	   return;
	}

	public  programResultHandler(res):void
	{	
		this.mask = false;
		if ( !isNullOrUndefined(res.programList.program)  )
		{	//console.log("program(s) --- " + res.programList.program.length);
			for (var  o of res.programList.program){
				this.programCombo.push({id:o.programId,label:o.programName});
			}
		}	
		return;
    }
    
    public  branchResultHandler(res):void{
		if (!isNullOrUndefined(res.branchList.branch))
		{   //console.log("branch(s) -- " + res.branchList.branch.length);
			for (var  o of res.branchList.branch){
				this.branchCombo.push({id:o.branchId,label:o.branchName});
			}
		}
		this.mask = false;
		return;
    }
    
    public  specializationResultHandler(res):void{		
		if(!isNullOrUndefined(res.specializationList.specialization))
		{   //console.log("specialization(s) -- " + res.specializationList.specialization.length);
			for (var  o of res.specializationList.specialization){
				this.specializationCombo.push({id:o.specializationId,label:o.specializationName});
			}
		}
		this.mask = false;
		return;
    }
    
   /* private  faultHandler(event):void{
         mx.controls.Alert.show(event.fault.message,this.getString('errorInResult'));
         //Mask.close();
         this.mask = false;
    }*/
	
	public get_branch_data():void
	{
		//branchCombo.enabled=true;
		this.params = new HttpParams();
		this.params = this.params.set("entityId",this.selectedEntityId);
		this.params = this.params.set("programId",this.selectedPrgId);
    	this.mask = true;
		//httpXmlBranchList.send(this.params);
		let obj = {xmltojs:'Y',
		method: this.urlBranchList };   
		this.mask=true;
			this.userservice.getdata(this.params,obj).subscribe(res=>{
			res= JSON.parse(res);
			this.branchResultHandler(res);
			this.mask=false;
			});
		return;
	}

	public get_specialization_data():void
	{
		//specializationCombo.enabled=true;
		this.params = new HttpParams();
		this.params = this.params.set("entityId",this.selectedEntityId);
   	 	this.params = this.params.set("programId",this.selectedPrgId);
		this.params = this.params.set("branchId",this.selectedBrId);
		this.mask = true;
		//httpXmlSpecializationList.send(param);
		let obj = {xmltojs:'Y',
		method: this.urlSpecializationList };   
		this.mask=true;
			this.userservice.getdata(this.params,obj).subscribe(res=>{
			res= JSON.parse(res);
			this.specializationResultHandler(res);
			this.mask=false;
			});
		return;
	}
	/*
//This function Set Focus on 1st Field Entity combobox
public drawFocusTo(object:UIComponent):void
            {
                object.setFocus();
                object.drawFocus(true);
            }
            
/**This function Validate that all mandatory fields required has filled or not
 * and on validation pass calls a function showProcessGrid*/          
public validationforOk():void
{
	this.mask = true;
	console.log("inside validationforOk");
	this.enableOkBtn = this.startactivityform.valid;
	if (!(this.selectedEntityId.length > 0 && 
		this.selectedPrgId.length > 0 &&
		this.selectedBrId.length > 0 &&
		this.selectedSpId.length > 0 &&
		this.selectedSemId.length > 0 &&
		this.selectedProcessId.length > 0 )
		|| this.startactivityform.invalid)
	{
    	//Alert.show((resourceManager.getString('Messages','firstSelectallMandatoryFields')),(resourceManager.getString('Messages','error')),0,null,null,errorIcon);		
    	const dialogRef=  this.dialog.open(alertComponent,
			   {data:{title:"Warning",content:"first Select all MandatoryFields", ok:true,cancel:false,color:"warn"}});
		//this.userservice.log("Please select the field(s) marked in Red color");
		this.showActGridPanel = false;
		this.showProGridPanel = false;
		this.showRejectedGridPanel = false;
	}
	else{
		this.showProcessGrid();		
	    }
}

//This function show all codes and calls function initApp to show grid data with pagination
public showProcessGrid():void 
{
   	
	this.params = new HttpParams();
	this.params = this.params.set("entityId",this.selectedEntityId);
	this.params = this.params.set("programId",this.selectedPrgId);
	this.params = this.params.set("branchId",this.selectedBrId);
	this.params = this.params.set("specializationId",this.selectedSpId);
	this.params = this.params.set("semesterId", this.selectedSemId);
	this.params = this.params.set("processId", this.selectedProcessId);	
	//processGridCanvas.visible=true;
	
	this.entityProcesSemesterforProcess ="Entity:"+ this.selectedEntityNm 
									+"Process:"+ this.selectedProcessNm +" Semester: "+ this.selectedSemNm;
    this.mask = true;
	//httpXmlProcessGridList.send(param);
	let obj = {xmltojs:'Y',
		method: this.urlProcessGridList };   
		this.mask=true;
			this.userservice.getdata(this.params,obj).subscribe(res=>{
			res= JSON.parse(res);
			this.processGridResultHandler(res);
			this.mask=false;
			});
		return;
}
//result handler for Process grid
 private processGridResultHandler(res):void{
	  this.processGridList.splice(0,this.processGridList.length);
	  if (!isNullOrUndefined(res.processGrid.activityMaster) )
	  {
		//console.log("processGridResultHandler size=" + res.processGrid.activityMaster.length);
		for (var o of res.processGrid.activityMaster)
		{
			var st: string="";
			if(o.status=="RDY"){
			st="Ready";
			}else if(o.status=="ERR"){
			st="Error";
			}else if(o.status=="COM"){
			st="Completed";
			}
			this.processGridList.push({programname:o.programName, branchname:o.branchName, specilizationname:o.specializationName,
			semesterstartdate:o.semesterStartDate, semesterenddate:o.semesterEndDate , status:st,programCourseKey:o.programCourseKey,
			programId:o.programId,branchId:o.branchId,specializationId:o.specializationId});
		}
	  }
	  //console.log("processGridList.length=" + this.processGridList.length);
	  if (this.processGridList.length > 0)
	  { 
		  this.showProGridPanel = true; 
	  }
	  else
	  {
		  this.showProGridPanel = false;
	  }
      //processGrid.dataProvider=this.processGridList;
      this.mask = false;
  }
  
OngridReady(parameters:GridReadyEvent){
	this.agGrid.columnApi.autoSizeAllColumns(false);
}

OnProGridReady(parameters:GridReadyEvent){
  this.proagGrid.columnApi.autoSizeAllColumns(false);
	//this.proagGrid.api.sizeColumnsToFit();
}

OnRejGridReady(parameters:GridReadyEvent){
	this.rejagGrid.columnApi.autoSizeAllColumns(false);
}

//This function make changes on change of entity like make refresh grid,textboxes etc
public entityChangeHandler(obj):void
{	
	if (obj.id === "-1" )
	{
		this.selectedEntityId = "";
		this.showPrgCB = false;
	}
	else
	{
		if(this.selectedEntityId.toString() != obj.label.toString())
		{
			this.showPrgCB = true;
		}
		this.startactivityform.value.f_entity = obj;
		this.selectedEntityId = obj.id;
		this.selectedEntityNm = obj.label;	
		//console.log("entitychangehandler selected Entity Id=" + this.selectedEntityId + "-" + this.selectedEntityNm);
		this.startactivityform.controls['f_program'].reset();
		this.startactivityform.controls['f_branch'].reset();
		this.startactivityform.controls['f_spc'].reset();
		this.programCombo.splice(0, this.programCombo.length );
		this.get_program_data();
		this.entityProcesSemesterforProcess ="";
		this.showProGridPanel = false;
		this.showActGridPanel = false;
	}
	return;
}

	
//This function make changes on change of semester like make refresh grid,textboxes etc
public semesterChangeHandler(obj):void
{
	this.startactivityform.value.f_sem = obj;
	this.selectedSemId = obj.id;
	this.selectedSemNm = obj.label;
	//console.log("semesterChangeHandler selected Sem Id=" + this.selectedSemId);
	this.showProGridPanel = false;
	this.showActGridPanel = false;
	/*
				programCombo.selectedIndex=-1;
				branchCombo.selectedIndex=-1;
				specializationCombo.selectedIndex=-1;
				branchCombo.enabled=false;
				specializationCombo.enabled=false;
				
				processGrid.dataProvider=null; */
	this.entityProcesSemesterforProcess =""; 
	return;
}	
			
//This function make changes on change of program like make refresh grid,textboxes etc					
public programChangeHandler(obj):void
{
	//console.log(this.startactivityform.value.f_program);
	if (obj.id === "-1" )
	{
		this.selectedPrgId = "";
		this.showBrCB = false;
		this.showSpCB = false;
		this.startactivityform.controls['f_branch'].reset();
		this.startactivityform.controls['f_spc'].reset();
	}
	else
	{
		if(this.selectedPrgId.toString() != obj.label.toString())
		{
			this.showBrCB = true;
		}
		this.startactivityform.value.f_program = obj;
		this.selectedPrgId = obj.id;
		this.selectedPrgNm = obj.label;
		//console.log("programChangeHandler selected Program Id=" + this.selectedPrgId);
		this.selectedBrId ="";
		this.selectedSpId ="";
		this.startactivityform.controls['f_branch'].reset();
		this.startactivityform.controls['f_spc'].reset();
		this.branchCombo.splice(0,this.branchCombo.length);
		this.get_branch_data();
		this.showProGridPanel = false;
		this.showActGridPanel = false;
	}
	return;
}	
			
//This function make changes on change of branch like make refresh grid etc			
public branchChangeHandler(obj):void
{
	if (obj.id === "-1" || this.startactivityform.value.invalid)
	{
		this.selectedBrId = "";
		this.showSpCB = false;
		this.selectedSpId = "";
		this.startactivityform.controls['f_spc'].reset();
		this.specializationCombo.splice(0,this.specializationCombo.length);
	}
	else
	{
		if(this.selectedBrId.toString() != obj.label.toString())
		{
			this.showSpCB = true;
		}
		this.startactivityform.value.f_branch = obj;
		this.selectedBrId = this.startactivityform.value.f_branch.id;
		this.selectedBrNm = this.startactivityform.value.f_branch.label; //obj.label;
		//console.log("branchChangeHandler selected Branch Id=" + this.selectedBrId);
		this.startactivityform.controls['f_spc'].reset();
		this.selectedSpId ="";
		this.specializationCombo.splice(0,this.specializationCombo.length);
		this.get_specialization_data();
		this.showProGridPanel = false;
		this.showActGridPanel = false;
	}
	return;
}			
			
//This function refresh processgrid on change of specilization 		
public specilizationChangeHandler(obj):void
{
	if (obj.id === "-1" )
	{
		this.selectedSpId = "";
		this.showOk = false;
		this.enableOkBtn = false;
	}
	else
	{
		this.showOk = true;
		this.enableOkBtn = true;
		this.startactivityform.value.f_spc = obj;
		this.selectedSpId = obj.id;
		this.selectedSpNm = obj.label;
		//console.log("specilizationChangeHandler selected Sp Id=" + this.selectedSpId);
		this.showProGridPanel = false;
		this.showActGridPanel = false;
	}
	return;
}

//This function make changes on change of process like make refresh grid etc
public processChangeHandler(obj):void
{
		this.startactivityform.value.f_process = obj;
		this.selectedProcessId = obj.id;
		this.selectedProcessNm = obj.label;
		console.log("selected processId=" + this.selectedProcessId);
		this.showProGridPanel = false;
		this.showActGridPanel = false;
		this.entityProcesSemesterforProcess="";
		return;
}
/*
//This function make changes on change of process start date like make refresh grid etc
protected processDateChangeHandler():void
			{
				processGrid.dataProvider=null;
			}
*/

public showActivityGrid():void
{
	
	this.showActGridPanel = false;
	//StartButton.enabled=false;
	   //var processGridData:any = processGrid.dataProvider as ArrayCollection;
	if(this.showProGridPanel)
	{
		const processGridData = this.proagGrid.api.getSelectedNodes();
		//console.log("Selected processGridData", processGridData);
		const selectedGridItem = processGridData.map(node => node.data );
		//console.log("gridItem selected ",selectedGridItem);
		
		this.params = new HttpParams();
		this.params = this.params.set("entityId",this.selectedEntityId);
			
		for(var pgridItem of selectedGridItem)
		{			
			this.prog = pgridItem.programname;
			this.bran=pgridItem.branchname;
			this.spcl=pgridItem.specilizationname;
			this.semSD=pgridItem.semesterstartdate;
			this.semED=pgridItem.semesterenddate
			this.pck=pgridItem.programCourseKey;
			this.program=pgridItem.programId;
			this.branch=pgridItem.branchId;
			this.specialization=pgridItem.specializationId;
			this.ostatus = pgridItem.status;
		} 
	}
	//console.log(this.semSD, this.semED, this.selectedProcessId,this.ostatus, this.pck);
	this.params = this.params.set("semesterStartDate", this.semSD);
	this.params = this.params.set("semesterEndDate", this.semED);
	this.params = this.params.set("processId", this.selectedProcessId);
	this.params = this.params.set("processStatus", this.ostatus);
	this.params = this.params.set("programCourseKey", this.pck);	  
	this.enableOkBtn = false;
	/*	processGridCanvas.visible=false;
    activityGridCanvas.visible=true;
 		okButton.enabled=false;
 		back.enabled=false;
    this.entityCombo.enabled=false;
    semesterCombo.enabled=false;
    this.processCombo.enabled=false;
    	
    programCombo.enabled=false;
    branchCombo.enabled=false;
    specializationCombo.enabled=false;
    entityProcesSemesterforActivity.text=entityProcesSemesterforProcess.text;
    //Mask.show(commonFunction.getMessages('pleaseWait')); */
    this.mask = true;
	//paramForAfterRevert=this.params;
	//httpXmlActivityGridList.send(this.params);
	this.activityGridList.splice(0, this.activityGridList.length );
	let obj = {xmltojs:'Y',
		method: this.urlActivityGridList };   
		this.mask=true;
			this.userservice.getdata(this.params,obj).subscribe(res=>{
			res= JSON.parse(res);
			this.activityGridResultHandler(res);
			this.mask=false;
			});
		return;	
}   	

//result handler for Process grid
private activityGridResultHandler(res):void
{
	this.activityGridList.splice(0, this.activityGridList.length);
	var resData:any[] = res.activityMasterDetails.activityMaster;
	if( isNullOrUndefined(resData) )
	{
		const dialogRef=  this.dialog.open(alertComponent,
			{data:{title:"Information",content:"No Data found for selected record", ok:true,cancel:false,color:"warn"}});
	}	
	else 
	{
		for (var o of resData)
		{
			var sts: string="";
			if(o.status=="RDY"){
				sts="Ready";
			}else if(o.status=="ERR"){
				sts="Error";
			}else if(o.status=="COM"){
				sts="Completed";
			}
			var revertsts:Boolean=false;
			var seqsts:Boolean=false;
			//if sem1 and activity status not M
			if(o.activityName=="Roll Number Generation" && (this.selectedSemId ==="SM1")){
				if(o.status=="RDY"){
					seqsts=true;
					revertsts=false;
				}else if(o.status=="COM"){
					seqsts=false;
					revertsts=true;
				}else{
					seqsts=false;
					revertsts=false;
				}
			}
	//		buttonStatusAC= new ArrayCollection();
	//		buttonStatusAC.addItem({revertsts:revertsts,seqsts:seqsts});
			
			this.activityGridList.push({activityprogramname:this.prog, activitybranchname:this.bran, activityspecilizationname:this.spcl,
			activitysemesterstartdate:this.semSD,activitysemesterenddate:this.semED ,activitystage:o.activityName,activitystagesequence:o.activitySequence, activitystatus:sts,programCourseKey:this.pck,
			activityCode:o.activityCode,processId:this.selectedProcessId,semId:this.selectedSemId,semester:this.selectedSemNm, entityNm:this.selectedEntityNm, entityId:this.selectedEntityId,programId:this.program,branchId:this.branch,specializationId:this.specialization,revertsts:revertsts,seqsts:seqsts,enabledValue:this.enabledValue
			});
		}
	}
	//console.log("activityGridList.length=" + this.activityGridList.length);
	if (this.activityGridList.length > 0)
	{ 
		this.showProGridPanel = false;
		this.showActGridPanel = true; 
	}
	else
	{
		this.showActGridPanel = false;
	}
	this.mask = false;
}

public onActSelectionChanged():void
{
	const actGridData = this.agGrid.api.getSelectedNodes();
	const selActGridItem = actGridData.map(node => node.data );
	for (var s of selActGridItem)
	{
		if ( s.activitystatus.toString() === "Error")
		{
			this.enableErrBtn = true;
		}
		else
		{
			this.enableErrBtn = false;
		}

		if (Number(s.activitystagesequence)===4 && s.activitystatus.toString() ==="Completed")
		{
			this.enableCertBtn = true;
			this.fileName = "PCV" + "/"+ this.selectedEntityId 
			+ "/" + s.programId
			+ "/" +"PcvActvity_" + s.programCourseKey 
			+ "_" + s.activitysemesterstartdate + ".pdf";		
		}
		else{
			this.enableCertBtn = false;
			this.fileName ="";
		}
	}
}
   
public forStartActivity():void
{
	this.showRejectedGridPanel =false;
    /*rejectedGrid.dataProvider=null;
	activityGridList.refresh();
	var activitiesGridData:any =activitiesGrid.dataProvider as ArrayCollection;
     */
	const activitiesGridData = this.agGrid.api.getSelectedNodes();
  	const selectedActGridItem = activitiesGridData.map(node => node.data );
	this.forStageSequence=0;
	this.forPrevStageSequence=0;
    for(var gridItem of selectedActGridItem)
    {
		this.forStageSequence=gridItem.activitystagesequence;
		this.forPrevStageSequence=this.forStageSequence-1;
	} 
    if(this.forStageSequence===1)
    {
		for(var d in this.activityGridList)
		{	
			var gridItem:any = this.activityGridList[d];
            if(gridItem.activitystagesequence===1)
           	{
           	   if(gridItem.activitystatus.toString()=="Completed"){
					 // Alert.show((resourceManager.getString('Messages','activityCompleted')),(resourceManager.getString('Messages','error')),0,null,null,errorIcon);
					  const dialogRef=  this.dialog.open(alertComponent,
					  {data:{title:"Warning",content:"This activity is already completed!", ok:true,cancel:false,color:"warn"}});
					  //this.userservice.log("This activity is already completed!");
           	   	}
           	   else{
           	   	this.openPopUpToStartActivity();
           	   }
		   	}
        }
      }
      else 
      {
      	for(var d in this.activityGridList){
			var gridItem:any = this.activityGridList[d];
         	if(gridItem.activitystagesequence===this.forStageSequence)
           	{
				if(gridItem.activitystatus.toString()==="Completed"){
					  //Alert.show((resourceManager.getString('Messages','activityCompleted')),(resourceManager.getString('Messages','error')),0,null,null,errorIcon);
					  const dialogRef=  this.dialog.open(alertComponent,
					  	{data:{title:"Warning",content:"This activity is already completed!", ok:true,cancel:false,color:"warn"}});
					//this.userservice.log("This activity is already completed!");
           		}
	            else{
					var openPopup:boolean = true;
	            	for(var  d1 in this.activityGridList){ 
						var gridItems:any = this.activityGridList[d1];
						  if(Number(gridItems.activitystagesequence)===this.forPrevStageSequence)
						  {
							openPopup = false; 
							if(gridItems.activitystatus.toString()!="Completed"){
								 //Alert.show((resourceManager.getString('Messages','previousActivitynotCompleted')),(resourceManager.getString('Messages','error')),0,null,null,errorIcon);	
								 const dialogRef=  this.dialog.open(alertComponent,
								    {data:{title:"Warning",content:"Previous activity is not Completed!", ok:true,cancel:false,color:"warn"}});
								 //this.userservice.log("Previous activity is not Completed!");
	     					}
	     					else{
								openPopup = false;
	     						this.openPopUpToStartActivity();		
	     					}
	     				}
					 }
					 if(openPopup)
					 {
						console.log("All previous activities are completed.") 
						this.openPopUpToStartActivity();
					 }
	           	}
      		}
		}
  		}  
}

/**This functions open popup for confirmation to start selected activity
 * and pass all codes to popup in a variable forConfirmActivty*/
private openPopUpToStartActivity():void 
{
	const activitiesGridData = this.agGrid.api.getSelectedNodes();
  	const selectedActGridItem = activitiesGridData.map(node => node.data );
  	this.rejArrayList.splice(0, this.rejArrayList.length);
    for(var gridItem of selectedActGridItem)
    {
		const dialogRef=  this.dialog.open(ConfirmwindowComponent, 
			{data:{width:"100px", height:"100px", title:"Confirmation",content:gridItem, ok:true,cancel:false,color:"warn"}
		});
		dialogRef.afterClosed().subscribe(res => {
			this.rejArrayList = res.result;
			this.onStart();
		})
   	} 
	
	this.showRejectedGridPanel=false;
}

public onStart():void{
	if(this.rejArrayList.length>0) 
	{
			console.log("rejArrayList.length=" + this.rejArrayList.length);
			this.showRGrid(this.rejArrayList); 
	}else{
		this.showActivityGrid();
	}
	
}

public showRGrid(record:any[]):void{
	
	this.showRejectedGridPanel=true;
	this.rejectedGridData.splice(0,this.rejectedGridData.length);
	for (var r of record)
	{
		this.rejectedGridData.push({rollno:r.rollno, reason:r.reason, detailreason:r.detail});
	}
	console.log("rejectedGridData ", this.rejectedGridData);
	this.d=1;
	this.openPDF();	
}


//This function make back from activitygrid to processgrid
public backFunction():void 
{
	this.showProGridPanel = true;
	this.showActGridPanel = false;
	//processGridCanvas.visible=true;
    //activityGridCanvas.visible=false;
	this.showRejectedGridPanel=false;
	this.enableOkBtn = true;
	//this.showOk = true;
    /*rejectedGrid.dataProvider=null;
    entityCombo.enabled=true;
    semesterCombo.enabled=true;
    processCombo.enabled=true;
    
    programCombo.enabled=true;
    okButton.enabled=true;
    back.enabled=true;
    getButton.enabled=false;
  //  StartButton.enabled=false;
    if(programCombo.selectedIndex==-1)
    {
        branchCombo.enabled=false;
        specializationCombo.enabled=false;
    }
    else
    {
        branchCombo.enabled=true;
        specializationCombo.enabled=true;
    } 
		var processGridData: any=processGrid.dataProvider as ArrayCollection;
        var gridLength: number=processGridData.length;
        for(var c:number=0;c<gridLength;c++)
        {
           var processGridItem:any=processGridData.getItemAt(c);
           if(processGridItem.select==true)
           {
           	processGridItem.select=false;
           	processGridData.setItemAt(processGridItem,c);
           	processGrid.dataProvider=processGridData;
           }
 		}
    var activitiesGridData: any=activitiesGrid.dataProvider as ArrayCollection;
    var countgridLength:number=activitiesGridData.length;
        for(var e:number=0;e<countgridLength;e++)
        {
          var activityGridItem:any=activitiesGridData.getItemAt(e);
           if(activityGridItem.select==true)
           {
              activityGridItem.select=false;
              activitiesGridData.setItemAt(activityGridItem,e);
              activitiesGrid.dataProvider=activitiesGridData;
           }
        }*/
}

public printGridData():void{
  console.log("in printGridData");
   /* const printJob:FlexPrintJob = new FlexPrintJob();

    if ( printJob.start() )
    {
    const printDataGrid:PrintDataGrid = new PrintDataGrid();
    this.addChild(printDataGrid);
    printDataGrid.width = printJob.pageWidth-80;
    printDataGrid.height = printJob.pageHeight;

    printDataGrid.columns = [new DataGridColumn("rollno"),new DataGridColumn("reason")];
    printDataGrid.dataProvider = rejectedGrid.dataProvider;
    printDataGrid.visible = false;
    while(printDataGrid.rowCount)
    {
      printJob.addObject(printDataGrid,FlexPrintJobScaleType.SHOW_ALL);
      printDataGrid.nextPage();
    }
    printDataGrid.styleDeclaration.setStyle("align","center");
    printJob.send();
    this.removeChild(printDataGrid);
    } */
}		


public sessionDataResultHandler(res):void{
	
   //Mask.close();
   this.mask = false;
	 var ss:any= res.Session;
	 console.log(res.Session);
	 var s1: string="";
	 var s2: string="";
	 var s3: string="";
	 var s4: string="";
	 var s5: string=this.selectedSemId;
	 var s6: string="";
	 var s7: string="";
		s1 =ss.universityId;
		s2 =ss.SessionStartDate.toString();
		s3 =ss.SessionEndDate.toString();
		s4 =s2.substring(0,4)+"-"+s3.substring(0,4); //"2020-2021";

	const activitiesGridData = this.agGrid.api.getSelectedNodes();
  	console.log("Selected activitiesGridData", activitiesGridData);
  	const selectedActGridItem = activitiesGridData.map(node => node.data );
  	console.log("activity gridItem selected ",selectedActGridItem);
	s6="";
	s7="";	
    for(var gridItem of selectedActGridItem)
    {
		s6=gridItem.programCourseKey;
        s7=gridItem.activityCode;
   	} 
	
	//commonFunction.getConstants('url')+
	
	this.pdfFilePath= this.localUrl +"/RejectedRecords"+"/"+s1+"/"+s4+"/"+s5+"/"+s7+"_"+s6+".pdf";
	  //navigateToURL(new URLRequest(pdfurl));
	window.open(this.pdfFilePath, '_blank');
	if(this.d===1){
		  this.showActivityGrid();
		  //pdfbutton.enabled=false;
		  //StartButton.enabled=false;
	}
}

public showDetails():void{
	
	const rejGridData = this.rejagGrid.api.getSelectedNodes();
  	console.log("Selected rejGridData", rejGridData);
  	const selectedRejGridItem = rejGridData.map(node => node.data );
  	console.log("rejected gridItem selected ",selectedRejGridItem);
	var rollNum:string='';
	var rejReason:string='';
	for (var o of selectedRejGridItem)
	{
		rollNum = o.rollno;
		rejReason = o.detailreason;
	}		
	const dialogRef=  this.dialog.open(alertComponent,
		{data:{title:"Information",content:"Registration No./RollNo = "+ rollNum + "<br/><br/>Detailed Reason = "+rejReason, ok:true,cancel:false,color:"warn"}});	
	   
	/*var detailpopup:detailErrorWindow=detailErrorWindow(PopUpManager.createPopUp(this,detailErrorWindow,true));
	detailpopup.rolLabel.text=a;
	detailpopup.reasondetaillabel.text=b;
	detailpopup.y=10;
	detailpopup.x=this.outerDocument.width/3;
	*/
}

public openPDF():void{
  //Mask.show("Please Wait");
    this.mask = true;
	//sessionDataList.send(new Date);
	let obj = {xmltojs:'Y',
		method: '/startActivity/sessionDataList.htm' };   
		this.mask=true;
			this.userservice.getdata(this.params,obj).subscribe(res=>{
			res= JSON.parse(res);
			this.sessionDataResultHandler(res);
			this.mask=false;
			});
		return;	
}
/*
//This function removes whole page
public cancelFunction():void
{
   this.parentDocument.loaderCanvas.removeAllChildren();
}


public revertRollNumber(){
	
	//param:Object=new Object();
	this.params["programId"]=this.xmldata_programName.program.(programName==programCombo.selectedLabel).programId;
	this.params["entityId"]=this.xmldata_entityName.Details.(name==entityCombo.selectedLabel).id;
	this.params["semesterId"]=this.xmldata_semesterName.Details.(name==semesterCombo.selectedLabel).id;
	
//	if(branchCombo.selectedIndex==-1){
//		param["branchId"]="";
//	}
//	else{
//		param["branchId"]=xmldata_branchName.branch.(branchName==branchCombo.selectedLabel).branchId;
//		
//	}
//	if(specializationCombo.selectedIndex==-1){
//		param["specializationId"]="";
//	}
//	else{
//		param["specializationId"]=xmldata_specializationName.specialization.(specializationName==specializationCombo.selectedLabel).specializationId;
//		
//	}
	
	
	var gridItem:any =activitiesGrid.selectedItem;
//	if(gridItem.select==true)
//	{
		this.params["semesterStartDate"]=gridItem.activitysemesterstartdate;
		this.params["semesterEndDate"]=gridItem.activitysemesterenddate;
		this.params["branchId"]=gridItem.branchId;
		this.params["specializationId"]=gridItem.specializationId;
//	}
	httprevertRollNumber.send(param);
}



//private function updateRowStyle():void
//{
//var rowRenderers:Array = activitiesGrid.listData;
//for(var i:int = 0; i < rowRenderers.length; i++)
//{
//	if(rowRenderers[i].length > 0)
//	{
//		if(activitiesGrid.isItemSelected(rowRenderers[i][0].data))
//		{
//			for(var j:int = 0; j < rowRenderers[i].length; j++)
//			{
//				rowRenderers[i][j].setStyle("fontWeight", "bold");
//			}
//		}
//		else
//		{
//			for(var j:int = 0; j < rowRenderers[i].length; j++)
//			{
//				rowRenderers[i][j].setStyle("fontWeight", "normal");
//			}
//		}
//		
//	}
//}
//}
 */  
 //getCertificate function added by Jyoti on 16-Apr-2018
public getCertificate():void {
	var path: string = "";
	console.log(this.fileName);
	if (this.fileName.length > 0)
    {
		this.pdfFilePath= this.localUrl +"/" + this.fileName;
	    window.open(this.pdfFilePath, '_blank');
    } 
}

/*
public editDeleteEnableForStartActivity(event:Event,grid:DataGrid):void
{
	var activitiesGridData:any=activitiesGrid.dataProvider as ArrayCollection;
	var gridItem:any =activitiesGridData.getItemAt(3);

//		Alert.show(String(gridItem.activitystage)+" "+activitiesGrid.isItemSelected(gridItem)+"reached here");
		if((gridItem.activitystage=="Roll Number Generation") && activitiesGrid.isItemSelected(gridItem)==true)
		{
				Application.application.revertId.enabled=true;
				gridItem.enabledValue=true;
			}else{
				Application.application.revertId.enabled=false;
			}
		
}


private static setButtonStatus(buttonArray:any,status:Boolean):void
{
	for (var button:any of buttonArray)
	{
		button.enabled=status;
	}
}

public revertRollNumberResultHandler(event):void
{
	var ss:any =event.result;
	var s1:String=ss.Exception;
	if(s1=="Success"){
	Alert.show("Roll number reverted successfully",commonFunction.getMessages('success'),0,null,null,successIcon);
	
	activitiesGrid.dataProvider=null;
	this.showActivityGrid();
//	activitiesGrid.dataProvider=null;
//	httpXmlActivityGridList.send(paramForAfterRevert);
//	activitiesGrid.visible=false; XML
//	validationforOk();
	}else{
		Alert.show(s1);
	}
}

public askSequence():void{

	//.popUpWindow1:SequenceWindow=SequenceWindow(PopUpManager.createPopUp(this,SequenceWindow,true));
	//.popUpWindow1.entity=this.xmldata_entityName.Details.(name==entityCombo.selectedLabel).id;
} */

//--------------------------------------------------------------------
}
