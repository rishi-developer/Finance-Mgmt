import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrokerModalComponent } from './add-broker-modal.component';

describe('AddBrokerModalComponent', () => {
  let component: AddBrokerModalComponent;
  let fixture: ComponentFixture<AddBrokerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBrokerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBrokerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
