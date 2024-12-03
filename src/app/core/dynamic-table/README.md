
## ATTRIBUTE

```html
<app-dynamic-table

[service$]="Observable<any>"
[style]="popupStyle" // optional
[suffix]="suffix"
[editable]="true" // optional
(return)="returnHandelFunction($event)" // if [editable]="true" is used
[filterON]="['data',....]" // optional
[filterOFF]="['data',....]" // optional  removes the rows containing this data from the table
[data]="staticData" // optional

></app-dynamic-table>
```

:point_right: NOTE: give one between service$ or data and service are higher priority if service data given both. Other attributes are optional

## HOW TO USE

### import requirement

```ts
// module.ts
import { DynamicTableModule } from 'src/app/core/dynamic-table/dynamic-table.module';
@NgModule({
    imports: [
        DynamicTableModule
    ],
})
```

### Do in component.html file

```html
<app-dynamic-table [service$]="myService$"  [suffix]="suffix"></app-dynamic-table>
```

### Do in component file

```ts
// component.ts
export YourAppComponent{
    suffix="suffix name"
    myService$?:Observable<any>;
    staticData: {
        data: { id: string; subCategoryName: string }[];
        headers: { name: string; fieldName: string }[];
    } = {
        data: [
            { id: '1', subCategoryName: 'ROPA 2008' },
            { id: '2', subCategoryName: 'ROPA 2009' },
            { id: '3', subCategoryName: 'ROPA 1998' },
            { id: '6', subCategoryName: 'NO SUB CATEGORY' },
            { id: '7', subCategoryName: 'Pension Rules 1966(Pre 81)' },
            { id: '8', subCategoryName: 'ROPA 2016' },
            { id: '12', subCategoryName: 'ROPA 2019' },
        ],
        headers: [
            { name: 'Sub Category ID', fieldName: 'id' },
            { name: 'Sub Category Name', fieldName: 'subCategoryName' },
        ],
    };
    constructor(
        private YourAppService: YourAppService,
        private SessionStorageService: SessionStorageService

    ){}
    ngOnInit(): void {
     this.myService$ = this.YourAppService.YourAppServiceMethod();
    }
    /*
        DO
            AnyThing
    */
//    when adding the data

                this.SessionStorageService.remove('', '', `DynamicTableComponent_${suffix}`)
                // eg
                /*
async add_primary_category() {
        if (this.primaryForm.valid) {
            const formData = this.primaryForm.value;
            let name = this.primaryForm.value.PrimaryCategoryName;
            let response = await firstValueFrom(
                this.service.createPrimaryCategory(formData)
            );

            if (response.apiResponseStatus === APIResponseStatus.Success) {
                // Assuming 1 means success
                this.sessionStorageService.remove('','',  `DynamicTableComponent_${this.suffix}`);
                this.displayInsertModal = false; // Close the dialog
                this.toastService.showSuccess(
                    ''+response.message
                );
                if (this.called_from_pension == true) {
                    this.router.navigate(
                        ['master/pension-category'],
                        { queryParams: { primary: name, sub: this.sub } }
                    );
                }
            } else {
                this.handleErrorResponse(response);
            }
        } else {
            this.toastService.showError(
                'Please fill all required fields correctly.'
            );
        }
    }

                */




}

```
