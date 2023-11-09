import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ProductAdminService } from './../service/product-admin.service';
import { PRODUCT_ADMIN } from 'src/app/constants/product-admin.constants';
import { Broker } from 'src/app/models/product-admin';

@Component({
  selector: 'app-product-admin-dashboard',
  templateUrl: './product-admin-dashboard.component.html',
  styleUrls: ['./product-admin-dashboard.component.css'],
})
export class ProductAdminDashboardComponent implements OnInit {
  mainHeadingValue: string = 'Home';
  dataSource: MatTableDataSource<Broker> = new MatTableDataSource<Broker>();
  displayedColumns: string[] = [
    'brokerName',
    'email',
    'organization',
    'rmFunctionality',
    'status',
    'action',
  ];
  statusOptions = ['Invite Sent', 'Active', 'Expired', 'Inactive'];
  isMobile: boolean = false;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  isTableHasFilteredData: boolean = true;

  constructor(
    private responsiveService: ResponsiveService,
    private router: Router,
    private productAdminService: ProductAdminService,
    private toastr: ToastrShowService,
    private sharedModuleService: SharedModuleService
  ) {}

  ngOnInit(): void {
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
    this.onResize();
    this.responsiveService.checkWidth();
    this.getAllBrokers();
    this.paginator._intl.itemsPerPageLabel = 'Rows per page:';
  }

  /**
   * Fetch all brokers
   */
  getAllBrokers() {
    this.productAdminService.getAllBrokers().subscribe(
      (data) => {
        if (data) {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  /**
   * Navigate to broker onboarding Screen
   */
  onboardBroker() {
    this.router.navigate(['/product-admin/broker-onboarding']);
  }

  /**
   * Resend invitation to a broker.
   * @param brokerAdminUserId - User ID of the broker admin.
   */
  resendInvite(brokerAdminUserId: string) {
    this.productAdminService.resendInvite(brokerAdminUserId).subscribe(
      (data) => {
        if (data) {
          this.toastr.showSuccess(data.message);
          this.getAllBrokers();
        }
      },
      (err) => {
        this.toastr.showError(PRODUCT_ADMIN.RESEND_MAIL_ERROR);
      }
    );
  }

  /**
   * Filter table data based on user input.
   * @param event -  Value entered by the user.
   */
  applyFilter(event: KeyboardEvent) {
    let filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if (this.dataSource.filteredData?.length > 0) {
      this.isTableHasFilteredData = true;
    } else {
      this.isTableHasFilteredData = false;
    }
  }

  /**
   * Sort data based on column.
   */
  sortData() {
    this.dataSource.sortingDataAccessor = (
      data: Broker,
      sortHeaderId: string
    ) => {
      if (!data[sortHeaderId as keyof Broker]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }
      return '2' + data[sortHeaderId as keyof Broker].toString().toLowerCase();
    };
  }

  /**
   * Handle window resize event.
   */
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.isMobile = isMobile;
    });
  }
}
