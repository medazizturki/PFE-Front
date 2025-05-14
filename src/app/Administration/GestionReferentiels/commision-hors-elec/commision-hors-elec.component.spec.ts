import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommisionHorsElecComponent } from './commision-hors-elec.component';

describe('CommisionHorsElecComponent', () => {
  let component: CommisionHorsElecComponent;
  let fixture: ComponentFixture<CommisionHorsElecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommisionHorsElecComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommisionHorsElecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
