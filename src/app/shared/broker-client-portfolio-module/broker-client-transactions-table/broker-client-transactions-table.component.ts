import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { MatTableDataSource } from '@angular/material/table';
import { broker_transactions_list } from './broker-transaction-table.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, NgForm } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormGroupDirective } from '@angular/forms';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-broker-client-transactions-table',
  templateUrl: './broker-client-transactions-table.component.html',
  styleUrls: ['./broker-client-transactions-table.component.css']
})
export class BrokerClientTransactionsTableComponent implements OnInit {
  modalForm: FormGroup;
  mainHeadingValue: string = 'Transactions';
  dataSource: any;
  mobile: boolean = false;
  pageEvent?: PageEvent;
  tablePageIndex: number = 0;
  tableLength: number = 0;
  dateString: any
  startDate: any
  endDate: any
  clientId: any;
  today = new Date()
  start_date: any;
  end_date: any;
  pageNo: any;
  startDate2: any;
  endDate2: any;
  flag: boolean = false;
  displayedColumns: string[] = ['orderId', 'schemeName', 'transactionTime', 'folioNo', 'transactionType', 'noOfUnits', 'amount', 'transactionStatus'];
  transaction_Status: any;
  @ViewChild('picker') datePicker!: MatDatepicker<Date>;
  @ViewChild("picker2") datePicker2!: MatDatepicker<Date>;
  @ViewChild(FormGroupDirective) formDirective?: FormGroupDirective;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  userId: any;
  userRole: any;

  constructor(private _sharedModulService: SharedModuleService,
    public dialog: MatDialog,
    private toastr: ToastrShowService,
    private sharedModuleService: SharedModuleService,
    private route: ActivatedRoute,
    private authUserService: AuthUserService,
    private formBuilder: FormBuilder,
    private responsiveService: ResponsiveService,) {
    this.dataSource = new MatTableDataSource<broker_transactions_list>([]);
    this.modalForm = this.formBuilder.group({}),
      this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.clientId = params?.get('id');
    });

    this.modalForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    this.authUserService.getUserDetailBehaviorSubject().subscribe(data => {
      if (data)
        this.userId = data.userId;this.userId = data.userId;
        this.userRole = data.newRoleFinal.roleDescription;

    });

    if( this.userRole == 'CLIENT'){
    this.clientId = this.userId
    }

    this.transactionDateRange();
    this.getTransactionHistoryList();
    this.onResize();
    this.responsiveService.checkWidth();
    this.paginator._intl.itemsPerPageLabel = "Rows per page:";

  }

  transactionDateRange() {
    var now = new Date();
    this.endDate = moment(now).format('YYYY-MM-DD HH:mm:ss');
    this.endDate2 = this.endDate
    var sixMonthAgo = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 6,
      new Date().getDate()
    );
    this.startDate = moment(sixMonthAgo).format('YYYY-MM-DD HH:mm:ss');
    this.startDate2 = this.startDate
  }

  getTransactionHistoryList() {
    this._sharedModulService.getTransactionHistory(this.clientId, this.startDate, this.endDate).subscribe(data => {
      if (data) {
        this.dataSource = new MatTableDataSource(data.clientTransactionHistoryList);
        for (const element of data.clientTransactionHistoryList) {
          if (element.transactionStatus == 0) {
            element.transaction_Status = 'Order Placed';
          }
          else {
            element.transaction_Status = 'Failed';
          }
        }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }

  public dateRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalid = false;
    const start_date = this.modalForm && moment(this.modalForm.value.startDate).format('YYYY-MM-DD');
    const end_date = this.modalForm && moment(this.modalForm.value.endDate).format('YYYY-MM-DD');
    if (start_date && end_date) {
      invalid = new Date(start_date).valueOf() > new Date(end_date).valueOf();
    }
    return invalid ? { invalidRange: { start_date, end_date } } : null;
  };



  onSubmit() {
    if (this.modalForm.invalid) {
      return;
    }

    this.startDate = moment(this.modalForm.value.startDate).format('YYYY-MM-DD HH:mm:ss');
    this.endDate = moment(this.modalForm.value.endDate).format('YYYY-MM-DD') + " 23:59:59"
    if (this.flag == false) {
    }
    this.trigger.closeMenu();
    this.getTransactionHistoryList();
  }

  reset() {
    this.formDirective?.resetForm();
    this.startDate = this.startDate2
    this.endDate = this.endDate2
    this.getTransactionHistoryList();
  }

  sortData(sort: MatSort) {
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: any) => {
      if (!data[sortHeaderId]) {
        return this.sort.direction === "asc" ? '3' : '1';
      }
      return '2' + data[sortHeaderId].toString().toLowerCase();
    }
  }

  applyFilter(event: any) {
    let filterValue = event.target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.mobile = isMobile;
    });
  }

}
