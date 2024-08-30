import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSidebarPensionComponent } from '../app.sidebar.pension.component';

describe('AppSidebarPensionComponent', () => {
  let component: AppSidebarPensionComponent;
  let fixture: ComponentFixture<AppSidebarPensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppSidebarPensionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSidebarPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
