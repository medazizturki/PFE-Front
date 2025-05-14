import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionElecComponent } from './commission-elec.component';

describe('CommissionElecComponent', () => {
  let component: CommissionElecComponent;
  let fixture: ComponentFixture<CommissionElecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommissionElecComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommissionElecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
