import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/enviroment";
import { Observable, finalize } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
@Injectable({
    providedIn: 'root'
})
export class ForgetPasswordService {

    private baseUrl = environment.baseUrl + 'forget-password/'
    // private httpOptions = this.headerService.updateHeader();
    constructor(
        private toster: ToastrService,
        private http: HttpClient,
        public translate: TranslateService
    ) { }
    makeApiCall(): void {
      // Show loading indicator
      this.toster.info('Loading...', 'API Call in progress', {
        disableTimeOut: true,
        closeButton: true,
        positionClass: 'toast-top-right'
      });
    }
    sendOtp = (data: any): Observable<any>=> {
      const loadingToast = this.toster.info('',this.translate.instant('TOASTER_RESPONSE.SENDING_OTP'), {
        disableTimeOut: true,
        closeButton: true,
        positionClass: 'toast-top-right'
      });

      return this.http.post<any>(this.baseUrl + 'send-otp', data)
        .pipe(
          finalize(() => {
            if (loadingToast) {
              this.toster.clear(loadingToast.toastId);
            }
          })
        );
    }

    verifyOtp = (data:any):Observable<any>=>{
      const loadingToast = this.toster.info('',this.translate.instant('VERIFYING_OTP'), {
        disableTimeOut: true,
        closeButton: true,
        positionClass: 'toast-top-right'
      });
        return this.http.post(this.baseUrl +'verify-otp',data).pipe(
          finalize(() => {
            if (loadingToast) {
              this.toster.clear(loadingToast.toastId);
            }
          })
        );
    }


}
