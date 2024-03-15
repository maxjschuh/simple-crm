import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditContactComponent } from './dialog-edit-contact.component';

describe('DialogEditUserComponent', () => {
  let component: DialogEditContactComponent;
  let fixture: ComponentFixture<DialogEditContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEditContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
