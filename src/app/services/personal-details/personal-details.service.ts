import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { signup } from 'src/app/beans/signup';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PersonalDetailsService {
  token: string;

  constructor(public httpClient: HttpClient) {
    this.token=sessionStorage.getItem("token");

   }

  public getPersonalDetails(userID:string,emailid:string,token):Observable<signup>{
      
    const httpHeaders = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + token,
        'content-type':'application/json'
      })
    };
 
    return this.httpClient.get<signup>(`${environment.domain}/nimaiUCM/UserDetails/viewPersonalDetails/`+userID+"/"+emailid,httpHeaders);
  }

  public updatePersonalDetails(signup:signup, token):Observable<signup>{
    const httpHeaders = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + token,
        'content-type':'application/json'
      })
    };
    return this.httpClient.post<signup>(`${environment.domain}/nimaiUCM/UserDetails/updatePersonalDetails`,signup,httpHeaders)
  }

  public getSubUserList(userID:any):Observable<any>{
    return this.httpClient.post<signup>(`${environment.domain}/nimaiUCM/UserBranch/subUserList`,userID,{headers:{'content-type':'application/json'}});
  }
  
  public getAddUserList(userID:any):Observable<any>{
    return this.httpClient.post<signup>(`${environment.domain}/nimaiUCM/UserBranch/addUserList`,userID,{headers:{'content-type':'application/json'}});
  }

  public getbranchUserList(userID:any):Observable<any>{
    return this.httpClient.post<signup>(`${environment.domain}/nimaiUCM/UserBranch/branchUserList`,userID,{headers:{'content-type':'application/json'}});
  }
  public getSavingsByUserId(ccy:any,userid:any):Observable<any>{
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/getSavingsByUserId/`+ccy+"/"+userid,{headers:{'content-type':'application/json'}});
  }
  public getSavings(ccy:any,userid:any):Observable<any>{
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/getSavings/`+ccy+"/"+userid,{headers:{'content-type':'application/json'}});
  }

}
