import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieavoirComponent } from './categorieavoir.component';

describe('CategorieavoirComponent', () => {
  let component: CategorieavoirComponent;
  let fixture: ComponentFixture<CategorieavoirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorieavoirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorieavoirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
