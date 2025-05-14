import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourFerieComponent } from './jour-ferie.component';

describe('JourFerieComponent', () => {
  let component: JourFerieComponent;
  let fixture: ComponentFixture<JourFerieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JourFerieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JourFerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
