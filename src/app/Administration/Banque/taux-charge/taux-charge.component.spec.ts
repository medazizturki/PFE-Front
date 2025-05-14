import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauxChargeComponent } from './taux-charge.component';

describe('TauxChargeComponent', () => {
  let component: TauxChargeComponent;
  let fixture: ComponentFixture<TauxChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TauxChargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TauxChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
