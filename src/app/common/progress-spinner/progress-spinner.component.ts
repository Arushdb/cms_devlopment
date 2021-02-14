import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.css']
})
export class ProgressSpinnerComponent implements OnInit {
 @Input() spinnerstatus :boolean=false;
  constructor() { }

  ngOnInit(): void {
  }

  mode: ProgressSpinnerMode = 'indeterminate';
  color: ThemePalette = 'primary';
  value = 50;
}
