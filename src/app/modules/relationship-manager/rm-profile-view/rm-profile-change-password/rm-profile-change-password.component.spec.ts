import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmProfileChangePasswordComponent } from './rm-profile-change-password.component';

describe('RmProfileChangePasswordComponent', () => {
  let component: RmProfileChangePasswordComponent;
  let fixture: ComponentFixture<RmProfileChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmProfileChangePasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmProfileChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
