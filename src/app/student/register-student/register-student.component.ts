import { HttpParams, HttpResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { Location } from '@angular/common';

import * as Collections from 'typescript-collections';
//import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { MyItem } from '../../interfaces/my-item';

import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { alertComponent } from '../../shared/alert/alert.component';

import { CustomComboboxComponent } from '../../shared/custom-combobox/custom-combobox.component';
import { GridOptions, GridReadyEvent } from 'ag-grid-community';
import { SubscriptionContainer } from '../../shared/subscription-container';
import { CourseGroupRowComponent } from '../../shared/course-group-row/course-group-row.component';
import { CourseGroupRelationRule } from '../../interfaces/course-group-relation-rule';
import { GroupCreditRule } from '../../interfaces/group-credit-rule';
import { CourseRuleService } from '../../services/course-rule.service';


@Component({
  selector: 'register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css'],
})
export class RegisterStudentComponent implements AfterViewInit, OnDestroy {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('CustomComboboxComponent') custcombo: CustomComboboxComponent;
  combowidth: string;
  public displaybutton: boolean = false;
  //suppressRowDeselection = false;
  check = false;
  showundertaking = true;
  subs = new SubscriptionContainer();
  rollno: string;
  courseGroupRules: CourseGroupRelationRule[] = [];
  groupCreditRules: GroupCreditRule[] = [];

  //  mode: ProgressSpinnerMode = 'indeterminate';
  // color: ThemePalette = 'primary';
  // value = 50;

  constructor(
   
    private userservice: UserService,
    
    private elementRef: ElementRef,

    private location: Location,
    public dialog: MatDialog,
    private courseRuleService: CourseRuleService,
  
   
  ) {}
  ngOnDestroy(): void {
    this.subs.dispose();
    this.elementRef.nativeElement.remove();
    this.location.back();
  }
  ngAfterViewInit(): void {}

  // OnSelectAll(){
  //   this.agGrid.api.selectAll();
  // }
  Onchange() {
    console.log(this.check);
    this.check ? this.agGrid.api.selectAll() : this.agGrid.api.deselectAll();
  }

  OngridReady(parameters: GridReadyEvent) {
    //this.agGrid.api.forEachNode((node,index)=>{console.log(node,index)});

    parameters.api.deselectAll();

    this.check = false;
  }

  ngOnInit(): void {
    // debugger;
    this.rollno = localStorage.getItem('id');

    this.showundertaking = true;
    // this.gettencode();
  }

  onAgreed($event) {
    //debugger;
    this.showundertaking = false;
    this.gettencode();
  }
  isSubmitEnabled: boolean = false;
  selectionErrorMessage: string = '';
  itemselected: MyItem;
  combolabel: string;
  mask: boolean = false;
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
  semDetail: any;
  tencode: any;
  studentDetail: any;
  url: string;
  urlPrefix: string;

  programId: string;
  branchId: string;
  specializationId: string;
  entityId: string;
  semester: string;

  semesterStartDate: string;
  semesterEndDate: string;
  pck: string;
  creditavailable: number;
  creditselected: number;

  credittheory: number;
  creditpractical: number;
  maxcreditrequired: number;
  mincreditrequired: number;
  attemptno: number;
  wrkAC: any;
  selectedbranchId: string;
  selectedspcId: string;
  courseGroupRow = CourseGroupRowComponent;

  regdataAC: any;
  //selecteddata=new Collections.Set<string>();
  selecteddata: string = '';
  studentdetailAC: any;

  spinnerstatus: boolean = false;

  public myrowData: any[] = [];

  selectedNodes: any;

  defaultColDef = {
    sortable: true,
    filter: true,
  };

  isFullWidthCell = (rowNode: any): boolean => {
    // console.log('FULL WIDTH:', rowNode.data);

    return rowNode.data && rowNode.data.isGroup === true;
  };
  hashValueGetter = function (params) {
    return params.node.rowIndex;
  };

  
  columnDefs = [
    {
      field: 'coursetypedesc',
      headerName: 'Course Type',
      hide: true,
    },

    {
      field: 'coursetype',
      hide: true,
    },

    {
      field: 'courseCode',
      headerName: 'Course Code',
      checkboxSelection: (params) => {
        return !params.data.isGroup;
      },
    },

    {
      field: 'coursename',
      headerName: 'Course Name',
    },

    {
      field: 'credits',
      headerName: 'Credits',
    },
  ];

  params = new HttpParams().set('application', 'CMS');

  myparam = new HttpParams().set('application', 'CMS');

  public combodata: MyItem[] = [];

  isRowSelectable = (params) => {
    return !params.data.isGroup;
  };

  createGroupedData(data: any[]): any[] {
    const result: any[] = [];
    let previousType: string = '';

    data.forEach((row) => {
      if (String(row.coursetypedesc).trim() !== previousType) {
        result.push({
          isGroup: true,
          coursetypedesc: row.coursetypedesc + '(' + row.coursetype + ')',
        });

        previousType = String(row.coursetypedesc).trim();
      }

      result.push({
        ...row,
        isGroup: false,
      });
    });
    console.log('Grouped Data', result);
    return result;
  }

  gettencode() {
    //debugger;
    let obj = {
      xmltojs: 'Y',
      method: '/registrationforstudent/gettencodes.htm',
    };
    this.mask = true;
    this.subs.add = this.userservice
      .getdata(this.params, obj)
      .subscribe((res) => {
        res = JSON.parse(res);
        this.gettencodeSuccess(res);
        this.mask = false;
      });
  }

  //public function
  gettencodeSuccess(res) {
    //let data = null;

    let myparam: any = {};
    for (var obj of res.registerDetails.Detail) {
      if (obj.switchType != '') {
        //if there is a switch
        //Alert.show("switch type"+obj.switchType);
        myparam['module'] = '';
        myparam['switchType'] = obj.switchType;
        myparam['entitytype'] = obj.entitytype;
        myparam['entityId'] = obj.entityId;
        myparam['entityName'] = obj.entityName;

        myparam['switchoption'] = obj.switchoption;

        myparam['currentpck'] = obj.programcoursekey;
        myparam['newpck'] = obj.newpck;
        myparam['semesterStartDate'] = obj.semesterStartDate;
        myparam['semesterEndDate'] = obj.semesterEndDate;
      }

      if (obj.available == 'Y') {
        /*   
       vstack.selectedChild=sempanel;
       */
        for (var num: number = 1; num < 17; num++) {
          this.combodata.push({ id: num.toString(), label: num.toString() });
        }

        this.combolabel = 'Select Module';
        this.combowidth = '50%';
        console.log('In Module', this.combodata);

        return;
      } else {
        //urlPrefix = url+"getswitchdetail.htm";

        //getswitchdetailservice.send(param);
        this.getswitchdetail();
        break;
      }
    }
  }

  getswitchdetail() {
    // this.params=this.params.set('method','/registrationforstudent/getswitchdetail.htm');
    // console.log(this.params);
    let obj = { xmltojs: 'Y', method: 'None' };
    obj.method = '/registrationforstudent/getswitchdetail.htm';
    this.mask = true;
    this.subs.add = this.userservice
      .getdata(this.params, obj)
      .subscribe((res) => {
        //this.userservice.log(" in switch detail selected");
        res = JSON.parse(res);
        this.mask = false;
        console.log('switch_detail', res);

        this.getswitchdetailSuccess(res);
      });
  }

  getswitchdetailSuccess(res) {
    //Alert.show("Arush switch detail success"+semDetail);

    for (var obj of res.registerDetails.Detail) {
      console.log('Object available', obj.available);
      if (obj.available == 'N') {
        console.log(' in Object available', obj.available);
        this.params = this.params.set('switchType', 'NON');
        this.params = this.params.set('module', '');

        //this.params["module"]="";

        this.getcoursesservice(this.params);
        break;
      } else {
        //	Alert.show("entity detail"+obj.entitytype +"f"+obj.entityId);
        this.params = this.params.set('module', '');
        this.params = this.params.set('switchType', obj.switchType);
        this.params = this.params.set('entitytype', obj.entitytype);
        this.params = this.params.set('entityId', obj.entityId);
        this.params = this.params.set('entityName', obj.entityName);
        this.params = this.params.set('switchoption', obj.switchoption);
        this.params = this.params.set('currentpck', obj.programcoursekey);
        this.params = this.params.set('newpck', obj.newpck);
        this.params = this.params.set(
          'semesterStartDate',
          obj.semesterStartDate,
        );
        this.params = this.params.set('semesterEndDate', obj.semesterEndDate);

        console.log('Switch option', obj.switchoption);
        if (obj.switchoption == 'FIX') {
          if (obj.newpck == '') {
            //errorlabel.text ="Switch setup not ready";
            //vstack.selectedChild=errorpanel;

            this.userservice.log('Switch setup not ready');
            //this.router.navigate(['../dashboard']);
            this.ngOnDestroy();
            return;
          }

          this.getcoursesservice(this.params);
        }

        if (obj.switchoption == 'BRN') {
          if (obj.newpck == '') {
            //errorlabel.text ="Switch setup not ready";

            //vstack.selectedChild=errorpanel;

            this.userservice.log('Switch setup not ready');
            this.ngOnDestroy();
            //this.router.navigate(['../dashboard']);
            return;
          }

          this.getbrnservice(this.params);
        }

        if (obj.switchoption == 'SPC') {
          if (obj.newpck == '') {
            //errorlabel.text ="Switch setup not ready";

            //vstack.selectedChild=errorpanel;
            this.userservice.log('Switch setup not ready');
            this.ngOnDestroy();
            //this.router.navigate(['../dashboard']);
            return;
          }

          console.log('before spcservice', this.params);

          this.getspcservice(this.params);
        }
      }
    }
  }
  getbrnservice(param) {
    // urlPrefix = url+"getbranches.htm";

    let myparam = { xmltojs: 'Y', method: 'None' };
    myparam.method = '/registrationforstudent/getbranches.htm';

    this.mask = true;
    this.subs.add = this.userservice
      .getdata(this.params, myparam)
      .subscribe((res) => {
        res = JSON.parse(res);
        this.mask = false;
        this.getbrnSuccess(res);
      });
  }

  getspcservice(param) {
    let myparam = { xmltojs: 'Y', method: 'None' };
    myparam.method = '/registrationforstudent/getspeclizations.htm';

    this.mask = true;
    this.subs.add = this.userservice
      .getdata(this.params, myparam)
      .subscribe((res) => {
        res = JSON.parse(res);
        this.mask = false;
        this.getspcSuccess(res);
      });
  }

  getcoursesservice(param) {
    let myparam = { xmltojs: 'Y', method: 'None' };
    myparam.method = '/registrationforstudent/getcourses.htm';
    // this.params=this.params.set('switchType','NON');
    // this.params=this.params.set('module','');
    this.mask = true;
    this.subs.add = this.userservice
      .getdata(this.params, myparam)
      .subscribe((res) => {
        res = JSON.parse(res);
        console.log('courses', res);
        this.combodata.splice(0, this.combodata.length);
        //this.combodata =[];
        this.mask = false;
        this.getcoursesSuccess(res);
      });
  }

  getcoursesSuccess(res) {
    //semDetail = event.result as XML;
    //regdataAC = new ArrayCollection();
    console.log('courses', res);

    //this.myrowData=res.registerDetails.Detail;
    let data: any = res.registerDetails.Detail;
    this.myrowData = this.createGroupedData(data);
    this.getCourseGroupRules(data);

    var start: number = 0;

    //Alert.show("arush"+semDetail);

    for (var obj of res.registerDetails.Detail) {
      if (obj.available == 'N') {
        this.myrowData.splice(0, this.myrowData.length); // clear the myrowdata array
        this.userservice.log(obj.message);
        this.ngOnDestroy();
        //errorlabel.text=obj.message;
        //vstack.selectedChild=errorpanel;
        //		Alert.show("Error :"+obj.message);

        return;
      } else {
        //	vstack.selectedChild=regpanel;
        //vstack.selectedChild=regpanel;
        if (start == 0) {
          this.maxcredit = 'Max Credits Required:' + obj.maxcredit;
          console.log('in start', this.maxcredit.text, 'arush', obj.maxcredit);
          this.mincredit = 'Min Credits Required:' + obj.mincredit;
          this.maxcreditrequired = parseFloat(obj.maxcredit);
          this.mincreditrequired = parseFloat(obj.mincredit);
          this.programId = obj.programId;
          this.pgm = obj.programname;

          this.branchId = obj.branchId;
          this.branch = obj.branch;

          this.pck = obj.programcoursekey;

          this.specializationId = obj.specializationId;
          if (obj.speclization == 'NONE') {
            this.spec = '';
          } else {
            this.spec = 'Specialization:' + obj.speclization;
          }

          this.sem = 'Semester:'.concat(obj.semestercode);
          this.semester = obj.semestercode;
          this.attempt = 'Attempt No:' + obj.attemptNumber;
          this.attemptno = obj.attemptNumber;

          this.semesterStartDate = obj.semesterStartDate;
          this.semesterEndDate = obj.semesterEndDate;
          this.entityId = obj.entityId;
          this.entity = obj.entityName;
          console.log('in course success', obj.entityName);
          this.creditavailable = obj.creditavailable;
          // Alert.show("creditavailable:"+creditavailable +"  max credit:"+maxcredit.text);
          console.log(this.creditavailable, obj.creditavailable);

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
  getCourseGroupRules(data: any) {
    let myparam = { xmltojs: 'Y', method: 'None' };
    let pck = data[0].programcoursekey;
    myparam.method = '/registrationforstudent/checkCourseGroupRules.htm';
    this.params = this.params.set('programCourseKey', pck);
   
    this.mask = true;
    this.subs.add = this.userservice.getdata(this.params, myparam).subscribe(
      (res) => {
        const data = JSON.parse(res);
        console.log('Course Group Rules', data);
        // Credit rules
        this.groupCreditRules = data.groupCreditRules || [];

        // Relationship rules
        this.courseGroupRules = data.groupRelations || [];

        console.log('GROUP CREDIT RULES:', this.groupCreditRules);
    
        this.mask = false;
        //this.getcoursesSuccess(res );
        console.log('Course Group Rules', this.courseGroupRules);
        console.log('Group Credit Rules', this.groupCreditRules);
      },
      (error: any) => {
        console.error('Error getting course group rules', error);
      },
    );
  }
  getRuleForGroup(groupCode: string): CourseGroupRelationRule | null {
    const rule = this.courseGroupRules.find(
      (r) => r.dependent_group_code === groupCode && r.active === 1,
    );

    return rule || null;
  }
  getSelectedCredits(groupCode: string): number {
    let totalCredits = 0;

    this.agGrid.api.forEachNode((node) => {
      if (!node.data || node.data.isGroup) {
        return;
      }

      const group = this.getValue(node.data.coursetype);

      if (node.isSelected() && group === groupCode) {
        totalCredits += this.getCredits(node.data);
      }
    });

    return totalCredits;
  }

  checkDependency(
  node: any,
  rule: CourseGroupRelationRule
): boolean {
   debugger;
  
  const result =
    this.courseRuleService.checkDependency(
      node,
      rule,
      (value: any) => this.getValue(value),
      (groupCode: string) =>
        this.getSelectedCredits(groupCode),
      (groupCode: string, node: any) =>
        this.getSelectedDisciplines(groupCode, node)
    );

  this.selectionErrorMessage =
    result.message;

  return result.valid;
}
 

  getSelectedDisciplines(groupCode: string, excludeNode?: any): string[] {
    const disciplines: string[] = [];


    this.agGrid.api.forEachNode((node: any) => {
      if (!node.data || node.data.isGroup) {
        return;
      }
      console.log(
    'Course:',
    node.data?.coursecode,
    'Selected:',
    node.isSelected(),
    'Data:',
    node.data
  );

      // IMPORTANT:
      // Don't include the course currently being checked
      if (excludeNode && node === excludeNode) {
        return;
      }

      const group = this.getValue(node.data.coursetype);
      console.log(node.isSelected(), group, groupCode, node.data.discipline);
      if (node.isSelected() && group === groupCode) {
        const discipline = this.getValue(node.data.discipline);

        if (discipline && disciplines.indexOf(discipline) === -1) {
          disciplines.push(discipline);
        }
      }
    });

    return disciplines;
  }
onSelectionChanged(event: any) {
  console.log('Selected nodes:', event.api.getSelectedNodes());
  console.log('Selected data:', event.api.getSelectedRows());
}
  


  getCreditRule(groupCode: string): any {
    return this.groupCreditRules.find((r) => r.courseGroupCode === groupCode);
  }

  checkCreditLimit(node: any): boolean {
    console.log('Checking credit limit for node:', node.data);

    const group = this.getValue(node.data.coursetype);

    const rule = this.getCreditRule(group);

    if (!rule) {
      return true;
    }

    let selectedCredits = 0;

    this.agGrid.api.forEachNode((rowNode: any) => {
      if (!rowNode.data || rowNode.data.isGroup) {
        return;
      }

      // Don't count the course we are currently checking
      if (rowNode === node) {
        return;
      }

      if (rowNode.isSelected()) {
        const rowGroup = this.getValue(rowNode.data.coursetype);

        if (rowGroup === group) {
          selectedCredits += this.getCredits(rowNode.data);
        }
      }
    });

    const courseCredits = this.getCredits(node.data);
    console.log(
      'Selected credits:',
      selectedCredits,
      'Course credits:',
      courseCredits,
      'Rule max credit:',
      rule.maximumCredit,
    );
    if (selectedCredits + courseCredits > Number(rule.maximumCredit)) {
      this.selectionErrorMessage =
        'You cannot select more than ' +
        rule.maximumCredit +
        ' credits in the ' +
        group +
        ' group.';

      return false;
    }

    return true;
  }
  onRowSelected(event: any): void {
    console.log('Row selected:', event.node.data);

    // Ignore group rows
    if (!event.node.data || event.node.data.isGroup) {
      return;
    }

    console.log('Selected:', event.node.isSelected());
    
    

    // -----------------------------------------
    // DESELECTION
    // -----------------------------------------
    if (!event.node.isSelected()) {
      // Refresh the grid because the selected
      // discipline/credit situation has changed
      this.agGrid.api.refreshCells({
        force: true,
      });

      return;
    }

    // -----------------------------------------
    // NEW SELECTION
    // -----------------------------------------
    if (!this.canSelectCourse(event.node)) {
      // Undo the selection
      event.node.setSelected(false);

      alert('Course selection is not allowed by the current rules.');

      return;
    }
    this.isSubmitEnabled = this.checkTotalCreditRules();

    // -----------------------------------------
    // VALID SELECTION
    // -----------------------------------------
    this.agGrid.api.refreshCells({
      force: true,
    });
  }
  canSelectCourse(node: any): boolean {
    debugger;
    if (!node.data || node.data.isGroup) {
      return false;
    }

    const group = this.getValue(node.data.coursetype);

    const rule = this.getRuleForGroup(group);

    // No relationship rule
    if (!rule) {
      return this.checkCreditLimit(node);
    }

    // Dependency
    if (!this.checkDependency(node, rule)) {
      return false;
    }

    // Credit limit
    if (!this.checkCreditLimit(node)) {
      return false;
    }

    return true;
  }

  getValue(value: any): string {
    if (Array.isArray(value)) {
      return value.length > 0 ? value[0] : '';
    }

    return value || '';
  }
  getCredits(row: any): number {
    return parseFloat(this.getValue(row.credits)) || 0;
  }
  checkDisciplineSelection(node: any, rule: CourseGroupRelationRule): boolean {
    // No discipline selection restriction
    if (
      !rule ||
      !rule.discipline_selection ||
      rule.discipline_selection !== 'SINGLE'
    ) {
      return true;
    }

    const currentDiscipline = this.getValue(node.data.discipline);

    const selectedDisciplines = this.getSelectedDisciplines(
      rule.dependent_group_code,
    );

    // No discipline has been selected yet
    if (selectedDisciplines.length === 0) {
      return true;
    }

    // SINGLE means only the already-selected
    // discipline can be selected
    return selectedDisciplines.indexOf(currentDiscipline) !== -1;
  }

  checkTotalCreditRules(): boolean {
    if (!this.groupCreditRules || this.groupCreditRules.length === 0) {
      return false;
    }

    // Check every group rule returned by backend
    for (const rule of this.groupCreditRules) {
      const groupCode = rule.courseGroupCode;

      const selectedCredits = this.getSelectedCredits(groupCode);

      const minimumCredit = Number(rule.minimumCredit);

      const maximumCredit = Number(rule.maximumCredit);

      console.log(
        'Credit Rule:',
        groupCode,
        'Selected:',
        selectedCredits,
        'Min:',
        minimumCredit,
        'Max:',
        maximumCredit,
      );

      // Minimum credit not satisfied
      if (selectedCredits < minimumCredit) {
        this.selectionErrorMessage =
          'You must select at least ' +
          minimumCredit +
          ' credits in the ' +
          groupCode +
          ' group.';
        return false;
      }

      // Maximum credit exceeded
      if (selectedCredits > maximumCredit) {
        this.selectionErrorMessage =
          'You cannot select more than ' +
          maximumCredit +
          ' credits in the ' +
          groupCode +
          ' group.';
        return false;
      }
    }

    return true;
  }

  goBack(): void {
    this.location.back();
  }
 
   submit(){
		
	
  
 
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
    var selectedCourseTypeCredits:any = [];

       console.log(subjectselected.length);
    if (subjectselected.length==0){
      const dialogRef=  this.dialog.open(alertComponent,
        {data:{title:"Warning",content:"You selected :"+ 0+" credits ." +
        this.mincredit,ok:true,cancel:false,color:"warn"}
      });
    dialogRef.disableClose = true;
     return;
    }
    this.selecteddata = "";
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
     console.log("after validation");
     //Alert.show("creditselected"+creditselected);
     this.crselected="Credits Selected:"+this.creditselected;
      
         console.log("credit selected",this.creditselected);
      
          if(
          (this.creditselected>=semestermincredit)&&(this.creditselected<=semestermaxcredit)
          // ||
          //(creditavailable<=mincreditrequired)
           
           )
           {
            //console.log("pck credits are validated...now validate course type credits.");
            this.validateCourseTypeCredits(); //added by Jyoti on 29 Aug 2026
     
           }
           else
           {
            //const dialogRef =
            console.log("Failure");
            const dialogRef=  this.dialog.open(alertComponent,
              {data:{title:"Warning",content:"You selected :"+ this.creditselected +" credits ." +
              "Please select at least :"+semestermincredit,ok:true,cancel:false,color:"warn"}
          });
          dialogRef.disableClose = true;
          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);


            });      

            
            // Alert.show(("You selected :"+ creditselected +" credits ." +"Please select at least :"+semestermincredit),
            // (commonFunction.getMessages('error')),0,null,null,errorIcon);
           
            return;	
            
           }
           
  }
 validateCourseTypeCredits()
    {
      var proceed:boolean = false;
      let myparam = {xmltojs:'Y', method:'None' };  
      myparam.method='/registrationforstudent/checkCourseTypeCredits.htm';
      this.params= this.params.set("selecteddata",this.selecteddata);
      this.params=this.params.set('pck', this.pck);
      this.mask=true;
      this.subs.add= this.userservice.getdata(this.params,myparam).subscribe(res=>{
          let data = JSON.parse(res);
          let alertmsg = "";
          for (var obj of  data.registerDetails.Detail)
          {
              proceed = false;
              if(obj.available=='N'){
                  //console.log("o",obj.message);
                  proceed = true;
                  break;
              }else{
                alertmsg = alertmsg  + "You selected total:<b>" + obj.credits +"</b> credits for " + "<b>" + obj.coursetypedesc + "</b>" +
                       " Please select at least :<b>" + obj.mincredit + "</b><br/>";
              }
          }
          this.mask = false;
          if (!proceed && alertmsg.length > 0) {
              const dialogRef=  this.dialog.open(alertComponent,
                    {data:{title:"Warning",content: alertmsg ,ok:true,cancel:false,color:"warn"}
                    });
                dialogRef.disableClose = true;
          }
          else if (proceed) 
          {this.proceedforSubmission();}
      });
      
    }
 proceedforSubmission() //added by Jyoti on 29 Aug 2026
    {
          const dialogconf =new MatDialogConfig();
          dialogconf.disableClose=true;
          dialogconf.autoFocus=true;
          let data={title:"",content:"Please confirm" ,ok:true,cancel:true,color:"warn"};
          dialogconf.data=data;
          const  dialogRef=  this.dialog.open(alertComponent,dialogconf);    
          dialogRef.disableClose = true;
          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
            if(result){
              this.onOK(); 
            }
            });                 
    }

  onOK() {
    //if(event.detail==Alert.YES){

    //	Alert.show("On OK called ");

    let myparam1 = new HttpParams();
    //.set('application','CMS');
    var CurrentDateTime: Date = new Date();

    myparam1 = myparam1.set('application', 'CMS');
    myparam1 = myparam1.set('date', CurrentDateTime.toString());
    myparam1 = myparam1.set('selecteddata', this.selecteddata);
    myparam1 = myparam1.set('semester', this.semester);
    myparam1 = myparam1.set('programId', this.programId);
    myparam1 = myparam1.set('branchId', this.branchId);
    myparam1 = myparam1.set('specializationId', this.specializationId);
    myparam1 = myparam1.set('pck', this.pck);
    myparam1 = myparam1.set('credits', this.creditselected.toString());
    myparam1 = myparam1.set('semesterStartDate', this.semesterStartDate);
    myparam1 = myparam1.set('semesterEndDate', this.semesterEndDate);
    myparam1 = myparam1.set('attemptno', this.attemptno.toString());
    myparam1 = myparam1.set('entityId', this.entityId);
    myparam1 = myparam1.set('credittheory', this.credittheory.toString());
    myparam1 = myparam1.set('creditpractical', this.creditpractical.toString());

   

    console.log(myparam1);

    

    //Arush on 27/10/18  If it is a switched student take values from myparam at global level else take from param.

    if (this.myparam['switchType'] != null) {
      myparam1 = myparam1.set('currentpck', this.myparam['currentpck']);
      myparam1 = myparam1.set('switchType', this.myparam['switchType']);
      myparam1 = myparam1.set('switchoption', this.myparam['switchoption']);

      // myparam1["switchType"]=this.myparam["switchType"];
      // myparam1["switchoption"] = this.myparam["switchoption"] ;
      // myparam1["currentpck"] = this.myparam["currentpck"] ;
    } else {
      myparam1 = myparam1.set('switchType', this.params.get('switchType'));
      myparam1 = myparam1.set('switchoption', this.params.get('switchoption'));
      myparam1 = myparam1.set('currentpck', this.params.get('currentpck'));
    }

    this.urlPrefix = this.url + 'registerstudent.htm';
    

    let obj = {
      xmltojs: 'Y',
      method: '/registrationforstudent/registerstudent.htm',
    };
    this.mask = true;
    this.subs.add = this.userservice.getdata(myparam1, obj).subscribe((res) => {
     

      res = JSON.parse(res);
      this.mask = false;
      this.registerstudentSuccess(res);
    
    });

    // console.log(myparam1);
  }

  //}

  registerstudentSuccess(res) {
    //Mask.close();
    //semDetail = event.result as XML;

    //Alert.show("regstatus:"+semDetail);
    //vstack.selectedChild=errorpanel;
    for (var obj of res.registerDetails.Detail) {
      if (obj.available == 'err') {
        //errorlabel.text=obj.message;
        this.userservice.log(obj.message);
        //this.router.navigate(['../dashboard']);
        this.ngOnDestroy();
        return;

        //		Alert.show("Error :"+obj.message);
      }
      if (obj.available == 'reg') {
        // errorlabel.text ="You are successfully registered";
        this.userservice.log('You are successfully registered');

        //vstack.selectedChild=errorpanel;
        //this.router.navigate(['../dashboard']);
        this.ngOnDestroy();
        return;
        //		Alert.show("Error :"+obj.message);
      } else {
        this.userservice.log('Error in registration');
        //errorlabel.text ="Error in registration";
        this.ngOnDestroy();
        //this.router.navigate(['../dashboard']);
        return;
      }
    }

    //vstack.selectedChild=errorpanel;

    //Alert.show("registerstudentsuccess"+semDetail);
  }

  getbrnSuccess(res) {
    console.log('In branches', res);

    for (var obj of res.registerDetails.Detail) {
      this.combodata.push({ id: obj.branchId, label: obj.branch });
    }

    this.combolabel = 'Select Branch';
    this.combowidth = '50%';

    return;
  }

  getspcSuccess(res) {
    for (var obj of res.registerDetails.Detail) {
      this.combodata.push({
        id: obj.specializationId,
        label: obj.speclization,
      });
    }

    this.combolabel = 'Select Speclization';
    this.combowidth = '50%';

    return;
  }
  OnOptionselected(obj) {
    if (obj.id === '-1') {
      this.displaybutton = false;
    } else {
      this.displaybutton = true;
      this.itemselected = obj;
    }
    console.log('on option selected', obj);
  }

  onContinue() {
    //console.log("on Continue");

    if (this.combolabel === 'Select Speclization') {
      console.log('on  select specilization');
      if (this.itemselected.id == '00') {
        this.params = this.params.set('switchType', 'NON');
      } else {
      }
      this.params = this.params.set('specializationId', this.itemselected.id);
      this.getcoursesservice(this.params);
    } else if (this.combolabel === 'Select Branch') {
      //console.log("on  select Branch");
      this.params = this.params.set('branchId', this.itemselected.id);
      this.params = this.params.set('module', '');
      this.getcoursesservice(this.params);
    } else if (this.combolabel === 'Select Module') {
      this.params = this.params.set('switchType', 'NON');
      this.params = this.params.set('module', this.itemselected.id);
      this.myparam = this.myparam.set('module', this.itemselected.id);
      this.params = this.params.set('switchType', 'NON');

      if (this.myparam['switchType'] != null) {
        //this.getcourses(myparam);
        this.getcoursesservice(this.myparam);
      } else {
        //this.getcourses(param);
        this.getcoursesservice(this.params);
      }
    }
  }
}
