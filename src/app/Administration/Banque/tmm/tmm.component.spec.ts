import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TMMComponent } from './tmm.component';

describe('TMMComponent', () => {
  let component: TMMComponent;
  let fixture: ComponentFixture<TMMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TMMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TMMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
