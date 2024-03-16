import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowChartComponent } from './cashflow-chart.component';

describe('CashflowChartComponent', () => {
  let component: CashflowChartComponent;
  let fixture: ComponentFixture<CashflowChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashflowChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashflowChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
