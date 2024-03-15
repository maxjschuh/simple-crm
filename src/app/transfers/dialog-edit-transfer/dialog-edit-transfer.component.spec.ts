import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditTransferComponent } from './dialog-edit-transfer.component';

describe('DialogEditTransferComponent', () => {
  let component: DialogEditTransferComponent;
  let fixture: ComponentFixture<DialogEditTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditTransferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEditTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
