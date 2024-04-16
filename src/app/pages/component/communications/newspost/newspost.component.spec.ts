import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewspostComponent } from './newspost.component';

describe('NewspostComponent', () => {
  let component: NewspostComponent;
  let fixture: ComponentFixture<NewspostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewspostComponent]
    });
    fixture = TestBed.createComponent(NewspostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
