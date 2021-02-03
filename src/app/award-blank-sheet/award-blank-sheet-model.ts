import { HttpParams } from "@angular/common/http";
import { ColDef, GridOptions } from "ag-grid-community";

export interface awardsheetmodel{


    mydefaultColDef: {
        editable: true,
        sortable: true,
        flex: 1,
        minWidth: 100,
        filter: true,
        resizable: true,
        
        };
    
     
      trigger:String="button";
      abc:any[]=[];
      abcbk:any[]=[];       
      editing : false;
      //columnDefsmk:ColDef[]=[];  
      buttonPressed:string=null;
      componentAC:any[];
      columnDefs: ColDef[]; 
      studentXml:any[]=[];
      public columnDefsmk : ColDef[]=[];                             
                                   
      urlPrefix:any;
      param: HttpParams()
      .set('application','CMS');
      public myrowData=[];
      displayType:any;
      private awardsheet_params:HttpParams=new HttpParams();
      gridOptions: GridOptions;
      gridOptionsmk: GridOptions;
      isEdit=false;
      isCheck=true;
      edit='Dont Edit';
      public defaultColDef;
    
}