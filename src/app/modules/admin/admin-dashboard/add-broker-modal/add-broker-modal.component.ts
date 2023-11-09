import { ConfirmationModalComponent } from './../../../../shared/confirmation-modal/confirmation-modal.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef ,MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ResponsiveService } from 'src/app/common-services/responsive-service/responsive.service';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { add_broker_table } from './add-broker-modal.model';

@Component({
  selector: 'app-add-broker-modal',
  templateUrl: './add-broker-modal.component.html',
  styleUrls: ['./add-broker-modal.component.css']
})
export class AddBrokerModalComponent implements OnInit {
  email:any;
  numSelected:number=0;
  numRows:any;
  selectedBroker:any;
  selectedBrokerId:any=[];
  mobile: boolean = false;
  BrokerNotSelectedBoolean:boolean=false;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['selectCheckbox','brokerId', 'brokerName', 'emailId', 'contactNumber'];
  selection = new SelectionModel<add_broker_table>(true, []);
  dataSource = new MatTableDataSource<add_broker_table>([]);
  constructor(private _adminDashboard: AdminDashboardService,
    public dialogRef: MatDialogRef<AddBrokerModalComponent>,
    private _responsiveService: ResponsiveService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.onResize();
    this._responsiveService.checkWidth();
    this.getAddBrokerList();
  }
  sendInvite(){
    if(this.selection?.selected?.length!=0){
    this._adminDashboard.sendEmailInvite(this.selectedBrokerId).subscribe(data => {
      if(data){
      const dialogRef = this.dialog.open(ConfirmationModalComponent, {
        width: '600px',
        data: {headingValue: 'Email Sent!',textValue:'Invitation link has been sent.', buttonValue: 'Done',modalType:'Invite Broker Modal'},
      });
      this.onClose1();
      }
    });

  }
  else{
    this.BrokerNotSelectedBoolean=true;
  }
  }
  onClose1() {
    this.dialogRef.close();
  }
  getAddBrokerList(){
    this._adminDashboard.getAddBrokerList().subscribe(data => {
      if(data){
      this.dataSource = new MatTableDataSource<add_broker_table>(data);
      this.dataSource.sort = this.sort;
      }
    });
  }
  isAllSelected() {
    this.numSelected = this.selection.selected.length;
    this.selectedBroker = this.selection.selected;
    this.selectedBrokerId = [];
    for (const element of this.selectedBroker) {
      this.selectedBrokerId.push(element.brokerId);
    }
    this.numRows = this.dataSource.data.length;
    return this.numSelected === this.numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  onResize() {
    this._responsiveService.getMobileStatus().subscribe((isMobile: boolean) => {
      this.mobile = isMobile;
    });
  }
  sortData(sort: MatSort) {
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLocaleLowerCase();
      }
      return data[sortHeaderId];
    }
  }
}
