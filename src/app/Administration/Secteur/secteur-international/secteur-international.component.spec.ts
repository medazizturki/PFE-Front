import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecteurInternationalComponent } from './secteur-international.component';

describe('SecteurInternationalComponent', () => {
  let component: SecteurInternationalComponent;
  let fixture: ComponentFixture<SecteurInternationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecteurInternationalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecteurInternationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
