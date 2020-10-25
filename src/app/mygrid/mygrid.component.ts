import { Component, OnInit, ViewChild  } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'mygrid',
  templateUrl: './mygrid.component.html',
  styleUrls: ['./mygrid.component.css']
})
export class MygridComponent  {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  title = 'my-app';

  defaultColDef = {
    sortable: true,
    filter: true
};
columnDefs = [
  { field: 'make', rowGroup: true },
  { field: 'price' }
];

autoGroupColumnDef = {
  headerName: 'Model',
  field: 'model',
  cellRenderer: 'agGroupCellRenderer',
  cellRendererParams: {
      checkbox: true
  }
};
/*
  columnDefs = [
    { field: 'make', sortable: true, filter: true ,checkboxSelection: true},
    { field: 'model', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true }
];
*/

  rowData = [
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 },
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 },
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 },
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 },
  ];
 

  getSelectedRows1() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data );
    const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');

    alert(`Selected nodes: ${selectedDataStringPresentation}`);
}


getSelectedRows() {
  const selectedNodes = this.agGrid.api.getSelectedNodes();
  const selectedData = selectedNodes.map(node => {
    if (node.groupData) {
      return { make: node.key, model: 'Group' };
    }
    return node.data;
  });
  const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');

  alert(`Selected nodes: ${selectedDataStringPresentation}`);
}
 
}
