import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddTransactionComponent } from './dialog-add-transaction.component';

describe('DialogAddTransactionComponent', () => {
  let component: DialogAddTransactionComponent;
  let fixture: ComponentFixture<DialogAddTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddTransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAddTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
