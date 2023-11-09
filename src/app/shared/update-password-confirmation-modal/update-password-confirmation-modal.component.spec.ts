import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePasswordConfirmationModalComponent } from './update-password-confirmation-modal.component';

describe('UpdatePasswordConfirmationModalComponent', () => {
  let component: UpdatePasswordConfirmationModalComponent;
  let fixture: ComponentFixture<UpdatePasswordConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePasswordConfirmationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePasswordConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
