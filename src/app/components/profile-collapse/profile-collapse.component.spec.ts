import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCollapseComponent } from './profile-collapse.component';

describe('ProfileCollapseComponent', () => {
  let component: ProfileCollapseComponent;
  let fixture: ComponentFixture<ProfileCollapseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileCollapseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
