import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrShowService } from 'src/app/common-services/toastr-service/toastr.service';
import { AuthUserService } from 'src/app/common-services/auth-user-service/auth-user.service';
import { BrokerModuleService } from 'src/app/modules/broker/service/broker-module.service';
import { RoleId } from 'src/app/_helper/role';
import { Subscription } from 'rxjs';
import {
  ActionButton,
  BrokerAdminRmClient,
  RMData,
} from 'src/app/models/broker-admin';

@Component({
  selector: 'app-invite-rm-modal',
  templateUrl: './invite-rm-modal.component.html',
  styleUrls: ['./invite-rm-modal.component.css'],
})
export class InviteRMModalComponent implements OnInit {
  modalForm: FormGroup;
  startsWithZero: boolean = false;
  userId: string = '';
  organizationId!: Number;
  organizationName: string = '';
  modalData!: ActionButton;
  clientName: string = '';
  rmName: string = '';
  existingRmDetails!: RMData;
  showExistingRm: boolean = false;
  filteredArray: BrokerAdminRmClient[] = [];
  hasRMboolean: boolean = false;
  role!: number;
  userDetailSubscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<InviteRMModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private authUserService: AuthUserService,
    private toastr: ToastrShowService,
    private brokerModuleService: BrokerModuleService
  ) {
    this.modalForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.userDetailSubscription = this.authUserService
      .getUserDetailBehaviorSubject()
      .subscribe((data) => {
        if (data) {
          this.userId = data.userId;
          this.organizationId = data.organizationId;
          this.organizationName = data.organizationName;
        }
      });

    this.getModalData();
    if (this.modalData.actionButton === 'Send Email Invitation') {
      this.hasRMboolean = false;
      this.role = RoleId.RelationshipManager;
    } else {
      this.hasRMboolean = true;
      this.role = RoleId.BrokerAdmin;
    }

    if (
      this.modalData.actionButton === 'Send Email Invitation' ||
      this.modalData.actionButton === 'Send Email Invitation Broker Admin'
    ) {
      this.modalForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        middleName: [''],
        lastName: [''],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.minLength(5),
            Validators.pattern(/^\S+@\S+\.\S+$/),
            Validators.pattern('[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}'),
          ],
        ],
        phoneNo: [
          '',
          [
            Validators.minLength(10),
            Validators.maxLength(12),
            Validators.required,
            Validators.pattern(/^[0-9]*$/),
          ],
        ],
        hasRMFunctionality: [this.hasRMboolean],
        onboardedBy: [this.userId],
        virtualRMId: ['', Validators.required],
        organizationId: [this.organizationId],
        organizationName: [this.organizationName],
        role: [this.role],
        euin: ['', [Validators.required, Validators.pattern('[E]+[0-9]{6}')]],
      });

      if (
        this.modalData.actionButton === 'Send Email Invitation Broker Admin'
      ) {
        this.modalForm.controls['euin'].clearValidators();
        this.modalForm.controls['euin'].updateValueAndValidity();
        this.modalForm.controls['virtualRMId'].clearValidators();
        this.modalForm.controls['virtualRMId'].updateValueAndValidity();
      }
    } else if (
      this.modalData.actionButton === 'Assign RM' ||
      this.modalData.actionButton === 'Reassign RM'
    ) {
      this.modalForm = this.formBuilder.group({
        clientUserId: [this.modalData.clientUserId],
        oldMappingUserId: [this.modalData.assignedRmUserId],
        newMappingUserId: ['', Validators.required],
        brokerAdminUserId: [this.userId],
        emailToClient: [false],
      });
    } else if (
      this.modalData.actionButton === 'Assign Client' ||
      this.modalData.actionButton === 'Reassign Client'
    ) {
      this.modalForm = this.formBuilder.group({
        clientUserId: ['', Validators.required],
        oldMappingUserId: [''],
        newMappingUserId: [this.modalData.rmUserId],
        brokerAdminUserId: [this.userId],
        emailToClient: [false],
      });
    }

    if (
      this.modalData.actionButton === 'Assign RM' ||
      this.modalData.actionButton === 'Reassign RM'
    ) {
      this.getBrokerAdminRmList();
    } else if (
      this.modalData.actionButton === 'Assign Client' ||
      this.modalData.actionButton === 'Reassign Client'
    ) {
      this.getBrokerAdminClientList();
    }
  }

  /**
   * Validates the phone number and checks if it starts with zero.
   * @param number - Phone number input.
   */
  validatePhoneNumber(number: KeyboardEvent) {
    if ((number.target as HTMLInputElement).value[0].toString() === '0') {
      this.startsWithZero = true;
      this.modalForm.controls['phoneNo'].setErrors({ phoneNo: true });
    } else {
      this.startsWithZero = false;
    }
  }

  /**
   * Retrieves the list of broker admin Rm's.
   */
  getBrokerAdminRmList() {
    this.brokerModuleService.getAssignReassignRm(this.organizationId).subscribe(
      (data) => {
        if (data) {
          let brokerAdminRmList = [...data];
          let rmUserId: string[] = [this.modalData.assignedRmUserId ?? ''];
          rmUserId.forEach((rmUserIdItem) => {
            brokerAdminRmList = brokerAdminRmList.filter(
              (data) => data.memberUserId !== rmUserIdItem
            );
          });
          this.filteredArray.push(...brokerAdminRmList);
        }
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  /**
   * Retrieves the list of broker admin clients.
   */
  getBrokerAdminClientList() {
    this.brokerModuleService.getBrokerAdminClientList(this.userId).subscribe(
      (data) => {
        if (data) {
          const brokerAdminClientList = [...data];
          const rmUserId: string[] = [this.modalData.rmUserId ?? ''];
          const filteredArray = brokerAdminClientList.filter(
            (item) => !rmUserId.includes(item.assignedRMUserId)
          );
          this.filteredArray.push(...filteredArray);
        }
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  /**
   * Retrieves client RM information.
   * @param clientUserId - The client's user ID.
   */
  getClientRmInfo(clientUserId: string) {
    this.showExistingRm = true;
    this.brokerModuleService.getClientRmInfo(clientUserId).subscribe(
      (data) => {
        if (data) {
          this.existingRmDetails = data;
          if (this.existingRmDetails.rmUserId != null) {
            this.modalForm.value.oldMappingUserId =
              this.existingRmDetails.rmUserId;
          } else {
            this.modalForm.value.oldMappingUserId = '';
          }
        }
      },
      (err) => {
        this.toastr.showError('Error in loading data');
      }
    );
  }

  /**
   * Retrieves modal data and sets clientName and rmName.
   */
  getModalData() {
    this.modalData = this.data.modalData;
    if (
      this.modalData.actionButton === 'Assign RM' ||
      this.modalData.actionButton === 'Reassign RM'
    ) {
      this.clientName = `${this.modalData.clientFirstName ?? ''}${
        this.modalData.clientMiddleName ?? ''
      }${this.modalData.clientLastName ?? ''}`;
    } else if (
      this.modalData.actionButton === 'Assign Client' ||
      this.modalData.actionButton === 'Reassign Client'
    ) {
      this.rmName = `${this.modalData.rmFirstName ?? ''}${
        this.modalData.rmMiddleName ?? ''
      }${this.modalData.rmLastName ?? ''}`;
    }
  }

  /**
   * Closes the modal dialog.
   */
  onClose() {
    this.dialogRef.close();
  }

  /**
   * Submits the modal form if it's valid.
   */
  onSubmit() {
    if (this.modalForm.invalid) return;

    this.dialogRef.close({
      resultForm: this.modalForm.value,
      flag: this.modalData.actionButton,
    });
  }

  /**
   * Unsubscribes from subscriptions.
   */
  ngOnDestroy(): void {
    this.userDetailSubscription.unsubscribe();
  }
}
