import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRpsMainComponent } from './home-rps-main.component';

describe('HomeRpsMainComponent', () => {
  let component: HomeRpsMainComponent;
  let fixture: ComponentFixture<HomeRpsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeRpsMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRpsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
