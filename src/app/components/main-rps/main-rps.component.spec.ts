import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRpsComponent } from './main-rps.component';

describe('MainRpsComponent', () => {
  let component: MainRpsComponent;
  let fixture: ComponentFixture<MainRpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainRpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainRpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
