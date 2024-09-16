import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlTransferComponent } from './pl-transfer.component';

describe('PlTransferComponent', () => {
    let component: PlTransferComponent;
    let fixture: ComponentFixture<PlTransferComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PlTransferComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PlTransferComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
