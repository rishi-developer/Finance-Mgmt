import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BseCredentialModalComponent } from './bse-credential-modal.component';

describe('BseCredentialModalComponent', () => {
  let component: BseCredentialModalComponent;
  let fixture: ComponentFixture<BseCredentialModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BseCredentialModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BseCredentialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
