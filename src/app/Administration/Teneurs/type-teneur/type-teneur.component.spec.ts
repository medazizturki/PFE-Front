import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeTeneurComponent } from './type-teneur.component';

describe('TypeTeneurComponent', () => {
  let component: TypeTeneurComponent;
  let fixture: ComponentFixture<TypeTeneurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeTeneurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeTeneurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
