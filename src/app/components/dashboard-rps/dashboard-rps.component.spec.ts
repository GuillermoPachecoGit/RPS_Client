import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRpsComponent } from './dashboard-rps.component';

describe('DashboardRpsComponent', () => {
  let component: DashboardRpsComponent;
  let fixture: ComponentFixture<DashboardRpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardRpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardRpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
