import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TokenService } from 'src/app/core/services/Token/token.service';


@Component({
    selector: 'app-token',
    templateUrl: './token.component.html',
    styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {
    private subscribtion :Subscription|any;
    constructor(private router:Router,private tokenServices:TokenService) { }

    ngOnInit(): void {
        this.subscribtion = this.tokenServices.getActionButtonObservable().subscribe((data)=>{
            // this.router.navigate(["/option"]);
        });
    }

    closeButton(event: any) {
        this.router.navigate(["/"]);
    }

}
