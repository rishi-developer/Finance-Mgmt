import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedModuleService } from 'src/app/common-services/shared-module-service/shared-module.service';
import { ClientService } from '../service/client.service';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { stateList } from '../client-onboarding/client-onboarding.model';
import { takeUntil } from 'rxjs/operators';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
@Component({
  selector: 'app-client-edit-details',
  templateUrl: './client-edit-details.component.html',
  styleUrls: ['./client-edit-details.component.css']
})
export class ClientEditDetailsComponent implements OnInit {
  mainHeadingValue: string = ' Update Client Details';
  modalForm: FormGroup;
  clientId: any;
  data: any;
  CSVId: any;
  uccCreationFlag: string | undefined;
  mobileDeclarationList: any = [];
  occupationCodeList: any = [];
  clientCodeFlag: boolean = false;
  data1: any;
  clientOnboardedFrom:string='';
  fatcaDetails:any;
  editDetailsObj:any;
  buttonHoverText!:string

  constructor(private sharedModuleService: SharedModuleService,
    private route: ActivatedRoute,
    private toastr: ToastrShowService,
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private router: Router,

  ) {
    this.modalForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.sharedModuleService.setNavbarHeading(this.mainHeadingValue);
    this.route.paramMap.subscribe((params: any) => {
      this.clientId = params.get?.('id');
    });
    this.getclientDetails();
    this.getMobileDeclarationList();
    this.getOccupationCodeList();
  }


  fetchData(res: any) {
    this.modalForm = this.formBuilder.group({
      mobile: [res.clientDataCSV.indianMobileNo, Validators.required],
      filler1MobileDeclarationFlag: [res.clientDataCSV.mobileDeclarationFlag, Validators.required],
      filler2EmailDeclarationFlag: [res.clientDataCSV.emailDeclarationFlag, Validators.required],
      occupationCode: [res.clientDataCSV.occupationCode, Validators.required],
      clientCode: [{ value: res.clientDataCSV.clientCode, disabled: this.clientCodeFlag }],
      // clientCode : [res.clientCode],
      address1: [res.clientDataCSV.address1, Validators.required],
      address2: [res.clientDataCSV.address2, Validators.required],
      address3: [res.clientDataCSV.address3, Validators.required],
      pincode: [res.clientDataCSV.pincode, Validators.required],
      city: [res.clientDataCSV.city, Validators.required]
    });
  }

  getclientDetails() {
    this.sharedModuleService.getClientPersonalOtherDetails(this.clientId).subscribe((res: any) => {
      if (res) {
        this.data = res.clientDataCSV;
        this.clientOnboardedFrom=this.data.clientOnboardedFrom;
        if(this.clientOnboardedFrom=='gemfinWithoutUCC'){
          this.getFatcaDetails();
          if(this.data.clientCode!=null){
            this.buttonHoverText='Update on both Gemfin and BSE';
          }
          else{
            this.buttonHoverText='Update on Gemfin';
          }
        }
        else if(this.clientOnboardedFrom=='gemfinWithUCC'){
          this.buttonHoverText='Update on both Gemfin and BSE';
        }
        this.data1 = Object.assign({}, res);     
        if (res.clientCode != null) {
          this.clientCodeFlag = true;
        }
        else {
          this.clientCodeFlag = false;
        }
        this.fetchData(res);
      }
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }

  getFatcaDetails(){
    this.sharedModuleService.getFatcaDetails(this.clientId).subscribe(res => {
      if(res){
        this.fatcaDetails=res[0];
      }
    }, err => {
      this.toastr.showError("Error in loading data"); 
    });
  }

  getMobileDeclarationList() {
    this.clientService.getMobileDeclarationList().subscribe(res => {
      if (res)
        this.mobileDeclarationList = res;
    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }

  getOccupationCodeList() {
    this.clientService.getOccupationCodeList().subscribe(data => {
      if (data)
        this.occupationCodeList = data;

    }, err => {
      this.toastr.showError("Error in loading data");
    });
  }

  onClientCodeChange(clientCode:string){
    if(clientCode!=null){
      if(clientCode==""){
        this.buttonHoverText='Update on Gemfin';
        this.modalForm.value.clientCode=null;
      }
      else {
        this.buttonHoverText='Update on both Gemfin and BSE';
      }   
    }
  }

  submit() {
    if (this.modalForm.invalid) {
      return
    }

    this.data.indianMobileNo = this.modalForm.value.mobile
    this.data.mobileDeclarationFlag = this.modalForm.value.filler1MobileDeclarationFlag
    this.data.emailDeclarationFlag = this.modalForm.value.filler2EmailDeclarationFlag
    this.data.occupationCode = this.modalForm.value.occupationCode
    this.data.address1 = this.modalForm.value.address1
    this.data.address2 = this.modalForm.value.address2
    this.data.address3 = this.modalForm.value.address3
    this.data.pincode = this.modalForm.value.pincode
    this.data.clientCode = this.modalForm.controls.clientCode.value
    this.data.city = this.modalForm.value.city
    this.CSVId = this.data.clientDataCSVId.toString()
    delete this.data.clientDataCSVId;
    delete this.data.memberCode

    if (this.data.clientCode == null) {
      this.uccCreationFlag = "false"
    }
    else {
      this.uccCreationFlag = "true"
    }
    if(this.clientOnboardedFrom=='gemfinWithoutUCC'){
      this.editDetailsObj= {
      'uccRegistrationParams': this.data,
      'clientUserId': this.clientId,
      'clientDataCSVId': this.CSVId,
      'uccCreation': this.uccCreationFlag,
      'fatcaDetails':this.fatcaDetails
      }
    }
    else {
      this.editDetailsObj= {
        'uccRegistrationParams': this.data,
        'clientUserId': this.clientId,
        'clientDataCSVId': this.CSVId,
        'uccCreation': this.uccCreationFlag,
        }
    }

    // this.clientService.updateClientDetails(this.editDetailsObj).subscribe((res: any) => {
    //   if (res) {
    //     if (this.uccCreationFlag == "true") {
    //       let message = JSON.parse(res.message);
    //       let statusCode = message.Status;
    //       let remarks = message.Remarks;
    //       if (statusCode == "1") {
    //         window.scrollTo(0, 0);
    //         this.toastr.showError(remarks);
    //       }
    //       else {
    //         this.toastr.showSuccess('Clients details Updated Successfully');
    //         this.router.navigate(['broker-client-portfolio', this.clientId])
    //       }
    //     }
    //     else {
    //       this.toastr.showSuccess('Clients details Updated Successfully');
    //       this.router.navigate(['broker-client-portfolio', this.clientId])
    //     }
    //   }
    // }, err => {
    //   this.toastr.showError("Error in updating client details");
    // });
  }

}
