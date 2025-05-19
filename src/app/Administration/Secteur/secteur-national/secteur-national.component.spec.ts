import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecteurNationalComponent } from './secteur-national.component';

describe('SecteurNationalComponent', () => {
  let component: SecteurNationalComponent;
  let fixture: ComponentFixture<SecteurNationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecteurNationalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecteurNationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
