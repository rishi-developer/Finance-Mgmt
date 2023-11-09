import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteRMModalComponent } from './invite-rm-modal.component';

describe('InviteRMModalComponent', () => {
  let component: InviteRMModalComponent;
  let fixture: ComponentFixture<InviteRMModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteRMModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteRMModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
