import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddTransferComponent } from './dialog-add-transfer.component';

describe('DialogAddTransferComponent', () => {
  let component: DialogAddTransferComponent;
  let fixture: ComponentFixture<DialogAddTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddTransferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAddTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
