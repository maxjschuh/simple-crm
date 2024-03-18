import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRevenueEmployeeComponent } from './top-revenue-employee.component';

describe('TopRevenueEmployeeComponent', () => {
  let component: TopRevenueEmployeeComponent;
  let fixture: ComponentFixture<TopRevenueEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopRevenueEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopRevenueEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
