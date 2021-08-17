import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signup } from 'src/app/beans/signup';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SignupService {
  constructor(public httpClient:HttpClient) { }
  public signUp(sugnup:signup):Observable<signup>{
    return this.httpClient.post<signup>(`${environment.domain}/nimaiUCM/UserDetails/registerUser`,
    sugnup,{headers:{'content-type':'application/json'}});
  }
  // public userBranch(Data): Observable<any> {
  //   return this.httpClient.post<any>(`${environment.domain}/nimaiUCM/UserBranch/userBranch/BC1511`, Data, { headers: { 'content-type': 'application/json' } });
  // }
  public userBranch(Data,userID:string): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiUCM/UserBranch/userBranch/`+userID, Data, { headers: { 'content-type': 'application/json' } });
  }
  
  public authenticate(data): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiJWT/authenticate`, data, { headers: { 'content-type': 'application/json' } });
  }
  
  public getDetailsFromTokenFieo(): Observable<any> {
    return this.httpClient.get<any>(`${environment.domain}/nimaiJWT/getDetailsFromToken/eyJhbGciOiJIUzUxMiJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJvcmdhbml6YXRpb25fbmFtZSI6IklCTSBJbmMiLCJkZXNpZ25hdGlvbiI6Ik1hbmFnZXIiLCJlbWFpbCI6ImpvaG5AaWJtLmNvbSIsImxhbmRsaW5lIjoiMDIyNjIzMTIzNCIsIm1vYmlsZSI6Iis5MSA5OTIwMzExMjM0IiwiYWRkcmVzcyI6IklCTSBob3VzZSIsImNpdHkiOiJtdW1iYWkiLCJzdGF0ZSI6Im1haGFyYXN0cmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdWIiOiJDVTEyMjAtYWJjMTIzNDU2Nzg5QGdtYWlsLmNvbSIsImV4cCI6MTYyOTEzNjkxMCwiaWF0IjoxNjI4MTY2NzI3fQ.iuWOElB3WAyXXXFdTc5TmbiacwuW55WndhT3raF313CoycPBvsisKpQNpgEpj92WR3NP27gMF6hBeoHaoSr2fg`,  { headers: { 'content-type': 'application/json' } });
  }
  public getSubsidiaryList(userID:string): Observable<any> {
    return this.httpClient.get<any>(`${environment.domain}/nimaiUCM/UserDetails/getSubsidiaryList/`+userID, { headers: { 'content-type': 'application/json' } });
  }
}
