import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UccActivationConfirmationModalComponent } from './ucc-activation-confirmation-modal.component';

describe('UccActivationConfirmationModalComponent', () => {
  let component: UccActivationConfirmationModalComponent;
  let fixture: ComponentFixture<UccActivationConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UccActivationConfirmationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UccActivationConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
