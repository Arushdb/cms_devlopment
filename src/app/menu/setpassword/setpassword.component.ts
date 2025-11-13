import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SubscriptionContainer } from '../../shared/subscription-container';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  matchPasswordValidator,
  passwordValidator,
} from '../../shared/password-validator';

@Component({
  selector: 'app-setpassword',
  templateUrl: './setpassword.component.html',
  styleUrls: ['./setpassword.component.css'],
})
export class SetpasswordComponent implements OnInit, OnDestroy {
  subs = new SubscriptionContainer();
  pwd_params: HttpParams;
  showconfirm: Boolean = false;
  showmsg: Boolean = false;
  email: any = '';
  form: FormGroup;
  submitted: boolean = false;
  otp: string;
  isPasswordVisible: boolean = false;
  isOldPasswordVisible: boolean = false;
  isDisabled: boolean = true;
  receivedMessage: string = '';
  spinnerstatus: boolean;
  isLoading: boolean;
  showotp: boolean = false;
  maxAttempts: number = 5;
  attempts: number = 0;
  isLocked: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<SetpasswordComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: {title: string,content:string,ok:boolean,cancel:boolean,color:string}) { }
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    public authService: AuthService,
    private userservice: UserService,
    private formBuilder: FormBuilder
  ) {}
  ngOnDestroy(): void {
    this.dialogRef.close();
  }

  get password() {
    return this.form.get('password')!;
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  toggleOldPasswordVisibility() {
    this.isOldPasswordVisible = !this.isOldPasswordVisible;
  }

  ngOnInit(): void {
    this.submitted = false;
    this.spinnerstatus = false;
    //this.email = this.data.email;
    this.email = localStorage.getItem('primaryemail');
    console.log('ARush email is', this.email);
    this.showconfirm = true;
    this.showmsg = false;

    this.form = this.formBuilder.group({
      //title: ['', Validators.required],

      fcotp: [''],
      fcoldpwd: ['', Validators.required],

      pwd: this.formBuilder.group(
        {
          fcnewpwd: ['', [Validators.required, passwordValidator]],
          fccfmnewpwd: ['', [Validators.required]],
        },
        { validators: matchPasswordValidator() }
      ),
    });
  }

  get passwordMismatch() {
    return this.form.hasError('passwordsMismatch');
  }
  get passwordSame() {
    return this.form.hasError('passwordsSame');
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    alert('Pasting is not allowed!');
  }

  onconfirm() {
    this.submitted = true;

    //console.log(this.pwdControls.fcnewpwd.value);
    

    if (this.f.fcotp.value !== this.otp) {
      this.attempts++;
      if (this.attempts > 5) {
        this.spinnerstatus = false;
        this.submitted = false;
        this.onclose();
      }

      return;
    }
    debugger;

    if (!this.form.valid) {
      return;
    }
    this.spinnerstatus = true;

    this.pwd_params = new HttpParams();

    //this.pwd_params.set('user', userid);
    this.pwd_params = this.pwd_params.set('password', this.f.fcoldpwd.value);
    this.pwd_params = this.pwd_params.set(
      'newPassword',
      this.pwdControls.fcnewpwd.value
    );
    this.pwd_params = this.pwd_params.set('application', 'ANGULAR');
    //this.pwd_params.set('otp', 'otp');

    let myparam = {
      method: '/settings/changePassword.htm',
      xmltojs: 'Y',
    };
    let data: any;
    this.subs.add = this.userservice
      .postdata(this.pwd_params, myparam)
      .subscribe((res) => {
        data = JSON.parse(res);
        console.log(res, data);
        console.log('Arush', data.info.info[0]);
        let status: string = '';
        status = data.info.info[0];
        console.log('Arush120', status);
        if (status === 'true')
          this.userservice.log('Password changed Successfully');
        else this.userservice.log('Some error occured.Please try again');
        this.spinnerstatus = false;
        this.submitted = false;
        this.showconfirm = false;
        //this.onclose();
        // this.authService.logout();
        // this.router.navigate(['/login']);
        // this.dialogRef.close();
      });
  }

  get pwdControls() {
    return (this.form.get('pwd') as FormGroup).controls;
  }

  get pwdGroup() {
    return this.form.get('pwd');
  }

  onclose() {
    //this.showconfirm = false;
    this.router.navigate(['/login']);
    this.dialogRef.close();
  }

  onclickok() {
    this.submitted = true;
    console.log(this.pwdControls);
    // console.log(this.pwdControls.fcnewpwd.errors.passwordStrength);

    console.log(this.f.fcoldpwd.value, this.pwdControls.fcnewpwd);

    debugger;
    if (!this.form.valid) {
      return;
    }
    if (this.f.fcoldpwd.value === this.pwdControls.fcnewpwd.value) {
      this.userservice.log('Old and new password can not be same ');
      return;
    }

    this.spinnerstatus = true;

    this.pwd_params = new HttpParams();
    this.pwd_params = this.pwd_params.set('user', 'user');
    this.pwd_params = this.pwd_params.set('email', this.email);
    debugger;
    let myparam = {
      method: '/login/sendOTP.htm',
      xmltojs: 'Y',
    };
    let data: any;
    this.subs.add = this.userservice
      .getdata(this.pwd_params, myparam)
      .subscribe((res) => {
        data = JSON.parse(res);
        this.otp = data.loginInfo.loginInfo[0].otp[0];
        //console.log(data.loginInfo.loginInfo[0].otp[0]);

        this.showotp = true;
        this.submitted = false;

        this.spinnerstatus = false;
      });

    //this.dialogRef.close();
  }

  receiveMessage(message: string) {
    this.receivedMessage = message;
    this.onclose();
  }
}
