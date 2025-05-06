import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
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
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css'],
})
export class forgotpasswordComponent implements OnInit, OnDestroy {
  subs = new SubscriptionContainer();
  pwd_params: HttpParams;
  usr_params: HttpParams;
  showconfirm: Boolean = false;
  showmsg: Boolean = false;
  email: any = '';
  actualemail: any = '';
  forgotPasswordForm: FormGroup;
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
  showpwd: boolean;
  constructor(
    private dialogRef: MatDialogRef<forgotpasswordComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: {title: string,content:string,ok:boolean,cancel:boolean,color:string}) { }
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    public authService: AuthService,
    private userservice: UserService,
    private formBuilder: FormBuilder // private accountService: AccountService, //private alertService: AlertService
  ) {}
  ngOnDestroy(): void {
    this.dialogRef.close();
  }

  get password() {
    return this.forgotPasswordForm.get('password')!;
  }

  get f() {
    return this.forgotPasswordForm.controls;
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
    this.showpwd = false;
    //this.email = this.data.email;
    //this.email = localStorage.getItem('primaryemail');
    //console.log('ARush email is', this.email);
    this.showconfirm = true;
    this.showmsg = false;

    this.forgotPasswordForm = this.formBuilder.group({
      //title: ['', Validators.required],
      user: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      fcotp: [''],

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
    return this.forgotPasswordForm.hasError('passwordsMismatch');
  }
  get passwordSame() {
    return this.forgotPasswordForm.hasError('passwordsSame');
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

    if (!this.forgotPasswordForm.valid) {
      return;
    }
    this.spinnerstatus = true;

    this.pwd_params = new HttpParams();

    //this.pwd_params.set('user', userid);
    //this.pwd_params = this.pwd_params.set('password', this.f.fcoldpwd.value);
    this.pwd_params = this.pwd_params
      .set('newPassword', this.pwdControls.fcnewpwd.value)
      .set('user', this.f.user.value);
    this.pwd_params = this.pwd_params.set('application', 'ANGULAR');
    //this.pwd_params.set('otp', 'otp');

    let myparam = {
      method: '/settings/changePasswordforgotpassword.htm',
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
    return (this.forgotPasswordForm.get('pwd') as FormGroup).controls;
  }

  get pwdGroup() {
    return this.forgotPasswordForm.get('pwd');
  }

  onclose() {
    //this.showconfirm = false;
    this.router.navigate(['/login']);
    this.dialogRef.close();
  }
  onclickok() {
    this.showpwd = false;
    let myparam = {
      method: '/login/getemail.htm',
      xmltojs: 'Y',
    };
    this.usr_params = new HttpParams();
    console.log(this.f.user.value);
    this.usr_params = this.usr_params
      .set('user', this.f.user.value)
      .set('email', this.f.email.value);
    let data: any;
    this.subs.add = this.userservice
      .getdata(this.usr_params, myparam)
      .subscribe((res) => {
        data = JSON.parse(res);
        // console.log(data.loginInfo.loginInfo[0].primaryemail[0]);
        console.log(data.loginInfo.loginInfo[0].status[0]);
        let status = data.loginInfo.loginInfo[0].status[0];
        //if (primaryemail !== this.f.email.value) {
        if (status == 'SUCCESS') {
          this.showpwd = true;
        } else {
          this.userservice.log('Invalid Data');
        }

        //console.log(data.loginInfo.loginInfo[0].otp[0]);

        this.spinnerstatus = false;
      });
  }
  getotp() {
    this.submitted = true;
    console.log(this.pwdControls);
    this.showotp = false;
    // console.log(this.pwdControls.fcnewpwd.errors.passwordStrength);

    //console.log(this.f.fcoldpwd.value, this.pwdControls.fcnewpwd);

    //debugger;
    // if (!this.forgotPasswordForm.valid) {
    //   return;
    // }
    // if (this.f.fcoldpwd.value === this.pwdControls.fcnewpwd.value) {
    //   this.userservice.log('Old and new password can not be same ');
    //   return;
    // }

    this.spinnerstatus = true;

    this.pwd_params = new HttpParams();
    this.pwd_params = this.pwd_params
      .set('user', this.f.user.value)
      .set('email', this.f.email.value);
    debugger;
    let myparam = {
      method: '/login/sendOTPforgotpassword.htm',
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
        this.email = this.f.email.value;

        this.spinnerstatus = false;
      });

    //this.dialogRef.close();
  }

  receiveMessage(message: string) {
    this.receivedMessage = message;
    this.onclose();
  }

  oncontinue() {
    this.submitted = true;
    console.log(this.forgotPasswordForm);
    if (!this.forgotPasswordForm.valid) {
      alert('Invalid data');

      return;
    }
    this.getotp();
  }
}
