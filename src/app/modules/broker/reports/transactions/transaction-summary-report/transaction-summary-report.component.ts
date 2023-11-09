import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ReportsModuleService } from '../../service/reports-module.service';
import * as moment from 'moment';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-transaction-summary-report',
  templateUrl: './transaction-summary-report.component.html',
  styleUrls: ['./transaction-summary-report.component.css'],
})
export class TransactionSummaryReportComponent implements OnInit {
  displayedColumns: string[] = [
    'orderId',
    'schemeDetails',
    'date',
    'transactionType',
    'amount',
  ];
  transactionStartDate: any;
  transactionEndDate: any;
  clientandRMDetails: any;
  NSEValue: any;
  mailReport: boolean = false;
  mydocument!: Blob;
  client_id!: string;
  constructor(
    private reportService: ReportsModuleService,
    private router: Router,
    private toastr: ToastrShowService
  ) {}
  dataSource: any;
  showHiddenElementsInUI = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;

  ngOnInit() {
    this.dataSource = this.reportService.transactionData;
    this.transactionStartDate = this.reportService.transactionStartDate;
    this.transactionEndDate = this.reportService.transactionEndDate;
    this.clientandRMDetails = this.reportService.clientandRMDetails;
    this.client_id = this.reportService.clientUserId;

    this.transactionStartDate = moment(this.transactionStartDate).format(
      'DD/MM/YY'
    );
    this.transactionEndDate = moment(this.transactionEndDate).format(
      'DD/MM/YY'
    );
    this.NSEValue = this.reportService.nseValue;
  }

  /**
   * Download the PDF
   */
  generatePDF() {
    this.showHiddenElementsInUI = true;
    this.pdfDownload();
    this.mailReport = false;
    this.showHiddenElementsInUI = false;
  }

  /**
   * Downloads report in pdf or sends in a mail when required
   */
  async pdfDownload() {
    if (!this.mailReport) {
      let id = document.getElementById('pdfOrder') as HTMLElement;
      try {
        this.reportService.generatePdf(id, true, 'Transaction Summary Report');
        this.toastr.showSuccess('PDF Generated Successfully');
      } catch (error) {
        this.toastr.showError('Error generating PDF');
      }
    }
    if (this.mailReport) {
      let DATA = document.getElementById('pdfOrder') as HTMLElement;
      await this.reportService.generatePdf(
        DATA,
        false,
        'Transaction Summary Report'
      );

      this.mydocument = this.reportService.document;

      const obj = {
        clientUserId: this.client_id,
        // clientUserId: "USR_73",
        reportType: 'transaction summary',
      };

      const blob = this.mydocument;
      const formdata: FormData = new FormData();
      formdata.append('file', blob, 'Transaction Summary Report.pdf'); // Append the blob directly with a filename
      formdata.append('formDetails', JSON.stringify(obj));
      this.reportService?.mailReport(formdata).subscribe(
        (res) => {
          const messageToShow = res.message || 'error while loading';
          this.toastr.showSuccess(messageToShow);
        },
        (error) => {
          this.toastr.showError(error);
        }
      );
    }
  }

  excelDownload() {
    let element = document.getElementById('excelOrder');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'file.xlsx');
  }

  /**
   * When click on the breadcrumbs
   */
  backRoute() {
    this.router.navigate(['reports/portfolio-valuation-report'], {
      queryParams: { reportType: 'portfolio' },
    });
  }
  sendMail(): void {
    this.mailReport = true;
    this.generatePDF();
  }
}
