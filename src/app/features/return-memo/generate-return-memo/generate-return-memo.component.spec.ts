import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateReturnMemoComponent } from './generate-return-memo.component';

describe('GenerateReturnMemoComponent', () => {
    let component: GenerateReturnMemoComponent;
    let fixture: ComponentFixture<GenerateReturnMemoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ GenerateReturnMemoComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GenerateReturnMemoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
