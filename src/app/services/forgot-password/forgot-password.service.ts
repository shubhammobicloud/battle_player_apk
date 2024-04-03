import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { HeaderService } from "../header/header.service";
import { environment } from "src/environment/enviroment";

@Injectable({
    providedIn: 'root'
})
export class ForgetPasswordService {

    private baseUrl = environment.baseUrl + 'forget-password/'
    // private httpOptions = this.headerService.updateHeader();
    constructor(
        private headerService: HeaderService,
        private toster: ToastrService,
        private http: HttpClient
    ) { }

    sendOtp = (data:any) => {
        return this.http.post(this.baseUrl + 'send-otp',data);
    }

    verifyOtp = (data:any)=>{
        return this.http.post(this.baseUrl +'verify-otp',data);
    }


}
