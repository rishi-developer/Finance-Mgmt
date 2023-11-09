import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import {
  ClientResponse,
  TransactionResponse,
} from '../modals/transaction.model';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { LoaderService } from 'src/app/modules/loader/service/loader.service';

@Injectable({
  providedIn: 'root',
})
export class ReportsModuleService {
  reportData = { type: '', name: '' };
  cardIndex = 0;
  userId!: string;
  transactionData!: TransactionResponse;
  portfolioSummaryData: any;
  portfolioDetailData: any;
  portfolioSummaryDate: any;
  portfolioDetailDate: any;
  nseValue: any;
  clientList!: ClientResponse;
  clientandRMDetails: any;
  transactionStartDate: any;
  transactionEndDate: any;
  capitalGainData: any;
  clientUserId: any;
  document!: any;

  constructor(
    private http: HttpClient,
    private authUser: AuthUserService,
    private loaderService: LoaderService
  ) {}

  transactionReport(
    userId: string,
    clientId: string,
    viewMode: string,
    reportCreationDate: string,
    reportEndDate: string
  ): Observable<any> {
    let obj = {
      brokerId: userId,
      clientId: clientId,
      viewMode: viewMode,
      // "dataSource": dataSource,
      reportCreationDate: reportCreationDate,
      reportEndDate: reportEndDate,
    };
    return this.http.post('transactionReport', obj);
  }

  /**
   * Created to get the logged in user details
   */
  getUserDetails() {
    this.authUser.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) this.userId = data.userId;
      this.getClientsList();
    });
  }

  /**
   * To get the details of clients for logged in user
   */
  getClientsList() {
    let obj = {
      userIdOfClient: '',
      userId: this.userId,
    };
    return this.http.post<ClientResponse>('get/listOfClients', obj);
  }
  /**
   *  Creates for the summary portfolio report
   * @param payload
   * @returns
   */
  portfolioSummaryReport(payload: {
    clientUserId: string;
    financialInstruments: string;
    date: string;
  }) {
    return this.http.post<TransactionResponse>(
      'portfolio/valuation/ui',
      payload
    );
  }
  setPortfolioSummaryReportDate(date: string) {
    this.portfolioSummaryDate = date;
  }
  getPortfolioSummaryReportDate() {
    return this.portfolioSummaryDate;
  }

  getNSEvalue() {
    return this.http.get<any>('get/accordNSEPrice');
  }

  getClientandRMDetails(payload: { clientId: string }) {
    return this.http.post<any>('details/rm-and-client', payload);
  }

  portfolioDetailReport(payload: {
    userId: any;
    financialInstrument: any;
    reportDate: any;
  }) {
    return this.http.post<TransactionResponse>(
      'portfolio/valuation/detailed',
      payload
    );
  }
  /**
   * Creates for the summary transaction report
   * @param payload
   * @returns
   */
  transactionSummaryReport(payload: {
    clientUserId: string;
    financialInstruments: string;
    startDate: string;
    endDate: string;
  }): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(
      'transaction/history/ui',
      payload
    );
  }

  /**
   * Creates for the capital gain realized both summary and detailed report
   * @param payload
   * @returns
   */

  capitalGainReport(payload: {
    userId: string;
    financialInstruments: string;
    startDate: string;
    endDate: string;
  }): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(
      'capital/gain',

      payload
    );
  }

  mailReport(formData: any): Observable<any> {
    this.document = null;
    return this.http.post<any>('email/report-pdf', formData);
  }

  /**
   * For pdf generates
   */
  async generatePdf(value: HTMLElement, isPDF: boolean, name: string) {
    this.loaderService.show();
    let doc = new jsPDF('p', 'mm');
    await html2canvas(value).then(async (canvas) => {
      let imgWidth = 200;
      let pageHeight = 200;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 5;
      let pageData = canvas.toDataURL('image/jpeg', 1.0);
      // var imgData = encodeURIComponent(pageData);
      let imgData = pageData;
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
      if (isPDF) {
        // Save the PDF
        doc.save(name + '.pdf');
      }
      if (!isPDF) {
        const pdfContent = doc.output('arraybuffer');
        const pdfFile = new Blob([pdfContent], { type: 'application/pdf' });
        this.document = pdfFile;
      }
      this.loaderService.hide();
    });
  }

  generateExcel(
    element: HTMLElement | null,
    element2: HTMLElement | null,
    element3: HTMLElement | null,
    element4: HTMLElement | null,
    element5: HTMLElement | null
  ) {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const ws2: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element2);
    const ws3: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element3);
    const ws4: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element4);
    const ws5: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element5);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.utils.book_append_sheet(wb, ws2, 'Sheet2');
    XLSX.utils.book_append_sheet(wb, ws3, 'Sheet3');
    XLSX.utils.book_append_sheet(wb, ws4, 'Sheet4');
    XLSX.utils.book_append_sheet(wb, ws5, 'Sheet5');

    XLSX.writeFile(wb, 'file.xlsx');
  }
}
