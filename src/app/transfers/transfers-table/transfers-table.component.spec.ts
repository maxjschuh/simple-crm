import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersTableComponent } from './transfers-table.component';

describe('TransfersTableComponent', () => {
  let component: TransfersTableComponent;
  let fixture: ComponentFixture<TransfersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfersTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransfersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
