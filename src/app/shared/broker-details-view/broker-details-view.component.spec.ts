import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerDetailsViewComponent } from './broker-details-view.component';

describe('BrokerDetailsViewComponent', () => {
  let component: BrokerDetailsViewComponent;
  let fixture: ComponentFixture<BrokerDetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerDetailsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
