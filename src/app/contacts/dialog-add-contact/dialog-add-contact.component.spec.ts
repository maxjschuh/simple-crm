import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddContactComponent } from './dialog-add-contact.component';

describe('DialogAddUserComponent', () => {
  let component: DialogAddContactComponent;
  let fixture: ComponentFixture<DialogAddContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAddContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
