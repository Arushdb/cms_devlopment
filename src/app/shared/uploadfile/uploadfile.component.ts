import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionContainer } from '../subscription-container';

@Component({
  selector: 'app-uploadfile',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.css']
})
export class UploadfileComponent implements OnInit {

  fileToUpload: File = null;
  submitted = false;
  subs = new SubscriptionContainer();
  spinnerstatus: boolean;
  registerForm: FormGroup;

  constructor(private userservice:UserService,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      file: ['', Validators.required]
    });
  }

  get f() {
          
    return this.registerForm.controls; }


//   onReset() {
//     this.submitted = false;
//     this.registerForm.reset();
// }

handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    

    console.log('Arush',this.fileToUpload);
}

uploadFileToActivity() {
 

  let obj = {xmltojs:'Y',
  method:'None' }; 

  console.log("inside upload file");  
//obj.method='/studentlogin/getStudentLoginInfo.htm';
//this.spinnerstatus=true;

this.subs.add=this.userservice.postFile(this.fileToUpload,obj).subscribe(res=>{
  //this.userservice.log(" in switch detail selected");

 console.log(res);
// res = JSON.parse(res);
  this.spinnerstatus=false;
 


 
},error=>{

  // console.log(error.originalError.message);
  // console.log(error.status);
  //this.message=error.originalError.message;
console.log("error in file upload",error);
  this.spinnerstatus=false;
  
})
    //this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
      // do something, if upload success
      //}, error => {
        //console.log(error);
      //});
  }

}
