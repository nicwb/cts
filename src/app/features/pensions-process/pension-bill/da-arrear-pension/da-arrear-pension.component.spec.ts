import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaArrearPensionComponent } from './da-arrear-pension.component';

describe('DaArrearPensionComponent', () => {
  let component: DaArrearPensionComponent;
  let fixture: ComponentFixture<DaArrearPensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaArrearPensionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaArrearPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
