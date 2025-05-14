import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeMarcheComponent } from './type-marche.component';

describe('TypeMarcheComponent', () => {
  let component: TypeMarcheComponent;
  let fixture: ComponentFixture<TypeMarcheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeMarcheComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeMarcheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
