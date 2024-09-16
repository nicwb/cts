import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfObjectionComponent } from './list-of-objection.component';

describe('ListOfObjectionComponent', () => {
    let component: ListOfObjectionComponent;
    let fixture: ComponentFixture<ListOfObjectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ListOfObjectionComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ListOfObjectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
