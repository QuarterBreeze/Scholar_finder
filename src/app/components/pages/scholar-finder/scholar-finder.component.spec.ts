import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarFinderComponent } from './scholar-finder.component';

describe('ScholarFinderComponent', () => {
  let component: ScholarFinderComponent;
  let fixture: ComponentFixture<ScholarFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScholarFinderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScholarFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
