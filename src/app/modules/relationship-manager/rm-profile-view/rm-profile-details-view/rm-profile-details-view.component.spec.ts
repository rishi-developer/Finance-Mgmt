import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmProfileDetailsViewComponent } from './rm-profile-details-view.component';

describe('RmProfileDetailsViewComponent', () => {
  let component: RmProfileDetailsViewComponent;
  let fixture: ComponentFixture<RmProfileDetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmProfileDetailsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmProfileDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
