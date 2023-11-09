import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfBrokersTabComponent } from './list-of-brokers-tab.component';

describe('ListOfBrokersTabComponent', () => {
  let component: ListOfBrokersTabComponent;
  let fixture: ComponentFixture<ListOfBrokersTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfBrokersTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfBrokersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
