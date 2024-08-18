## SEARCH POPUP
The Search Popup is designed to help users filter and search through tabular data dynamically. This component provides an inputs by attribute for searching and  the displayed data in the table based on the search query. Select the row for return the row data.
## ATTRIBUTE
```html
<app-search-popup
name="Button Label"
[service$]="Observable<any>" 
[data]="{headers: any, data: any}"
title="Your Search Title" // optional
[style]="popupStyle" // optional
[return]="returnHandelFunction(event)"
></app-search-popup>
```
:point_right: NOTE: give one between service$ or data and service are higher priority if service data given both

## HOW TO USE
### import requirement
```ts
// module.ts
import { SearchPopupTempModule } from 'src/app/core/searchpopup/search-popup.module';
@NgModule({
    imports: [
        SearchPopupTempModule
    ],
})
```
### Do in component.html file
```html
<app-search-popup name="Search PPOId"  [service$]="myService$" (return)="handleSelectedRow($event)"></app-search-popup>
```

### Do in component file
```ts
// component.ts
export YourAppComponent{
    myService$?:Observable<any>;
    constructor(
        private YourAppService: YourAppService,
    ){}
    ngOnInit(): void {
     this.myService$ = this.YourAppService.YourAppServiceMethod();
    }
    /*
        DO 
            AnyThing 
    */

    // Your row select function
    handleSelectedRow(event){
        console.log(event);
        /*
        DO 
            AnyThing 
    */
    }
}

```