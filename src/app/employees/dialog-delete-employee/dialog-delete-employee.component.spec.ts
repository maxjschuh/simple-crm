import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteEmployeeComponent } from './dialog-delete-employee.component';

describe('DialogDeleteEmployeeComponent', () => {
  let component: DialogDeleteEmployeeComponent;
  let fixture: ComponentFixture<DialogDeleteEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeleteEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDeleteEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
