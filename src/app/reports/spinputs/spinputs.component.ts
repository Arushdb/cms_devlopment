import { Component, Inject, OnInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-spinputs',
  templateUrl: './spinputs.component.html',
  styleUrls: ['./spinputs.component.css']
})

export class SpinputsComponent implements OnInit {
  obj: any = null;
  reportName:string ;
  numofparams: any ;
  parameterNames:string;
  inputValues:string;
  paramNm: string[]=[];
  param: string[]=[];
  mask:boolean=false;
  formElement: any ;

  constructor(private dialogRef: MatDialogRef<SpinputsComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any, 
    public mdialog: MatDialog, private elementRef:ElementRef ) 
    { 
        console.log("------------------inside alert",data);
    }

  ngOnInit(): void {

    this.obj = this.data.content ;
    this.reportName = this.obj.reportName;
    this.numofparams = this.obj.numofparams;
    this.parameterNames =this.obj.parameterNames;
    this.inputValues =this.obj.inputValues;
    this.formElement = document.getElementById('form');
    if (this.numofparams == 0)
    {
      var lbl = document.createElement("LABEL");
      lbl.innerText = "No Inputs Required. Please click to Get Data";
      this.formElement.appendChild(lbl);
    }
    else if (this.numofparams == 1)
    {
      this.paramNm[0] = this.parameterNames.toString();
      this.param[0] = this.inputValues.toString() ;
      var lbl = document.createElement("LABEL");
      lbl.innerText = this.parameterNames;
      this.formElement.appendChild(lbl);
      var textfield = document.createElement("input");
      textfield.type = "text";
      textfield.value = "";
      textfield.id = "inp"+ 0;
      textfield.placeholder = this.inputValues;
      textfield.setAttribute("required", "");
      textfield.required = true;
      this.formElement.appendChild(textfield);
    }
    else if (this.numofparams > 1)
    {
      this.paramNm = this.parameterNames.toString().split("|");
      this.param = this.inputValues.toString().split("|");
      for(var i=0;i < this.numofparams;i++) {
        this.formElement.appendChild(document.createElement("tr"));
        var lbl = document.createElement("LABEL");
        lbl.innerText = this.paramNm[i];
        this.formElement.appendChild(lbl);
        var textfield = document.createElement("input");
        textfield.type = "text";
        textfield.value = "";
        textfield.id = "inp"+ i;
        textfield.placeholder = this.param[i];
        textfield.setAttribute("required", "");
        textfield.required = true;
        this.formElement.appendChild(textfield);
      }
    }
  }

 
  public confirmAlert():void
  { 
    this.param = [];
    let inputbox:any;
    var ok :boolean = true;
    if (this.numofparams > 0)
    {
        for (var i=0; i<this.numofparams; i++)
        {
          inputbox = document.getElementById("inp"+i) as HTMLInputElement ;
          this.param[i] = inputbox.value;
          if (this.param[i].trim() == '') {
            console.log("Please fill out the input field!");
            inputbox.style.borderColor = "red";
            ok = false;
          } 
          //console.log("param[", i, "]=", this.param[i] );
        }
    }
    if (ok)
    {
      this.dialogRef.close({ getparamNms: this.paramNm, getparamValues : this.param, getData:true });
    }
    else 
    {
      var newdiv = document.createElement("div");
      newdiv.innerText = "Please fill out the input(s)!";
      newdiv.className = "warning";
      newdiv.style.color = "red";
      this.formElement.appendChild(newdiv);
    }
    return;
  }

  close() {
    this.dialogRef.close({getData: false});
  }
}


