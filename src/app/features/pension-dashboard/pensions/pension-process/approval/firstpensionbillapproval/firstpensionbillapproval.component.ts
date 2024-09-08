import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';
import { PensionFirstBillService, PensionPPODetailsService, PensionPPOStatusService } from 'src/app/api';
import { PensionStatusFlag } from 'src/app/shared/modules/pensioner-status/enumsStatus';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-firstpensionbillapproval',
  templateUrl: './firstpensionbillapproval.component.html',
  styleUrls: ['./firstpensionbillapproval.component.scss']
})
export class FirstpensionbillapprovalComponent implements OnInit {
  pensionForm: FormGroup;
  getpensionbill: any;
  pensioncategory: any = {};
  ppoList$: Observable<any>;


  constructor(
    private fb: FormBuilder,
    private firstbill: PensionFirstBillService,
    private pensionPPOStatusService: PensionPPOStatusService,
    private ppoListService: PensionPPODetailsService,

  ) {
    this.pensionForm = this.fb.group({
      ppoId: ['', [Validators.required, Validators.pattern("^[0-9]*$")]] // PPO ID must be a number
    });
    const payload = {
      listType: 'type1',
      pageSize: 200,
      pageIndex: 0,
      filterParameters: [],
      sortParameters: {
        field: 'ppoNo',
        order: 'asc',
      },
    };
    this.ppoList$ = this.ppoListService.getAllPensioners(payload);
  }

  ngOnInit(): void {
  }

  pensionbill() {
    const ppoId = this.pensionForm.get('ppoId')?.value;
    if (ppoId && this.pensionForm.get('ppoId')?.valid) {
      this.getfirstpensionbill(ppoId);
    }
  }

  async getfirstpensionbill(ppoId: number): Promise<void> {
    try {
      this.getpensionbill = await firstValueFrom(this.firstbill.getFirstPensionBillByPpoId(ppoId));
      if (this.getpensionbill.apiResponseStatus === 3) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "" + this.getpensionbill.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });    }
  }

  async approve(): Promise<void> {
    if (this.pensionForm.invalid) {
      this.pensionForm.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });      return;
    }

    const ppoId = this.pensionForm.get('ppoId')?.value;
    const statusFlag = PensionStatusFlag.PpoApproved;
    const payload = {
      statusFlag: statusFlag,
      statusWef: '2024-08-01',
      ppoId: ppoId
    };

    try {
      if (this.getpensionbill.apiResponseStatus === 1) {
        const response = await firstValueFrom(this.pensionPPOStatusService.setPpoStatusFlag(payload));
        if (response.apiResponseStatus === 1) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Success",
            text: "" + response.message,
            // showConfirmButton: false,
            // timer: 2500,
            width: '500px',
            padding: '3em',
            customClass: {
              title: '.swal-custom-title ',
            }
          });
        } if (response.apiResponseStatus === 3) {
          Swal.fire({
            icon: "info",
            title: "Oops...",
            text: "" + response.message,
          });
        }
      } if (this.getpensionbill.apiResponseStatus === 3) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "" + this.getpensionbill.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  }
  handleSelectedRow(event: any) {
    this.pensionForm.patchValue({
      ppoId: event.ppoId,
    });
    const ppoId = this.pensionForm.get('ppoId')?.value;
    if (ppoId && this.pensionForm.get('ppoId')?.valid) {
      this.getfirstpensionbill(ppoId);
    }
  }
  refreshTable() {
    this.getpensionbill = null;
    this.pensionForm.reset();
  }
}
