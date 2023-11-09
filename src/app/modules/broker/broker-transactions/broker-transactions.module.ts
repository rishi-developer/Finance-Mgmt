import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerFreshTransactionComponent } from './broker-fresh-transaction/broker-fresh-transaction.component';
import { BrokerAdditionalTransactionComponent } from './broker-additional-transaction/broker-additional-transaction.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrokerFreshTransactionStpSwpComponent } from './broker-fresh-transaction-stp-swp/broker-fresh-transaction-stp-swp.component';
import { FundListModalComponent } from './fund-list-modal/fund-list-modal.component';
import { MandateSipTableComponent } from './mandate-sip/mandate-sip-table/mandate-sip-table.component';
import { CreateMandateSipModalComponent } from './mandate-sip/create-mandate-sip-modal/create-mandate-sip-modal.component';


@NgModule({
  declarations: [
    BrokerFreshTransactionComponent,
    BrokerAdditionalTransactionComponent,
    BrokerFreshTransactionStpSwpComponent,
    FundListModalComponent,
    MandateSipTableComponent,
    CreateMandateSipModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class BrokerTransactionsModule { }
