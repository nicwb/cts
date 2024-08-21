## SEARCH POPUP
The Search Popup is designed to help users filter and search through tabular data dynamically. This component provides an inputs by attribute for searching and  the displayed data in the table based on the search query. Select the row for return the row data.
## ATTRIBUTE
```html
<app-search-popup 
name="Button Label"
[service$]="Observable<any>" 
[data]="{headers: any, data: any}"
<<<<<<< HEAD
title="Your Search Title"
[style]="popupStyle"
(return)="returnHandelFunction(event)"
=======
title="Your Search Title" // optional
[style]="popupStyle" // optional
[buttonStyle]="Style" // optional
(return)="returnHandelFunction(event)"
(loads)="loads($) // optional
>>>>>>> f301f0f (Update SearchPopUp and ButtonStyle)
></app-search-popup>
```
:point_right: NOTE: give one between service$ or data and service are higher priority if service data given both. Other attributes are optional

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
# What is new here
:point_right: NOTE: Add ability to customize btn style by using
```html 
<app-search-popup [buttonStyle]="YourButtonStyle" ></app-search-popup>
```
