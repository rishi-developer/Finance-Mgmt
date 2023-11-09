import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetCreatePasswordComponent } from './forget-create-password.component';

describe('ForgetCreatePasswordComponent', () => {
  let component: ForgetCreatePasswordComponent;
  let fixture: ComponentFixture<ForgetCreatePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgetCreatePasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetCreatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
