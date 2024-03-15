import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddEmployeeComponent } from './dialog-add-employee.component';

describe('DialogAddEmployeeComponent', () => {
  let component: DialogAddEmployeeComponent;
  let fixture: ComponentFixture<DialogAddEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAddEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
