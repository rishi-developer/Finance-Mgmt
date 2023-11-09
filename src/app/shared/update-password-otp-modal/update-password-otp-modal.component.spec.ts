import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePasswordOtpModalComponent } from './update-password-otp-modal.component';

describe('UpdatePasswordOtpModalComponent', () => {
  let component: UpdatePasswordOtpModalComponent;
  let fixture: ComponentFixture<UpdatePasswordOtpModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePasswordOtpModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePasswordOtpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
