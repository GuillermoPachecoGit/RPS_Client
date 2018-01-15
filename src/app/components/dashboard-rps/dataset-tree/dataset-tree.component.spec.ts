import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetTreeComponent } from './dataset-tree.component';

describe('DatasetTreeComponent', () => {
  let component: DatasetTreeComponent;
  let fixture: ComponentFixture<DatasetTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
