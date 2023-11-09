import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMandateSipModalComponent } from './create-mandate-sip-modal.component';

describe('CreateMandateSipModalComponent', () => {
  let component: CreateMandateSipModalComponent;
  let fixture: ComponentFixture<CreateMandateSipModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMandateSipModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMandateSipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
