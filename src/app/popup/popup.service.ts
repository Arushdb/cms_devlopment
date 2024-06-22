import { Injectable } from '@angular/core';
import { PopupComponent } from './popup.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  closeDialog: any;
  public data: any;

  constructor(private dialog: MatDialog) { }

  openPopup(rowData:any)
  { this.data=rowData;
    console.log("Aditya",this.data)
    this.dialog.open(PopupComponent,{data:rowData});
  }
  
}
