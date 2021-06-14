import { HttpEvent, HttpEventType } from '@angular/common/http';
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
  progress:number=10;

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
    

    
}

uploadFileToActivity() {
 

  let obj = {xmltojs:'N',
  method:'None' }; 

  console.log("inside upload file");  
//obj.method='/studentlogin/getStudentLoginInfo.htm';
//this.spinnerstatus=true;

this.subs.add=this.userservice.postFile(this.fileToUpload,obj).subscribe((event: HttpEvent<any>)=>{
 

  switch (event.type) {
    case HttpEventType.Sent:
    
      console.log('Request has been made!');
      break;
    case HttpEventType.ResponseHeader:
   
      console.log('Response header has been received!');
      break;
    //case HttpEventType.UploadProgress:
    case HttpEventType.UploadProgress:
      //debugger;
      this.progress = Math.round(event.loaded / event.total * 100);
      console.log(`Uploaded! ${this.progress}%`);
      break;
    case HttpEventType.Response:
        //debugger;
      console.log('User successfully created!', event.body);
      setTimeout(() => {
        this.progress = 10;
      }, 1500);

  }
},error=>{

  
console.log("error in file upload",error);
  this.spinnerstatus=false;
 

    
  });

  
  


}
}
