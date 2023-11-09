import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadIPDMpdalComponent } from './upload-ipd-mpdal.component';

describe('UploadIPDMpdalComponent', () => {
  let component: UploadIPDMpdalComponent;
  let fixture: ComponentFixture<UploadIPDMpdalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadIPDMpdalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadIPDMpdalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
