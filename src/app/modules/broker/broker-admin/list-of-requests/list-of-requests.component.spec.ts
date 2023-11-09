import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfRequestsComponent } from './list-of-requests.component';

describe('ListOfRequestsComponent', () => {
  let component: ListOfRequestsComponent;
  let fixture: ComponentFixture<ListOfRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
