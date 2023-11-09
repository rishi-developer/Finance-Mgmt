import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfClientTabComponent } from './list-of-client-tab.component';

describe('ListOfClientTabComponent', () => {
  let component: ListOfClientTabComponent;
  let fixture: ComponentFixture<ListOfClientTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfClientTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfClientTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
