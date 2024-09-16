// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class RecordService {
//   private apiUrl = '';

//   constructor(private http: HttpClient) { }

//   getRecords(): Observable<any[]> {
//     return this.http.get<any[]>(this.apiUrl);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecordService {
    private apiUrl = 'v1/ppo/1/first-bill-general'; // Update with your JSON server URL

    constructor(private http: HttpClient) { }

    getRecords(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
}
