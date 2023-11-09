import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportsModuleService } from './service/reports-module.service';
import { Subscription } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit, OnDestroy {
  reportTypes = ['Summary', 'Detailed'];
  reportType = 'Summary';
  selectedCardIndex = 0;
  subscription!: Subscription;
  reportsName = [
    {
      imgName: 'assets/images/portfolio-valuation.svg',
      title: 'Portfolio Valuation',
      url: '/reports/portfolio-valuation-report',
    },
    {
      imgName: 'assets/images/capital-gain-realized.svg',
      title: 'Capital Gain Realized',
      url: '/reports/capital-gain-realized-report',
    },
    {
      imgName: 'assets/images/transactions.svg',
      title: 'Transaction',
      url: '/reports/transactions',
    },
  ];
  reportsTitle = this.reportsName[0].title;
  role = '';
  constructor(
    private router: Router,
    private reportService: ReportsModuleService,
    private route: ActivatedRoute,
    private authUserService: AuthUserService
  ) {
    this.reportService.getUserDetails();
  }

  ngOnInit(): void {
    //! need to get directly from service
    this.authUserService.getUserDetailBehaviorSubject().subscribe((data : any) => {
      if (data)
        this.role = data.newRoleFinal.roleDescription;
    });

    this.setReportInitialData(this.reportsTitle, this.reportType);
    this.subscription = this.route.queryParams.subscribe((res) => {
      if (res?.reportType) {
        let path = this.reportsName.findIndex((val) =>
          val.url.includes(res.reportType)
        );
        if (path >= 0) {
          this.setSelectedReport(path);
          this.reportSelected(this.reportsName[path].title);
        }
      }
    });
  }

  /**
   * Created to set the index of selected report
   * @param index Selected Report Index
   */
  setSelectedReport(index: number) {
    this.selectedCardIndex = index;
  }

  /**
   * Use to get the selected reports
   * @param title having report name
   */
  reportSelected(title: string) {
    if (title) {
      this.reportsTitle = title;
      if (title === this.reportsName[0].title) {
        this.router.navigate([`.${this.reportsName[0].url}`], {
          queryParams: { reportType: 'portfolio' },
        });
      } else if (title === this.reportsName[1].title) {
        this.router.navigate([`.${this.reportsName[1].url}`], {
          queryParams: { reportType: 'capital' },
        });
      } else {
        this.reportType = this.reportTypes[0];
        this.router.navigate([`.${this.reportsName[2].url}`], {
          queryParams: { reportType: 'transaction' },
        });
      }
    }
  }

  /**
   * Setting the selected value of report Type  i.e. Summary/Detailed
   */
  setReportInitialData(title: string, type: string) {
    this.reportService.reportData.name = title;
    this.reportService.reportData.type = type;
  }

  /**
   * On change of report type in reports i.e. Summary/Detailed
   */
  reportTypeValue() {
    this.setReportInitialData(this.reportsTitle, this.reportType);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  backRoute() {
    if(this.role=='BROKER ADMIN'){
      this.router.navigate(['broker']);
    }
    else{
      this.router.navigate(['relationshipManager']);
    }
  }
}
