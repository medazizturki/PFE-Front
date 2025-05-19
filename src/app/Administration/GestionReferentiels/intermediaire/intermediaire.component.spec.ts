import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntermediaireComponent } from './intermediaire.component';

describe('IntermediaireComponent', () => {
  let component: IntermediaireComponent;
  let fixture: ComponentFixture<IntermediaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntermediaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntermediaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
