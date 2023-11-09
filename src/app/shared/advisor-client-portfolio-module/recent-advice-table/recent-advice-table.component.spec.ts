import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentAdviceTableComponent } from './recent-advice-table.component';

describe('RecentAdviceTableComponent', () => {
  let component: RecentAdviceTableComponent;
  let fixture: ComponentFixture<RecentAdviceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentAdviceTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentAdviceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
