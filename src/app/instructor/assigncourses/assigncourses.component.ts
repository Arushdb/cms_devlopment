import { Component, Pipe, PipeTransform, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionChangedEvent } from 'ag-grid-community';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {alertComponent} from    'src/app/shared/alert/alert.component';
import { MatDialogRef } from '@angular/material/dialog';



interface OwnerEntity {
  ownerEntityId: string;
  ownerEntityName?: string;
}

@Pipe({ name: 'uppercaseCourseCode' })
export class UppercaseCourseCodePipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.toUpperCase() : '';
  }
}

@Component({
  selector: 'app-assigncourses',
  templateUrl: './assigncourses.component.html',
  styleUrls: ['./assigncourses.component.css'],
})
export class AssignCoursesComponent implements OnDestroy {
  @ViewChild('employeeDialog') employeeDialog!: TemplateRef<any>;
  @ViewChild('confirmationDialog') confirmationDialog!: TemplateRef<any>;

  selectedSession = '';
  courseCode = '';
  isOkButtonEnabled = false;
  isGridVisible = false;
  isAssignButtonEnabled = false;
  isUnassignButtonEnabled = false;
  selectedEmployee: any = null;
  selectedRecords: any[] = [];
  selectedRecordsCount = 0;
  assignedToValues: string[] = [];
  sessions: string[] = [];
  parentEntity: OwnerEntity | null = null;
  courseOwnerEntity: OwnerEntity | null = null;
  currentDialogRef: any = null;
  gridData: any[] = [];
  errorMessage = '';
  employeeList: any[] = [];
  employeeData: any[] = []; 
  isLoading: boolean = false;


  param = new HttpParams().set('application', 'CMS');
  private subs = new Subscription();

  columnDefs = [
    { headerName: 'Program', field: 'program',width: 200, checkboxSelection: true  },
    {   headerName: 'Branch', field: 'branch',width: 200},
    { headerName: 'Specialization', field: 'specialization',width: 150},
    {  headerName: 'Assigned To', field: 'assigned_to',width: 250},
    { headerName: 'Semester', field: 'semester',width: 100 },
    { headerName: 'Entity', field: 'entity',width: 250 },
    //{ headerName: 'Assigned To Code', field: 'assigned_to_code',width: 150 },
  ];

  employeeColumnDefs = [
    { headerName: 'Employee Code', field: 'employeeCode', checkboxSelection: true },
    { headerName: 'Employee Name', field: 'employeeName' },
  ];

  constructor(public dialog: MatDialog, private userService: UserService, private http: HttpClient) {
    this.fetchSessions();
  }

  fetchSessions() {
    const obj = { xmltojs: 'Y', method: '/associatecoursewithinstructor/getSemList.htm' };
    this.subs.add(
      this.userService.getdata(this.param, obj).subscribe({
        next: (res) => {
          try {
            const jsonResponse = JSON.parse(res);
            this.sessions = jsonResponse.sessions?.map((s: any) => s.sessionStartDate) || [];
          } catch (error) {
            console.error('JSON Parse Error:', error);
          }
        },
        error: (err) => {
          console.error('Error loading sessions:', err);
        }
      })
    );
  }

  formatSession(session: string): string {
    const startYear = session.substring(0, 4);
    const endYear = (parseInt(startYear, 10) + 1).toString();
    return `${startYear}-${endYear}`;
  }



  fetchParentEntity(): Promise<OwnerEntity | null> {
    const obj = { xmltojs: 'Y', method: '/associatecoursewithinstructor/parentEntity.htm' };
    return new Promise((resolve, reject) => {
      this.userService.getdata(this.param, obj).subscribe({
        next: (res) => {
          try {
            const parsed = JSON.parse(res);
            this.parentEntity = parsed.parentEntities?.[0] || null;
            resolve(this.parentEntity);
          } catch (error) {
            console.error('Parent entity parsing error:', error);
            reject(error);
          }
        },
        error: (err) => {
          console.error('Parent entity fetch failed:', err);
          reject(err);
        }
      });
    });
  }

 


 validateFields() {
  if (this.courseCode) {
    this.courseCode = this.courseCode.toUpperCase();
  }

  const isValidCourseCode = /^[A-Z]{3}[0-9]{3}$/.test(this.courseCode?.trim());
  const isValidSession = !!this.selectedSession;

  // Enable OK button only if both are valid
  this.isOkButtonEnabled = isValidCourseCode && isValidSession;

  // Reset buttons and grid on input change
  this.isAssignButtonEnabled = false;
  this.isUnassignButtonEnabled = false;
  this.selectedRecords = [];
  this.selectedRecordsCount = 0;
  this.isGridVisible = false; // Hide grid on input change
}

onOk() {
  if (!this.isOkButtonEnabled) return;

  try {
    this.fetchParentEntity().then(() => {
      this.fetchCourseOwnerEntityAndGrid();
    });
  } catch (error) {
    alert('Error fetching entity data.');
  }
}

fetchGridData() {
  this.isLoading = true; // Show spinner

  const params = this.param
    .set('sessionStartDate', this.selectedSession)
    .set('courseCode', this.courseCode.trim());

  const obj = {
    xmltojs: 'Y',
    method: '/associatecoursewithinstructor/instructorPckGrid.htm'
  };

  this.subs.add(
    this.userService.getdata(params, obj).subscribe({
      next: (res) => {
        try {
          const parsed = JSON.parse(res);
          this.gridData = parsed.instructorGrid || [];
          this.isGridVisible = this.gridData.length > 0;

          if (!this.isGridVisible) {
            this.openDialog('Info', 'No data found for the selected course.', 'error', true, false, 'warn');
          }
        } catch (error) {
          console.error('Error parsing grid data:', error);
          this.openDialog('Error', 'Unexpected response format.', 'error', true, false, 'warn');
        } finally {
          this.isLoading = false; // Hide spinner after processing
        }
      },
      error: (err) => {
        console.error('Grid data error:', err);
        this.openDialog('Error', 'Error while loading grid data.', 'error', true, false, 'warn');
        this.isLoading = false; // Hide spinner on error
      }
    })
  );
}



fetchCourseOwnerEntityAndGrid() {
  const params = this.param.set('courseCode', this.courseCode.trim());
  const obj = { xmltojs: 'Y', method: '/associatecoursewithinstructor/ownerEntity.htm' };

  this.subs.add(
    this.userService.getdata(params, obj).subscribe({
      next: (res) => {
        try {
          const parsed = JSON.parse(res);
          this.courseOwnerEntity = parsed.ownerEntities?.[0] || null;

          if (!this.courseOwnerEntity?.ownerEntityId) {
            alert('You are not authorized for this course code.');
            return;
          }

          if (this.parentEntity?.ownerEntityId !== this.courseOwnerEntity.ownerEntityId) {
            alert('You are not authorized for this course code.');
            this.isGridVisible = false;
            return;
          }

          // Only fetch grid data after successful owner entity fetch
          this.fetchGridData();
        } catch (error) {
          console.error('Owner entity parsing error:', error);
        }
      },
      error: (err) => {
        console.error('Owner entity fetch failed:', err);
      }
    })
  );
}

  onRowSelected(event: SelectionChangedEvent) {
    console.log('Row Selected Event:', event);
    this.selectedRecords = event.api.getSelectedRows();
    console.log('Selected Records:', this.selectedRecords);
    this.selectedRecordsCount = this.selectedRecords.length;
  
    if (this.selectedRecords.length > 0) {
      const allAssigned = this.selectedRecords.every(record => record.assigned_to !== '');
      const someUnassigned = this.selectedRecords.some(record => record.assigned_to === '');
  
      // Always enable Assign if any rows are selected
      this.isAssignButtonEnabled = true;
  
      // Enable Unassign only if all are assigned
      this.isUnassignButtonEnabled = allAssigned;
    } else {
      this.isAssignButtonEnabled = false;
      this.isUnassignButtonEnabled = false;
    }
  }
  
  


 onAssign() {
  if (!this.selectedEmployee) {
    alert('Please select an employee.');
    return;
  }

  const confirmationDialogRef = this.dialog.open(this.confirmationDialog, {
    width: '450px',
    data: {
      message: `Are you sure you want to assign ${this.selectedEmployee.employeeName} to the selected course(s)?`,
      type: 'assign',
      employeeName: this.selectedEmployee.employeeName
    }
  });

  confirmationDialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.assignSelectedRecordsToEmployee(); // Perform the assignment logic
    }
  });
}

onUnAssign(): void {
  if (this.selectedRecords.length === 0) {
    alert('Please select a record.');
    return;
  }

  this.assignedToValues = this.selectedRecords
    .map(record => record.assigned_to)
    .filter(value => value && value !== 'None');

  if (this.assignedToValues.length === 0) {
    alert('No assigned employees to unassign.');
    return;
  }

  const confirmationDialogRef = this.dialog.open(this.confirmationDialog, {
    width: '450px',
    data: {
      message: 'Are you sure you want to unassign the following employees?',
      assignedEmployees: this.assignedToValues,
      type: 'unassign'
    }
  });

  confirmationDialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.executeUnassignment();
    }
  });
}

//executeUnassignment(): void {
 // const selectedData = this.selectedRecords
  //  .map(row => [
  //    row.entity_id,
  //    row.course_code,
  //    row.assigned_to_code,
  //    row.program_course_key,
  //    row.semester_start_date,
  //    row.semester_end_date
   // ].join(','))
   // .join(';');

 // const url = `${environment.url}/associatecoursewithinstructor/deleteAngCourseInstructor.htm`;

 // const httpParams = new HttpParams().set('selectedData', selectedData);

  //this.http.get<{ message: string }>(url, { params: httpParams }).subscribe({
  //  next: (res) => {
  //    if (res.message === 'success') {
   //     this.showAlert('Unassignment successful.');
   //     this.fetchGridData();
   //   } else if (res.message === 'sessionInactive') {
   //     this.showAlert('Session expired. Please log in again.');
   //   } else {
   //     this.showAlert('Unassignment failed: ' + res.message);
   //   }
  //  },
  //  error: (err) => {
  //    this.logError('Unassignment error', err);
  //    this.showAlert('Unassignment failed: Server error.');
  //  }
//  });
//}

executeUnassignment(): void {
  const selectedData = this.selectedRecords
    .map(row => [
      row.entity_id,
      row.course_code,
      row.assigned_to_code,
      row.program_course_key,
      row.semester_start_date,
      row.semester_end_date
    ].join(','))
    .join(';');

  const url = `${environment.url}/associatecoursewithinstructor/deleteAngCourseInstructor.htm`;

  const httpParams = new HttpParams().set('selectedData', selectedData);

  this.http.get<{ message: string }>(url, { params: httpParams }).subscribe({
    next: (res) => {
      switch (res.message) {
        case 'success':
          this.openDialog('Success', 'Unassignment successful.', 'success', true, false, 'primary');
          this.fetchGridData();
          break;
        case 'sessionInactive':
          this.openDialog('Error', 'Session expired. Please log in again.', 'error', true, false, 'warn');
          break;
        default:
          this.openDialog('Error', 'Unassignment failed: ' + res.message, 'error', true, false, 'warn');
      }
    },
    error: (err) => {
      this.logError('Unassignment error', err);
      this.openDialog('Error', 'Unassignment failed: Server error.', 'error', true, false, 'warn');
    }
  });
}


 fetchEmployeeData() {
  const obj = {
    xmltojs: 'Y',
    method: '/associatecoursewithinstructor/getAngEmployeeList.htm'
  };
  this.subs.add(
    this.userService.getdata(this.param, obj).subscribe({
      next: (res) => {
        try {
          const parsed = JSON.parse(res);
          this.employeeList = parsed.employees || [];
  
          // ✅ Assign to ag-grid
          this.employeeData = [...this.employeeList];
          console.log('Employee data:', this.employeeData);
        } catch (error) {
          console.error('Employee data parsing error:', error);
          alert('Failed to load employee data.');
        }
      },
      error: (err) => {
        console.error('Error fetching employee data:', err);
        alert('Error fetching employee data.');
      }
    })
  );
}

  
  openEmployeeDialog() {
    this.fetchEmployeeData(); // Fetch employee list
    this.currentDialogRef = this.dialog.open(this.employeeDialog, { width: '450px' });
  }

  

 //assignSelectedRecordsToEmployee(): void {
 // if (!this.selectedEmployee || this.selectedRecords.length === 0) {
 //   this.showAlert('Please select both an employee and at least one course record.');
 //   return;
 // }

 // const employeeCode = this.selectedEmployee.employeeCode;
 // const employeeName = this.selectedEmployee.employeeName;

  //const selectedData = this.selectedRecords
   // .map(row => [
   //   row.entity_id,
   //   row.course_code,
   //   employeeCode,
   //   row.program_course_key,
   //   row.semester_start_date,
   //   row.semester_end_date
   // ].join(','))
   // .join(';');

  //const body = new HttpParams()
  //  .set('selectedData', selectedData)
  //  .set('employeeName', employeeName)
  //  .set('employeeCode', employeeCode);

 // const url = `${environment.url}/associatecoursewithinstructor/assignAngCourseInstructor.htm`;

  //this.http.post<{ message: string }>(url, body.toString(), {
  //  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  //}).subscribe({
  //  next: (res) => {
    //  switch (res.message) {
      //  case 'success':
      //    this.showAlert('Assignment successful.');
      //    this.fetchGridData();         // ✅ Refresh the grid only
      //    this.closeEmployeeDialog();   // ✅ Close the employee selection dialog
      //    this.selectedEmployee = null; // ✅ Clear selected employee
      //    break;
      //  case 'sessionInactive':
      //    this.showAlert('Session expired. Please log in again.');
       //   break;
       // case 'noDataProvided':
        //  this.showAlert('No course data was provided.');
        //  break;
        //case 'invalidEmployeeCode':
        //  this.showAlert('Invalid Employee Code.');
        //  break;
       // default:
        //  this.showAlert('Assignment failed: ' + res.message);
     // }
   // },
   // error: (err) => {
    //  this.logError('Assignment error', err);
    //  this.showAlert('Assignment failed due to a server error.');
   // }
 // });
//}

assignSelectedRecordsToEmployee(): void {
  if (!this.selectedEmployee || this.selectedRecords.length === 0) {
    this.openDialog('Error', 'Please select both an employee and at least one course record.', 'error', true, false, 'warn');
    return;
  }

  const employeeCode = this.selectedEmployee.employeeCode;
  const employeeName = this.selectedEmployee.employeeName;

  const selectedData = this.selectedRecords
    .map(row => [
      row.entity_id,
      row.course_code,
      employeeCode,
      row.program_course_key,
      row.semester_start_date,
      row.semester_end_date
    ].join(','))
    .join(';');

  const body = new HttpParams()
    .set('selectedData', selectedData)
    .set('employeeName', employeeName)
    .set('employeeCode', employeeCode);

  const url = `${environment.url}/associatecoursewithinstructor/assignAngCourseInstructor.htm`;

  this.http.post<{ message: string }>(url, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).subscribe({
    next: (res) => {
      switch (res.message) {
        case 'success':
          const dialogRef = this.openDialog('Success', 'Assignment successful.', 'success', true, false, 'primary');
          dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
              this.fetchGridData();         // ✅ Refresh the grid after user clicks OK
              this.closeEmployeeDialog();   // ✅ Close the employee selection dialog
              this.selectedEmployee = null; // ✅ Clear selected employee
            }
          });
          break;
        case 'sessionInactive':
          this.openDialog('Error', 'Session expired. Please log in again.', 'error', true, false, 'warn');
          break;
        case 'noDataProvided':
          this.openDialog('Error', 'No course data was provided.', 'error', true, false, 'warn');
          break;
        case 'invalidEmployeeCode':
          this.openDialog('Error', 'Invalid Employee Code.', 'error', true, false, 'warn');
          break;
        default:
          this.openDialog('Error', 'Assignment failed: ' + res.message, 'error', true, false, 'warn');
      }
    },
    error: (err) => {
      this.logError('Assignment error', err);
      this.openDialog('Error', 'Assignment failed due to a server error.', 'error', true, false, 'warn');
    }
  });
}

openDialog(title: string, content: string, color: string, ok: boolean, cancel: boolean, buttonColor: string): MatDialogRef<alertComponent> {
  return this.dialog.open(alertComponent, {
    data: {
      title: title,
      content: content,
      ok: ok,
      cancel: cancel,
      color: buttonColor,
      success: color === 'success',
      error: color === 'error'
    }
  });
}


  
  
onEmployeeOk(): void {
  if (!this.selectedEmployee || this.selectedRecords.length === 0) {
    this.openDialog('Error', 'Please select both employee and at least one course record.', 'error', true, false, 'warn');
    return;
  }

  // Check if any selected record is already assigned to this employee
  const alreadyAssigned = this.selectedRecords.some(record => 
    record.assigned_to_code === this.selectedEmployee.employeeCode
  );

  if (alreadyAssigned) {
    this.openDialog('Info', 'Selected course is already assigned to this employee.', 'error', true, false, 'warn');
    return; // Stop further processing
  }

  // If not assigned already, proceed normally
  this.assignSelectedRecordsToEmployee();
}

  
  onEmployeeSelected(event: any): void {
    const selectedNodes = event.api.getSelectedNodes();
    this.selectedEmployee = selectedNodes.length > 0 ? selectedNodes[0].data : null;
    console.log('Selected Employee:', this.selectedEmployee);  // Log to verify employeeCode
  }
  
  
  closeEmployeeDialog(): void {
    this.dialog.closeAll();
  }
  
  resetForm(): void {
    this.selectedSession = '';
    this.courseCode = '';
    this.isOkButtonEnabled = false;
    this.errorMessage = '';
    this.selectedRecordsCount = 0;
    this.isGridVisible = false;
  }
  

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  // Add the missing methods for logging and showing alerts
  logError(message: string, error: any) {
    console.error(message, error);
  }

  showAlert(message: string) {
    alert(message);
  }
}