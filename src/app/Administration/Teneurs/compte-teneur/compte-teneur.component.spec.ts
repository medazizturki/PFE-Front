import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteTeneurComponent } from './compte-teneur.component';

describe('CompteTeneurComponent', () => {
  let component: CompteTeneurComponent;
  let fixture: ComponentFixture<CompteTeneurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompteTeneurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompteTeneurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
