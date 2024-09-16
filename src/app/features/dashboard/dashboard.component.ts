import { Component, OnInit } from '@angular/core';
import { DashbordService } from 'src/app/core/services/dashbord/dashbord.service';
import { tokenCount } from 'src/app/core/models/dashboard';
import { NgxRolesService } from 'ngx-permissions';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    newBills:number=0;
    count : tokenCount [][] | any =0;
    constructor(private dashbordService:DashbordService,private ngxRolesService:NgxRolesService,) { }

    ngOnInit(): void {
        this.getCount();
    // this.newBillCount();
    }
    // newBillCount(){
    //   this.dashbordService.getBillsCountByStatus(3).subscribe((response)=>{
    //     if(response.apiResponseStatus==1){
    //         this.newBills = response.result;
    //     }
    //   });
    // }
  
    getCount(){
        this.dashbordService.getNoOfToken().subscribe((response)=>{
            if(response.apiResponseStatus==1){
                this.count =  response.result;
            }
        })
    }
}
