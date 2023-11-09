import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditDetailsComponent } from './client-edit-details.component';

describe('ClientEditDetailsComponent', () => {
  let component: ClientEditDetailsComponent;
  let fixture: ComponentFixture<ClientEditDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientEditDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
