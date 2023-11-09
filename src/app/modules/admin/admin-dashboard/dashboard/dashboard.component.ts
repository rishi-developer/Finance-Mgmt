import { Component, OnInit } from '@angular/core';
import { AddBrokerModalComponent } from '../add-broker-modal/add-broker-modal.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  roleType:string="admin";
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openAddBrokerModal(){
    const dialogRef = this.dialog.open(AddBrokerModalComponent, {
      width: '800px',
    });
  }

}
