import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRemarksModalComponentComponent } from './request-remarks-modal-component.component';

describe('RequestRemarksModalComponentComponent', () => {
  let component: RequestRemarksModalComponentComponent;
  let fixture: ComponentFixture<RequestRemarksModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestRemarksModalComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestRemarksModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
