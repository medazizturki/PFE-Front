import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiceSectorielComponent } from './indice-sectoriel.component';

describe('IndiceSectorielComponent', () => {
  let component: IndiceSectorielComponent;
  let fixture: ComponentFixture<IndiceSectorielComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndiceSectorielComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndiceSectorielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
