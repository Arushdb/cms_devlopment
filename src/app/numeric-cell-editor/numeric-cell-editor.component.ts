import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellEditorParams, StartEditingCellParams } from 'ag-grid-community';

@Component({
  selector: 'app-numeric-cell-editor',
  templateUrl: './numeric-cell-editor.component.html',
  styleUrls: ['./numeric-cell-editor.component.css']
})
export class NumericCellEditorComponent implements ICellEditorAngularComp , AfterViewInit {
//export class NumericCellEditorComponent implements OnInit {

  @ViewChild('input', { read: ViewContainerRef }) public input;

  
  
  //@ViewChild('input')input:HTMLElement;
  public params: ICellEditorParams;
  public value: any;

  
  constructor() { }
  getValue() {
   return this.value;
  }
  isPopup(): boolean {
    return false;
  }
  getPopupPosition?(): string {
    return null ;
  }
  isCancelBeforeStart?(): boolean {
    //throw new Error('Method not implemented.');

    //return this.params.charPress && ('1234567890'.indexOf(this.params.charPress) < 0);
    return false;
    
  }
  isCancelAfterEnd?(): boolean {
    return this.value>40;
  }
  focusIn(): void {
    
   // throw new Error('Method not implemented.');
  }
  focusOut?(): void {
    //throw new Error('Method not implemented.');
  }
  getFrameworkComponentInstance?() {
    //throw new Error('Method not implemented.');
  }

  onButtonClicked(){
    var startEditingParams = {
      rowIndex: this.params.rowIndex,
      colKey: this.params.column.getId(),
    };

    this.params.api.startEditingCell(startEditingParams);
  }

  agInit(params: ICellEditorParams): void {
    
       
        this.params = params;
      if (params.value !== undefined && params.value !== null) {
      this.value = params.value;
  }
 
//   params.eGridCell.focus();
//   let indexparam:StartEditingCellParams={rowIndex:null,colKey:null};
//   indexparam.rowIndex=params.node.rowIndex;
//   indexparam.colKey=params.column.getId();
//   console.log(indexparam);
//   params.api.startEditingCell(indexparam);
//   params.eGridCell.addEventListener('keypress', function(event) {
   
//     // let myevt:KeyboardEventInit= event.key()  ;
//     // myevt.key="backspace";
    
//     // params.eGridCell.dispatchEvent(new MouseEvent('click',{ bubbles: true }));
  
//     console.log("this object",event);
// //     if (!params.eGridCell.isKeyPressedNumeric(event)) {
       
       
       
// //         if (event.preventDefault) event.preventDefault();
// //     } else if (this.isKeyPressedNavigation(event)) {
// //         event.stopPropagation();
// //     }
// });

  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
   // throw new Error('Method not implemented.');
  }
  ngAfterViewInit(): void {

  
    //throw new Error('Method not implemented.');
  }

//   triggerKeyboardEvent(el: any, keyString: string) {
//     var eventObj = document.createEvent("Events") as any;
  
//     if(eventObj.initEvent){
//       eventObj.initEvent("keyup", true, true);
//     }

//     eventObj.shiftKey = true;
//     eventObj.ctrlKey = false;
//     eventObj.metaKey = false;
//     eventObj.altKey = false;
//     eventObj.key = keyString;
    
//     el.dispatchEvent ? 
//     el.dispatchEvent(eventObj) : 
//     el.fireEvent("onkeyup", eventObj); 
  
// } 
//   // isPopup?(): boolean {
  //   return true;
  // }
  // getPopupPosition?(): string {
  //   //throw new Error('Method not implemented.');
  // }
  // isCancelBeforeStart?(): boolean {
  //   throw new Error('Method not implemented.');
  // }
  // focusOut?(): void {
  //   throw new Error('Method not implemented.');
  // }
  // i =getFrameworkComponentInstance() 
     
   
  // afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
  //   //throw new Error('Method not implemented.');
  // }

//   ngOnInit(): void {
    
//     console.log("inside numeric editor");
//   }



//   //private cancelBeforeStart: boolean = false;

//   @ViewChild('input', { read: ViewContainerRef }) public input;

//   agInit(params: ICellEditorParams ): void {

//     //console.log("inside aginit",params);


//     this.params = params;
//     // let gridCell = this.params.api.getFocusedCell();
//     // let indexparam:StartEditingCellParams={rowIndex:null,colKey:null};
//     // indexparam.rowIndex=this.params.node.rowIndex;
//     // indexparam.colKey=this.params.column.getId();

//     //indexparam.rowIndex=this.params.keyPress;

    
    
//     //console.log(indexparam);
//     this.value = this.params.value;
//     //this.params.api.startEditingCell(indexparam);
//    //this.params.apicellStartedEdit =true;  
// //    if (this.value>40)
//   //  this.value="Z";

//     //var that = this;
//     // this.input.addEventListener('keypress', function(event) {
//     //     if (!this.isKeyPressedNumeric(event)) {
//     //         that.input.focus();
//         //     if (event.preventDefault) event.preventDefault();
//         // } else if (this.isKeyPressedNavigation(event)) {
//         //     event.stopPropagation();
//       //   }
//     //});

   

//   //   if (this.isCharNumeric(params.charPress)) {
//   //     this.input.value = params.charPress;
//   // } else {
//   //     if (params.value !== undefined && params.value !== null) {
//   //         this.input.value = params.value;
//   //     }
//   // }
//     //console.log(this.value);
//     //this.params.api.startEditingCell():
//     // if(String(this.value).toLowerCase()==='z'){
//     // console.log("inside aginit z value");
//     // //this.value=;
//     // }
//     //console.log("value",this.value);
//     //this.cancelBeforeStart = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
//     //console.log("cell value",this.value);
//   }

//   getValue(): any {

//     //console.log("in get value")
    
//     return this.value;
//   }

//   // isCancelBeforeStart(): boolean {
//   //   //return this.cancelBeforeStart;
//   // }

//   isCancelAfterEnd(): boolean {

//     //console.log("isCancelAfterEnd");
//     //return false;
//     return this.value > 40;
//   }


//   onKeyDown(event:KeyboardEvent): boolean {
//     console.log("on key down");
//     //console.log(this.isKeyPressedNumeric(event));

//     return true;
//     //  if (!this.isKeyPressedNumeric()) {
//     //      if (event.preventDefault) event.preventDefault();
//     //  }
// }
// getGui(){
//   return this.input;
//    }

//   ngAfterViewInit() {

//   //   if (this.value>40)
//   //   this.value="Z"
//   // return this.value;    
// //    console.log("in ngAfterViewInit");
//     //this.input.element.nativeElement.focus();
//     // window.setTimeout(() => {
//     //   this.input.element.nativeElement.focus();
//     // });
//   }


// //    private getCharCodeFromEvent(event): boolean {
// //     console.log("in getCharCodeFromEvent");
// //     return false;
// // //     // event = event || window.event;
// // //     // return (typeof event.which == "undefined") ? event.keyCode : event.which;
// //  }

//     isCharNumeric(charStr): void {
//   //  console.log("isCharNumeric");
//   //   //return !!/\d/.test(charStr);
//    }
//   //   focusIn(): boolean{
//   //  return true;

//   //  }
// //     isKeyPressedNumeric(event): void {
// //     console.log("isKeyPressedNumeric",event);
    
// //      //const charCode = this.getCharCodeFromEvent(event);
// // //     const charStr = event.key ? event.key : String.fromCharCode(charCode);
// // //     return this.isCharNumeric(charStr);
// //  }
}
