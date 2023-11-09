import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCommunicationDetailsComponent } from './client-communication-details.component';

describe('ClientCommunicationDetailsComponent', () => {
  let component: ClientCommunicationDetailsComponent;
  let fixture: ComponentFixture<ClientCommunicationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientCommunicationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCommunicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
