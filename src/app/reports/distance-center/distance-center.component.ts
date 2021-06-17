import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CustomComboboxComponent } from '../../shared/custom-combobox/custom-combobox.component';
import { MyItem} from '../../interfaces/my-item';
import { UserService} from  '../../services/user.service' ;
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { SubscriptionContainer } from '../../shared/subscription-container';
import {Location} from '@angular/common';
import { alertComponent } from '../../shared/alert/alert.component';

@Component({
  selector: 'app-distance-center',
  templateUrl: './distance-center.component.html',
  styleUrls: ['./distance-center.component.css']
})
export class DistanceCenterComponent implements AfterViewInit {
  @ViewChild('CustomComboboxComponent') custcombo: CustomComboboxComponent;
  combowidth: string;
  entityCombolabel : string ='Select Study Center';
  entityCombo : MyItem[] = [];
  urlEntityList :string='';
  urlgenerate :string='';
  params = new HttpParams().set('application','CMS');
  curDate = new Date;
  mask:boolean = true;
  selectedEntityId : string ="";
  selectedEntityNm : string ="";
  showOk:boolean = true;
  subs = new SubscriptionContainer();
  enableOkBtn:boolean = false;

  constructor(private router:Router,
    private userservice:UserService,
    private route:ActivatedRoute,
    private elementRef:ElementRef,
    private location:Location,
    public dialog: MatDialog,
    private renderer:Renderer2) { }

  ngOnInit(): void {
    this.getEntityList();
  }
  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
    this.subs.dispose();
    this.elementRef.nativeElement.remove();
   
  }

public getEntityList():void
{
  this.urlEntityList = "/distanceCenterList/getEntityList.htm";
  this.params = this.params.set("time", this.curDate.toString()); 
	let obj = {xmltojs:'Y',
	method: this.urlEntityList };   
	this.mask=true;
  this.subs.add=this.userservice.getdata(this.params,obj).subscribe(res=>{
		res= JSON.parse(res);
		this.entityresultHandler(res);
		this.mask=false;
		});

}

public  entityresultHandler(res):void
{
	//console.log("entity", res.Details.item);
	if(!isNullOrUndefined(res.Details.item) )
	{	//console.log("entity --- " + res.componentDetails.Details.length);
		for (var  o of res.Details.item){
			this.entityCombo.push({id:o.entity_id,label:o.entity_name});
		}	
	}
	this.combowidth = "80%";
}

public entityChangeHandler(obj):void
{	
	if (obj.id === "-1" )
	{
    this.selectedEntityId = "";
    this.enableOkBtn = false;
	}
	else
	{
    this.selectedEntityId = obj.id;
    this.selectedEntityNm = obj.label;
    this.enableOkBtn = true;
		console.log("entitychangehandler selected Entity Id=" + this.selectedEntityId + "-" + this.selectedEntityNm);
	}
	return;
  }

  public generateExcel()
  {
      if (this.selectedEntityId.length > 0 )
      {
        this.urlgenerate= "/distanceCenterList/GenerateExcel.htm";
        this.params = this.params.set("entityId", this.selectedEntityId.toString().trim()); 
        let obj = {xmltojs:'Y',
        method: this.urlgenerate };   
        this.mask=true;
        this.subs.add=this.userservice.getdata(this.params,obj).subscribe(res=>{
          res= JSON.parse(res);
          this.GenerateExcelSuccess(res);
          this.mask=false;
          });
      }
      else
      {
        //Alert.show("please select the study center ");
        const dialogRef=  this.dialog.open(alertComponent,
          {data:{title:"Information",content:"Please select the study center",ok:true,cancel:false,color:"warn"} });

        console.log("please select the study center");
      }
  }
  path1 :string="";
  //downloadUrl:URLRequest = new URLRequest();
  public GenerateExcelSuccess(res)
  {
      for (var  o of res.path.rd)
      {
        this.path1 = o.Path;
		  }
      //console.log(this.path1);
      if(!isNullOrUndefined(this.path1) )
      {
       if (this.path1.toString().length > 0 ) {
        //console.log(this.path1, this.userservice.url + this.path1);
        //console.log(reportPath);
        window.open(this.userservice.url + '/' + this.path1);
       }
      }
      else
      {
        //Alert.show("No data found");
        const dialogRef=  this.dialog.open(alertComponent,
          {data:{title:"Information",content:"No data found",ok:true,cancel:false,color:"warn"} });

        console.log("No data found");
      } 
      return;
  }

}
