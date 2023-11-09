import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoryClientListComponent } from './advisory-client-list.component';

describe('AdvisoryClientListComponent', () => {
  let component: AdvisoryClientListComponent;
  let fixture: ComponentFixture<AdvisoryClientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisoryClientListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisoryClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
