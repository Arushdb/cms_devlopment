import { AfterViewInit, Component,  ElementRef,  EventEmitter,  Input,  OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
//import * as Collections from 'typescript-collections';
import {MyItem} from 'src/app/interfaces/my-item';
//import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-custom-combobox',
  templateUrl: './custom-combobox.component.html',
  styleUrls: ['./custom-combobox.component.css']
})

export class CustomComboboxComponent implements AfterViewInit,OnInit{
  Options: MyItem[] = [];
 
  @Input('Options')  set onOptions(options: MyItem[]){
  this.Options = options;
  this.initAutoComplete()
}
 @Input() labeltext :string;
 @Input() comboid :string;
 @Input() combowidth :string="100%";
 
 @ViewChild('mylabel',{ read: ElementRef }) mylabel:ElementRef<HTMLLabelElement>; 
 @ViewChild('formfield',{ read: ElementRef }) formfield:ElementRef<MatFormField>; 




 @Output() OptSelected= new EventEmitter<MyItem>();
  myControl = new FormControl();
  filteredOptions: Observable<MyItem[]>;


  ngOnInit() {

    this.initAutoComplete();
    //  this.filteredOptions = this.myControl.valueChanges
    //    .pipe(
    //      startWith(''),
    //      map(value =>  this._filter(value))
    //    );
  
  }



  private _filter(value:string): MyItem[] {
     const filterValue = value.toString().toLowerCase();
  
     return this.Options.filter( v=>{
             return v.label.toString().toLowerCase().includes(filterValue);
     }
      ) 
      ;
   }
  constructor(private renderer:Renderer2) { }
  ngAfterViewInit(): void {
    
     this.renderer.setProperty(this.mylabel.nativeElement ,'textContent',this.labeltext);
     this.renderer.setStyle(this.formfield.nativeElement ,'width',this.combowidth);
     
    }

    


    displayFn(item:MyItem):string{
    
                  
       return  item && item.label ?item.label:"";
    }

    change(event){
      //console.log("change event",event);
      //debugger;
      //let obj :MyItem={id:"-1",label:"notselected"} ;
      //this.OptSelected.emit(event.option.value);
    

     // this.OptSelected.emit(obj);
    }

    OnngModelChange(event) {
    
      console.log('ngModelChange called',event);
    }
    initAutoComplete(){
      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    }
   
}
