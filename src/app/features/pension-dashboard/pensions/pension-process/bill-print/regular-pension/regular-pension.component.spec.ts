import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularPensionComponent } from './regular-pension.component';

describe('RegularPensionComponent', () => {
  let component: RegularPensionComponent;
  let fixture: ComponentFixture<RegularPensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegularPensionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegularPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
