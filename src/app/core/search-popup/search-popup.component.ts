// import { Component, OnInit } from '@angular/core';
// import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';;
// import { firstValueFrom, Observable, tap } from 'rxjs';
// import { ObjectJsonAPIResponse } from 'src/app/api';


// //  remove when it final may component import it
// export interface SearchPopupConfig {
//   payload: any;
//   apiUrl: string; // API URL parameter
//   responseInterface?: new () => any; // Optional if not needed
// }

// @Component({
//   selector: 'app-search-popup',
//   templateUrl: './search-popup.component.html',
// })

// export class SearchPopupComponent implements OnInit {
//   records: any[] = [];
//   cols: any[] = [];
//   filteredRecords: any[] = [];
//   searchTerm: string = '';
//   noresult:string = '';
//   service$:Observable<ObjectJsonAPIResponse>;


//   constructor(
//     public ref: DynamicDialogRef,
//     public config: DynamicDialogConfig,
//   ) {
//     this.service$ = config.data;
//   }

//   ngOnInit(): void {
//     this.popUpfunction();
//   }
//   async popUpfunction() {
//     await firstValueFrom(this.service$.pipe(
//       tap(response => {
//         if (response && response.result) {
//           const { headers, data } = response.result;
//           this.records = data;
//           this.filteredRecords = data;
//           this.cols = headers.map((header: any) => ({
//             field: header.fieldName,
//             header: header.name
//           }));
//         } else {
//           console.error('Invalid API response structure', response);
//         }
//       })
//     ));
//   }

//   selectRecord(record: any): void {
//     this.ref.close(record);
//   }

//   filterRecords(): void {
//     if (this.searchTerm) {
//       const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
//       // Filter records based on any property value that contains the search term, case-insensitive.
//       this.filteredRecords = this.records.filter(record =>
//         Object.values(record).some(value => {
//           if (typeof value === 'string' || typeof value === 'number') {
//             return value.toString().toLowerCase().includes(lowerCaseSearchTerm);
//           }
//           return false;
//         })
//       );
//       if (this.filterRecords.length === 0){

//         this.noresult = 'No records found';

//       }else{
//         this.noresult = '';
//       }
//     } else {
//       this.filteredRecords = [...this.records];
//       this.noresult = '';
//     }

//   }


// }

import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';;
import { firstValueFrom, Observable, tap } from 'rxjs';
import { ObjectJsonAPIResponse } from 'src/app/api';

//  remove when it final may component import it
export interface SearchPopupConfig {
	payload: any;
	apiUrl: string; // API URL parameter
	responseInterface?: new () => any; // Optional if not needed
}


@Component({
	selector: 'app-search-popup',
	templateUrl: './search-popup.component.html',
})

export class SearchPopupComponent implements OnInit {
	@Input() table: { header: string[], data: any[] } | null = null;
	@Input() title: String | null = 'Search Data';
	@Input() service$: Observable<ObjectJsonAPIResponse> | null = null; // ObjectJsonAPIResponse 

	records: any[] = [];
	cols: any[] = [];
	filteredRecords: any[] = [];
	searchTerm: string = '';
	noresult: string = '';

	display:boolean=false;

	constructor(
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
	) {
		this.service$ = config.data;
	}

	ngOnInit(): void {
		this.popUpfunction();
	}

	search(){
		this.display=true;
	}
	async popUpfunction() {
		if (this.service$) {
			await firstValueFrom(this.service$.pipe(
				tap(response => {
					if (response && response.result) {
						const { headers, data } = response.result;
						this.records = data;
						this.filteredRecords = data;
						this.cols = headers.map((header: any) => ({
							field: header.fieldName,
							header: header.name
						}));
					} else {
						console.error('Invalid API response structure', response);
					}
				})
			));
		}
		else{
			if (this.table) {
				const { header, data } = this.table;
				this.records = data;
				this.filteredRecords = data;
				this.cols = header.map((header: any) => ({
					field: header.fieldName,
					header: header.name
				}));
			}
		}
	}

	selectRecord(record: any): void {
		this.ref.close(record);
		this.display=false;
	}

	filterRecords(): void {
		if (this.searchTerm) {
			const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
			// Filter records based on any property value that contains the search term, case-insensitive.
			this.filteredRecords = this.records.filter(record =>
				Object.values(record).some(value => {
					if (typeof value === 'string' || typeof value === 'number') {
						return value.toString().toLowerCase().includes(lowerCaseSearchTerm);
					}
					return false;
				})
			);
			if (this.filterRecords.length === 0) {

				this.noresult = 'No records found';

			} else {
				this.noresult = '';
			}
		} else {
			this.filteredRecords = [...this.records];
			this.noresult = '';
		}

	}
}