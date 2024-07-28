import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromToDateFormComponent } from './from-to-date-form.component';

describe('FromToDateFormComponent', () => {
  let component: FromToDateFormComponent;
  let fixture: ComponentFixture<FromToDateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FromToDateFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FromToDateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
