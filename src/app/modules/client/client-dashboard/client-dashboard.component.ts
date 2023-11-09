import { Component, OnInit } from '@angular/core';
import { BrokerModuleService } from '../../broker/service/broker-module.service';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { USERROLES } from 'src/app/shared/common-enums/enum';
// import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css'],
})
export class ClientDashboardComponent implements OnInit {
  clientId!: string;
  userRole!: string;
  userId!: string;
  // dataValue:any;
  constructor(
    private brokerModuleService: BrokerModuleService,
    private toastr: ToastrShowService,
    private route: ActivatedRoute,
    private authUserService: AuthUserService,
    private sharedModuleService: SharedModuleService
  ) {}

  ngOnInit(): void {
    this.authUserService.getUserDetailBehaviorSubject().subscribe((data) => {
      if (data) this.userId = data.userId;
      this.userRole = data.newRoleFinal.roleDescription;
    });

    if (this.userRole === USERROLES.CLIENT) {
      this.clientId = this.userId;
    }

    this.getClientData();
  }

  /**
   * Fetches the client personal details and sets the client email in the service file
   */
  async getClientData() {
    try {
      const data = await this.sharedModuleService
        .getClientPersonalOtherDetails(this.clientId)
        .toPromise();
      // const data$ =  this.sharedModuleService.getClientPersonalOtherDetails(this.clientId)
      // this.dataValue = await lastValueFrom(data$)
      if (data)
        this.sharedModuleService.clientEmail = data.clientDataCSV?.email;
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  }
}
