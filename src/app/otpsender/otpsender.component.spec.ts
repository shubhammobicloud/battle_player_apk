import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpsenderComponent } from './otpsender.component';

describe('OtpsenderComponent', () => {
  let component: OtpsenderComponent;
  let fixture: ComponentFixture<OtpsenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtpsenderComponent]
    });
    fixture = TestBed.createComponent(OtpsenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
