import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteTransferComponent } from './dialog-delete-transfer.component';

describe('DialogDeleteTransferComponent', () => {
  let component: DialogDeleteTransferComponent;
  let fixture: ComponentFixture<DialogDeleteTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeleteTransferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDeleteTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
