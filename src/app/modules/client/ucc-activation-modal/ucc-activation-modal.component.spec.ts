import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UccActivationModalComponent } from './ucc-activation-modal.component';

describe('UccActivationModalComponent', () => {
  let component: UccActivationModalComponent;
  let fixture: ComponentFixture<UccActivationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UccActivationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UccActivationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
