import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HeaderService {

    updateHeader = () => {
        let authToken: string = `${localStorage.getItem('token')}`;
        ;
        let headers: HttpHeaders = new HttpHeaders({
        //   'Authorization': 'Bearer ' + authToken
        });

        let httpOptions: any = {
            headers: headers
        }
        return httpOptions;

    };
}
