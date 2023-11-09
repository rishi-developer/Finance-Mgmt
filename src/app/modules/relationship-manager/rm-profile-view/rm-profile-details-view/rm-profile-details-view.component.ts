import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RelationshipManagerService } from '../../service/relationship-manager.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
@Component({
  selector: 'app-rm-profile-details-view',
  templateUrl: './rm-profile-details-view.component.html',
  styleUrls: ['./rm-profile-details-view.component.css']
})
export class RmProfileDetailsViewComponent implements OnInit {
  @Output() dataUpdateEvent = new EventEmitter();
  details: any;
  modalForm: FormGroup;
  edit: boolean = false;
  rmUserId : any;
  BrokerAdminBoolean : boolean = false
  startsWithZero: boolean = false;
  BrokerAdminUserId:string='';
  subscriptionName: Subscription;
  hasRmFunctionality:boolean=false;
  constructor(private relationshipMangerModuleService: RelationshipManagerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrShowService,
    private route:ActivatedRoute,
    private authUserService:AuthUserService,)
    {
      this.modalForm = this.formBuilder.group({});
      this.subscriptionName = this.relationshipMangerModuleService.getRmProfileUpdate().subscribe((res) => {
        this.details=res.rmProfile;
      });
    }

  ngOnInit(): void {
    
    this.authUserService.getUserDetailBehaviorSubject().subscribe(data => {
      if (data)
        this.BrokerAdminUserId = data.userId;
        if(data.newRoleFinal.roleDescription == "BROKER ADMIN"){
          this.BrokerAdminBoolean = true
        }    
    }
    );
    this.route.paramMap.subscribe((params:any)=>{
      this.rmUserId=params.get?.('rmUserId');
   });
    this.details = this.relationshipMangerModuleService.getRMprofileData();
    this.modalForm = this.formBuilder.group({
    virtualRMId: [this.details.virtualRMId, Validators.required],
    firstName: [this.details.firstName, Validators.required],
    middleName: [this.details.middleName],
    lastName: [this.details.lastName],
    euin: [this.details.euin, [Validators.required,Validators.pattern('[E]+[0-9]{6}')]],
    panNo: [this.details.panNo, Validators.required],
    phone: [this.details.phone, [Validators.minLength(10), Validators.maxLength(12), Validators.required, Validators.pattern(/^[0-9]*$/)]],
    email: [
      {value: this.details.email, disabled:(this.details.email!=null)},
      [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
        Validators.pattern(/^\S+@\S+\.\S+$/),
        Validators.pattern('[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}') 
      ],
    ],
    });
    if(this.details.hasRmFunctionality !== '')
      this.hasRmFunctionality = true;
  }

  validatePhoneNumber(number: any) {
    if (number.target.value[0].toString() === '0') {
      this.startsWithZero = true;
      this.modalForm.controls['phone'].setErrors({ 'phone': true })
    } else {
      this.startsWithZero = false;
    }
  }

  editRMDetails() {
    this.edit = true
  }

  backToRMDetails() {
    this.edit = false
  }

  submit() {
    if (this.modalForm.invalid) {
      return
    }
    if (this.details.email == this.modalForm.value.email && this.details.euin == this.modalForm.value.euin && this.details.firstName == this.modalForm.value.firstName && this.details.lastName == this.modalForm.value.lastName && this.details.middleName == this.modalForm.value.middleName && this.details.panNo == this.modalForm.value.panNo && this.details.phone == this.modalForm.value.phone && this.details.virtualRMId == this.modalForm.value.virtualRMId) {
      window.scrollTo(0, 0);
      this.toastr.showError("No details modified")
    }
    else {
      this.relationshipMangerModuleService.editRmDetails(this.BrokerAdminUserId, this.rmUserId, this.modalForm.getRawValue()).subscribe(res => {
        if (res.message == "Profile updated") {
          window.scrollTo(0, 0);
          this.toastr.showSuccess("RM details updated Successfully");
          this.dataUpdateEvent.emit();
          this.edit = false;
        }
      }, err => {
        this.toastr.showError("Error in loading data");
      })
    }
  }
}
