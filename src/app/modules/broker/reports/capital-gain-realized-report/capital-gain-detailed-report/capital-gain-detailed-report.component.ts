import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ReportsModuleService } from '../../service/reports-module.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';
import * as XLSX from 'xlsx';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-capital-gain-detailed-report',
  templateUrl: './capital-gain-detailed-report.component.html',
  styleUrls: ['./capital-gain-detailed-report.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class CapitalGainDetailedReportComponent implements OnInit {
  purchaseHeadings = ['Date', 'Value(₹)'];
  acquisitionHeadings = ['Value(₹)'];
  redemptionHeadings = ['Date', 'Value(₹)'];
  capitalGainHeadings = ['Short Term', 'Long Term'];
  allRowsExpanded: boolean = false;

  mailReport: boolean = false;
  mydocument!: Blob;
  client_id!: string;
  constructor(
    private reportService: ReportsModuleService,
    private toastr: ToastrShowService
  ) {}
  dataSource: any;
  length: number = 0;
  NSEValue: any;
  clientandRMDetails: any;
  showHiddenElementsInUI = false;
  displayedColumns: string[] = [
    'action',
    'scheme',
    'purchaseValueTotal',
    'acquisitionValueTotal',
    'redemptionValueTotal',
    'shortTermCapitalGainTotal',
    'longTermCapitalGainTotal',
  ];
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  // columnsToDisplay = ['action','name', 'weight', 'symbol', 'position'];
  expandedElement: any;
  transactionStartDate: any;
  transactionEndDate: any;
  ngOnInit() {
    // this.dataSource = this.ELEMENT_DATA;
    this.dataSource = this.reportService.capitalGainData;
    this.length = this.dataSource.length - 1;
    this.NSEValue = this.reportService.nseValue;
    this.clientandRMDetails = this.reportService.clientandRMDetails;
    this.client_id = this.reportService.clientUserId;
    this.transactionStartDate = this.reportService.transactionStartDate;
    this.transactionEndDate = this.reportService.transactionEndDate;
  }

  formatDate(unixTimestamp: any) {
    const date = new Date(unixTimestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  toggleAll() {
    this.allRowsExpanded = !this.allRowsExpanded;
    this.expandedElement = null;
  }
  shouldHideNamesColumn(index: number): boolean {
    console.log(index);
    return index === this.dataSource.length - 1;
  }

  generatePDF() {
    this.showHiddenElementsInUI = true;
    setTimeout(() => {
      this.toggleAll();
      this.exportAsPDF();
      // this.showHiddenElementsInUI = false;
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
          'Capital Gain Realized Detailed Report'
        );
        this.toggleAll();
        this.showHiddenElementsInUI = false;
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
        'Capital Gain Realized Detailed Report'
      );
      this.toggleAll();
      this.showHiddenElementsInUI = false;
      this.mydocument = this.reportService.document;
      const obj = {
        clientUserId: this.client_id,
        // clientUserId: "USR_73",
        reportType: 'capital gain realized detailed',
      };
      const blob = this.mydocument;
      const formdata: FormData = new FormData();
      formdata.append(
        'file',
        blob,
        'Capital Gain Realized Detailed Report.pdf'
      ); // Append the blob directly with a filename
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
      this.mailReport = false;
    }
  }

  exportAsCSV() {
    let element = document.getElementById('excelOrder');
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
