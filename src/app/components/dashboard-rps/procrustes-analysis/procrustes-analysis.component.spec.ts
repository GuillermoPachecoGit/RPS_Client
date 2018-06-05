import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcrustesAnalysisComponent } from './procrustes-analysis.component';

describe('ProcrustesAnalysisComponent', () => {
  let component: ProcrustesAnalysisComponent;
  let fixture: ComponentFixture<ProcrustesAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcrustesAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcrustesAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
