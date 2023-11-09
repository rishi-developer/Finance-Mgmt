import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BseCredentialConfirmationModalComponent } from './bse-credential-confirmation-modal.component';

describe('BseCredentialConfirmationModalComponent', () => {
  let component: BseCredentialConfirmationModalComponent;
  let fixture: ComponentFixture<BseCredentialConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BseCredentialConfirmationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BseCredentialConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
