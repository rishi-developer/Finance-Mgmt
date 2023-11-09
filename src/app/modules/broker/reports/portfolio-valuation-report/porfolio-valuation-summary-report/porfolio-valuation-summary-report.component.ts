import { Component, OnInit } from '@angular/core';
import { ReportsModuleService } from '../../service/reports-module.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner/progress-spinner';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-porfolio-valuation-summary-report',
  templateUrl: './porfolio-valuation-summary-report.component.html',
  styleUrls: ['./porfolio-valuation-summary-report.component.css'],
})
export class PorfolioValuationSummaryReportComponent implements OnInit {
  mainHeadingValue: string = 'Reports';
  mutualFund: string[] = ['subCategory', 'currentValue', 'allocationValue'];
  allocationFund: string[] = [
    'fundName',
    'purchaseValue',
    'currentValue',
    'allocationPercentage',
  ];
  fundAnalysis: string[] = ['fundName', 'currentValue', 'allocationPercentage'];
  dataSource: any;
  data: any;
  options: any;
  client_id: any;
  element: any;
  clientandRMDetails: any;
  NSEValue: any;
  portfolioSummaryReportDate: any;
  showHiddenElementsInUI = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  mailReport: boolean = false;
  mydocument: any;

  constructor(
    private reportService: ReportsModuleService,
    private toastr: ToastrShowService
  ) {}

  ngOnInit() {
    this.dataSource = this.reportService.portfolioSummaryData;
    this.portfolioSummaryReportDate =
      this.reportService.getPortfolioSummaryReportDate();

    this.portfolioSummaryReportDate = moment(
      this.portfolioSummaryReportDate
    ).format('DD/MM/YY');

    this.NSEValue = this.reportService.nseValue;
    this.client_id = this.reportService.clientUserId;

    this.clientandRMDetails = this.reportService.clientandRMDetails;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: [
        `Equity Rs.${this.dataSource.assetDistribution.equityAllocationAmount}`,
        `Debt Rs.${this.dataSource.assetDistribution.debtAllocationAmount}`,
        `Others Rs.${this.dataSource.assetDistribution.othersAllocationAmount}`,
      ],
      datasets: [
        {
          pointStyle: 'circle',
          labels: [],
          data: [
            this.dataSource.assetDistribution.equityAllocationPercentage,
            this.dataSource.assetDistribution.debtAllocationPercentage,
            this.dataSource.assetDistribution.othersAllocationPercentage,
          ],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--yellow-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--yellow-500'),
          ],
        },
      ],
    };

    this.options = {
      legend: {
        position: 'right',
        align: 'right',
      },
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }

  generatePDF() {
    this.showHiddenElementsInUI = true;
    setTimeout(() => {
      this.exportAsPDF();
      this.showHiddenElementsInUI = false;
      this.mailReport = false;
    }, 2000);
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
          'Portfolio Valuation Summary Report'
        );
        this.toastr.showSuccess('PDF Downloaded Successfully');
      } catch (error) {
        this.toastr.showError('Error downloading PDF');
      }
    }

    if (this.mailReport) {
      let DATA = document.getElementById('pdfOrder') as HTMLElement;
      await this.reportService.generatePdf(
        DATA,
        false,
        'Portfolio Valuation Summary Report'
      );

      this.mydocument = this.reportService.document;

      const obj = {
        clientUserId: this.client_id,
        // clientUserId: "USR_73",
        reportType: 'portfolio valuation summary',
      };
      const blob = this.mydocument;
      const formdata: FormData = new FormData();
      formdata.append('file', blob, 'Portfolio Valuation Summary Report.pdf'); // Append the blob directly with a filename
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

  // convertToBase64() {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const base64String = reader.result?.toString().split(',')[1]; // Get the Base64 string (remove data:image/pdf;base64, prefix)
  //     // Now, you can use this base64String to send in the payload of the HTTP request.
  //   };
  //   reader.readAsDataURL(this.mydocument);
  // }

  exportAsCSV() {
    let element = document.getElementById('excel-table1');
    let element2 = document.getElementById('excel-table2');
    let element3 = document.getElementById('excel-table3');
    let element4 = document.getElementById('excel-table4');
    let element5 = document.getElementById('excel-table5');

    this.reportService.generateExcel(
      element,
      element2,
      element3,
      element4,
      element5
    );
  }

  sendMail(): void {
    this.mailReport = true;
    this.generatePDF();
  }
}
