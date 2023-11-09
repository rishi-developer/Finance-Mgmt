import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioProfileTabComponent } from './portfolio-profile-tab.component';

describe('PortfolioProfileTabComponent', () => {
  let component: PortfolioProfileTabComponent;
  let fixture: ComponentFixture<PortfolioProfileTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioProfileTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioProfileTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
