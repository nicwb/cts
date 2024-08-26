import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpoApprovalComponent } from './ppo-approval.component';

describe('PpoApprovalComponent', () => {
  let component: PpoApprovalComponent;
  let fixture: ComponentFixture<PpoApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpoApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpoApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
