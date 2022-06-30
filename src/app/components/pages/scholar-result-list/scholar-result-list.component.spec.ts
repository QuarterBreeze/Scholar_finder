import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarResultListComponent } from './scholar-result-list.component';

describe('ScholarResultListComponent', () => {
  let component: ScholarResultListComponent;
  let fixture: ComponentFixture<ScholarResultListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScholarResultListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScholarResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
