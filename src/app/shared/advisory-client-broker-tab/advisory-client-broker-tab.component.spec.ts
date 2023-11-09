import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoryClientBrokerTabComponent } from './advisory-client-broker-tab.component';

describe('AdvisoryClientBrokerTabComponent', () => {
  let component: AdvisoryClientBrokerTabComponent;
  let fixture: ComponentFixture<AdvisoryClientBrokerTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisoryClientBrokerTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisoryClientBrokerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
