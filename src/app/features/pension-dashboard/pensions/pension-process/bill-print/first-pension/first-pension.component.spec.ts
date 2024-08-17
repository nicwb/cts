import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPensionComponent } from './first-pension.component';

describe('FirstPensionComponent', () => {
  let component: FirstPensionComponent;
  let fixture: ComponentFixture<FirstPensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstPensionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
