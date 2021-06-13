import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { UserService } from 'src/app/services/user.service';
import { HttpParams } from '@angular/common/http';
import { NewregistrationComponent } from '../newregistration/newregistration.component';

//import { AccountService, AlertService } from '../_services';

@Component({ selector: 'signonform',
             templateUrl: './loginform.component.html' ,
             styleUrls: ['./loginform.component.css']
            })
export class LoginformComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    spinnerstatus: boolean=false;
    subs = new SubscriptionContainer();
    reg_params:HttpParams=new HttpParams();
    sts:string="ACT";
    message: any;
  

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private userservice:UserService,
        private dialogRef: MatDialogRef<LoginformComponent>
       // private accountService: AccountService,
        //private alertService: AlertService
    ) {
        // redirect to home if already logged in
        // if (this.accountService.userValue) {
        //     this.router.navigate(['/']);
        // }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        console.log(this.returnUrl);
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        this.sts="ACT";

        console.log("form submitted");

        // reset alerts on submit
       // this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        
        this.reg_params= this.reg_params.set("user_name",this.f.username.value);
       this.reg_params= this.reg_params.set("roll_number",this.f.username.value);
        this.reg_params= this.reg_params.set("password",this.f.password.value);
                       
        this.studentlogin();
       

        //this.accountService.login(this.f.username.value, this.f.password.value)
          //  .pipe(first())
            //.subscribe(
              //  data => {
                //    this.router.navigate([this.returnUrl]);
                //},
                // error => {
                //     this.alertService.error(error);
                //     this.loading = false;
                // });
    }

    close() {
        this.dialogRef.close(false);
      }


      studentlogin(){
        let obj = {xmltojs:'Y',
        method:'None' }; 
      
          
      obj.method='/studentlogin/getStudentLoginInfo.htm';
      this.spinnerstatus=true;
      
      this.subs.add=this.userservice.getdata(this.reg_params,obj).subscribe(res=>{
        //this.userservice.log(" in switch detail selected");
    
       
        res = JSON.parse(res);
        this.spinnerstatus=false;
        this.loading = false;
        this.getStudentLoginInfoResultHandler(res);

    
      
       
    },error=>{
     this.sts= "inactive";
        // console.log(error.originalError.message);
        // console.log(error.status);
        //this.message=error.originalError.message;
        this.message="Invalid User or Password";
        this.loading = false;
        this.spinnerstatus=false;
        
    })
      }


      getStudentLoginInfoResultHandler(res){
        
          if(res.LoginInfo.login[0].processed_flag=="P"){
            this.message=" Already Registered!";
            this.sts= "inactive";
            return;
            
          }

          if(res.LoginInfo.login[0].processed_flag=="N"){
            this.close();
            this.getstudentdetail();

              

            
           
            return;
            
          }
          
      }

      getstudentdetail(){
        let obj = {xmltojs:'Y',
        method:'None' }; 
      
          
      obj.method='/registrationform/getStudentDetails.htm';
      this.spinnerstatus=true;
      
      this.subs.add=this.userservice.getdata(this.reg_params,obj).subscribe(res=>{
        //this.userservice.log(" in switch detail selected");
    
       
        res = JSON.parse(res);
        this.spinnerstatus=false;
        this.loading = false;
        this.getStudentDetailsResultHandler(res);


      });
    
    }
    
    getStudentDetailsResultHandler(res){
        console.log(res);
        console.log(res.studentdata.student[0].program_id[0]);

         res["appnumber"]=this.f.username.value;
        
        
      
        this.reg_params=this.reg_params.set("userName",this.f.username.value);

      
        console.log(this.reg_params);

            
            // let navigationExtras: NavigationExtras = {
            //     queryParams: {
            //         "reg_params": JSON.stringify(res)
            //     }
            // };
        
            const dialogConfig = new MatDialogConfig();
            dialogConfig.width="90%";
            dialogConfig.height="90%";
            dialogConfig.data={
              "studentdata":res,
             

            }
  
        const dialogRef=  this.dialog.open(NewregistrationComponent,dialogConfig)
      
          this.subs.add=dialogRef.afterClosed().subscribe(result => {
        
   
          
           });      
    

            //this.router.navigate(['/newregistration'],navigationExtras);




    }
}
