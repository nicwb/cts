import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, catchError } from 'rxjs';
import { ToastService } from "../toast.service";
import { PensionBillResponse} from 'src/app/core/models/pension-bill'

@Injectable({
    providedIn: 'root'
})


export class PensionBill{
    constructor(private http:HttpClient,private tosterservice:ToastService){}

    private apiurl = 'v1/ppo/pension-bill';


    getrecord(payload: any):Observable<PensionBillResponse>{
        return this.http.patch<PensionBillResponse>(this.apiurl,payload).pipe(

            catchError((error)=>{
                throw this.tosterservice.showError(error.message);
            })
        )

    }

}