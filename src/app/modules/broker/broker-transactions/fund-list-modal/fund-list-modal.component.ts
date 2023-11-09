import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { fund_list_table } from './fund-list-modal.model';
import { FundName } from 'src/app/models/broker-admin';

@Component({
  selector: 'app-fund-list-modal',
  templateUrl: './fund-list-modal.component.html',
  styleUrls: ['./fund-list-modal.component.css'],
})
export class FundListModalComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['Select', 'SchemeCode', 'fundName', 'ISIN'];
  selection = new SelectionModel<fund_list_table>(true, []);
  dataSource = new MatTableDataSource<fund_list_table>([]);
  element!: FundName;
  ButtonDisable: boolean | undefined;
  mobile: boolean = false;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  isTableHasFilteredData: boolean = true;
  selectedRow!: FundName;

  constructor(
    public dialogRef: MatDialogRef<FundListModalComponent>,
    private responsiveService: ResponsiveService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataSource = new MatTableDataSource<fund_list_table>([]);
    if (this.element === undefined) {
      this.ButtonDisable = true;
    }
  }

  ngOnInit(): void {
    this.onResize();
    this.responsiveService.checkWidth();
    this.getFundsData();
  }

  /**
   * Fetches the list of funds
   */
  getFundsData() {
    this.dataSource = new MatTableDataSource<fund_list_table>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Rows per page:';
  }

  /**
   * Closes the fund list dialog modal
   */
  onClose1() {
    this.dialogRef.close();
  }

  /**
   * Triggered when a particular fund is selected
   * @param element
   */
  onFundSelect(element: FundName) {
    this.ButtonDisable = false;
    // delete element['date'], delete element['nav'] , delete element['divReinvestFlag'], delete element['rtaSchemeCode'], delete element['rtaCode']
    this.element = element;
  }

  /**
   * Closes the fund dialog modal with the selected fund
   */
  close1() {
    this.dialogRef.close(this.element);
  }

  /**
   * Filters the fund
   * @param event
   */
  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let filterValue: string | undefined = inputElement.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.ButtonDisable = true;
    if (this.dataSource.filteredData.length > 0) {
      this.isTableHasFilteredData = true;
    } else {
      this.isTableHasFilteredData = false;
    }
  }

  /**
   * Sorts the fund list
   * @param sort
   */
  sortData(sort: MatSort) {
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: any) => {
      if (!data[sortHeaderId]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }
      return '2' + data[sortHeaderId].toString().toLowerCase();
    };
  }

  /**
   * Triggered when screen size changes
   */
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.mobile = isMobile;
    });
  }

  /**
   * Selects a particular fund row
   * @param row
   */
  onRowSelect(row: FundName): void {
    this.selectedRow = row;
    this.onFundSelect(row);
  }

  /**
   * Returns the selected fund row
   * @param row
   * @returns
   */
  isSelected(row: FundName): boolean {
    return this.selectedRow === row;
  }
}
