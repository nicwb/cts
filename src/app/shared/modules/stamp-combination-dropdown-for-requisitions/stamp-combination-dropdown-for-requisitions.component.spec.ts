import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampCombinationDropdownForRequisitionsComponent } from './stamp-combination-dropdown-for-requisitions.component';

describe('StampCombinationDropdownForRequisitionsComponent', () => {
  let component: StampCombinationDropdownForRequisitionsComponent;
  let fixture: ComponentFixture<StampCombinationDropdownForRequisitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StampCombinationDropdownForRequisitionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StampCombinationDropdownForRequisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
