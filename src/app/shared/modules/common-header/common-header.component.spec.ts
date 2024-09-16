import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonHeaderComponent } from './common-header.component';

describe('CommonHeaderComponent', () => {
    let component: CommonHeaderComponent;
    let fixture: ComponentFixture<CommonHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ CommonHeaderComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CommonHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
