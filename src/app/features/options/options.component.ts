import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/core/services/Token/token.service';

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
    tokenNo: Number | undefined;
    tokenDate: Date | undefined;

    constructor(private tokenService:TokenService) { }

    ngOnInit(): void {
        this.tokenNo= this.tokenService.selectedTokenNo;
        this.tokenDate = this.tokenService.selectedTokenDate;
    }

}
