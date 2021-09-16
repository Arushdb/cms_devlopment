import { Component, Inject, Input, OnInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import {alertComponent} from    'src/app/shared/alert/alert.component'
import { isNullOrUndefined } from 'util';
//import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-confirmwindow',
  templateUrl: './confirmwindow.component.html',
  styleUrls: ['./confirmwindow.component.css']
})
export class ConfirmwindowComponent implements OnInit {
  
  public obj: any = this.data.content;
  public entity:string=this.obj.entityId;
  public entityName:string=this.obj.entityNm;
  
  public programNm:string= this.obj.activityprogramname;
  public program:string=this.obj.programId;
  public branchNm:string=this.obj.activitybranchname;
  public branch:string=this.obj.branchId;
  public spclNm:string=this.obj.activityspecilizationname;
  public specialization:string=this.obj.specializationId;
  
  public process:string=this.obj.processId;
  public semester:string=this.obj.semId;
  public semesterName:string=this.obj.semester;
  
  public programCourseKey:string=this.obj.programCourseKey;
  public ssd:string=this.obj.activitysemesterstartdate;
  public sed:string=this.obj.activitysemesterenddate;
  public activityCode:string=this.obj.activityCode;
  public activityName:string=this.obj.activitystage;
  public actvitySeq:string=this.obj.activitystagesequence;
  public activityStatus:string=this.obj.activitystatus;
  public buttonFunction:Function=this.data.f1;
  public gridFunction:Function=this.data.f2;
  public rejArray: any[]=[];
  //[Embed(source="/images/question.png")]private var questionIcon:Class;*/
  public url_DNS:string ="";
  public urlStartActivityList:string = "";
  param = new HttpParams().set('application','CMS');
  mask:boolean=false;
  certifylbl: string="";
  certifylblVisible: boolean = false;
  can1Visible:boolean = true;
 // spinnerstatus:boolean=false;
  user:string = "";
  
  constructor(private dialogRef: MatDialogRef<ConfirmwindowComponent> ,
	@Inject(MAT_DIALOG_DATA) public data,
    private userservice:UserService,
    public mdialog: MatDialog, private elementRef:ElementRef
	) { 
  
      console.log("------------------inside alert",data);
    }
  
    ngOnInit(): void {
    }
	
	ngOndestroy() {
		this.elementRef.nativeElement.remove();
	}

    close() {
        this.dialogRef.close(true);
    }

//confirmAlert, cardGenerated, generateConfirmPdf and pdfsuccess functions are added by Jyoti on 11-Apr-2018
public confirmAlert():void
{
	if (this.actvitySeq.toString() == "4")
	{
		this.param = new HttpParams();
		this.param = this.param.set("entityId",this.entity);
		this.param = this.param.set("programId",this.program);
		this.param = this.param.set("branchId",this.branch);
		this.param = this.param.set("specializationId",this.specialization);
		this.param = this.param.set("semesterId",this.semester);
		this.param = this.param.set("semStartDate",this.ssd);
		this.param = this.param.set("semEndDate",this.sed);
		this.param = this.param.set("programCourseKey",this.programCourseKey);
		//Mask.show(commonFunction.getMessages('pleaseWait'));
		this.mask = true;
		//checkCardGenerated.send(param);
		let obj = {xmltojs:'Y',
		method: '/startActivity/checkCardGenerated.htm' };   
		this.mask=true;
			this.userservice.getdata(this.param,obj).subscribe(res=>{
			res= JSON.parse(res);
			this.cardGeneratedSuccess(res);
			this.mask=false;
			});
	}	
	else
	{  
		this.confirmFunction();
  	} 
}

private cardGeneratedSuccess(res):void{
	
		if(isNullOrUndefined(res.info.result))
		{ 
			this.user = "";
		} 
		else 
		{ 
			for ( var o of res.info.result )
			{
				this.user = String(o.message);
			}
		}
		var found:string = "";
		if (this.user.length > 0)
		{
        	found = this.user.substr(0,1);
			this.user = this.user.substr(1);
		}
        this.mask = false;
		console.log(this.user, found);	
       if (found === "Y")
       {
		this.certifylblVisible = true;
		this.can1Visible = false;
		var lblcontents:string="";
	    	lblcontents = "		User Confirmation" + "\n" + "\n";
	    	lblcontents= lblcontents + "This is to certify that Result Processing has been" + "\n" + "done successfully for " + this.semesterName + "\n";
	    	lblcontents = lblcontents +  "Entity	:" + this.entityName + "\n";
	    	lblcontents = lblcontents +  "Program	:" + this.programNm + "\n";
	    	lblcontents = lblcontents +  "Branch	:" + this.branchNm + "\n" + "\n";
	    	lblcontents = lblcontents +  "and following documents has been printed "+  "\n" + "successfully." + "\n";
	    	lblcontents = lblcontents + "	1. Progress Cards" + "\n";
	    	lblcontents = lblcontents + "	2. Consolidated Chart" + "\n";
	    	lblcontents = lblcontents + "	3. Result Statistics" + "\n";
	    	lblcontents = lblcontents + "	4. Result Unsatisfactory Performance" + "\n" + "\n";
	    	lblcontents = lblcontents + "All related cases (like scrutiny, result revised, etc)" + "\n" + "has also been resolved." + "\n" + "\n";
	    	lblcontents = lblcontents + "Confirmed By : " + this.user + "\n";
	    	this.certifylbl = lblcontents;
	    	/*certifylbl.visible = true;
	    	can2.visible = true;
	    	programlbl.visible = false;
			programforConfirmWindow.visible = false;
			branchlbl.visible = false;
			branchforConfirmWindow.visible = false;
			speciallbl.visible = false;
			specilizationforConfirmWindow.visible = false;
			semStdtlbl.visible = false;
			semesterStartDateforConfirmWindow.visible = false;
			semEnddtlbl.visible = false;
			semesterEndDateforConfirmWindow.visible = false;
			stagelbl.visible = false;
			stageforConfirmWindow.visible = false;
			stageseqlbl.visible = false
			stageSequenceforConfirmWindow.visible = false;
			statuslbl.visible = false;
			statusforConfirmWindow.visible = false;
			conbutton.visible = false;
			canbutton.visible = false;*/
       }
       else
       {
			//Alert.show("Progress Card not generated yet","Error",0,null,null,errorIcon);
			const mdialogRef=  this.mdialog.open(alertComponent,
				{data:{title:"Error",content:"Progress Card not generated yet", ok:true,cancel:false,color:"warn"}});
 
       		this.closeConfirmWindow();
       }
}

public generateConfirmPdf():void
{
	this.mask=true;	
	//var param:Object = new Object();
		this.param = this.param.set("entityId", this.entity);
		this.param = this.param.set("programId", this.program);
		this.param = this.param.set("programCourseKey", this.programCourseKey);
		this.param = this.param.set("semesterStartDate", this.ssd);
		this.param = this.param.set("confirmText", this.certifylbl);
		//generatePDF.send(param);
		let obj = {xmltojs:'Y',
		method: '/startActivity/generateUserConfirmPdf.htm' };   
			this.userservice.getdata(this.param,obj).subscribe(res=>{
			res= JSON.parse(res);
			this.pdfsuccess(res);
			this.mask=false;
			});
}
private pdfsuccess(res):void{
	var resMsg : string ="";
	if(isNullOrUndefined(res.info.result))
	{ 
		resMsg = "";
	} 
	else 
	{ 
		for ( var o of res.info.result )
		{
			resMsg = String(o.message);
		}
	}
	if (resMsg === "success")
	{
		this.confirmFunction();
	}
	else
	{
		console.log(resMsg);
	}
}
//This function Gives alert on confirmation 

public confirmFunction():void 
{   
	this.urlStartActivityList = "/startActivity/startProcessActivity.htm";
		    		
	//var param:Object=new Object();
	this.param = new HttpParams();
	this.param = this.param.set("entityId", this.entity); 
	this.param = this.param.set("entityName", this.entityName);
	this.param = this.param.set("programId", this.program);
	this.param = this.param.set("branchId", this.branch);
	this.param = this.param.set("specializationId", this.specialization);
	this.param = this.param.set("programName", this.programNm);
	this.param = this.param.set("branchName", this.branchNm);
	this.param = this.param.set("specializationName", this.spclNm);
	this.param = this.param.set("processId", this.process);
	this.param = this.param.set("semesterId", this.semester);
	this.param = this.param.set("semesterName", this.semesterName);
	this.param = this.param.set("programCourseKey", this.programCourseKey);
	this.param = this.param.set("semesterStartDate", this.ssd);
	this.param = this.param.set("semesterEndDate", this.sed);
	this.param = this.param.set("activityCode", this.activityCode);
	this.param = this.param.set("activityName", this.activityName);
	this.param = this.param.set("activitySequence", this.actvitySeq);
	this.param = this.param.set("activityStatus", this.activityStatus);
	
	//Mask.show(commonFunction.getMessages('pleaseWait'));
	this.mask = true;
	//httpXmlStartActivityList.send(param);
	let obj = {xmltojs:'Y',
		method: this.urlStartActivityList };   
		this.mask=true;
			this.userservice.getdata(this.param,obj).subscribe(res=>{
			res= JSON.parse(res);
			this.startActivityResultHandler(res);
			});

	//this.closeConfirmWindow();
}

 private startActivityResultHandler(res):void{
        //xmldata_activityList=event.result as XML;
		//Mask.close();
		this.mask = false;
		var errorList:any[]=[] ;
		var total:string="";
		var correct:string="";
        var reject:string="";
        var error:string="";
        var isComplete:string="";

		var coutResult:any[]=[];
		if(!isNullOrUndefined(res.countList.count) )
		{
        	for (var o of res.countList.count){
        		coutResult.push({total:o.total,correct:o.correct,error:o.error,activityCompleted:o.activityCompleted});
			}
		}
		for (var o of coutResult){
			total=o.total;
			correct=o.correct;
			error=o.error;
			isComplete=o.activityCompleted;
		}
		
		total=total.toString();
		correct=correct.toString();
		error=error.toString();
		isComplete=isComplete.toString();

		console.log("coutResult ", coutResult.length, coutResult, total, correct, error);
		var obj:any ;
		//console.log("error res=" , res,  res.countList.error );
		console.log("error res=" ,  res.countList.error );
		if( !isNullOrUndefined(res.countList.error)  )
		{
			if(Number(error) > 0 )
			{
				for (var o of res.countList.error)
				{
					console.log(o.errorRecord);
						for (var obj of o.errorRecord){
							var ss:string = obj.processed;
							//console.log("ss=" + ss);
							if(ss.length>30){
								ss=ss.substring(0,30);
							}				
							this.rejArray.push({rollno:obj.rollNumber,reason:ss,detail:obj.processed});
						}
				}
			}
		}
	   console.log(this.rejArray.length);
        	
       if(correct==="-404"){
		   //Alert.show(error+" roll numbers will be duplicate \n Please set correct starting sequence");
		   const mdialogRef=  this.mdialog.open(alertComponent,
			{data:{title:"Error",content:error+" roll numbers will be duplicate <br/> Please set correct starting sequence", ok:true,cancel:false,color:"warn"}});
	   }
	   else if(total===""){
			//Alert.show("Database Inconsistency:System Failure","Error",0,null,null,errorIcon); 	
			const mdialogRef=  this.mdialog.open(alertComponent,
				{data:{title:"Error",content:"Database Inconsistency:System Failure", ok:true,cancel:false,color:"warn"}});	
	   }	 
	   else
	    {
       		var sts:string="";
       		 if(isComplete==="true")	{
       		 	sts="Activity Completed";
       		 }else if(isComplete==="false"){
       		 	sts="Activity Not Completed";
       		 }
		  // Alert.show("Total Records ="+" "+total+"\n"+"Records Processed Correctly ="+" "+correct+"\n"+"Records Gives Error ="+" "+error+"\n"+sts,"Result",4,null,onStart,successIcon);
		   const mdialogRef=  this.mdialog.open(alertComponent,
			{data:{title:"Result",content:"Total Records ="+" "+total +"<br/>Records Processed Correctly = "+correct +"<br/>Records Gives Error = "+error+ "<br/><b>" + sts + "</b>", ok:true,cancel:false,color:"success"}});	
           /*if(activityCode=='MST'){
           	emailService.send([new Date]);
		   } */
		}
	    
		this.closeConfirmWindow();
    }
    
    /*public onStart():void{
        if(this.rejArray.length>0){
        	this.gridFunction(this.rejArray);
        }else{
        	this.buttonFunction();
        }
    	
    }
    
/* private faultHandler(event:FaultEvent):void{
        Alert.show(commonFunction.getMessages('requestFailed'),
	commonFunction.getMessages('failure'),0,null,null,errorIcon);
	Mask.close();
    }
  */ 
//This function Close popup window on click of cancel button on window
public cancelConfirmWindow():void 
{
	this.closeConfirmWindow();
} 

//This function Close popup window on click of close sign at corner on window
public closeConfirmWindow():void
{
	//PopUpManager.removePopUp(this);			
	this.dialogRef.close({ result: this.rejArray });
	return;
}
  
/*private initializeForEsc(evt:KeyboardEvent):void
   {
    if (evt.keyCode == Keyboard.ESCAPE)
    {
    	closeConfirmWindow();
    }
  }
  */

}