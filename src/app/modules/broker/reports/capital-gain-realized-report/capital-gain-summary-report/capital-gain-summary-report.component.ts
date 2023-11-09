import { Component, OnInit } from '@angular/core';
import { ReportsModuleService } from '../../service/reports-module.service';
import * as XLSX from 'xlsx';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';


@Component({
  selector: 'app-capital-gain-summary-report',
  templateUrl: './capital-gain-summary-report.component.html',
  styleUrls: ['./capital-gain-summary-report.component.css'],
})
export class CapitalGainSummaryReportComponent implements OnInit {
  capitalGainSummaryReport: any;
  displayedColumns: string[] = [
    'scheme',
    'purchaseValueTotal',
    'acquisitionValueTotal',
    'redemptionValueTotal',
    'shortTermCapitalGainTotal',
    'longTermCapitalGainTotal',
  ];
  transactionStartDate: any;
  transactionEndDate: any;
  showHiddenElementsInUI = false;
  NSEValue: any;
  clientandRMDetails: any;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  mailReport: boolean = false;
  mydocument!: Blob;
  client_id!: string;

  constructor(
    private reportService: ReportsModuleService,
    private toastr: ToastrShowService
  ) {}
  dataSource: any;
  ngOnInit() {
    this.transactionStartDate = this.reportService.transactionStartDate;
    this.transactionEndDate = this.reportService.transactionEndDate;
    this.capitalGainSummaryReport = this.reportService.capitalGainData;
    this.dataSource = this.capitalGainSummaryReport;
    this.NSEValue = this.reportService.nseValue;
    this.clientandRMDetails = this.reportService.clientandRMDetails;
    this.client_id = this.reportService.clientUserId;

    console.log(this.clientandRMDetails);
  }

  generatePDF() {
    this.showHiddenElementsInUI = true;
    setTimeout(() => {
      this.exportAsPDF();
      this.showHiddenElementsInUI = false;
      this.mailReport = false;
    }, 1000);
  }

  /**
   * Exports report in pdf and sends in a mail when required
   */
  async exportAsPDF() {
    if (!this.mailReport) {
      let DATA = document.getElementById('pdfOrder') as HTMLElement;
      const isPDF: boolean = true;
      try {
        await this.reportService.generatePdf(
          DATA,
          isPDF,
          'Capital Gain Realized Summary Report'
        );
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
        'Capital Gain Realized Summary Report'
      );

      this.mydocument = this.reportService.document;

      const obj = {
        clientUserId: this.client_id,
        // clientUserId: "USR_73",
        reportType: 'capital gain realized summary',
      };
      const blob = this.mydocument;
      const formdata: FormData = new FormData();
      formdata.append('file', blob, 'Capital Gain Realized Summary Report.pdf'); // Append the blob directly with a filename
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

  exportAsCSV() {
    let element = document.getElementById('excel-table1');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'file.xlsx');
  }
  sendMail(): void {
    this.mailReport = true;
    this.generatePDF();
  }
}
