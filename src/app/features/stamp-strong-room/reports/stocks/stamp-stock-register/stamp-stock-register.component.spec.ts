import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampStockRegisterComponent } from './stamp-stock-register.component';

describe('StampStockRegisterComponent', () => {
  let component: StampStockRegisterComponent;
  let fixture: ComponentFixture<StampStockRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StampStockRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StampStockRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
