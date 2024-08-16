## GUID FOR DEVELOPER
## Import requirements
```ts
import { MessageService } from 'primeng/api';
import { SearchPopupComponent } from 'src/app/core/search-popup/search-popup.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
```
## Add providers
```ts
@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService],
})
```

## Create a variable in class that refer DynamicDialogRef and add Observable allManualPPOReceipt$?:Observable<ListAllPpoReceiptsResponseDTOIEnumerableDynamicListResultJsonAPIResponse>;
```ts
export class AppComponent implements OnInit {
  ref: DynamicDialogRef | undefined;
  allManualPPOReceipt$?:Observable<ListAllPpoReceiptsResponseDTOIEnumerableDynamicListResultJsonAPIResponse>;
```
## Inject DialogService in constructor
```ts
    private dialogService: DialogService,
```

### CALL WHERE YOU WANT
```ts
MyFunction(): void{
    
    let payload:Payload = {
      "pageSize":10,
      "pageIndex":0,
      "filterParameters": [],
      "sortParameters":{
        "field":"",
        "order":""
      }
    };
    



    this.allManualPPOReceipt$ = this.PensionManualPPOReceiptService.getAllPpoReceipts(payload);

    this.ref = this.dialogService.open(SearchPopupComponent, {
      data: this.allManualPPOReceipt$,
      header: 'Search record',
      width: '60%'
    });

    const x = this.ref.onClose.subscribe((record: any) => {
      if (record) {
        console.log(record) // degug
        this.ppoFormDetails.controls['receiptId'].setValue(record.id);
        this.ppoFormDetails.controls['pensionerName'].setValue(record.pensionerName);
        this.ppoFormDetails.controls['ppoNo'].setValue(record.ppoNo);
        this.ManualEntrySearchForm.controls["eppoid"].setValue(record.treasuryReceiptNo);
        x.unsubscribe();
      }
    });
  }
```