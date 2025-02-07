import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  ActivatedRoute,
  GuardsCheckStart,
  NavigationStart,
  Router,
} from '@angular/router';
import { map } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import { SetpasswordComponent } from '../setpassword/setpassword.component';
import { SubscriptionContainer } from '../../shared/subscription-container';
import { AuthGuard } from '../../guards/auth.guard';
import { alertComponent } from 'src/app/shared/alert/alert.component';

type MyType = {
  displayname: string;
  route: string;
  children: MyType;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  id: string;
  title = 'Dayalbagh Educational Institute';
  public menus: MyType[] = [];
  subs = new SubscriptionContainer();

  constructor(
    private router: Router,
    public authService: AuthService,
    public _activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.id = localStorage.getItem('id');
    //console.log(this.id);

    //console.log(this.router.getCurrentNavigation());

    //this.state$ = this.activatedRoute.paramMap
    // .pipe(map(() => {
    //   console.log("Hello in dasshboard ngoninit method");
    //   console.log(window.history.state);
    // }
    // ));
    let data = null;
    this._activatedRoute.queryParams.subscribe((params) => {
      //console.log(params.menus);

      this.menus = JSON.parse(params.menus);
      //this.menus.push(data);
      //let mymenu = params["menu"];
      //this.menus.push(data);
      //console.log(this.menus);
    });
  }
  logout() {
    //console.log('logout in dashboard');
    this.authService.logout();
    this.router.navigate(['/login']);
    localStorage.clear();
  }

  setpassword() {
    debugger;

    //const dialogConfig = new MatDialogConfig();
    //dialogConfig.width = '100%';
    //dialogConfig.height = '70%';
    // this.gridOptions.api.stopEditing();

    const dialogRef = this.dialog.open(SetpasswordComponent, {
      data: {
        title: 'Warning',
        content: 'An OTP will be sent to your primary email. Please confirm ',
        ok: true,
        cancel: true,
        color: 'warn',
      },
      closeOnNavigation: false,
      disableClose: true,
      width: '50%',
      height: '90%',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const dialogRef = this.dialog.open(SetpasswordComponent, {
          data: {
            title: 'Warning',
            email: 'Email',
            ok: true,
            cancel: true,
            color: 'warn',
          },
          closeOnNavigation: false,
          disableClose: true,
          width: '50%',
          height: '30%',
        });
      } else console.log('Canceled is clicked');
    });

    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.width = '30%';
    // dialogConfig.height = '20%';
    // //dialogConfig.data = { data: 'mydata' };
    // const dialogRef = this.dialog.open(SetpasswordComponent);
    // dialogRef.disableClose = true;
    // this.subs.add = dialogRef.afterClosed().subscribe((result) => {
    //   if (result) alert('Confirmed');
    //   else alert('Confirmed');
    // });

    //console.log('logout in dashboard');
    //this.authService.logout();
  }
}
