import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcFormComponent } from './ec-form.component';

describe('EcFormComponent', () => {
  let component: EcFormComponent;
  let fixture: ComponentFixture<EcFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
