import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceAnalysisComponent } from './distance-analysis.component';

describe('DistanceAnalysisComponent', () => {
  let component: DistanceAnalysisComponent;
  let fixture: ComponentFixture<DistanceAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistanceAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistanceAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
