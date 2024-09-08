import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstpensionbillapprovalComponent } from './firstpensionbillapproval.component';

describe('FirstpensionbillapprovalComponent', () => {
  let component: FirstpensionbillapprovalComponent;
  let fixture: ComponentFixture<FirstpensionbillapprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstpensionbillapprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstpensionbillapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
