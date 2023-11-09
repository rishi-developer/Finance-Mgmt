import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportsModuleService } from '../../service/reports-module.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-portfolio-valuation-detailed-report',
  templateUrl: './portfolio-valuation-detailed-report.component.html',
  styleUrls: ['./portfolio-valuation-detailed-report.component.css'],
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
export class PortfolioValuationDetailedReportComponent implements OnInit {
  purchaseHeadings = ['Date', 'Value(₹)', 'NAV(₹)', 'Type'];
  currentHeadings = ['Units', 'Value(₹)', 'Days'];
  returnHeadings = ['Gain(₹)', 'Absolute(%)', 'CAGR(%)'];
  reportDate: any;
  showHiddenElementsInUI = false;
  NSEValue: any;
  clientandRMDetails: any;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  mailReport: boolean = false;
  client_id: any;

  constructor(
    private reportService: ReportsModuleService,
    private toastr: ToastrShowService
  ) {}
  dataSource: any;
  columnsData: string[] = [
    'action',
    'fundName',
    'totalPurchaseValue',
    'totalCurrentValue',
    'totalUnrealizedGain',
    'totalAbsoluteReturn',
    'totalHoldingDays',
    'totalCagr',
  ];

  expandedElement = null;
  allRowsExpanded: boolean = false;
  ngOnInit() {
    this.dataSource = this.reportService.portfolioDetailData;
    // console.log(this.dataSource.detailPortfolioReport)
    this.NSEValue = this.reportService.nseValue;

    this.client_id = this.reportService.clientUserId;

    this.reportDate = this.reportService.portfolioDetailDate;
    this.reportDate = moment(this.reportDate).format('DD/MM/YY');

    this.clientandRMDetails = this.reportService.clientandRMDetails;

    // console.log(this.dataSource.detailPortfolioReport.fundTransactions)
  }

  /**
   * To expand all the rows of table on pdf button clicked
   */
  toggleAll() {
    this.allRowsExpanded = !this.allRowsExpanded;
    this.expandedElement = null;
  }

  /**
   * To get the downloaded data
   */

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
    let DATA = document.getElementById('pdfOrder') as HTMLElement;
    await html2canvas(DATA).then((canvas) => {
      // const contentDataURL = canvas.toDataURL('image/png');
      // const pdf = new jsPDF('p', 'mm', 'a4'); // Create PDF object
      // const imgProps = pdf.getImageProperties(contentDataURL);
      // const imgWidth = pdf.internal.pageSize.getWidth();
      // const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      // const margin = 10; // Set margin in mm
      // pdf.addImage(
      //   contentDataURL,
      //   'PNG',
      //   margin,
      //   margin,
      //   imgWidth - margin * 2,
      //   imgHeight - margin * 2
      // ); // Add image to PDF with margin
      // pdf.save('your-pdf-filename.pdf'); // Download PDF

      var imgWidth = 200;
      var pageHeight = 200;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      var doc = new jsPDF('p', 'mm');
      var position = 5;
      var pageData = canvas.toDataURL('image/jpeg', 1.0);
      var imgData = encodeURIComponent(pageData);
      doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
      doc.setLineWidth(5);
      doc.setDrawColor(255, 255, 255);
      doc.rect(0, 0, 210, 295);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight - 85;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
        doc.setLineWidth(5);
        doc.setDrawColor(255, 255, 255);
        doc.rect(0, 0, 210, 295);
        heightLeft -= pageHeight;
      }

      if (!this.mailReport) {
        try {
          doc.save('Portfolio Valuation Detailed Report.pdf');
          this.toastr.showSuccess('PDF Downloaded Successfully');
        } catch (error) {
          this.toastr.showError('Error downloading PDF');
        }
      }
      if (this.mailReport) {
        const pdfContent = doc.output('arraybuffer');
        const pdfFile = new Blob([pdfContent], { type: 'application/pdf' });

        const obj = {
          clientUserId: this.client_id,
          // clientUserId: "USR_73",
          reportType: 'portfolio valuation detailed',
        };
        const blob = pdfFile;
        const formdata: FormData = new FormData();
        formdata.append(
          'file',
          blob,
          'Portfolio Valuation Detailed Report.pdf'
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
    });
    this.toggleAll();
    this.showHiddenElementsInUI = false;
  }

  exportAsCSV() {
    let element = document.getElementById('excelOrder');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'file.xlsx');
  }

  /**
   * Sends the report via email.
   */
  sendMail(): void {
    this.mailReport = true;
    this.generatePDF();
  }

  formatNumber(value: number | string) {
    // Handle "Infinity," "-Infinity," and "NaN" as '0.00'
    if (
      typeof value === 'string' &&
      (value === 'Infinity' || value === '-Infinity' || value === 'NaN')
    ) {
      return '0.00';
    }

    // Handle valid numbers and format them with the specified decimal places
    if (typeof value === 'number') {
      return value.toFixed(2);
    }

    // Handle other invalid inputs as '0.00'
    return '0.00';
  }
}
