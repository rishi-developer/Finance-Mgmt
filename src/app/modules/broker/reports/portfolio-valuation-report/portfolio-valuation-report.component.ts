import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ReportsModuleService } from '../service/reports-module.service';
import { map } from 'rxjs/operators';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-portfolio-valuation-report',
  templateUrl: './portfolio-valuation-report.component.html',
  styleUrls: ['./portfolio-valuation-report.component.css'],
})
export class PortfolioValuationReportComponent implements OnInit {
  modalForm: FormGroup;
  financialOptions = ['Mutual Funds', 'Stocks'];
  today = new Date();
  mainHeadingValue: string = 'Portfolio Valuation Report';
  setClientList: any;

  constructor(
    private formBuilder: FormBuilder,
    private sharedModuleService: SharedModuleService,
    private reportService: ReportsModuleService,
    private router: Router,
    private toastr: ToastrShowService
  ) {
    this.setClientList = this.reportService.clientList;
    (this.modalForm = this.formBuilder.group({})),
      this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
  }

  ngOnInit(): void {
    // ! need to make it at one place
    this.setClientList = this.reportService.getClientsList();
    this.modalForm = this.formBuilder.group({
      investor: ['', Validators.required],
      reportDate: ['', Validators.required],
      financialInstruments: ['', Validators.required],
    });
  }

  reset() {
    this.modalForm.reset();
  }
  /**
   * created when data is submitted
   */
  submit() {
    if (this.modalForm.valid) {
      this.reportService.getNSEvalue().subscribe((res: any) => {
        if(res){
          this.reportService.nseValue = res;
        }
      })
      if (
        this.reportService.reportData.type.toLocaleLowerCase() === 'detailed'
      ) {
        let obj = 
        {
          userId: this.modalForm.value['investor'],
          financialInstrument: this.modalForm.value['financialInstruments'],
          reportDate: formatDate(
            this.modalForm.value['reportDate'],
            'yyyy-MM-dd',
            'en-US'
          ),
        };
        // {
        //     userId:"USR_242",
        //     financialInstrument:"mutual funds",
        //     reportDate:"2023/04/05",
        //     }


            this.reportService.portfolioDetailDate = obj.reportDate;

            this.reportService.getClientandRMDetails(obj.userId).subscribe((res: any) => {
              if(res){
                this.reportService.clientandRMDetails = res;
              }
            })
        this.reportService
          .portfolioDetailReport(obj)
          .pipe(
            map((res: any) => {
              let payload = {
                detailPortfolioReport: [...res],
              };
              return payload;
            })
          )
          .subscribe(
            (res: any) => {
              this.reportService.portfolioDetailData = res;
              this.reportService.clientUserId = obj.userId;
              // localStorage.setItem('client_id', obj.userId);
              console.log(this.reportService.portfolioDetailData);

              console.log(res);
              this.router.navigate(['./portfolio-valuation-detail-report']);
            },
            () => {
              this.toastr.showError(
                'Something went wrong.Please try again later.'
              );
            }
          );
      } else {
        let obj = {
          clientUserId: this.modalForm.value['investor'],
          financialInstruments: this.modalForm.value['financialInstruments'],
          date: formatDate(
            this.modalForm.value['reportDate'],
            'yyyy-MM-dd',
            'en-US'
          ),
        };

        this.reportService.getClientandRMDetails(obj.clientUserId).subscribe((res: any) => {
          if(res){
            this.reportService.clientandRMDetails = res;
          }
        })
        this.reportService.setPortfolioSummaryReportDate(obj.date);     
        this.reportService
          .portfolioSummaryReport(obj)
          .pipe(
            map((res: any) => {
              let payload = {
                investmentDetails: [
                  { title: 'Investment (₹)', value: res.totalInvestment },
                  // { title: 'Redemption (₹)', value: res.redemptionAmount },
                  { title: 'Current Value (₹)', value: res.currentValue },
                  { title: 'Profit/Loss (₹)', value: res.profitLoss },
                  { title: 'XIRR (%)', value: res.xirr },
                ],
                mutualFundDistribution: [
                  {
                    subCategory: 'Equity',
                    currentValue: res.equityAllocationAmount,
                    allocationValue: res.equityAllocationPercentage,
                  },
                  {
                    subCategory: 'Debt',
                    currentValue: res.debtAllocationAmount,
                    allocationValue: res.debtAllocationPercentage,
                  },
                  {
                    subCategory: 'Others',
                    currentValue: res.othersAllocationAmount,
                    allocationValue: res.othersAllocationPercentage,
                  },
                  {
                    subCategory: 'Total',
                    currentValue: res.currentValue,
                    allocationValue: 100,
                  },
                ],
                mutualFundEquiltyDistribution: [
                  {
                    subCategory: 'Small Cap',
                    currentValue: res.smallCapAmount,
                    allocationValue: res.smallCapPercentage,
                  },
                  {
                    subCategory: 'Mid Cap',
                    currentValue: res.midCapAmount,
                    allocationValue: res.midCapPercentage,
                  },
                  {
                    subCategory: 'Large Cap',
                    currentValue: res.largeCapAmount,
                    allocationValue: res.largeCapPercentage,
                  },
                  {
                    subCategory: 'Other Cap',
                    currentValue: res.otherCapAmount,
                    allocationValue: res.otherCapPercentage,
                  },
                  {
                    subCategory: 'Total',
                    currentValue: res.mcapAmountTotal,
                    allocationValue: 100,
                  },
                ],

                allocationByFundResult: [
                  ...res.allocationByFundResult,
                  ...[
                    {
                      allocationPercentage: '100',
                      currentValue: res.allocationByFundCurrentValueTotal,
                      fundName: 'Total',
                      purchaseValue: res.allocationByFundPurchaseValueTotal,
                    },
                  ],
                ],

                topTenEquityFundsResult: [
                  ...res.topTenEquityFundsResult,
                  ...[
                    {
                      allocationPercentage: '100',
                      currentValue: res.topTenEquityFundsCurrentValueTotal,
                      fundName: 'Total',
                    },
                  ],
                ],

                topTenDebtFundsResult: [
                  ...res.topTenDebtFundsResult,
                  ...[
                    {
                      allocationPercentage: '100',
                      currentValue: res.topTenDebtFundsCurrentValueTotal,
                      fundName: 'Total',
                    },
                  ],
                ],

                assetDistribution: {
                  equityAllocationAmount: res.equityAllocationAmount,
                  equityAllocationPercentage: res.equityAllocationPercentage,
                  debtAllocationAmount: res.debtAllocationAmount,
                  debtAllocationPercentage: res.debtAllocationPercentage,
                  othersAllocationAmount: res.othersAllocationAmount,
                  othersAllocationPercentage: res.othersAllocationPercentage,
                },
              };

              return payload;
            })
          )
          .subscribe(
            (res: any) => {
              this.reportService.portfolioSummaryData = res;
              this.reportService.clientUserId = obj.clientUserId;
              // localStorage.setItem('client_id', obj.clientUserId);
              this.router.navigate(['./portfolio-valuation-summary-report']);
            },
            () => {
              this.toastr.showError(
                'Something went wrong.Please try again later.'
              );
            }
          );
      }
    }
  }
}
