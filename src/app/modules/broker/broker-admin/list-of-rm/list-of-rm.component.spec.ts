import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfRMComponent } from './list-of-rm.component';

describe('ListOfRMComponent', () => {
  let component: ListOfRMComponent;
  let fixture: ComponentFixture<ListOfRMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfRMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfRMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
