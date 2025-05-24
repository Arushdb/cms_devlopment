/***************************************************************************
 * AssignCoursesComponent
 * ------------------------------------------------------------------------
 *  – Does a LOCAL authorization check (one call) in ngOnInit
 *  – No longer imports / injects AuthService
 ***************************************************************************/

import {
  Component, Pipe, PipeTransform, TemplateRef, ViewChild,
  OnInit, OnDestroy
} from '@angular/core';
import { MatDialog, MatDialogRef }   from '@angular/material/dialog';
import { SelectionChangedEvent }     from 'ag-grid-community';
import { Subscription }              from 'rxjs';
import { HttpParams, HttpClient }    from '@angular/common/http';
import { environment }               from '../../../environments/environment';
import { alertComponent }            from 'src/app/shared/alert/alert.component';
import { UserService }               from '../../services/user.service';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
@Component({
  selector   : 'app-assigncourses',
  templateUrl: './assigncourses.component.html',
  styleUrls  : ['./assigncourses.component.css']
})
export class AssignCoursesComponent implements OnInit, OnDestroy {
  
  showInputControls = false; 

  /* ------------ Data ------------------------------------------------ */
  sessions: string[] = [];
  gridData: any[]    = [];

  /* ------------ Template refs -------------------------------------- */
  @ViewChild('employeeDialog')     employeeDialog!    : TemplateRef<any>;
  @ViewChild('confirmationDialog') confirmationDialog!: TemplateRef<any>;

  /* ------------ Form state ----------------------------------------- */
  selectedSession   = '';
  courseCode        = '';
  isOkButtonEnabled = false;

  /* ------------ Grid · Employee ----------------------------------- */
  isGridVisible         = false;
  selectedRecords: any[]= [];
  selectedRecordsCount  = 0;
  isAssignButtonEnabled = false;
  isUnassignButtonEnabled = false;

  selectedEmployee : any   = null;
  employeeList     : any[] = [];
  employeeData     : any[] = [];

  /* ------------ Entities ------------------------------------------ */
  parentEntity     : OwnerEntity | null = null;
  courseOwnerEntity: OwnerEntity | null = null;

  /* ------------ Authorisation (local) ----------------------------- */
  authorizedRoles  : any[] = [];
  isUserAuthorized = false;     // set after local check

  /* ------------ Misc ---------------------------------------------- */
  isLoading     = false;
  errorMessage  = '';
  currentDialogRef: MatDialogRef<any> | null = null;

  /* ------------ Network helpers ----------------------------------- */
  private param = new HttpParams().set('application', 'CMS');
  private subs  = new Subscription();

  /* ─────────── ag-Grid defaults applied to every column ─────────── */
defaultColDef = {
  flex: 1,                // columns fill width evenly
  minWidth: 120,
  resizable: true,
  sortable: true,
  filter: true,           // ⇦ switch filters ON
  floatingFilter: true,   // ⇦ little filter box under the header
};

  /* ------------ ag-Grid columns ----------------------------------- */
  columnDefs = [
    { headerName: 'Program',        field: 'program',filter: 'agTextColumnFilter',  width: 200, checkboxSelection: true },
    { headerName: 'Branch',         field: 'branch',filter: 'agTextColumnFilter',   width: 200 },
    { headerName: 'Specialization', field: 'specialization',filter: 'agTextColumnFilter', width: 150 },
    { headerName: 'Assigned To',    field: 'assigned_to',filter: 'agTextColumnFilter',    width: 250 },
    { headerName: 'Semester',       field: 'semester',filter: 'agTextColumnFilter', width: 100 },
    { headerName: 'Entity',         field: 'entity', filter: 'agTextColumnFilter',  width: 250 }
  ];

  employeeColumnDefs = [
    { headerName: 'Employee Code', field: 'employeeCode',filter: 'agTextColumnFilter', checkboxSelection: true },
    { headerName: 'Employee Name', field: 'employeeName',filter: 'agTextColumnFilter' }
  ];


  /* ------------ Ctor ---------------------------------------------- */
  constructor(
    private dialog     : MatDialog,
    private userService: UserService,
    private http       : HttpClient
  ) {}

  /* =================================================================
                                LIFECYCLE
     ================================================================= */
  ngOnInit(): void {
    this.fetchSessions();
    this.checkAuthorization();          // 🔹 menu-specific auth check
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  /* =================================================================
   LOCAL  AUTHORISATION CHECK  – toggles showInputControls
   ================================================================= */
private checkAuthorization(): void {
  const obj = {
    xmltojs: 'Y',
    method : '/associatecoursewithinstructor/checkAssignmentAuthorization.htm'
  };

  this.userService.getdata(this.param, obj).subscribe({
    next: (raw: any) => {
      /* 1️⃣ Parse the plain-text JSON sent by your JSP */
      let res: any;
      try {
        res = typeof raw === 'string' ? JSON.parse(raw) : raw;
      } catch (e) {
        console.error('Authorization JSON parse error', e);
        this.showAuthError();
        return;
      }

      /* 2️⃣ Determine authorisation */
      this.isUserAuthorized  = !!res?.authorizedRoles?.length;
      this.authorizedRoles   = res?.authorizedRoles || [];
      this.showInputControls = this.isUserAuthorized;     // 🔹 toggle inputs

      /* 3️⃣ If unauthorised, keep controls hidden and (optionally) show a toast */
      if (!this.isUserAuthorized) {
        // No need to pop an alert here; the controls are hidden.
        // Remove these two lines if you want it COMPLETELY silent.
        this.openDialog('Error',
          'You are not authorized to use the Assign Courses feature.',
          'error', true, false, 'warn');
      }
    },

    error: err => {
      console.error('Authorization check failed', err);
      this.showAuthError();
    }
  });
}

/* helper – also hides controls when we cannot verify */
private showAuthError(): void {
  this.isUserAuthorized  = false;
  this.showInputControls = false;           // 🔹 keep hidden
  this.openDialog(
    'Error',
    'Could not verify your authorization. Please try again later.',
    'error', true, false, 'warn'
  );
}


  /* =================================================================
                              SESSION LIST
     ================================================================= */
  private fetchSessions(): void {
    const obj = { xmltojs: 'Y', method: '/associatecoursewithinstructor/getSemList.htm' };

    this.subs.add(
      this.userService.getdata(this.param, obj).subscribe({
        next: res => {
          try {
            const json = JSON.parse(res);
            this.sessions = json.sessions?.map((s: any) => s.sessionStartDate) || [];
          } catch (e) { console.error('JSON parse error (sessions)', e); }
        },
        error: err => console.error('Error loading sessions', err)
      })
    );
  }

  /* ---------- UI helpers ----------------------------------------- */
  formatSession(session: string): string {
    const year = +session.slice(0, 4);
    return `${year}-${year + 1}`;
  }

  /* =================================================================
                               VALIDATION
     ================================================================= */
  validateFields(): void {
    if (this.courseCode) { this.courseCode = this.courseCode.toUpperCase(); }

    const codeOK    = /^[A-Z]{3}\d{3}$/.test(this.courseCode.trim());
    const sessionOK = !!this.selectedSession;

    this.isOkButtonEnabled    = codeOK && sessionOK;
    this.isAssignButtonEnabled= false;
    this.isUnassignButtonEnabled = false;
    this.isGridVisible        = false;
    this.selectedRecords      = [];
    this.selectedRecordsCount = 0;
  }

  /* =================================================================
                  OK  (parent / owner entity & grid)
     ================================================================= */
  onOk(): void {
    if (!this.isOkButtonEnabled) { return; }

    if (!this.isUserAuthorized) {      // 🔹 local guard
      this.openDialog('Error', 'You are not authorized for Assignment.',
                      'error', true, false, 'warn');
      return;
    }

    this.fetchParentEntity()
        .then(() => this.fetchCourseOwnerEntityAndGrid())
        .catch(() => this.openDialog('Error', 'Error fetching entity data.',
                                     'error', true, false, 'warn'));
  }

  /* ---------- Parent entity -------------------------------------- */
//  private fetchParentEntity(): Promise<OwnerEntity | null> {
//    const obj = { xmltojs: 'Y', method: '/associatecoursewithinstructor/parentEntity.htm' };

//    return new Promise((resolve, reject) =>
 //     this.userService.getdata(this.param, obj).subscribe({
 //       next : res => {
 //         try {
  //          const p = JSON.parse(res);
  //          this.parentEntity = p.parentEntities?.[0] || null;
  //          resolve(this.parentEntity);
   //       } catch (e) { console.error('Parent entity parse error', e); reject(e); }
  //      },
   //     error: err => { console.error('Parent entity fetch', err); reject(err); }
  //    })
 //   );
//  }

  /* ---------- Owner entity + grid -------------------------------- */
 // private fetchCourseOwnerEntityAndGrid(): void {
 //   const params = this.param.set('courseCode', this.courseCode.trim());
 //   const obj    = { xmltojs: 'Y', method: '/associatecoursewithinstructor/ownerEntity.htm' };

 //   this.subs.add(
 //     this.userService.getdata(params, obj).subscribe({
 //       next: res => {
 //         try {
 //           const p = JSON.parse(res);
 //           this.courseOwnerEntity = p.ownerEntities?.[0] || null;

  //          if (!this.courseOwnerEntity?.ownerEntityId ||
   //             this.courseOwnerEntity.ownerEntityId !== this.parentEntity?.ownerEntityId) {
   //           this.openDialog('Error', 'You are not authorized for this course code.',
   //                           'error', true, false, 'warn');
   //           return;
   //         }
   //         this.fetchGridData();    // ✅ only now
   //       } catch (e) { console.error('Owner entity parse', e); }
   //     },
   //     error: err => console.error('Owner entity fetch', err)
  //    })
  //  );
//  }



/* ─────────── ① Parent-entity list ─────────── */
private parentEntities: OwnerEntity[] = [];   // ➊ keep *all* parents

private fetchParentEntity(): Promise<OwnerEntity[]> {   // ➋ returns an array
  const obj = { xmltojs: 'Y', method: '/associatecoursewithinstructor/parentEntity.htm' };

  return new Promise((resolve, reject) =>
    this.userService.getdata(this.param, obj).subscribe({
      next: res => {
        try {
          const json = JSON.parse(res);
          /* store the whole array, not just the first element */
          this.parentEntities = json.parentEntities ?? [];
          resolve(this.parentEntities);
        } catch (e) { console.error('Parent entity parse', e); reject(e); }
      },
      error: err => { console.error('Parent entity fetch', err); reject(err); }
    })
  );
}

/* ─────────── ② Owner entity + authorisation + grid ─────────── */
private fetchCourseOwnerEntityAndGrid(): void {
  const params = this.param.set('courseCode', this.courseCode.trim());
  const obj    = { xmltojs: 'Y', method: '/associatecoursewithinstructor/ownerEntity.htm' };

  this.subs.add(
    this.userService.getdata(params, obj).subscribe({
      next: res => {
        try {
          const json = JSON.parse(res);
          this.courseOwnerEntity = json.ownerEntities?.[0] || null;

          /* ✅ authorised if *any* parent’s ID matches the owner’s ID */
          const authorised = !!this.courseOwnerEntity &&
            this.parentEntities.some(p => p.ownerEntityId === this.courseOwnerEntity!.ownerEntityId);

          if (!authorised) {
            this.openDialog('Error',
                            'You are not authorized for this course code.',
                            'error', true, false, 'warn');
            return;
          }
          this.fetchGridData();      // proceed only when authorised
        } catch (e) { console.error('Owner entity parse', e); }
      },
      error: err => console.error('Owner entity fetch', err)
    })
  );
}



        /* quick-filter helper */
//private gridApi!: GridApi;
//onGridReady(params: GridReadyEvent) { this.gridApi = params.api; }
//onQuickFilter($event: Event) {
//  const value = ($event.target as HTMLInputElement).value;
//  this.gridApi?.setQuickFilter(value);
//}


  /* ---------- Grid data ------------------------------------------ */
  private fetchGridData(): void {
    this.isLoading = true;

    const params = this.param
      .set('sessionStartDate', this.selectedSession)
      .set('courseCode', this.courseCode.trim());

    const obj = { xmltojs: 'Y', method: '/associatecoursewithinstructor/instructorPckGrid.htm' };

    this.subs.add(
      this.userService.getdata(params, obj).subscribe({
        next : res => {
          try {
            const p   = JSON.parse(res);
            this.gridData   = p.instructorGrid || [];
            this.isGridVisible = this.gridData.length > 0;

            if (!this.isGridVisible) {
              this.openDialog('Info', 'No data found for the selected course.',
                              'error', true, false, 'warn');
            }
          } catch (e) {
            console.error('Grid parse', e);
            this.openDialog('Error', 'Unexpected response format.',
                            'error', true, false, 'warn');
          } finally { this.isLoading = false; }
        },
        error: err => {
          console.error('Grid fetch', err);
          this.openDialog('Error', 'Error while loading grid data.',
                          'error', true, false, 'warn');
          this.isLoading = false;
        }
      })
    );
  }

  /* =================================================================
                         ROW SELECTION · BUTTONS
     ================================================================= */
  onRowSelected(event: SelectionChangedEvent): void {
    this.selectedRecords      = event.api.getSelectedRows();
    this.selectedRecordsCount = this.selectedRecords.length;

    if (this.selectedRecordsCount) {
      const allAssigned   = this.selectedRecords.every(r => r.assigned_to !== '');
      this.isAssignButtonEnabled   = true;
      this.isUnassignButtonEnabled = allAssigned;
    } else {
      this.isAssignButtonEnabled   = false;
      this.isUnassignButtonEnabled = false;
    }
  }

  /* =================================================================
                           EMPLOYEE  (dialog)
     ================================================================= */
  openEmployeeDialog(): void {
    this.fetchEmployeeData();
    this.currentDialogRef = this.dialog.open(this.employeeDialog, { width: '450px' });
  }

  private fetchEmployeeData(): void {
    const obj = { xmltojs: 'Y', method: '/associatecoursewithinstructor/getAngEmployeeList.htm' };

    this.subs.add(
      this.userService.getdata(this.param, obj).subscribe({
        next : res => {
          try {
            const p = JSON.parse(res);
            this.employeeList = p.employees || [];
            this.employeeData = [...this.employeeList];
          } catch (e) {
            console.error('Employee parse', e);
            this.openDialog('Error', 'Failed to load employee data.',
                            'error', true, false, 'warn');
          }
        },
        error: err => {
          console.error('Employee fetch', err);
          this.openDialog('Error', 'Error fetching employee data.',
                          'error', true, false, 'warn');
        }
      })
    );
  }

  onEmployeeSelected(event: any): void {
    const node            = event.api.getSelectedNodes()[0];
    this.selectedEmployee = node ? node.data : null;
  }

  closeEmployeeDialog(): void { this.dialog.closeAll(); }

  /* ---------- Employee OK ---------------------------------------- */
  onEmployeeOk(): void {
    if (!this.selectedEmployee || !this.selectedRecordsCount) {
      this.openDialog('Error', 'Please select both employee and at least one course record.',
                      'error', true, false, 'warn');
      return;
    }

    const alreadyAssigned = this.selectedRecords.some(r =>
      r.assigned_to_code === this.selectedEmployee.employeeCode);

    if (alreadyAssigned) {
      this.openDialog('Info', 'Selected course is already assigned to this employee.',
                      'error', true, false, 'warn');
      return;
    }

    this.assignSelectedRecordsToEmployee();
  }

  /* ---------- Assign ------------------------------------------------ */
  private assignSelectedRecordsToEmployee(): void {
    const employeeCode = this.selectedEmployee.employeeCode;
    const employeeName = this.selectedEmployee.employeeName;

    const selectedData = this.selectedRecords
      .map(r => [
        r.entity_id, r.course_code, employeeCode,
        r.program_course_key, r.semester_start_date, r.semester_end_date
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
      next : res => {
        switch (res.message) {
          case 'success':
            this.openDialog('Success', 'Assignment successful.', 'success',
                            true, false, 'primary')
                .afterClosed().subscribe(() => {
                  this.fetchGridData();
                  this.closeEmployeeDialog();
                  this.selectedEmployee = null;
                });
            break;
          case 'sessionInactive':
            this.openDialog('Error', 'Session expired. Please log in again.',
                            'error', true, false, 'warn');
            break;
          case 'noDataProvided':
            this.openDialog('Error', 'No course data was provided.',
                            'error', true, false, 'warn');
            break;
          case 'invalidEmployeeCode':
            this.openDialog('Error', 'Invalid Employee Code.',
                            'error', true, false, 'warn');
            break;
          default:
            this.openDialog('Error', 'Assignment failed: ' + res.message,
                            'error', true, false, 'warn');
        }
      },
      error: err => {
        console.error('Assignment error', err);
        this.openDialog('Error', 'Assignment failed due to a server error.',
                        'error', true, false, 'warn');
      }
    });
  }

  /* ---------- Un-assign ------------------------------------------- */
  onUnAssign(): void {
    if (!this.selectedRecordsCount) {
      this.openDialog('Error', 'Please select a record.',
                      'error', true, false, 'warn');
      return;
    }

    const assigned = this.selectedRecords
      .map(r => r.assigned_to)
      .filter(v => v && v !== 'None');

    if (!assigned.length) {
      this.openDialog('Info', 'No assigned employees to unassign.',
                      'error', true, false, 'warn');
      return;
    }

    this.dialog.open(this.confirmationDialog, {
      width: '450px',
      data : {
        message          : 'Are you sure you want to unassign the following employees?',
        assignedEmployees: assigned,
        type             : 'unassign'
      }
    }).afterClosed().subscribe(ok => { if (ok) { this.executeUnassignment(); } });
  }

  private executeUnassignment(): void {
    const selectedData = this.selectedRecords
      .map(r => [
        r.entity_id, r.course_code, r.assigned_to_code,
        r.program_course_key, r.semester_start_date, r.semester_end_date
      ].join(','))
      .join(';');

    const url  = `${environment.url}/associatecoursewithinstructor/deleteAngCourseInstructor.htm`;
    const params = new HttpParams().set('selectedData', selectedData);

    this.http.get<{ message: string }>(url, { params }).subscribe({
      next : res => {
        switch (res.message) {
          case 'success':
            this.openDialog('Success', 'Unassignment successful.', 'success',
                            true, false, 'primary')
                .afterClosed().subscribe(() => this.fetchGridData());
            break;
          case 'sessionInactive':
            this.openDialog('Error', 'Session expired. Please log in again.',
                            'error', true, false, 'warn');
            break;
          default:
            this.openDialog('Error', 'Unassignment failed: ' + res.message,
                            'error', true, false, 'warn');
        }
      },
      error: err => {
        console.error('Unassignment error', err);
        this.openDialog('Error', 'Unassignment failed: Server error.',
                        'error', true, false, 'warn');
      }
    });
  }

  /* =================================================================
                              DIALOG HELPER
     ================================================================= */
  openDialog(title: string, content: string,
             color: 'success' | 'error',
             ok: boolean, cancel: boolean,
             buttonColor: 'primary' | 'warn'):
      MatDialogRef<alertComponent> {

    return this.dialog.open(alertComponent, {
      data: {
        title, content, ok, cancel, color: buttonColor,
        success: color === 'success', error: color === 'error'
      }
    });
  }
}
