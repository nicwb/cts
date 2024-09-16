import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampStrongRoomComponent } from './stamp-strong-room.component';

describe('StampStrongRoomComponent', () => {
    let component: StampStrongRoomComponent;
    let fixture: ComponentFixture<StampStrongRoomComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ StampStrongRoomComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StampStrongRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
