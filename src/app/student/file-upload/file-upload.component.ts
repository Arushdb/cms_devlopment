import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {

  @Input() progress;
  
  public file: File | null = null;
  onChange: Function;
 

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    const file = event && event.item(0);
    debugger;
    this.onChange(file);
    this.file = file;
  }

  constructor( private host: ElementRef<HTMLInputElement> ) {
  }
 
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  writeValue( value: null ) {
    // clear file input
    debugger;
    this.host.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange( fn: Function ) {
    debugger;
    this.onChange = fn;
  }

  registerOnTouched( fn: Function ) {
  }

}
export function requiredFileType( type: string ) {
  return function (control: FormControl) {
    const file = control.value;
    if ( file ) {
      const extension = file.name.split('.')[1].toLowerCase();
      if ( type.toLowerCase() !== extension.toLowerCase() ) {
        return {
          requiredFileType: true
        };
      }
      
      return null;
    }

    return null;
  };
}