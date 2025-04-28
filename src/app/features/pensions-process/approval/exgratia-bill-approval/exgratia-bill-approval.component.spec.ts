import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExgratiaBillApprovalComponent } from './exgratia-bill-approval.component';

describe('ExgratiaBillApprovalComponent', () => {
    let component: ExgratiaBillApprovalComponent;
    let fixture: ComponentFixture<ExgratiaBillApprovalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExgratiaBillApprovalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ExgratiaBillApprovalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
