import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpCreatePasswordComponent } from './sign-up-create-password.component';

describe('SignUpCreatePasswordComponent', () => {
  let component: SignUpCreatePasswordComponent;
  let fixture: ComponentFixture<SignUpCreatePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpCreatePasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpCreatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
