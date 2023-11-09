import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateSipTableComponent } from './mandate-sip-table.component';

describe('MandateSipTableComponent', () => {
  let component: MandateSipTableComponent;
  let fixture: ComponentFixture<MandateSipTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MandateSipTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateSipTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
