import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureReferentielsComponent } from './nature-referentiels.component';

describe('NatureReferentielsComponent', () => {
  let component: NatureReferentielsComponent;
  let fixture: ComponentFixture<NatureReferentielsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NatureReferentielsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NatureReferentielsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
