import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditEmployeeComponent } from './dialog-edit-employee.component';

describe('DialogEditEmployeeComponent', () => {
  let component: DialogEditEmployeeComponent;
  let fixture: ComponentFixture<DialogEditEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEditEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
