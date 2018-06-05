import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdinationAnalysisComponent } from './ordination-analysis.component';

describe('OrdinationAnalysisComponent', () => {
  let component: OrdinationAnalysisComponent;
  let fixture: ComponentFixture<OrdinationAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdinationAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdinationAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
