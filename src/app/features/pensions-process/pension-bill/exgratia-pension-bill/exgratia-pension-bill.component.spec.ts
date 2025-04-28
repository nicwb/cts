import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExgratiaPensionBillComponent } from './exgratia-pension-bill.component';

describe('ExgratiaPensionBillComponent', () => {
    let component: ExgratiaPensionBillComponent;
    let fixture: ComponentFixture<ExgratiaPensionBillComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExgratiaPensionBillComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ExgratiaPensionBillComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
