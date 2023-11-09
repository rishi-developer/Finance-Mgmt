import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerClientListComponent } from './broker-client-list.component';

describe('BrokerClientListComponent', () => {
  let component: BrokerClientListComponent;
  let fixture: ComponentFixture<BrokerClientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerClientListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
