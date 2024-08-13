import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampDamageDetailsComponent } from './stamp-damage-details.component';

describe('StampDamageDetailsComponent', () => {
  let component: StampDamageDetailsComponent;
  let fixture: ComponentFixture<StampDamageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StampDamageDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StampDamageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
