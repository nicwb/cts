import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    constructor() {}

    toast = swal.mixin({
        toast: false,
        // position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        // customClass: 'swal-wide',
        // onOpen: (tst) => {
        //   tst.addEventListener('mouseenter', swal.stopTimer);
        //   tst.addEventListener('mouseleave', swal.resumeTimer);
        // }
    });

    // *******************************************************************************************************
    successToast(succMsg: string) {
        this.toast.fire({
            icon: 'success',
            title: succMsg,
        });
    }

    // *******************************************************************************************************
    alertToast(alertMg: string) {
        this.toast.fire({
            icon: 'info',
            title: alertMg,
        });
    }

    // *******************************************************************************************************
    infoToast(infoMsg: string) {
        this.toast.fire({
            // title: 'Information !!!',
            icon: 'info',
            html: infoMsg,
        });
    }
    info(message: string): void {
        swal.fire({
            icon: 'info',
            title: 'Info',
            text: message,
            allowOutsideClick: false,
            //  timer: 3000
        });
    }

    // *******************************************************************************************************
    errorToast(errMsg: string) {
        this.toast.fire({
            icon: 'error',
            title: errMsg,
        });
    }

    // *******************************************************************************************************
    warningToast(warnMsg: string) {
        this.toast.fire({
            icon: 'warning',
            title: warnMsg,
        });
    }

    warning(warnMsg: string) {
        this.toast.fire({
            icon: 'warning',
            title: warnMsg,
        });
    }

    // ----------------------------------------------------------------------------------- TOATSER ALERTS ENDS

    // ---------------------------------------------------------------------------- NORMAL SWEET ALERTS STARTS
    // *******************************************************************************************************
    success(title: string = '', msg: string = '') {
        swal.fire({ icon: 'success', title: title, html: msg });
    }

    successHTML(message: string): void {
        swal.fire({});
        swal.fire({
            icon: 'success',
            title: 'Success',
            html: message,
            allowOutsideClick: false,
            // timer: 3000
        });
    }

    successful(msg: string) {
        return swal
            .fire({
                title: 'Success',
                icon: 'success',
                html: msg,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Yes',
            })
            .then((result) => {
                console.log(result);

                return result.value === true ? true : false;
            });
    }
    successfulReload(msg: string) {
        return swal
            .fire({
                title: 'Success',
                icon: 'success',
                html: msg,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
            })
            .then((result) => {
                window.location.reload();
                return result.value === true ? true : false;
            });
    }

    // *******************************************************************************************************
    error(errMsg: string) {
        swal.fire({ icon: 'error', title: 'Error', html: errMsg });
    }

    // *******************************************************************************************************
    alert(alertMsg: string) {
        swal.fire({ icon: 'warning', title: 'Alert !!!', html: alertMsg });
    }

    // *******************************************************************************************************
    notification(msg: string) {
        swal.fire({ icon: 'info', title: 'Information !!!', html: msg });
    }

    // *******************************************************************************************************
    infoCustom(customMsg: string) {
        swal.fire({
            title: 'Information !!!',
            icon: 'info',
            html: customMsg,
        });
    }

    // *******************************************************************************************************
    confirmLogout(
        title = 'Logout',
        msg = 'You have been logged out!'
    ): Promise<any> {
        return swal
            .fire({
                title: title,
                text: msg,
                icon: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
            })
            .then((result) => {
                return result.value === true ? true : false;
            });
    }
}
