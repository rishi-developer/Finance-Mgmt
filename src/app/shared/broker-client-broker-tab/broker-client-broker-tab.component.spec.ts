import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerClientBrokerTabComponent } from './broker-client-broker-tab.component';

describe('BrokerClientBrokerTabComponent', () => {
  let component: BrokerClientBrokerTabComponent;
  let fixture: ComponentFixture<BrokerClientBrokerTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerClientBrokerTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerClientBrokerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
