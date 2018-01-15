import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsDashboardComponent } from './graphics-dashboard.component';

describe('GraphicsDashboardComponent', () => {
  let component: GraphicsDashboardComponent;
  let fixture: ComponentFixture<GraphicsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
