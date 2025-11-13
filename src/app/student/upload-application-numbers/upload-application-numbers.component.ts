import { Component,  HostListener,  OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgramService } from 'src/app/services/program.service';
import { EntityService } from 'src/app/services/entity.service';
import { FlleserviceService } from 'src/app/services/flleservice.service';
import { UserService } from 'src/app/services/user.service';
import { MyItem } from 'src/app/interfaces/my-item';
import { AgGridEvent, ColDef,  GridOptions,  GridReadyEvent, IsRowSelectable, RowNode } from 'ag-grid-community';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomComboboxComponent } from 'src/app/shared/custom-combobox/custom-combobox.component';
import { HttpParams } from '@angular/common/http';
import {alertComponent} from  'src/app/shared/alert/alert.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { isNullOrUndefined } from 'util';

function customComboValidator(obj: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if(control.value==' '){ 
      return {'id':true}; 
    }
    return null;
  };
}


@Component({
  selector: 'app-upload-application-numbers',
  templateUrl: './upload-application-numbers.component.html',
  styleUrls: ['./upload-application-numbers.component.css']
})
export class UploadApplicationNumbersComponent implements OnInit ,OnDestroy{
 
  @ViewChild('entityCombo') entityCombo:CustomComboboxComponent; 
  @ViewChild('programCombo') programCombo:CustomComboboxComponent; 
  @ViewChild('branchCombo') branchCombo:CustomComboboxComponent; 
  @ViewChild('spcCombo') spcCombo:CustomComboboxComponent; 

  mycolor='blue';
  entitycombolabel: string;
  programcombolabel: string;
  branchcombolabel: string;
  spccombolabel: string;
  semcombolabel: string;
  notupldedfilepath:String="";
  notupldedfilename:String="";
  pdfTimestamp = Date.now();
  showDownloadPwd:boolean = false;
  downloadPwdfilepath:string="";
  route:string="";
  displaygrid = false;
  gridOptions: GridOptions;
  public columnDefs: ColDef[]=[];
  defaultColDef!: any;
  suppressRowClickSelection: boolean = false;
  isRowSelectable!: IsRowSelectable;
  getRowStyle: any;
  selectedregdata: any[]=[];
  studentregdata: any[]=[];
  semCode:string="SM1";
  subs = new SubscriptionContainer();
  public rowData=[];
  public entitydata :MyItem []=[];
  public programdata :MyItem []=[];
  public branchdata :MyItem []=[];
  public spcdata :MyItem []=[];
  public semdata :MyItem []=[];
  combowidth: string;
  prgId: string="";
  prgName: string="";
  brnId: string="";
  brnName: string="";
  spcId: string="";
  spcName: string="";
  semName: string="";
  entityId: string="";
  entityName: string="";
  selectedFile: File | null = null;
  upldform:FormGroup;
  totaluploaded:any =0;
  registeredCount:any =0;
  notregisteredCount:any=0;
  mask:boolean=false;
  spinnerstatus: boolean=false;
  
  hashValueGetter = function (params: { node: { rowIndex: number; }; }) {
    return params.node.rowIndex+1;
  };
  
  
    constructor(private formBuilder: FormBuilder, 
    private router: Router,
    private programService:ProgramService,
    private fileservice:FlleserviceService,
    private userservice: UserService,
    public dialog: MatDialog  
   
    ) {
    this.programcombolabel = "Select Program" ;
    this.branchcombolabel ="Select Branch";
    this.spccombolabel = "Select Speclization";
    this.entitycombolabel= "Select Faculty";
    this.semcombolabel ="Select Semester";
    this.combowidth = "100%";
    this.defaultColDef = {editable: true, sortable: true,flex: 1,minWidth: 100,
                          filter: true, resizable: true};
   }

   @HostListener('unloaded')
  
   ngOnDestroy(): void { 
    this.subs.dispose();
    //throw new Error('Method not implemented.');
   }
 
  ngOnInit(): void {
    let idx=String(this.router.url).lastIndexOf("/");
    this.route = String(this.router.url).slice(idx+1);    
    this._createForm();
    this.getEntities();
    this.spinnerstatus=false;          
    this.displaygrid = false;
        this.gridOptions = <GridOptions>{
          enableSorting: true,
          enableFilter: true
        };
  }

  private _createForm(): void {
    this.upldform = this.formBuilder.group({
      entityId: [" ",[Validators.required,customComboValidator(this.entityId)]],
      programId: [" ", [Validators.required,customComboValidator(this.prgId)]],
      branchId: [" ", [Validators.required,customComboValidator(this.brnId)]],
      specializationId: [" ",[Validators.required,customComboValidator(this.spcId)]],
      semester:[" ",[Validators.required,customComboValidator(this.semCode)]],
    });
  } 

  Onpgmselected(obj:any){ 
    this.upldform.get('programId')?.setValue(obj.id[0]);
    this.prgId=obj.id[0];
    this.prgName=obj.label[0];
    //this.branchCombo.myControl.setValue({"":""});
    //this.spcCombo.myControl.setValue({"":""});
    this.semdata=[]; this.semCode="";
    this.branchdata=[]; this.brnId="";
    this.spcdata=[]; this.spcId="";
    this.displaygrid = false;
    this.notupldedfilepath = "";
    this.showDownloadPwd = false;
    this.getSem();
  }

  OnentitySelected(obj:any){
    this.upldform.get('entityId')?.setValue(obj.id[0]);
    this.entityId=obj.id[0];
    this.entityName=obj.label[0];
    this.programCombo.myControl.setValue({"":""});
    this.semdata=[]; this.semCode="";
    this.branchdata=[]; this.brnId="";
    this.spcdata=[]; this.spcId="";
    this.displaygrid = false;
    this.notupldedfilepath = "";
    this.showDownloadPwd = false;
    this.userservice.clear();
    this.programService.clear();
    this.getAuthPrograms();
  }

  OnSemselected(obj){
    this.upldform.get('semester')?.setValue(obj.id);
    this.semCode=obj.id;
    this.semName=obj.label;
    this.branchdata=[]; this.brnId="";
    this.spcdata=[]; this.spcId="";
    this.displaygrid = false;
    this.notupldedfilepath = "";
    this.showDownloadPwd = false;
    this.userservice.clear();
    this.programService.clear();
    this.getBranches();
  }

  Onbrnselected(obj:any){
    this.upldform.get('branchId')?.setValue(obj.id[0]);
    this.brnId=obj.id[0];
    this.brnName=obj.label[0];
    this.spcdata=[];
    this.spcId="";
    this.displaygrid = false;
    this.notupldedfilepath = "";
    this.showDownloadPwd = false;
    this.userservice.clear();
    this.programService.clear();
    this.getSpc();
  }

  Onspcselected(obj:any){
    this.upldform.get('specializationId')?.setValue(obj.id[0]);
    this.spcId=obj.id[0];
    this.spcName=obj.label[0];
    this.displaygrid = false;
    this.notupldedfilepath = "";
    this.showDownloadPwd = false;
    this.userservice.clear();
    this.programService.clear();
    this.showStagingGrid();
  }

  onCancel(){
    this.router.navigate(['dashboard']);
  }  

  get f() {  return this.upldform.controls; }

OngridReady(params: GridReadyEvent) {
    this.columnDefs = [
      //{ headerName: 'Sq.no', valueGetter: this.hashValueGetter, suppressSizeToFit: true, flex: 1 },
      { headerName: 'Reg Number', field: 'registrationNo', headerCheckboxSelection: true, checkboxSelection: true, width:100, suppressSizeToFit: true},
      { headerName: 'Name', field: 'studentname', flex: 1 },
      { headerName: 'Father Name', field: 'fathername',flex: 1 },
      { headerName: 'Mother Name', field: 'mothername',flex: 1 },
      { headerName: 'Date of Birth', field: 'dob',flex: 1 },
      { headerName: 'Enrolment Number', field: 'enrollmentNo', hide:true },
      { headerName: 'Status', field: 'status',flex: 1 },
      { headerName: "Semester Start Date", field: 'semesterstartdate',flex: 1, hide:true },
      { headerName: "Semester End Date", field: 'semesterenddate',flex: 1, hide:true },
    ];
    params.columnApi.autoSizeAllColumns();
    //params.api.sizeColumnsToFit();
    this.gridOptions.columnDefs = this.columnDefs;
  }

  getEntities(){   
    let params:HttpParams= new HttpParams(); 
    params=params.set("menuCode", this.route);
    let obj = { xmltojs: 'Y', method: 'None' };
    obj.method = '/uploadStudents/getEntityList.htm';
    this.subs.add = this.userservice.postdata(params, obj).subscribe((res) => {
      let  data = JSON.parse(res);
      if(isNullOrUndefined(data.commonObjectList.object)){
        this.userservice.log("No data available");
        return;
      }
      this.entitydata=[];
      data.commonObjectList.object.forEach(element => {
        this.entitydata.push({id:element.code,label:element.description});
      });  
    },
    error=>{
      this.userservice.log(error.originalError.message);
    })
}

getAuthPrograms(){
      this.programService.getAuthorizeProgramsformenu(this.entityId,this.route).subscribe(res=>{
      this.programdata =[];       
      let  data = JSON.parse(res);
      //console.log("route",  this.route, "prgs", data.Details.Detail);
      if(isNullOrUndefined(data.Details.Detail)){
        this.programService.log("You are not Authorized for program");
        this.upldform.reset();
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

getSem(){
  let params:HttpParams= new HttpParams();
  params=params.set("programId", this.prgId);
  let obj = { xmltojs: 'Y', method: 'None' };
  obj.method = '/uploadStudents/getSemforReg.htm';
  this.subs.add = this.userservice.postdata(params, obj).subscribe((res) => {
  let  data = JSON.parse(res);
  //console.log("getSem", data);
    if(isNullOrUndefined(data.commonObjectList.object)){
      this.semCode='SM1'; //default registration would be enabled in SM1
      this.getBranches();
      return;
    }
    else {
      this.semdata=[];
      data.commonObjectList.object.forEach(element => { 
            this.semdata.push({id:element.code, label:element.description});
      });  
    }
    },
    error=>{
       this.programService.log(error.originalError.message);
       this.semCode='SM1'; 
    }) 
}

getBranches(){
      this.brnId ="";
      this.branchdata=[];
      let params:HttpParams= new HttpParams();
      params=params.set("entityId", this.entityId );
      params=params.set("programId", this.prgId);
      params=params.set("semesterCode", this.semCode);
      let obj = { xmltojs: 'Y', method: 'None' };
      obj.method = '/uploadStudents/getSemBranches.htm';
      this.subs.add = this.userservice.postdata(params, obj).subscribe((res) => {
          let  resd = JSON.parse(res);
          //console.log("getBranches", resd);
          if(isNullOrUndefined(resd.commonObjectList.object)){
              this.brnId='XX'; //default branch None.
              this.brnName = 'None';
              this.getSpc();
              return;
          }
          else {
            let branches: MyItem[]=[];
            resd.commonObjectList.object.forEach(element => { 
                branches.push({id:element.code, label:element.description});
            });  
            if (branches.length == 1 && branches[0].id[0] == 'XX')  
            { 
                this.brnId = 'XX';
                this.brnName = 'None';
                this.getSpc();
            }
            else if (branches.length > 0) {
              this.branchdata = branches;
            }
          }
    },
    error=>{
        this.programService.log(error.originalError.message);
        this.brnId = 'XX';
        this.brnName = 'None';
    })
}

getSpc(){
  this.spcdata=[];
  this.spcId="";
  //console.log("programId", this.prgId, "branchId", this.brnId, "semester", this.semCode);
  let params:HttpParams= new HttpParams();
      params=params.set("entityId", this.entityId );
      params=params.set("programId", this.prgId);
      params=params.set("branchId", this.brnId);
      params=params.set("semesterCode", this.semCode);
      let obj = { xmltojs: 'Y', method: 'None' };
      obj.method = '/uploadStudents/getSemSpcl.htm';
      this.subs.add = this.userservice.postdata(params, obj).subscribe((res) => {
          let  data = JSON.parse(res);
          //console.log("getSpc", data.commonObjectList.object);
          if(isNullOrUndefined(data.commonObjectList.object)){
              this.spcId = '00'; //default spc Id
              this.spcName = 'None';
              this.showStagingGrid();
              return;
          }
          else {
            let spc: MyItem[]=[];
            data.commonObjectList.object.forEach(element => { 
                spc.push({id:element.code, label:element.description});
            }); 
            if (spc.length == 1 && spc[0].id[0] == '00')  
            {
                this.spcId = '00';
                this.spcName = 'None';
                this.showStagingGrid();
                //console.log("default spc", this.spcId);
            }
            else if (spc.length > 0) {
              this.spcdata = spc;
            }
          }
    },
    error=>{
        this.programService.log(error.originalError.message);
        this.spcdata=[];
        this.spcId = '00';
        this.spcName = 'None';
    })
}

downloadBlankTemplate()
{
  //create excel file with name entityid_programid_branchid_specializationid.xls
  //and first column header as application number in excel
  //download this file.
  if(!isNullOrUndefined(this.entityId) && !isNullOrUndefined(this.prgId) 
    && !isNullOrUndefined(this.brnId) && !isNullOrUndefined(this.spcId)) 
  {
      //let headerdata = [{ApplicationNumber: ''}];
      //const worksheet = XLSX.utils.json_to_sheet(headerdata);
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
            [],               // Row 1 (we’ll add later manually)
            []                // Row 2
          ]);

      // Set specific cells manually
      worksheet['B1'] = { t: 's', v: this.entityName + " " + this.prgName + " " + this.brnName + " " + this.spcName + " " + this.semCode }; // B1 cell
      worksheet['A2'] = { t: 's', v: 'ApplicationNumber' };     // A2 cell
     // Define worksheet range so Excel knows used area
      worksheet['!ref'] = 'A1:B2';
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xls',
        type: 'array',
      });
  
      const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
      let filename = this.entityId + "_" + this.prgId + "_"+ this.brnId + "_" + this.spcId +'_REG.xls';
      FileSaver.saveAs(data, filename);
    }
    else
    {
      this.userservice.log("Please select the inputs");
    }
    return;
}

onFileChange(event: any) {
    this.userservice.clear();
    this.programService.clear();
    const file = event.target.files[0];
    this.notupldedfilepath="";
    if (file && (file.name.endsWith('.xls') || file.name.endsWith('.xlsx'))) {
      this.spinnerstatus = true;
      console.log('Selected file:', file.name);
      let inpfilenm = file.name.toString();
      let expectedfilenm = this.entityId + "_" + this.prgId + "_"+ this.brnId + "_" + this.spcId +"_REG.xls";
      if (inpfilenm != expectedfilenm)
      {
         this.userservice.log("Please download tempate for above selected class, enter application numbers and upload it without changing the template file name"); 
         this.spinnerstatus = false;
         event.target.value = '';
         return;
      }
      this.selectedFile = file;
      //let filename: string = String(file.name).toString();      
      let filename = this.entityId + "_" + this.prgId + "_"+ this.brnId + "_" + this.spcId +"_StudentsUpload.xls";
      console.log("filename", filename);
      if(this.selectedFile)
      {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        this.fileservice.uploadxlsFile(formData, filename).subscribe((res)=>
           { 
              console.log("file upload status", res.message);
              this.setStagingData(filename);
           }
        );
      }
      else { alert('Please select a file first'); }
    } else {
      alert('Please select a valid Excel file.');
    }
    this.spinnerstatus = false;
    event.target.value = '';
}

setStagingData(filename: string)
{
          this.mask=true;
            let params:HttpParams= new HttpParams();
            params=params.set("userDefinedPwd", "N");
            params=params.set("fileName", filename);
            params=params.set("entityId", this.entityId);
            params=params.set("entityName", this.entityName);
            params=params.set("programId", this.prgId);
            params=params.set("programName", this.prgName);
            params=params.set("branchId", this.brnId);
            params=params.set("branchName", this.brnName);
            params=params.set("specializationId", this.spcId);
            params=params.set("specializationName", this.spcName);
            params=params.set("semesterCode", this.semCode);
            console.log("setting data for", this.entityId, this.prgId, this.brnId, this.spcId, this.semCode);
            let obj = { xmltojs: 'Y', method: 'None' };
            obj.method = '/uploadStudents/setStagingData.htm';
            
            this.subs.add = this.userservice.postdata(params, obj).subscribe((res) => {
               let robj = JSON.parse(res);
               this.mask=false;
               let str:String ="";
               if(!(isNullOrUndefined(robj.info.result))){
                    str =robj.info.result[0].status[0]; 
                    //this.userservice.log("Upload file status - " + robj.info.result[0].message[0]);
                    const dialogRef1=  this.dialog.open(alertComponent,
                          {data:{title:"Info",content:"Upload file status: " + robj.info.result[0].message[0], ok:true,cancel:false,color:"warn"}});
                      dialogRef1.disableClose = true;                  
               }
               console.log("res after setStagingData", str);
                if(str=="failure")
                {
                  this.notupldedfilepath="";
                  this.getNotUploadedRecords();
                }
                else if (str == "someNotUploaded") //some loaded successfully and some not
                {
                  this.notupldedfilepath="";
                  this.getNotUploadedRecords();
                  this.showDownloadPwd = true;
                }
                else if(str=="success")
                {
                  this.showDownloadPwd = true;
                }
                this.showStagingGrid();
              },
              (error) => { console.log(error);}
             );
}

getNotUploadedRecords()
{
    this.notupldedfilename = "";
    let params:HttpParams= new HttpParams();
      params=params.set("entityId", this.entityId);
      params=params.set("entityName", this.entityName);
      params=params.set("programId", this.prgId);
      params=params.set("programName", this.prgName);
      params=params.set("branchId", this.brnId);
      params=params.set("branchName", this.brnName);
      params=params.set("specializationId", this.spcId);
      params=params.set("specializationName", this.spcName);
      let obj = { xmltojs: 'Y', method: 'None' };
      obj.method = '/uploadStudents/getNotUploadedStudents.htm';
      this.mask=true;
      this.subs.add = this.userservice.postdata(params, obj).subscribe((res) => {
               let robj = JSON.parse(res);
               let str:String ="";
               if(!(isNullOrUndefined(robj.info.result))){
                    str =robj.info.result[0].status[0]; 
               }
               console.log("res notuploadedRecords", str);
                if(str=="failure")
                {
                  this.userservice.log(str + " " + robj.info.result[0].message[0]);
                }
                if(str=="success")
                {
                  let url1:String = robj.info.result[0].pathWithFileName;
		              //let aa:any[] = url1.toString().split('\\');
			            //url1 = aa.join('\/');
                  if (url1.length > 0) {
                        let strary = String(url1).split('/');
                        this.notupldedfilename =strary[strary.length-1];
                        this.notupldedfilepath = url1 + "?v=" + this.pdfTimestamp;
                        console.log("pdf file path" , this.notupldedfilepath);
                  }  
                }
              },
              (error) => { console.log(error);}
             );
             this.mask=false;
}

getPasswordFile()
{
      let params:HttpParams= new HttpParams();
      params=params.set("entityId", this.entityId);
      params=params.set("entityName", this.entityName);
      params=params.set("programId", this.prgId);
      params=params.set("programName", this.prgName);
      params=params.set("branchId", this.brnId);
      params=params.set("branchName", this.brnName);
      params=params.set("specializationId", this.spcId);
      params=params.set("specializationName", this.spcName);
      params=params.set("semesterCode", this.semCode);
      let obj = { xmltojs: 'Y', method: 'None' };
      obj.method = '/uploadStudents/downloadPasswordFile.htm';
      this.mask=true;
      this.subs.add = this.userservice.postdata(params, obj).subscribe((res) => {
               let robj = JSON.parse(res);
               let str:String ="";
               if(!(isNullOrUndefined(robj.info.result))){
                    str =robj.info.result[0].status[0]; 
               }
               console.log("res uploadedRecords", str);
                if(str=="failure")
                {
                  this.userservice.log(str + " " + robj.info.result[0].message[0]);
                }
                if(str=="success")
                {
                  let url1:string = robj.info.result[0].pathWithFileName;
		              let aa:any[] = url1.toString().split('\\');
			            url1 = aa.join('\/');
                  if (url1.length > 0) {
                      this.downloadPwdfilepath = url1;
                      window.open(this.downloadPwdfilepath);
                  }  
                }
              },
              (error) => { console.log(error);}
             );
             this.mask=false;
}
onSubmit(userForm: NgForm){
  if (this.upldform.status!="VALID"){
    this.programService.log("Input not Valid");
    return;
  }
  this.getPasswordFile();
  console.log("submit click");
}

showStagingGrid():void 
{   
  this.studentregdata = [];
  this.displaygrid = true; 
  this.totaluploaded =0;
  this.registeredCount =0;
  this.notregisteredCount =0;
  this.notupldedfilepath="";
  console.log(this.entityId, this.prgId, this.brnId, this.spcId, this.semCode);
  if (this.entityId?.length > 0 && this.prgId?.length > 0 && 
      this.brnId?.length >0 && this.spcId?.length >0 &&  this.semCode?.length > 0)
  {	
           let params:HttpParams= new HttpParams();
            params=params.set("entityId", this.entityId);
            params=params.set("programId", this.prgId);
            params=params.set("branchId", this.brnId);
            params=params.set("specializationId", this.spcId);
            params=params.set("semesterCode", this.semCode);
            let obj = { xmltojs: 'Y', method: 'None' };
            obj.method = '/uploadStudents/getStagingData.htm';
            this.mask=true;
            this.subs.add = this.userservice.postdata(params, obj).subscribe((res) => {
               let robj = JSON.parse(res);
               this.studentregdata.splice(0,this.studentregdata.length);
	              if (!isNullOrUndefined(robj.students.student) )
	              {
                    for (var o of robj.students.student)
		                  {
			                  this.studentregdata.push({status:o.processedFlag, registrationNo:o.registrationNo, studentname:o.studentName, dob:o.dob, 
                        gender:o.gender, fathername:o.fatherName, mothername:o.motherName, 
                        entityName:this.entityName, programname:this.prgName, branchname:this.brnName, specilizationname:this.spcName,
                        enrollmentNo:o.enrollmentNo,
			                  semesterstartdate:o.semesterStartDate, semesterenddate:o.semesterEndDate , 
			                  programId:this.prgId,branchId:this.brnId,specializationId:this.spcId});
                        this.totaluploaded ++;
                        if (o.processedFlag[0] ==="Registered")
                        { this.registeredCount ++ ;}
                        else if (o.processedFlag[0] ==="NotRegistered")
                        { this.notregisteredCount ++ ;}
		                  }
                      this.displaygrid = true;
                      this.showDownloadPwd = true;
                      this.isRowSelectable = (params: RowNode) => {
                              if (params.data.status[0].trim() === "Registered") {
                                this.suppressRowClickSelection = true;
                                return false;
                              }
                              else
                                return true;
                            };
                      
                            this.getRowStyle = params => {
                              if (params.node.data.status[0].trim() === "NotRegistered") {
                                return { color : 'red' };
                              }
                            };
	              }
                else {
                  //this.userservice.log("No Data found for selected class");
                  this.totaluploaded =0;
                  this.registeredCount =0;
                  this.notregisteredCount =0;
                }
	            },
              (error) => { console.log(error);}
             );
             this.mask=false;
  }
  return;
}

onRowSelected(event: AgGridEvent) {
      this.selectedregdata = event.api.getSelectedRows();  
      //console.log(this.selectedregdata);
}

deleteSelected() {
    if (this.selectedregdata.length === 0) {
      alert('Please select registration number to delete!');
      return;
    }
    if (this.selectedregdata.length > 0) {
      console.log("selected rows", this.selectedregdata.length);
      const dialogRef=  this.dialog.open(alertComponent,
              {data:{title:"Warning",content:"Are you sure to delete selected records",
                ok:true,cancel:true,color:"warn"}});
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe(result => {
            if(result){
              let regno:string = this.selectedregdata.map((row: any) => row.registrationNo).join('|');      
              console.log("regno", regno);
              let params:HttpParams= new HttpParams();
              params=params.set("entityId", this.entityId);
              params=params.set("programId", this.prgId);
              params=params.set("branchId", this.brnId);
              params=params.set("specializationId", this.spcId);
              params=params.set("semesterCode", this.semCode);
              params=params.set("deleteAll", "no");
              params=params.set("registrationNumbers", regno);
              let obj = { xmltojs: 'Y', method: 'None' };
              obj.method = '/uploadStudents/deleteStagingData.htm';
              this.mask=true;
              this.subs.add = this.userservice.postdata(params, obj).subscribe(res=> {
                let resobj = JSON.parse(res);
                if(!(isNullOrUndefined(resobj.info.result))){
                    let str =resobj.info.result[0].status[0];
                    console.log(resobj.info.result, str);
                    if (str === "success") { 
                      const dialogRef1=  this.dialog.open(alertComponent,
                          {data:{title:"Info",content:"Deleted successfully", ok:true,cancel:false,color:"warn"}});
                      dialogRef1.disableClose = true;                  
                      this.showStagingGrid(); }
                    else { this.userservice.log("Record can not be deleted"); }
                }
              }, err => {
                    this.userservice.log("Record can not be deleted");
              });
            }
      });      
      this.mask=false;
    }
  }  

}