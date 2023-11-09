import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewBrokerComponent } from './add-new-broker.component';

describe('AddNewBrokerComponent', () => {
  let component: AddNewBrokerComponent;
  let fixture: ComponentFixture<AddNewBrokerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewBrokerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewBrokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
