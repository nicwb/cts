## SEARCH POPUP
The Search Popup is designed to help users filter and search through tabular data dynamically. This component provides an inputs by attribute for searching and  the displayed data in the table based on the search query. Select the row for return the row data.
## ATTRIBUTE
```html
<app-popup-table
name="Button Label"
[service$]="Observable<any>" 
[data]="{headers: any, data: any}"
title="Your Search Title" // optional
[style]="popupStyle" // optional
[buttonStyle]="Style" // optional
(return)="returnHandelFunction(event)"
(loads)="loads($) // optional
></app-popup-table>
```
:point_right: NOTE: give one between service$ or data and service are higher priority if service data given both. Other attributes are optional

## HOW TO USE
### import requirement
```ts
// module.ts
import { PopupTableModule } from 'src/app/core/popup-table/search-popup.module';
@NgModule({
    imports: [
        PopupTableModule
    ],
})
```
### Do in component.html file
```html
<app-popup-table name="Search PPOId"  [service$]="myService$" (return)="handleSelectedRow($event)"></app-popup-table>
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
# What's new
:point_right: NOTE: Add ability to customize btn style by using
```html 
<app-popup-table [buttonStyle]="YourButtonStyle" ></app-popup-table>
```
